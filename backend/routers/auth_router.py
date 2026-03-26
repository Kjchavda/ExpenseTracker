import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
import os
from dotenv import load_dotenv

from backend.database import get_db
from backend.utils.dependencies import get_current_user
from backend.utils.security_utils import hash_password, verify_password, create_access_token
from backend.models import User
from backend.schemas import Token, UserCreate, UserOut, UserInfo

load_dotenv()


cloudinary.config( 
  cloud_name = os.getenv("CLOUD_NAME"),
  api_key = os.getenv("API_KEY"), 
  api_secret = os.getenv("API_SECRET")
)

auth_router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# --- 2. SIGNUP ROUTE (Standard JSON) ---
@auth_router.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = hash_password(user_data.password)
    new_user = User(
        email=user_data.email, 
        hashed_password=hashed_pwd, 
        name=user_data.name
        # profile_image_url will use the default from your Model
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# --- 3. LOGIN ROUTE (Standard OAuth2) ---
@auth_router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    access_token = create_access_token(data={"sub": str(user.id)})
    # We return the token; the frontend uses /getUser to fetch the profile image later
    return {"access_token": access_token, "token_type": "bearer"}

# --- 4. PROFILE IMAGE UPLOAD (The "Feature" Route) ---
@auth_router.patch("/update-avatar", response_model=UserOut)
async def update_avatar(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Security: Check file extension
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Only .jpg and .png files are allowed")

    try:
        # Upload file stream to Cloudinary
        upload_result = cloudinary.uploader.upload(
            file.file, 
            folder="expense_tracker_profiles",
            public_id=f"user_{current_user.id}" # Overwrites existing pic for this user
        )
        
        # Update the database field
        current_user.profile_image_url = upload_result.get("secure_url")
        db.commit()
        db.refresh(current_user)
        
        return current_user

    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to upload to Cloudinary")

# --- 5. GET USER PROFILE ---
@auth_router.get('/getUser', response_model=UserInfo)
def get_user_profile(current_user: User = Depends(get_current_user)):
    # This will now include the profile_image_url in the response
    return current_user
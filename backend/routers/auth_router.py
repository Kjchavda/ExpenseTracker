from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from backend.database import get_db
from backend.utils.dependencies import get_current_user
from backend.utils.security_utils import hash_password, verify_password, create_access_token
from backend.models import User
from backend.schemas import Token, UserCreate, UserOut, UserInfo

auth_router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@auth_router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")

    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@auth_router.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = hash_password(user_data.password)
    new_user = User(email=user_data.email, hashed_password=hashed_pwd, name = user_data.name)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@auth_router.get('/getUser', response_model=UserInfo)
def getUser(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    user = db.query(User).filter(User.email == current_user.email).first()
    print(user)
    return user
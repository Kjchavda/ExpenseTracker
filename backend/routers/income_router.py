from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from backend.crud import crud_income
from backend.database import get_db
from backend.utils.dependencies import get_current_user
from backend.utils.security_utils import hash_password, verify_password, create_access_token
from backend import models
from backend.schemas import IncomeCreate, IncomeOut, Token, UserCreate, UserOut

income_router = APIRouter(
    prefix="/income",
    tags=["Income Routes"]
)

@income_router.post("/add", response_model=IncomeOut)
def add_income(income: IncomeCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return crud_income.create(db=db, user_id = current_user.id, income= income)

@income_router.get("/", response_model=List[IncomeOut])
def get_incomes(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return crud_income.get_all_incomes(db=db, user_id=current_user.id)

@income_router.get("/{id}", response_model=IncomeOut)
def get_income( id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    income =  crud_income.get_income_by_id(id=id, db=db, user_id=current_user.id)

    if not income:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"income with id {id} was not found")
    # income_dict = income.dict()
    if income.user_id != current_user.id: # type: ignore
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this income")
    return income

@income_router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_income(id: int, db:Session = Depends(get_db), current_user = Depends(get_current_user)):
    income = crud_income.get_income_by_id(id=id, db=db, user_id=current_user.id)

    if not income:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Income not found")

    if income.user_id != current_user.id: # type: ignore
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    crud_income.delete_income_by_id(id=id, db=db)
    return
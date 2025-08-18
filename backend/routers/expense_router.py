from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from backend.crud import crud_expense
from backend.database import get_db
from backend.utils.dependencies import get_current_user
from backend.utils.security_utils  import hash_password, verify_password, create_access_token
from backend import models
from backend.schemas import ExpenseCreate, ExpenseOut, Token, UserCreate, UserOut

expense_router = APIRouter(
    prefix="/expense",
    tags=["expense Routes"]
)

@expense_router.post("/add", response_model=ExpenseOut)
def add_expense(expense: ExpenseCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return crud_expense.create(db=db, user_id = current_user.id, expense= expense)

@expense_router.get("", response_model=List[ExpenseOut])
def get_expenses(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return crud_expense.get_all_expenses(db=db, user_id=current_user.id)

@expense_router.get("/{id}", response_model=ExpenseOut)
def get_expense( id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    expense =  crud_expense.get_expense_by_id(id=id, db=db, user_id=current_user.id)

    if not expense:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"expense with id {id} was not found")
    # expense_dict = expense.dict()
    if expense.user_id != current_user.id: # type: ignore
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this expense")
    return expense

@expense_router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(id: int, db:Session = Depends(get_db), current_user = Depends(get_current_user)):
    expense = crud_expense.get_expense_by_id(id=id, db=db, user_id=current_user.id)

    if not expense:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="expense not found")

    if expense.user_id != current_user.id: # type: ignore
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    crud_expense.delete_expense_by_id(id=id, db=db)
    return
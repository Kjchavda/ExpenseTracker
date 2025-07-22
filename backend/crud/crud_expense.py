from sqlalchemy.orm import Session

from backend import schemas
from backend.schemas import ExpenseCreate
import backend.models

def create(db: Session, expense: ExpenseCreate, user_id: int):
    
    db_expense = backend.models.Expense(amount=expense.amount,
        category=expense.category,
        description=expense.description,
        date = expense.date,
        user_id=user_id,
        )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    
    return db_expense

def get_all_expenses(db:Session, user_id):
    expenses = db.query(backend.models.Expense).filter(backend.models.Expense.user_id == user_id).all()
    return expenses

def get_expense_by_id(db:Session,user_id, id:int):
    expense = db.query(backend.models.Expense).filter(backend.models.Expense.id == id).first()
    return expense

def delete_expense_by_id(id: int, db: Session):
    expense = db.query(backend.models.Expense).filter(backend.models.Expense.id == id).first()
    if not expense:
        return None
    db.delete(expense)
    db.commit()
    return expense 
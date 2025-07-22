from sqlalchemy.orm import Session

from backend import schemas
from backend.schemas import IncomeCreate
import backend.models

def create(db: Session, income: IncomeCreate, user_id: int):
    
    db_income = backend.models.Income(amount=income.amount,
        source=income.source,
        description=income.description,
        date = income.date,
        user_id=user_id,
        )
    db.add(db_income)
    db.commit()
    db.refresh(db_income)
    
    return db_income

def get_all_incomes(db:Session, user_id):
    incomes = db.query(backend.models.Income).filter(backend.models.Income.user_id == user_id).all()
    return incomes

def get_income_by_id(db:Session,user_id, id:int):
    income = db.query(backend.models.Income).filter(backend.models.Income.id == id).first()
    return income

def delete_income_by_id(id: int, db: Session):
    income = db.query(backend.models.Income).filter(backend.models.Income.id == id).first()
    if not income:
        return None
    db.delete(income)
    db.commit()
    return income 
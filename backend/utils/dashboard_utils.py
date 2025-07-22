from sqlalchemy import func
from sqlalchemy.orm import Session
from datetime import date, timedelta

import backend.models

def get_total_income(db: Session, user_id: int):
    total_income = db.query(func.sum(backend.models.Income.amount)).filter(backend.models.Income.user_id == user_id).scalar()
    
    return total_income

def get_total_expense(db: Session, user_id: int):
    total_expense = db.query(func.sum(backend.models.Expense.amount)).filter(backend.models.Expense.user_id == user_id).scalar()
    
    return total_expense

def get_last_five_income(db: Session, user_id: int):
    incomes = db.query(backend.models.Income).filter(backend.models.Income.user_id == user_id).order_by(backend.models.Income.date.desc()).limit(5).all()
    return incomes

def get_last_five_expense(db: Session, user_id: int):
    expenses = db.query(backend.models.Expense).filter(backend.models.Expense.user_id == user_id).order_by(backend.models.Expense.date.desc()).limit(5).all()
    return expenses

def format_transaction(txn, txn_type: str):
    return {
        "id": txn.id,
        "amount": txn.amount,
        # "description": txn.description,
        # "category_or_source": getattr(txn, "category", getattr(txn, "source", None)),
        "date": txn.date,
        "type": txn_type
    }


def get_last_five_transactions(db:Session, user_id: int):
    last_five_incomes = get_last_five_income(db=db, user_id=user_id)

    last_five_expenes = get_last_five_expense(db=db, user_id=user_id)

    income_txns = [format_transaction(txn, "income") for txn in last_five_incomes]
    expense_txns = [format_transaction(txn, "expense") for txn in last_five_expenes]

    all_txns = income_txns + expense_txns

    sorted_txns = sorted(all_txns, key=lambda x: x["date"], reverse=True)

    return sorted_txns[:5]

def get_last_30_days_expenses(db: Session, user_id: int):
    thirty_days = date.today()-timedelta(days=30)

    expenses = (
        db.query(backend.models.Expense)
        .filter(
            backend.models.Expense.user_id == user_id, 
            backend.models.Expense.date >= thirty_days)
        .order_by(backend.models.Expense.date.desc())
        .all()
        )
    return expenses

def get_last_60_days_incomes(db: Session, user_id: int):
    sixty_days = date.today()-timedelta(days=60)

    incomes = (
        db.query(backend.models.Income)
        .filter(
            backend.models.Income.user_id == user_id, 
            backend.models.Income.date >= sixty_days)
        .order_by(backend.models.Income.date.desc())
        .all()
        )
    return incomes
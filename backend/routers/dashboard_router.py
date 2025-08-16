from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from ..database import get_db
from ..utils import dashboard_utils 
from ..utils.dependencies import get_current_user
from ..utils.security_utils import hash_password, verify_password, create_access_token
from .. import models
from ..schemas import IncomeCreate, IncomeOut, Token, UserCreate, UserOut

dashboard_router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard Routes"]
)

@dashboard_router.get("/")
def fetch_dashboard_data(db: Session=Depends(get_db), current_user = Depends(get_current_user)):
    total_income = dashboard_utils.get_total_income(db=db, user_id=current_user.id)
    total_expense = dashboard_utils.get_total_expense(db=db, user_id=current_user.id)

    last_five_transactions = dashboard_utils.get_last_five_transactions(db=db, user_id=current_user.id)

    last_thirty_day_expenses = dashboard_utils.get_last_30_days_expenses(db=db, user_id=current_user.id)

    last_sixty_day_incomes = dashboard_utils.get_last_60_days_incomes(db=db, user_id=current_user.id)
    return {
        "total_balance": total_income-total_expense,
        "total_income": total_income,
        "total_expense": total_expense,
        "recent_transactions": last_five_transactions,
        "last_30_days_expenses": last_thirty_day_expenses,
        "last_60_day_incomes": last_sixty_day_incomes
    }

'''
res.json({
    totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
    totalIncome: totalIncome[0]?.total || 0,
    totalExpenses: totalExpense[0]?.total || 0,
    last30DaysExpenses: {
        total: expensesLast30Days,
        transactions: last30DaysExpenseTransactions,
    },
    last60DaysIncome: {
        total: incomeLast60Days,
        transactions: last60DaysIncomeTransactions,
    },
    recentTransactions: lastTransactions,
    });
'''
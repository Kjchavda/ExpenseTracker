from typing import Optional
from pydantic import BaseModel, EmailStr
import datetime 

class TokenData(BaseModel):
    user_id: int | None = None

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserOut(BaseModel):
    email: EmailStr
    name: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


class IncomeCreate(BaseModel):
    amount: int
    source: str
    description: Optional[str] = None
    date: Optional[datetime.date] = datetime.date.today()

class IncomeOut(BaseModel):
    amount: int
    source: str
    description: str
    date: datetime.date

    class Config:
        orm_mode = True

class ExpenseCreate(BaseModel):
    amount: int
    category: str
    description: Optional[str] = None
    date: Optional[datetime.date] = datetime.date.today()

class ExpenseOut(BaseModel):
    amount: int
    category: str
    description: str
    date: datetime.date

    class Config:
        orm_mode = True
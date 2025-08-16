import datetime
from sqlalchemy import Column, Date, DateTime, Float, Integer, String, Boolean, ForeignKey, Table, Text
from sqlalchemy.orm import relationship

from backend.database import Base

class User(Base):
    __tablename__ = "users"
    id =  Column(Integer, primary_key=True, index=True)
    hashed_password = Column(String, nullable=False)
    email = Column(String, nullable=False)
    name = Column(String, nullable=False)

    incomes = relationship("Income", back_populates="user", cascade="all, delete")
    expenses = relationship("Expense", back_populates="user", cascade="all, delete")



class Income(Base):
    __tablename__ = "incomes"
    
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    source = Column(String, nullable=False)
    description = Column(String)
    date = Column(Date, nullable=False, default=datetime.date.today)
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="incomes")

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False)  # e.g., Food, Rent, Travel
    description = Column(String, nullable=True)
    date = Column(Date, default=datetime.date.today, nullable=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="expenses")
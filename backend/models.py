from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Table, Text
from sqlalchemy.orm import relationship

from backend.database import Base

class User(Base):
    __tablename__ = "users"
    id =  Column(Integer, primary_key=True, index=True)
    hashed_password = Column(String, nullable=False)
    email = Column(String, nullable=False)
    name = Column(String, nullable=False)
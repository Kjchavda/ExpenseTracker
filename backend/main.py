from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models
from .database import engine
from .routers import auth_router, dashboard_router, expense_router, income_router

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:5173",       # React dev server
    
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # ✅ Allow these origins
    allow_credentials=True,
    allow_methods=["*"],              # ✅ Allow all HTTP methods
    allow_headers=["*"],              # ✅ Allow all headers (including Authorization)
)

app.include_router(expense_router.expense_router)
app.include_router(income_router.income_router)
app.include_router(dashboard_router.dashboard_router)
app.include_router(auth_router.auth_router)


@app.get("/")
def root():
    return{"Hello World"}
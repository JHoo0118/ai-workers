import logging

from app.db.prisma import prisma
from fastapi import FastAPI
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from app.api import api
from app.middleware import RouterLoggingMiddleware
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()


@asynccontextmanager
async def lifespan(_: FastAPI):
    try:
        prisma.connect()
        yield
    finally:
        prisma.disconnect()


app = FastAPI(lifespan=lifespan)
# app.add_middleware(
#     RouterLoggingMiddleware,
#     logger=logging.getLogger(__name__),
# )
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"version": "1.0.0"}


app.include_router(api, prefix="/api")

from fastapi import FastAPI
from pydantic import BaseModel
try:
    import tensorflow as tf  # noqa: F401
except ImportError:
    tf = None  # Demo mode: allow running without tensorflow installed

app = FastAPI()

class TransactionData(BaseModel):
    data: dict

@app.post("/analyze")
async def analyze(data: TransactionData):
    # Dummy LSTM ? ???? mock
    score = 0.83
    return {"risk_score": score}

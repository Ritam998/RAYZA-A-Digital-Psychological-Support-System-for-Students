from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()  # THIS IS CRUCIAL

def predict_function(text: str):
    return text.upper()  # example logic

class InputData(BaseModel):
    text: str

@app.post("/predict")
def predict(data: InputData):
    result = predict_function(data.text)
    return {"result": result}

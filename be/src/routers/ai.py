from fastapi import APIRouter, HTTPException
from src.controllers.ai_controller import (
    main_train_model,
    predict_from_model                                           
)
from src.models.ai import AIResponse, AIRequest

router = APIRouter(prefix="/ai", tags=["Ai"])
# print("✅ AI Router đã được load")
@router.get("/train")
async def train():
    """API train model"""
    success = main_train_model()
    if not success:
        raise HTTPException(status_code=404, detail="Không train được model")
    return success

@router.get("/predict")
async def predict_control(req: AIRequest):
    """ API du doan tin hieu dieu khien PUMP va FAN"""
    temp = req.temp
    humid = req.humid
    if type(temp) is str:
        temp = float(temp)
    if type(humid) is str:
        humid = float(humid)
    # print(f"temp: {temp}, humid: {humid}")
    response :  AIResponse = predict_from_model(temp, humid)
    print(f"response: {response}")
    if not response:
        raise HTTPException(status_code=404, detail="không dự đoán được")
    return response
from pydantic import BaseModel

class AIResponse(BaseModel):
    pump: int
    fan: int
    
class AIRequest(BaseModel):
    temp: float
    humid: float
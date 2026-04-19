from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from api.models import Users

class Token(BaseModel):
    access_token: str

security = HTTPBearer()

def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)):
    # Temporary stub, replace with actual authentication logic
    return Users(id=5, email="temp@example.com", plan_tier="starter")

# def get_current_active_user(current_user: Users = Depends(get_current_user)):
#     if not current_user.is_active:
#         raise HTTPException(status_code=400, detail="Inactive user")
#     return current_user

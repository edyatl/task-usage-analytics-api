from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from api.models import Users
from api.auth.service import AuthService

security = HTTPBearer(auto_error=False)

def get_current_user(
    request: Request, 
    credentials: HTTPAuthorizationCredentials | None = Depends(security)
):
    token = request.cookies.get("access_token")
    if not token:
        token = credentials.credentials if credentials else None

    if not token:
        raise HTTPException(status_code=401, detail="Missing token")

    try:
        payload = AuthService.decode_access_token(token)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

    return payload

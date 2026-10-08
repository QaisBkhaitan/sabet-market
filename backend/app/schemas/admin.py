from pydantic import BaseModel


class AdminLoginRequest(BaseModel):
    username: str
    password: str


class AdminResponse(BaseModel):
    id: int
    username: str
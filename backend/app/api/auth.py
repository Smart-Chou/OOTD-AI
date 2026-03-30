from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, datetime, timezone
from jose import JWTError, jwt
import secrets

from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, validate_password_strength
from app.core.config import settings
from app.models.models import User, BodyData, RefreshToken
from app.schemas.schemas import (
    UserCreate, UserResponse, UserUpdate,
    Token, LoginRequest, BodyDataCreate, BodyDataResponse,
    RefreshTokenRequest, RefreshTokenResponse, TokenRevokeRequest
)
from app.middleware.rate_limit import limiter, AUTH_RATE_LIMIT

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

# Refresh Token 配置
REFRESH_TOKEN_EXPIRE_DAYS = 12  # 12小时有效期
REFRESH_TOKEN_LENGTH = 64  # 令牌长度


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    expire_timestamp = datetime.now(timezone.utc).timestamp() + expire.total_seconds()
    to_encode.update({"exp": expire_timestamp})
    return jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.JWT_ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.JWT_ALGORITHM])
        user_id_str = payload.get("sub")
        if user_id_str is None:
            raise credentials_exception
        user_id = int(user_id_str)
    except (JWTError, ValueError):
        raise credentials_exception
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user


def _create_refresh_token(db: Session, user_id: int, device_info: str = None) -> str:
    """创建并存储 Refresh Token"""
    token = secrets.token_urlsafe(REFRESH_TOKEN_LENGTH)
    expires_at = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

    db_refresh_token = RefreshToken(
        user_id=user_id,
        token=token,
        expires_at=expires_at,
        device_info=device_info
    )
    db.add(db_refresh_token)
    db.commit()

    return token


def _verify_refresh_token(db: Session, token: str) -> RefreshToken | None:
    """验证 Refresh Token"""
    refresh_token = db.query(RefreshToken).filter(
        RefreshToken.token == token,
        RefreshToken.is_revoked == 0
    ).first()

    if not refresh_token:
        return None

    # 检查是否过期
    if refresh_token.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        return None

    return refresh_token


def _revoke_refresh_token(db: Session, token: str) -> bool:
    """撤销 Refresh Token"""
    refresh_token = db.query(RefreshToken).filter(
        RefreshToken.token == token
    ).first()

    if refresh_token:
        refresh_token.is_revoked = 1
        db.commit()
        return True
    return False


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("3/minute")
def register(request: Request, user: UserCreate, db: Session = Depends(get_db)):
    # Check if email exists
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    # Check if username exists
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    # Validate password strength
    is_valid, error_msg = validate_password_strength(user.password)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)

    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.post("/login")
@limiter.limit("5/minute")
def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": str(user.id)})
    # 创建并返回 refresh token
    refresh_token = _create_refresh_token(db, user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "refresh_token": refresh_token,
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }


@router.post("/refresh", response_model=RefreshTokenResponse)
@limiter.limit("10/minute")
def refresh_token(request: Request, request_body: RefreshTokenRequest, db: Session = Depends(get_db)):
    """使用 Refresh Token 获取新的 Access Token"""
    refresh_token_obj = _verify_refresh_token(db, request.refresh_token)

    if not refresh_token_obj:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 获取用户
    user = db.query(User).filter(User.id == refresh_token_obj.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    # 生成新的 Access Token
    access_token = create_access_token(data={"sub": str(user.id)})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }


@router.post("/revoke")
def revoke_token(request: TokenRevokeRequest, db: Session = Depends(get_db)):
    """撤销 Refresh Token (登出)"""
    revoked = _revoke_refresh_token(db, request.refresh_token)
    if not revoked:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Token not found",
        )
    return {"message": "Token revoked successfully"}


@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserResponse)
def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user_update.email:
        current_user.email = user_update.email
    if user_update.username:
        current_user.username = user_update.username
    if user_update.full_name:
        current_user.full_name = user_update.full_name
    if user_update.avatar_url:
        current_user.avatar_url = user_update.avatar_url
    db.commit()
    db.refresh(current_user)
    return current_user

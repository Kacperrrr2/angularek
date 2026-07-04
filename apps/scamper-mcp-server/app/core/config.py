from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# app/core/config.py -> app/core -> app -> project root, where .env lives.
_ENV_FILE = Path(__file__).resolve().parent.parent.parent / ".env"


class Config(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=_ENV_FILE,
        env_ignore_empty=True,
        extra="ignore",
    )

    # ==========================================
    # MCP Server
    # ==========================================
    MCP_HOST: str = "localhost"
    MCP_PORT: int = 8124


config = Config()

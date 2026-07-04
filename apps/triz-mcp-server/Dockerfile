# Build context is the repo root - see docker-compose.yml
FROM python:3.13-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Trust a machine-local CA (e.g. antivirus HTTPS-scanning cert), if present - see docker/certs/
COPY docker/certs/ /usr/local/share/ca-certificates/
RUN update-ca-certificates

ENV PYTHONUNBUFFERED=1
ENV UV_PYTHON_DOWNLOADS=0
ENV UV_SYSTEM_CERTS=1

WORKDIR /app

RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=apps/triz-mcp-server/uv.lock,target=uv.lock \
    --mount=type=bind,source=apps/triz-mcp-server/pyproject.toml,target=pyproject.toml \
    uv sync --locked --no-install-project

COPY apps/triz-mcp-server/pyproject.toml apps/triz-mcp-server/uv.lock apps/triz-mcp-server/README.md ./
COPY apps/triz-mcp-server/app/ /app/app/

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked

CMD ["uv", "run", "python", "app/main.py"]

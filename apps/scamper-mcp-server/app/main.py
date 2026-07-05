from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from dataclasses import dataclass

import uvicorn
from mcp.server.fastmcp import FastMCP
from starlette.middleware.cors import CORSMiddleware

from app.core.config import Config, config
from app.core.logger import setup_logging
from app.prompts import register as register_prompts
from app.resources import register as register_resources
from app.services.scamper import ScamperStore, get_store
from app.tools import register as register_tools


@dataclass
class AppContext:
    config: Config
    store: ScamperStore


@asynccontextmanager
async def lifespan(server: FastMCP) -> AsyncIterator[AppContext]:
    setup_logging()
    store = get_store()
    yield AppContext(config=config, store=store)


mcp = FastMCP(
    "SCAMPER MCP Server",
    lifespan=lifespan,
    stateless_http=True,
    json_response=True,
    # FastMCP auto-enables DNS-rebinding protection (rejecting non-localhost Host
    # headers with 421) when it thinks it's bound to localhost. Tell it the real
    # bind host so that logic reflects reality (e.g. 0.0.0.0 in Docker, reachable
    # by other containers via their own Host header).
    host=config.MCP_HOST,
)

# ---------------------------------------------------------------------------
# Register tools, resources, and prompts
# ---------------------------------------------------------------------------

register_tools(mcp)
register_resources(mcp)
register_prompts(mcp)


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    app = mcp.streamable_http_app()
    app = CORSMiddleware(
        app,
        allow_origins=["*"],
        allow_methods=["GET", "POST", "DELETE"],
        allow_headers=["*"],
        expose_headers=["Mcp-Session-Id"],
    )
    uvicorn.run(app, host=config.MCP_HOST, port=config.MCP_PORT)

from mcp.server.fastmcp import FastMCP

from app.resources.example import read_category

# Add your resources here — URI pattern + handler.
resources: list[tuple[str, object]] = [
    ("scamper://{category}", read_category),
]


def register(mcp: FastMCP) -> None:
    for uri, handler in resources:
        mcp.resource(uri)(handler)

from mcp.server.fastmcp import FastMCP

from app.tools.scamper import (
    generate_scamper_questions,
    get_random_scamper_prompts,
    get_scamper_category,
    list_scamper_categories,
    search_scamper_prompts,
)

tools = [
    # Data / retrieval
    list_scamper_categories,
    get_scamper_category,
    search_scamper_prompts,
    get_random_scamper_prompts,
    # Problem redefinition
    generate_scamper_questions,
]


def register(mcp: FastMCP) -> None:
    for tool in tools:
        mcp.tool()(tool)

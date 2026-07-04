from mcp.server.fastmcp import FastMCP

from app.prompts.example import reframe_problem

prompts = [
    reframe_problem,
]


def register(mcp: FastMCP) -> None:
    for prompt in prompts:
        mcp.prompt()(prompt)

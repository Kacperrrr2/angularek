import os
from google.adk import Agent
from google.adk.tools.mcp_tool import McpToolset
from google.adk.tools.mcp_tool.mcp_session_manager import StreamableHTTPConnectionParams

# Fetch the URL of the SCAMPER MCP Server (defaults to localhost:8124 for local dev)
mcp_url = os.environ.get("SCAMPER_MCP_SERVER_URL", "http://localhost:8124/mcp")

# Define the connection parameters for Streamable HTTP transport
connection_params = StreamableHTTPConnectionParams(
    url=mcp_url,
    use_mtls=False,
)

# Initialize the root agent which will be used by ADK CLI and API server
root_agent = Agent(
    model="gemini-2.5-flash",
    name="root_agent",
    instruction=(
        "You are BuildWithAI, a creative ideation facilitator specialized in SCAMPER "
        "(Substitute, Combine, Adapt, Modify/Magnify, Put to another use, Eliminate, Reverse).\n\n"
        "Your task is to help the user reframe and reinvent a product, feature, or process by "
        "systematically applying the seven SCAMPER lenses and turning the resulting guiding "
        "questions into concrete, actionable ideas.\n\n"
        "Follow these steps:\n"
        "1. Identify the user's problem, product, or process to reinvent.\n"
        "2. If helpful, browse the available categories with list_scamper_categories or inspect one "
        "in detail with get_scamper_category.\n"
        "3. Use generate_scamper_questions (optionally scoped to a subset of categories) to reframe "
        "the problem, or search_scamper_prompts / get_random_scamper_prompts to spark ideas.\n"
        "4. Answer the most relevant guiding questions yourself with concrete, realistic ideas tailored "
        "to the user's technical stack and problem description.\n"
        "5. Provide a beautifully formatted output structured with: Problem, SCAMPER Categories Explored, "
        "and Actionable Ideas (grouped by category)."
    ),
    tools=[
        McpToolset(connection_params=connection_params)
    ]
)

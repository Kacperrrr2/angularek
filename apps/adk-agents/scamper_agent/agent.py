import os

# TEMPORARY local-dev-only escape hatch: skips TLS certificate verification on
# outbound calls (e.g. to Gemini) when an intercepting proxy/antivirus (e.g. Avast
# Web Shield) injects a malformed root certificate that a correct client must
# reject. Patches ssl.create_default_context itself so it applies regardless of
# which library/layer requests a context. Never enable this outside local dev.
if os.environ.get("ADK_INSECURE_SKIP_TLS_VERIFY") == "1":
    import ssl

    _orig_create_default_context = ssl.create_default_context

    def _insecure_create_default_context(*args, **kwargs):
        ctx = _orig_create_default_context(*args, **kwargs)
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        return ctx

    ssl.create_default_context = _insecure_create_default_context

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

WORKSPACE_CONTEXT_INSTRUCTION = """

Workspace context rules:
- Always use the provided workspace/IDE context as the source of truth when it is present.
- Treat the current working directory, active file, open tabs, selected text, diagnostics,
  terminal output, git status, and detected project files as runtime context for the request.
- If the user says "this file", "the app", "the project", "here", "now", or similar, resolve
  that using the active file and current working directory from the provided context.
- Do not assume you can see the IDE directly. Only rely on context explicitly provided in the
  conversation and on files/tools available to you.
- When suggesting commands, base them on the current working directory and project scripts.
- When changing or explaining code, inspect the relevant files, preserve existing style, and do
  not overwrite unrelated user changes.
"""

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
        + WORKSPACE_CONTEXT_INSTRUCTION
    ),
    tools=[
        McpToolset(connection_params=connection_params)
    ]
)

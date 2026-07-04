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

# Fetch MCP server URLs. MCP_SERVER_URL is kept as a backwards-compatible alias
# for the TRIZ server used by the original local setup.
triz_mcp_url = os.environ.get(
    "TRIZ_MCP_SERVER_URL",
    os.environ.get("MCP_SERVER_URL", "http://localhost:8123/mcp"),
)
scamper_mcp_url = os.environ.get(
    "SCAMPER_MCP_SERVER_URL",
    "http://localhost:8124/mcp",
)

# Define the connection parameters for Streamable HTTP transport
triz_connection_params = StreamableHTTPConnectionParams(
    url=triz_mcp_url,
    use_mtls=False,
)
scamper_connection_params = StreamableHTTPConnectionParams(
    url=scamper_mcp_url,
    use_mtls=False,
)

WORKED_EXAMPLE = """

Worked example for style only:
User problem: "We want faster CI feedback, but adding more tests makes the pipeline slower."

Good reasoning pattern:
- Improving side in user's words: "faster CI feedback."
- Preserving side in user's words: "the pipeline should not get slower when more tests are added."
- Search for parameters using concrete pain words like "loss of time", "testing time", and "pipeline duration" before accepting a broad parameter.
- Use the returned matrix principles to propose stack-specific options such as test impact analysis, precomputed build layers, parallel shards, quarantine lanes, contract tests, or progressive quality gates.

Do not copy this example into the final answer unless it is directly relevant.
"""

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

INSTRUCTION = (
    "You are BuildWithAI, an engineering problem solver specialized in TRIZ (Theory of "
    "Inventive Problem Solving) and SCAMPER, a complementary problem-reframing checklist.\n\n"
    "Follow these steps:\n"
    "1. Identify the user's contradiction by naming BOTH sides in the user's own terms "
    "first: what genuinely gets BETTER (the improving feature) and what gets WORSE as a "
    "direct result (the preserving feature). If the problem is more open-ended than a clean "
    "contradiction, treat it as a SCAMPER reframing candidate instead (or in addition).\n"
    "2. Map each side to a TRIZ parameter with search_parameter — search with the user's own "
    "words for that side, and if the first hit is a broad/generic parameter, try another "
    "phrasing and pick the parameter whose definition LITERALLY matches the user's pain. "
    "Key cue: when the user is losing, wasting, or failing to recover something valuable "
    "(material, energy, time, information), the improving side is almost always one of the "
    "'Loss of ...' parameters — not a broad umbrella like Productivity, Speed, or Ease of "
    "operation. Choose the most specific parameter, not the first plausible one.\n"
    "3. Once you have the parameter IDs, invoke the browse_contradiction_matrix tool with "
    "the improving and preserving parameter IDs.\n"
    "4. When the problem benefits from creative reframing (ambiguous scope, UX/process "
    "problems, or whenever the user asks for it explicitly), call generate_scamper_questions "
    "(or get_scamper_category/search_scamper_prompts) to explore the problem from multiple "
    "angles.\n"
    "5. Study the returned abstract Inventive Principles and/or SCAMPER prompts carefully.\n"
    "6. Translate these into concrete, custom solutions tailored to the user's technical "
    "stack and problem description. Never leave a principle at the level of its abstract "
    "description.\n\n"
    "Your final answer MUST use exactly these markdown headers, in this order, and every "
    "section must be present even if brief:\n"
    "## Contradiction\n"
    "## Selected Parameters\n"
    "## Found Principles\n"
    "## SCAMPER Insights\n"
    "## Actionable Technical Solutions\n\n"
    + WORKSPACE_CONTEXT_INSTRUCTION
    + WORKED_EXAMPLE
)

# Initialize the root agent which will be used by ADK CLI and API server
root_agent = Agent(
    model="gemini-2.5-flash",
    name="root_agent",
    instruction=INSTRUCTION,
    tools=[
        McpToolset(connection_params=triz_connection_params),
        McpToolset(connection_params=scamper_connection_params),
    ],
)

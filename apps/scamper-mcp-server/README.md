# SCAMPER MCP Server

A Model Context Protocol (MCP) server exposing tools for the [SCAMPER](https://en.wikipedia.org/wiki/SCAMPER) checklist over Streamable HTTP — a complementary problem-redefinition method to the TRIZ contradiction matrix in [`../mcp-server`](../mcp-server).

SCAMPER reframes a problem by asking guiding questions across seven lenses:

- **S**ubstitute
- **C**ombine
- **A**dapt
- **M**odify (magnify / minify)
- **P**ut to another use
- **E**liminate
- **R**everse (rearrange)

Unlike the TRIZ matrix (which maps improving/preserving engineering parameters to inventive principles), SCAMPER is a lightweight checklist you apply directly to a free-text problem statement — no matrix lookup or embeddings required.

## Run with uv

```bash
cp ../.env.example .env   # or create scamper-mcp-server/.env directly
uv sync
uv run python app/main.py
```

Server listens on `http://localhost:8124` (see `MCP_HOST` / `MCP_PORT` in `.env`).

## Run with Docker

```bash
./local_deploy.sh
```

Builds the image, runs it detached, and prints the server URL, logs command, and stop command.

## Test with MCP Inspector

With the server running (locally or via Docker), launch the [MCP Inspector](https://github.com/modelcontextprotocol/inspector):

```bash
npx @modelcontextprotocol/inspector
```

In the Inspector UI, connect using:

- **Transport:** Streamable HTTP
- **URL:** `http://localhost:8124/mcp`

You should see the registered tools (category listing, prompt search, random prompts, and problem-reframing question generation) and can invoke them directly from the UI.

## Add to LM Studio

With the server running, open the "Program" tab in LM Studio's right sidebar, then `Install > Edit mcp.json`, and add:

```json
{
  "mcpServers": {
    "scamper-mcp-server": {
      "url": "http://localhost:8124/mcp"
    }
  }
}
```

## Tools

| Tool | Description |
| --- | --- |
| `list_scamper_categories` | List all seven SCAMPER categories with descriptions. |
| `get_scamper_category` | Full detail (questions + examples) for one category by letter or name. |
| `search_scamper_prompts` | Keyword search over guiding questions and examples. |
| `get_random_scamper_prompts` | Random selection of guiding questions to spark ideation. |
| `generate_scamper_questions` | Redefine a free-text problem by generating SCAMPER questions for it (optionally scoped to a subset of categories). |

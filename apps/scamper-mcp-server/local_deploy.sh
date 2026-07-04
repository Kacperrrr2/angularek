#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

MCP_PORT=8124

CONTAINER_NAME="gcp-scamper-mcp-server"

docker build -t scamper-mcp-server .

docker rm -f "${CONTAINER_NAME}" >/dev/null 2>&1 || true

docker run -d \
    --name "${CONTAINER_NAME}" \
    -p "${MCP_PORT}:${MCP_PORT}" \
    -e MCP_HOST=0.0.0.0 \
    -e MCP_PORT="${MCP_PORT}" \
    scamper-mcp-server

echo "Running at http://localhost:${MCP_PORT}/mcp"
echo "Logs: docker logs -f ${CONTAINER_NAME}"
echo "Stop: docker stop ${CONTAINER_NAME}"

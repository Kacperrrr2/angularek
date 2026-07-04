# Build context is the repo root (Nx monorepo) - see docker-compose.yml
FROM node:24-slim

# Trust a machine-local CA (e.g. antivirus HTTPS-scanning cert), if present - see docker/certs/
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY docker/certs/ /usr/local/share/ca-certificates/
RUN update-ca-certificates
ENV NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/local-ca.crt

WORKDIR /workspace

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 4200

CMD ["npx", "nx", "serve", "frontend", "--host", "0.0.0.0", "--port", "4200"]

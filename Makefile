# ==========================================================================
# BuildWithAI - GCP Deployment Makefile (run from the repo root)
#
# Cloud Build config files (build-*.yaml, cloudbuild.yaml) live alongside this
# Makefile at the repo root. All Dockerfiles expect the repo root as their
# build context (they COPY apps/<service>/... paths), so builds are submitted
# with '.' (this directory) as source.
# ==========================================================================

# Configuration Variables (Participants should override these)
GCP_PROJECT   ?= przykladowy-projekt1234
REGION        ?= europe-west1
REGISTRY_NAME ?= buildwithai-repo
DB_INSTANCE   ?= buildwithai-db
DB_USER       ?= postgres
DB_PASSWORD   ?= inventapassword
DB_NAME       ?= buildwithai

# Full Image Paths
REGISTRY_URL       = $(REGION)-docker.pkg.dev/$(GCP_PROJECT)/$(REGISTRY_NAME)
MCP_IMAGE          = $(REGISTRY_URL)/triz-mcp-server:latest
SCAMPER_MCP_IMAGE  = $(REGISTRY_URL)/scamper-mcp-server:latest
AGENT_IMAGE        = $(REGISTRY_URL)/triz-adk-agent:latest
BACKEND_IMAGE      = $(REGISTRY_URL)/buildwithai-backend:latest
FRONTEND_IMAGE     = $(REGISTRY_URL)/buildwithai-frontend:latest

.PHONY: help install-tools install-deps gcp-init gcp-enable-apis gcp-create-registry gcp-create-db build-mcp build-scamper-mcp build-agent build-backend build-frontend build-all deploy-mcp deploy-scamper-mcp deploy-agent deploy-backend deploy-frontend deploy-all show-urls gcp-cleanup

help:
	@echo "=========================================================================="
	@echo "🌀 BUILDWITHAI - GCP DEPLOYMENT MENU"
	@echo "=========================================================================="
	@echo "Prerequisites & Local Tooling Setup:"
	@echo "  make install-tools       (Install 'uv' package manager automatically)"
	@echo "  make install-deps        (Install all Node and Python dependencies)"
	@echo ""
	@echo "Configure GCP credentials and project:"
	@echo "  make gcp-init GCP_PROJECT=your-project-id"
	@echo ""
	@echo "Step 1: Enable Google APIs:"
	@echo "  make gcp-enable-apis"
	@echo ""
	@echo "Step 2: Create Artifact Registry:"
	@echo "  make gcp-create-registry"
	@echo ""
	@echo "Step 3: Spin up Cloud SQL PostgreSQL:"
	@echo "  make gcp-create-db"
	@echo ""
	@echo "Step 4: Build individual services (Cloud Build):"
	@echo "  make build-mcp           (Build only TRIZ MCP Server)"
	@echo "  make build-scamper-mcp   (Build only SCAMPER MCP Server)"
	@echo "  make build-agent         (Build only ADK Agent - serves triz_agent + scamper_agent)"
	@echo "  make build-backend       (Build only NestJS Backend)"
	@echo "  make build-frontend      (Build only Angular Frontend)"
	@echo "  make build-all           (Build all five services)"
	@echo ""
	@echo "Step 5: Deploy containers to Cloud Run (in this order):"
	@echo "  make deploy-mcp          (TRIZ MCP Server)"
	@echo "  make deploy-scamper-mcp  (SCAMPER MCP Server)"
	@echo "  make deploy-agent        (ADK Agent)"
	@echo "  make deploy-backend      (NestJS Backend connected to Database)"
	@echo "  make deploy-frontend     (Angular Frontend)"
	@echo "  make deploy-all          (Deploy all five, in the correct order)"
	@echo ""
	@echo "Utility Targets:"
	@echo "  make show-urls           (Retrieve URLs of deployed Cloud Run services)"
	@echo "  make gcp-cleanup         (Delete all deployed resources)"
	@echo "=========================================================================="

# Install uv package manager dynamically depending on OS
install-tools:
	@echo "Detecting OS for 'uv' package manager installation..."
	@if [ "$$(uname)" = "Darwin" ] || [ "$$(uname)" = "Linux" ]; then \
		echo "Installing uv for Linux/macOS..."; \
		curl -LsSf https://astral.sh/uv/install.sh | sh; \
	elif [ "$$(expr substr $$(uname -s) 1 10)" = "MINGW32_NT" ] || [ "$$(expr substr $$(uname -s) 1 10)" = "MINGW64_NT" ]; then \
		echo "Installing uv for Windows (PowerShell)..."; \
		powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"; \
	else \
		echo "Unsupported OS for automatic install. Please install 'uv' manually from https://github.com/astral-sh/uv"; \
	fi

# Install Node & Python dependencies
install-deps:
	@echo "Installing python packages for the MCP servers and ADK agents..."
	cd apps/triz-mcp-server && uv sync
	cd apps/scamper-mcp-server && uv sync
	cd apps/adk-agents && uv sync
	@echo "Installing global monorepo NPM dependencies..."
	npm install

# Authenticate & set current active project
gcp-init:
	gcloud auth login
	gcloud config set project $(GCP_PROJECT)

# Enable all required APIs
gcp-enable-apis:
	gcloud services enable \
		artifactregistry.googleapis.com \
		run.googleapis.com \
		sqladmin.googleapis.com \
		compute.googleapis.com \
		cloudbuild.googleapis.com \
		aiplatform.googleapis.com

# Create Artifact Registry Repository for Docker images
gcp-create-registry:
	gcloud artifacts repositories create $(REGISTRY_NAME) \
		--repository-format=docker \
		--location=$(REGION) \
		--description="BuildWithAI Docker Repository"

# Provision a production-grade Cloud SQL instance
gcp-create-db:
	@echo "Provisioning Cloud SQL (PostgreSQL)... This will take a few minutes."
	gcloud sql instances create $(DB_INSTANCE) \
		--database-version=POSTGRES_15 \
		--tier=db-f1-micro \
		--region=$(REGION) \
		--root-password=$(DB_PASSWORD)
	@echo "Creating Database $(DB_NAME)..."
	gcloud sql databases create $(DB_NAME) --instance=$(DB_INSTANCE)

# ==========================================================================
# Individual Container Build Targets (Cloud Build)
# ==========================================================================

build-mcp:
	gcloud builds submit . --config=build-mcp.yaml

build-scamper-mcp:
	gcloud builds submit . --config=build-scamper-mcp.yaml

build-agent:
	gcloud builds submit . --config=build-agent.yaml

build-backend:
	gcloud builds submit . --config=build-backend.yaml

build-frontend:
	gcloud builds submit . --config=build-frontend.yaml

build-all: build-mcp build-scamper-mcp build-agent build-backend build-frontend

# ==========================================================================
# Deployment Targets (Cloud Run)
# ==========================================================================

# Deploy TRIZ MCP Server (Private internal microservice)
deploy-mcp:
	gcloud run deploy triz-mcp-server \
		--image=$(MCP_IMAGE) \
		--region=$(REGION) \
		--platform=managed \
		--ingress=all \
		--allow-unauthenticated \
		--memory=2Gi \
		--min-instances=1 \
		--set-env-vars=MCP_HOST=0.0.0.0,MCP_PORT=8080

# Deploy SCAMPER MCP Server (Private internal microservice)
deploy-scamper-mcp:
	gcloud run deploy scamper-mcp-server \
		--image=$(SCAMPER_MCP_IMAGE) \
		--region=$(REGION) \
		--platform=managed \
		--ingress=all \
		--allow-unauthenticated \
		--memory=2Gi \
		--min-instances=1 \
		--set-env-vars=MCP_HOST=0.0.0.0,MCP_PORT=8080

# Deploy Google ADK Agent (serves both triz_agent and scamper_agent)
deploy-agent:
	@echo "Fetching private MCP Server URLs..."
	$(eval MCP_URL := $(shell gcloud run services describe triz-mcp-server --region=$(REGION) --format='value(status.url)'))
	$(eval SCAMPER_MCP_URL := $(shell gcloud run services describe scamper-mcp-server --region=$(REGION) --format='value(status.url)'))
	gcloud run deploy triz-adk-agent \
		--image=$(AGENT_IMAGE) \
		--region=$(REGION) \
		--platform=managed \
		--ingress=all \
		--allow-unauthenticated \
		--memory=2Gi \
		--min-instances=1 \
		--set-env-vars=MCP_SERVER_URL=$(MCP_URL)/mcp,SCAMPER_MCP_SERVER_URL=$(SCAMPER_MCP_URL)/mcp,GOOGLE_GENAI_USE_VERTEXAI=1,GOOGLE_CLOUD_PROJECT=$(GCP_PROJECT),GOOGLE_CLOUD_LOCATION=$(REGION),GCP_PROJECT=$(GCP_PROJECT)

# Deploy NestJS Backend (Publicly accessible api service)
deploy-backend:
	@echo "Fetching private ADK Agent URL..."
	$(eval AGENT_URL := $(shell gcloud run services describe triz-adk-agent --region=$(REGION) --format='value(status.url)'))
	gcloud run deploy buildwithai-backend \
		--image=$(BACKEND_IMAGE) \
		--region=$(REGION) \
		--platform=managed \
		--allow-unauthenticated \
		--min-instances=1 \
		--add-cloudsql-instances=$(GCP_PROJECT):$(REGION):$(DB_INSTANCE) \
		--set-env-vars=DATABASE_URL="postgresql://$(DB_USER):$(DB_PASSWORD)@localhost:5432/$(DB_NAME)?host=/cloudsql/$(GCP_PROJECT):$(REGION):$(DB_INSTANCE)",ADK_AGENT_URL=$(AGENT_URL)

# Deploy Angular Frontend (Publicly accessible frontend; dev-server container listens on 4200)
deploy-frontend:
	@echo "Fetching private Backend URL..."
	$(eval BACKEND_URL := $(shell gcloud run services describe buildwithai-backend --region=$(REGION) --format='value(status.url)'))
	gcloud run deploy buildwithai-frontend \
		--image=$(FRONTEND_IMAGE) \
		--region=$(REGION) \
		--platform=managed \
		--allow-unauthenticated \
		--min-instances=1 \
		--memory=2Gi \
		--cpu=2 \
		--timeout=600 \
		--port=4200 \
		--set-env-vars=BACKEND_URL=$(BACKEND_URL)

# Deploy every service in the correct dependency order
deploy-all: deploy-mcp deploy-scamper-mcp deploy-agent deploy-backend deploy-frontend

# Retrieve active endpoints of deployed Cloud Run services
show-urls:
	@echo "=========================================================================="
	@echo "🌀 BUILDWITHAI - ACTIVE GCP CLOUD RUN ENDPOINTS"
	@echo "=========================================================================="
	@echo "Frontend (Angular UI):"
	@gcloud run services describe buildwithai-frontend --region=$(REGION) --format='value(status.url)'
	@echo ""
	@echo "Backend (NestJS API):"
	@gcloud run services describe buildwithai-backend --region=$(REGION) --format='value(status.url)'
	@echo ""
	@echo "ADK Agent (Private Brain):"
	@gcloud run services describe triz-adk-agent --region=$(REGION) --format='value(status.url)'
	@echo ""
	@echo "TRIZ MCP Server (Private Tools):"
	@gcloud run services describe triz-mcp-server --region=$(REGION) --format='value(status.url)'
	@echo ""
	@echo "SCAMPER MCP Server (Private Tools):"
	@gcloud run services describe scamper-mcp-server --region=$(REGION) --format='value(status.url)'
	@echo "=========================================================================="

# Tear down all deployed resources to avoid charges
gcp-cleanup:
	@echo "Deleting Cloud Run Services..."
	-gcloud run services delete buildwithai-frontend --region=$(REGION) --quiet
	-gcloud run services delete buildwithai-backend --region=$(REGION) --quiet
	-gcloud run services delete triz-adk-agent --region=$(REGION) --quiet
	-gcloud run services delete triz-mcp-server --region=$(REGION) --quiet
	-gcloud run services delete scamper-mcp-server --region=$(REGION) --quiet
	@echo "Deleting Cloud SQL Instance $(DB_INSTANCE)..."
	-gcloud sql instances delete $(DB_INSTANCE) --quiet
	@echo "Deleting Artifact Registry $(REGISTRY_NAME)..."
	-gcloud artifacts repositories delete $(REGISTRY_NAME) --location=$(REGION) --quiet
	@echo "Takedown completed!"

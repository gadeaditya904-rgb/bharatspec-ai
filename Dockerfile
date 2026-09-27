# ==============================================================================
# BHARATSPEC AI - PRODUCTION DOCKERFILE (UNIFIED CONTAINER DEPLOYMENT)
# Builds React Frontend SPA + Runs Python FastAPI REST API on a single port
# Compatible with: Render, Railway, Fly.io, Cloud Run, Hugging Face Spaces, VPS
# ==============================================================================

# -------------------------------------------------------------
# STAGE 1: Build Frontend Single Page App
# -------------------------------------------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# -------------------------------------------------------------
# STAGE 2: Python FastAPI Production Server
# -------------------------------------------------------------
FROM python:3.11-slim AS production

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python backend dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Copy built frontend from Stage 1 into backend-accessible location
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./backend/dist

EXPOSE 8000

WORKDIR /app/backend

# Start uvicorn serving both REST API and SPA frontend
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]

# BHARATSPEC AI — Deployment Guide

This guide provides instructions to deploy **BHARATSPEC AI** to free cloud hosting platforms (**Render**, **Railway**, **Fly.io**, or any Docker host).

---

## Architecture Overview

BHARATSPEC has been configured for **two flexible deployment modes**:

1. **Unified Single-Container Mode (Recommended)**:
   - The production `Dockerfile` compiles the React frontend SPA into static assets and embeds it directly into the Python FastAPI container.
   - FastAPI serves both the **REST API (`/api/*`)** and the **React Web UI (`/*`)** on a single domain and port.
   - **Zero CORS issues**, minimal memory footprint, and runs on any cloud host with a single container.

2. **Decoupled Split Mode (Render Blueprint)**:
   - Uses `render.yaml` to deploy:
     - `bharatspec-backend`: FastAPI Python Web Service
     - `bharatspec-frontend`: React Static Site with automatic URL binding

---

## Option 1: Deploy on Render (100% Free & Recommended)

Render provides free hosting for both web services and static sites.

### Method A: Blueprint Deployment (One-Click via `render.yaml`)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Deploy BHARATSPEC AI"
   git remote add origin https://github.com/<your-username>/bharatspec-ai.git
   git push -u origin main
   ```

2. **Deploy on Render**:
   - Go to [dashboard.render.com](https://dashboard.render.com/).
   - Click **New +** → **Blueprint**.
   - Connect your GitHub repository `bharatspec-ai`.
   - Render will read [render.yaml](file:///c:/Users/ADITYA/.gemini/antigravity/scratch/bharatspec-ai/render.yaml) and automatically create both services:
     - `bharatspec-backend` (FastAPI)
     - `bharatspec-frontend` (React SPA)
   - Click **Apply**.
   - Your application will be live in 2–3 minutes at your Render URL!

### Method B: Single Web Service (Unified Dockerfile)

1. On Render, click **New +** → **Web Service**.
2. Select your GitHub repository.
3. Choose **Docker** as the Environment.
4. Set Instance Type to **Free**.
5. Click **Deploy Web Service**.
6. Render will automatically build the `Dockerfile` and serve both frontend and backend on your single Render domain (e.g., `https://bharatspec-ai.onrender.com`).

---

## Option 2: Deploy on Railway (Free Tier / 1-Click)

Railway automatically detects the `Dockerfile` and [railway.json](file:///c:/Users/ADITYA/.gemini/antigravity/scratch/bharatspec-ai/railway.json).

1. Push your code to a GitHub repository.
2. Go to [railway.app](https://railway.app/) and sign in with GitHub.
3. Click **New Project** → **Deploy from GitHub repo**.
4. Select your `bharatspec-ai` repository.
5. Railway will automatically build the multi-stage `Dockerfile` and start the server.
6. In **Settings** → **Networking**, click **Generate Domain** (e.g. `bharatspec.up.railway.app`).
7. Your app is live!

---

## Option 3: Deploy on Fly.io

1. Install the Fly CLI:
   - **Windows (PowerShell)**: `pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"`
   - **Mac/Linux**: `curl -L https://fly.io/install.sh | sh`
2. Sign in:
   ```bash
   fly auth login
   ```
3. Launch and deploy:
   ```bash
   fly launch
   ```
   Select your app name and region. When prompted to tweak settings, proceed to deploy:
   ```bash
   fly deploy
   ```
4. Access your live app at `https://<your-app-name>.fly.dev`.

---

## Option 4: Local or VPS Docker Deployment

If deploying to your own Virtual Private Server (Ubuntu/Debian) or testing locally with Docker:

### Using Docker Compose:
```bash
docker compose up -d --build
```
Access at: `http://localhost:8000`

### Using Docker Directly:
```bash
# Build the image
docker build -t bharatspec-ai:latest .

# Run the container
docker run -d -p 8000:8000 --name bharatspec bharatspec-ai:latest
```

---

## Environment Variables Reference

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `PORT` | `8000` | Port on which FastAPI / Uvicorn listens. Assigned automatically by Render/Railway. |
| `VITE_API_BASE_URL` | Empty / Auto | Base URL for API calls. If unset, frontend automatically routes to the same host or `http://localhost:8000`. |
| `PYTHONUNBUFFERED` | `1` | Ensures real-time Python stdout/stderr log output in cloud logs. |

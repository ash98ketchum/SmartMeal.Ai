# ─── Stage 1: Build React frontend ─────────────────────────────────────────
FROM node:18 AS frontend-builder

WORKDIR /app/frontend

# Install deps
COPY frontend/package*.json ./
RUN npm install

# Copy source & build
COPY frontend/ ./
RUN npm run build

# ─── Stage 2: Build backend + bundle frontend ─────────────────────────────
FROM node:18

# Install Python for your model script
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy backend code and JSON data
COPY backend/ ./backend

# Copy built frontend into place
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose port & default start
EXPOSE 4000
CMD ["node", "backend/server.cjs"]

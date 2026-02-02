# Build stage for Rust contract
FROM rust:1.75-slim as contract-builder

RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

RUN rustup target add wasm32-unknown-unknown

WORKDIR /app
COPY Cargo.toml ./
COPY src ./src

RUN cargo build --release --target wasm32-unknown-unknown

# Build stage for frontend
FROM node:20-alpine as frontend-builder

WORKDIR /app/frontend
COPY frontend/package.json ./
RUN npm install

COPY frontend ./
RUN npm run build

# Final stage
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js for serving frontend
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g serve

WORKDIR /app

# Copy contract artifacts
COPY --from=contract-builder /app/target/wasm32-unknown-unknown/release/*.wasm ./contract/

# Copy frontend build
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Copy run script
COPY run.bash ./

EXPOSE 5173 8080

CMD ["bash", "run.bash"]

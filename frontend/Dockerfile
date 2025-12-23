# Multi-stage Dockerfile for React + Vite frontend
# Stage 1: Build
# Stage 2: Production (nginx)

# ============================================
# Build Stage
# ============================================
FROM node:22.12-bookworm-slim AS builder

WORKDIR /app

# Install Bun (used for dependency installation)
RUN npm i -g bun@1.1.45

# Install dependencies first (for better caching)
COPY package*.json ./
RUN bun install --no-save

# Bun doesn't currently install Rollup's platform-native optional dependency.
# Ensure the correct `@rollup/rollup-linux-*` package is present for Vite/Rollup.
RUN node - <<'NODE'
const fs = require("fs");
const { execSync } = require("child_process");

if (process.platform !== "linux") process.exit(0);

const rollupPkg = JSON.parse(
	fs.readFileSync("node_modules/rollup/package.json", "utf8")
);
const rollupVersion = rollupPkg.version;

const archMap = { x64: "x64", arm64: "arm64" };
const arch = archMap[process.arch];
if (!arch) process.exit(0);

let isMusl = false;
try {
	const out = execSync("ldd --version 2>&1 || true", { encoding: "utf8" });
	isMusl = out.toLowerCase().includes("musl");
} catch {}

const libc = isMusl ? "musl" : "gnu";
const pkg = `@rollup/rollup-linux-${arch}-${libc}`;

execSync(`bun add --no-save ${pkg}@${rollupVersion}`, { stdio: "inherit" });
NODE

# Copy source code
COPY . .

# Build the application
ARG VITE_API_URL=
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ============================================
# Production Stage
# ============================================
FROM nginx:alpine AS production

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

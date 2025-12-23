FROM oven/bun:1.1.45-slim

WORKDIR /app

# Install unzip (needed by Cypress during install)
RUN apt-get update && apt-get install -y unzip && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the app
RUN bun run build

# Expose port
EXPOSE 5173

# Serve with Vite preview
CMD ["bun", "run", "preview", "--host", "0.0.0.0", "--port", "5173"]

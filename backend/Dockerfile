# Dockerfile for Dex Note Taking App Backend
# 
# This Dockerfile creates a production-ready container for the Express.js backend
# API that serves the note-taking application. It's designed for deployment on
# Fly.io and integrates with the health check system for container monitoring.
#
# The container is optimized for production with:
# - Alpine Linux base image for minimal size and security
# - Production-only dependencies to reduce attack surface
# - Health check integration for container orchestration
# - Proper port exposure for Fly.io deployment
#
# @author Dayle Cortes
# @version 1.0.0

# Use Node.js 18 Alpine Linux as the base image
# Alpine Linux provides a minimal, secure foundation with a small footprint
# Node.js 18 ensures compatibility with modern JavaScript features and performance
FROM node:18-alpine

# Set the working directory inside the container
# This is where all application files will be located and commands will run
WORKDIR /app

# Copy package files first for better Docker layer caching
# This allows Docker to cache the dependency installation layer separately
# from the source code, making rebuilds faster when only code changes
COPY package*.json ./

# Install only production dependencies
# --only=production excludes devDependencies like nodemon
# This reduces the final image size and eliminates potential security vulnerabilities
# from development tools that shouldn't be in production
RUN npm ci --only=production

# Copy the entire source code into the container
# This includes all JavaScript files, configuration, and other assets
# The .dockerignore file should exclude unnecessary files like node_modules
COPY . .

# Expose port 8080 to the host system
# This port must match the internal_port in fly.toml configuration
# The port is used by Fly.io to route external traffic to the container
EXPOSE 8080

# Configure health check for container monitoring
# This allows Docker and Fly.io to monitor the application's health status
# and restart the container if it becomes unhealthy
#
# Health check configuration:
# --interval=30s: Check every 30 seconds (matches fly.toml interval)
# --timeout=3s: Wait up to 3 seconds for response (matches fly.toml timeout)
# --start-period=5s: Wait 5 seconds before first check (matches fly.toml grace_period)
# --retries=3: Retry 3 times before marking as unhealthy
#
# The health check makes an HTTP GET request to the /health endpoint
# defined in server.js, which returns a 200 status for healthy applications
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application using npm start script
# This runs "node src/server.js" as defined in package.json
# The application will listen on port 8080 and handle incoming requests
CMD ["npm", "start"]

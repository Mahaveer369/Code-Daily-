# Minimal Node.js sandbox image
FROM node:20-alpine

# Security: Run as non-root
RUN adduser -D -u 1000 sandbox

# Remove unnecessary packages
RUN apk --no-cache add coreutils

# Set working directory
WORKDIR /tmp

# Switch to sandbox user
USER sandbox

# Default command (will be overridden)
CMD ["node", "--version"]

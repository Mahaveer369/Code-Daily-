# Minimal SQLite sandbox image
FROM alpine:3.19

# Install SQLite
RUN apk --no-cache add sqlite coreutils

# Security: Run as non-root
RUN adduser -D -u 1000 sandbox

# Set working directory
WORKDIR /tmp

# Switch to sandbox user
USER sandbox

# Default command (will be overridden)
CMD ["sqlite3", "--version"]

FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Create wait-for-it script
RUN echo '#!/bin/sh' > /wait-for-it.sh && \
    echo 'until nc -z $1 $2; do' >> /wait-for-it.sh && \
    echo '  echo "Waiting for $1:$2..."' >> /wait-for-it.sh && \
    echo '  sleep 1' >> /wait-for-it.sh && \
    echo 'done' >> /wait-for-it.sh && \
    echo 'echo "$1:$2 is available!"' >> /wait-for-it.sh && \
    chmod +x /wait-for-it.sh

# Install netcat-openbsd for the wait script
RUN apk add --no-cache netcat-openbsd

# Expose port
EXPOSE 4200

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); const options = { host: 'localhost', port: 5000, path: '/api/health', method: 'GET', timeout: 2000 }; const req = http.request(options, (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }); req.on('error', () => process.exit(1)); req.end();"

# Start command
CMD ["npm", "start"]
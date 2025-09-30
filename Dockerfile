FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Install wait-for-it script for database dependency
RUN wget -O /wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Expose port (adjust based on your backend)
EXPOSE 4200

# Start command with database wait
CMD ["/wait-for-it.sh", "mssql:1433", "--", "npm", "start"]
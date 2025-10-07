# Use the official Node.js 20 image (LTS)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json before other files
# Utilize Docker cache to save re-installing dependencies if unchanged
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the listening port
EXPOSE 8080

# Run the app
CMD ["node", "server.js"]
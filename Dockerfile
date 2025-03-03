# Use Node.js as base image
FROM node:22.0.0

# Set environment variables via build arguments
ARG MYSQL_URL
ARG SMTP_HOST
ARG SMTP_USER
ARG SMTP_PASS
ARG APP_URL
ARG ADMIN_APP_URL

ENV MYSQL_URL=$MYSQL_URL
ENV SMTP_HOST=$SMTP_HOST
ENV SMTP_USER=$SMTP_USER
ENV SMTP_PASS=$SMTP_PASS
ENV APP_URL=$APP_URL
ENV ADMIN_APP_URL=$ADMIN_APP_URL

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
# RUN npm install

# Install PM2 globally
RUN npm install -g pm2

# Copy the entire application (backend + frontend)
COPY . .

# Ensure the log file exists and set proper permissions
RUN touch /app/app_error.log && chmod 666 /app/app_error.log

# Change to the frontend directory, install dependencies, and build the React app
# WORKDIR /app/client
# RUN npm install
# RUN npm run build

# Back to the root app directory
WORKDIR /app

# Ensure node user has permission to write logs
# RUN chown -R node:node /app

# # Switch to non-root user for better security
# USER node

# Expose necessary ports
EXPOSE 8000 4000

# Start both frontend and backend using PM2
CMD ["npm", "run", "start:both"]

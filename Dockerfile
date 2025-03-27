# Step 1: Build React application  
FROM node:20-alpine as builder  

# Set working directory  
WORKDIR /app  

# Copy package.json and package-lock.json  
COPY package.json package-lock.json ./  

# Install dependencies  
RUN npm install  

# Copy React app source code  
COPY . ./  

# Build the React app  
RUN npm run build  

# Step 2: Serve React app using Nginx  
FROM nginx:alpine  

# Copy built files to Nginx's default directory  
COPY --from=builder /app/dist /usr/share/nginx/html  

# Copy custom Nginx configuration (optional)  
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf  

# Expose port 80  
EXPOSE 80  

# Start Nginx  
CMD ["nginx", "-g", "daemon off;"]  

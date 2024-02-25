FROM node:20.10.0-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock if you use yarn) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

# Bundle your app source inside the Docker image
COPY . .

# Build your app
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your app
CMD [ "npm", "run", "start:prod" ]

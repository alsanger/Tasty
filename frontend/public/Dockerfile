FROM node:22-alpine

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
COPY ./src/package.json /app
RUN npm install

# Bundle app source
COPY ./src /app

EXPOSE 5173
CMD [ "npm", "run", "start"]
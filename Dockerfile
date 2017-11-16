FROM node:alpine
# Create app dir in contianer
WORKDIR /usr/src/app
# Install app dependencies
COPY package.json ./
RUN npm install
# Bundle app source
COPY . .
# Expose app port 8080
EXPOSE 8080
CMD $(npm bin)/nodemon

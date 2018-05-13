FROM node:alpine
# use nodemon for development
RUN npm install --global nodemon
# use cached layer for node modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /app && cp -a /tmp/node_modules /app/
# add project files
WORKDIR /app
ADD . /app
# Expose app port 8080
EXPOSE 8080

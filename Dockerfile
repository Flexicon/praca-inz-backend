FROM node:alpine
# use nodemon for development
RUN npm install --global nodemon
# use cached layer for node modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /usr/src && cp -a /tmp/node_modules /usr/src/
# add project files
WORKDIR /usr/src
ADD . /usr/src
# Expose app port 8080
EXPOSE 8080
CMD ["nodemon", "/usr/src"]

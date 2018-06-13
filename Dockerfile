FROM node:alpine
# use nodemon for development
RUN npm install --global nodemon
# add project files
RUN mkdir -p /app
WORKDIR /app
ADD . /app
# Expose app port 8080
EXPOSE 8080

## A Dockerfile defines the base image that will serve as the foundation of the container.

## Docker image is a template that defines how a container will be realized. A Docker container is a runtime instance of a Docker image.

FROM node:lts-alpine

WORKDIR /app
# copy the source file to the working directory
COPY package*.json ./

COPY client/package*.json client/
RUN npm run install-client --only=production

COPY server/package*.json server/
RUN npm run install-server --only=production

COPY client/ client/
RUN npm run build --prefix client

COPY server/ server/

#only for node user
USER node
# port
EXPOSE 8000

CMD [ "npm", "start", "--prefix", "server" ]

### build images/ docker image creation
# docker build . -t username/name of project - ex: vod6atwit/nasa-project

### For localhost use/ docker container creation
# docker run -it --name mycontainer -p 8000:8000 vod6atwit/nasa-project 

## verify that the container is running
# docker ps -a

### For docker hub repository
# docker login
# docker push 'name of the repository' ex: vod6atwit/nasa-project
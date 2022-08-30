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

# docker build . -t vod6atwit/nasa-project
# docker run -it -p 8000:8000 vod6atwit/nasa-project 
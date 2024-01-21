FROM --platform=arm64 node:latest
ADD . /app
RUN cd app && npm install express sqlite3 
ENTRYPOINT [ "node", "index.js" ]
FROM amd64/node:lts
# Declare a mount point for external volumes
# https://docs.docker.com/engine/reference/builder/#volume
VOLUME /vol
WORKDIR /app
COPY . .
RUN npm install
RUN mv /app/* /vol 
WORKDIR /vol
EXPOSE 3000
CMD ["npm", "run", "start"]
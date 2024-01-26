FROM amd64/node:lts
# Declare a mount point for external volumes
# https://docs.docker.com/engine/reference/builder/#volume
WORKDIR /app
COPY . .
# RUN npm install
EXPOSE 3000
VOLUME /app
# CMD ["npm", "run", "start"]
CMD [ "ls", "-l" ]
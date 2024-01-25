FROM amd64/node:lts
WORKDIR /app
COPY . .
RUN npm install
VOLUME /app
EXPOSE 3000
CMD ["npm", "run", "start"]
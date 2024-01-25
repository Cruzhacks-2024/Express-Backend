FROM amd64/node:lts
RUN mkdir -p /app
VOLUME /app
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "start"]
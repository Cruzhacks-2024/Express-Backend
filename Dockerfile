FROM amd64/node:lts
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
VOLUME /app
CMD ["npm", "run", "start"]
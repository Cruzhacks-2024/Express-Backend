FROM amd64/node:lts
RUN mkdir -p /app
VOLUME /app
COPY . /app
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "start"]
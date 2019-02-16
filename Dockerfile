from node:8.9.4

COPY . .
RUN npm i

CMD node main.js
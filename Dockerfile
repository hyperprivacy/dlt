from node:8.9.4-alpine

COPY . .
RUN npm i

CMD ['node', 'main.js']
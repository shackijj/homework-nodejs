FROM node:carbon

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run build

RUN git clone https://github.com/libgit2/libgit2 /usr/src/app/test-data

EXPOSE 3000

CMD [ "npm", "start" ]
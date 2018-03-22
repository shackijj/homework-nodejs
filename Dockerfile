FROM node:carbon

RUN mkdir -p /var/app/
RUN cd /var/app/ && git clone https://github.com/libgit2/libgit2

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
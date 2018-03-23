FROM node:carbon

WORKDIR /usr/src/app

RUN npm run build

COPY . .

RUN git clone https://github.com/shackijj/hermione-simple-environment
RUN npm install
RUN npm run build

# EXPOSE 3000

CMD [ "npm", "start" ]
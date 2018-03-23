FROM node:carbon

WORKDIR /usr/src/app

COPY . .

RUN chmod +x create_demo_repo.sh
RUN ./create_demo_repo.sh
RUN npm install
RUN npm run build

CMD [ "npm", "start" ]
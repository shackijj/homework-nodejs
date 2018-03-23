FROM node:carbon

WORKDIR /usr/src/app

COPY . .

RUN ./create_demo_repo.sh
RUN npm install
RUN npm run build

# EXPOSE 3000

CMD [ "npm", "start" ]
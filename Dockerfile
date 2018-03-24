FROM node:carbon

WORKDIR /opt/nodeapp

COPY . .

RUN chmod +x create_demo_repo.sh
RUN ./create_demo_repo.sh
RUN npm install
RUN npm run build


RUN useradd -m nodeapp
USER nodeapp

CMD [ "npm", "start" ]
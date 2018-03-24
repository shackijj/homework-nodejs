FROM node:carbon

RUN useradd -ms /bin/bash nodeapp

USER nodeapp
WORKDIR /home/nodeapp

COPY . .

RUN chmod +x create_demo_repo.sh
RUN ./create_demo_repo.sh
RUN npm install
RUN npm run build

CMD [ "npm", "start" ]
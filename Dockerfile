FROM node
RUN mkdir -p /srv/app
WORKDIR /srv/app
COPY package.json /srv/app/
RUN npm install
COPY . /srv/app
CMD [ "npm", "start" ]

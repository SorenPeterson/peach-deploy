FROM node
RUN usermod -a -G daemon root
RUN mkdir -p /srv/app
WORKDIR /srv/app
COPY package.json /srv/app/
RUN npm install
COPY . /srv/app
CMD [ "npm", "start" ]

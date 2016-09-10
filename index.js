import Docker from 'dockerode';
import { Server } from 'hapi';

const { DOCKER_SOCK, HAPI_HOST, HAPI_PORT } = process.env;

const docker = new Docker({ socketPath: DOCKER_SOCK });
const server = new Server();
server.connection({ host: HAPI_HOST, port: HAPI_PORT })

server.route({
    path: '/',
    method: 'GET',
    handler: (request, reply) => {
        docker.listContainers((err, containers) => {
            reply(containers);
        });
    }
});

server.start().then(err => {
    console.log('started', HAPI_HOST, HAPI_PORT);
}, err => {
    console.log(err);
});

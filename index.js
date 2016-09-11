import Docker from 'dockerode';
import { Server } from 'hapi';
import Web3 from 'web3';

const { DOCKER_SOCK, HAPI_HOST, HAPI_PORT, WEB3_PROVIDER } = process.env;

const docker = new Docker({ socketPath: DOCKER_SOCK });
const server = new Server();
server.connection({ host: HAPI_HOST, port: HAPI_PORT })
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(WEB3_PROVIDER))

server.route({
    path: '/',
    method: 'GET',
    handler: (request, reply) => {
        reply(web3.eth.getBalance(web3.eth.coinbase));
    }
});

server.start().then(err => {
    console.log('started', HAPI_HOST, HAPI_PORT);
}, err => {
    console.log(err);
});

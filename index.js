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
    path: '/balance/{address}',
    method: 'GET',
    handler: (request, reply) => {
        reply(web3.eth.getBalance(request.params.address));
    }
});

server.route({
    path: '/logs/{id}',
    method: 'GET',
    handler: (request, reply) => {
        let container = docker.getContainer(request.params.id);
        container.logs({
            stdout: true, stderr: true
        }, (err, logs) => {
            reply(logs).type('text/html');
        });
    }
});

let lastCount = 0;
let lastTime = 0;
server.route({
    path: '/progress',
    method: 'GET',
    handler: (request, reply) => {
        let { currentBlock, highestBlock } = web3.eth.syncing;
        reply(`
            <div>
                ${highestBlock} - ${currentBlock} = ${highestBlock - currentBlock}
            </div>
            <div>
                ${currentBlock - lastCount} / ${new Date() - lastTime} = ${(currentBlock - lastCount) / (new Date() - lastTime) * 1000}
            </div>
        `);
        lastCount = currentBlock;
        lastTime = new Date();
    }
});

server.route({
    path: '/containers',
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

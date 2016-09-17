import Docker from 'dockerode';
import { Server } from 'hapi';
import Web3 from 'web3';
import fs from 'fs';
import solc from 'solc';

const { DOCKER_SOCK, HAPI_HOST, HAPI_PORT, WEB3_PROVIDER, CONTRACT_ADDRESS } = process.env;

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
            reply(`<pre>${logs.toString()}</pre>`).type('text/html');
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
            console.log(err);
            reply(containers);
        });
    }
});

new Promise((resolve, reject) => {
    fs.readFile('peach.sol', (err, data) => err ? reject(err) : resolve(data));
})
.then(source => {
    let { contracts: { Peach: { interface: abi } } } = solc.compile(source.toString(), 1);
    server.app.contract = web3.eth.contract(JSON.parse(abi)).at(CONTRACT_ADDRESS);
    server.app.contract.Create({}, {}, (err, result) => {
        console.log(err, result);
    });
})
.then(() => server.start())
.then(() => console.log('Server started'))
.catch(err => console.log(err));

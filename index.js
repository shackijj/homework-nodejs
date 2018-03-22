const config = require('./config/test.json');
const createServer = require('./createServer');

const server = createServer(config);

server.start();

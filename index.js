const config = require('./config/default.json');
const createServer = require('./createServer');

const server = createServer(config);

server.start();

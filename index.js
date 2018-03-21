const config = require('./config/default.json');
const createServer = require('./src/createServer');

const server = createServer(config);

server.start();

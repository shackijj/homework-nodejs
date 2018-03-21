const express = require('express');
const path = require('path');

const branches = require('./controllers/branches');
const log = require('./controllers/log');
const tree = require('./controllers/tree');
const blob = require('./controllers/blob');

function createServer (config) {
  const app = express();
  let server;

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  app.get('/', branches(config));
  app.get('/log', log(config));
  app.get('/tree', tree(config));
  app.get('/blob', blob(config));

  return {
    start: () => new Promise((resolve, reject) => {
      server = app.listen(config.port, config.hostname, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    }),
    stop: () => new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    })
  };
}

module.exports = createServer;

const express = require('express');
const path = require('path');
const getBranches = require('./utils/git/getBranches');

function createServer (config) {
  const app = express();
  let server;

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  app.get('/', (req, res) => {
    getBranches(config.repoPath)
      .then(branches => res.render('branches', { branches }))
      .catch(error => res.render('error', { error }));
  });

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

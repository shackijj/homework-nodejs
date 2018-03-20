const express = require('express');
const path = require('path');
const execShell = require('./utils/execShell');

function createServer (config) {
  const app = express();
  let server;

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  app.get('/', (req, res) => {
    execShell(`
        cd ${config.repoPath};
        git for-each-ref --format='%(refname:short)' refs/heads/;`)
      .then((stdout) => {
        const branches = stdout.trim().split('\n');
        res.render('branches', { branches });
      });
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

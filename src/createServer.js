const express = require('express');
const path = require('path');
const getBranches = require('./utils/git/getBranches');
const getBranchCommits = require('./utils/git/getBranchCommits');
const getTree = require('./utils/git/getTree');
const getBlob = require('./utils/git/getBlob');

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

  app.get('/log', (req, res) => {
    getBranchCommits(config.repoPath, req.query.ref)
      .then(commits => res.render('log', { commits }))
      .catch(error => res.render('error', { error }));
  });

  app.get('/tree', (req, res) => {
    getTree(config.repoPath, req.query.hash, req.query.branch, req.query.path)
      .then(objects => res.render('tree', { objects }))
      .catch(error => res.render('error', { error }));
  });

  app.get('/blob', (req, res) => {
    getBlob(config.repoPath, req.query.branch, req.query.path)
      .then(blob => res.render('blob', { blob }))
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

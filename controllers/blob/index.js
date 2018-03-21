const getBlobRequest = require('./getBlobRequest');

function blob ({repoPath}) {
  return (req, res) => {
    getBlobRequest(repoPath, req)
      .then(data => res.render('blob', data))
      .catch(error => res.render('error', { error }));
  };
}

module.exports = blob;

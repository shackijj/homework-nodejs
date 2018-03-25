const config = require('./config/test.json');
const createServer = require('./createServer');
const createRepo = require('./integration_tests/fixtures/create-repo');
const { expect } = require('chai');

const server = createServer(config);

module.exports = {
  sets: {
    desktop: {
        files: 'integration_tests/user_opens_root_page.hermione.js',
    }
  },
  browsers: {
/*     chrome: {
      desiredCapabilities: {
          browserName: 'chrome'
      }
    }, */
    firefox: {
      desiredCapabilities: {
          browserName: 'firefox',
          'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER
      }
    }
  },
  prepareBrowser: (browser) => {
    browser.addCommand("openUrlAndClick", function(url, selector) {
        return this.url(url).click(selector);
    });
    browser.addCommand("assertTextOfElementEqual", function(selector, expectedText) {
      return this.getText(selector)
        .then(actualText => {
          expect(actualText).to.equal(expectedText);
        });
  });
  },
  plugins: {
    'hermione-simple-environment': {
      loadFixtures: () => createRepo(config),
      startServer: () => server.start(),
      stopServer: () => server.stop(),
    }
  },
  baseUrl: `http://${config.host}:${config.port}`,
  gridUrl: `http://${process.env.SAUCE_USERNAME}:${process.env.SAUCE_ACCESS_KEY}@localhost:4445/wd/hub`
};
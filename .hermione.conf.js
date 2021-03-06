const config = require('./config/test.json');
const createServer = require('./createServer');
const createRepo = require('./integration_tests/fixtures/create-repo');
const { expect } = require('chai');

const server = createServer(config);

const {TRAVIS_JOB_NUMBER, SAUCE_USERNAME, SAUCE_ACCESS_KEY, CI} = process.env;

module.exports = {
  sets: {
    desktop: {
        files: 'integration_tests/**/*.hermione.js',
    }
  },
  browsers: {
    chrome: {
      desiredCapabilities: {
          browserName: 'chrome',
          'tunnel-identifier': TRAVIS_JOB_NUMBER,
      }
    },
    firefox: {
      desiredCapabilities: {
          browserName: 'firefox',
          'tunnel-identifier': TRAVIS_JOB_NUMBER
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
  gridUrl: CI ? `http://${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY}@localhost:4445/wd/hub` : undefined
};
const path = require('path');
const fs = require('fs');
const puppeteer = require('../..');
const {TestServer} = require('../testserver/');
const {TestRunner, Reporter, Matchers} = require('../testrunner/');

const puppeteerWebPath = path.join(__dirname, 'puppeteer-web.js');
if (!fs.existsSync(puppeteerWebPath))
  throw new Error(`puppeteer-web is not built; run "npm run bundle"`);
const puppeteerWeb = fs.readFileSync(puppeteerWebPath, 'utf8');

const testRunner = new TestRunner();
const {describe, fdescribe, xdescribe} = testRunner;
const {it, xit, fit} = testRunner;
const {afterAll, beforeAll, afterEach, beforeEach} = testRunner;
const {expect} = new Matchers();

const defaultBrowserOptions = {
  args: ['--no-sandbox']
};

beforeAll(/* async */ state => {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
  const assetsPath = path.join(__dirname, '..', '..', 'test', 'assets');
  const port = 8998;
  state.server = (yield TestServer.create(assetsPath, port));
  state.serverConfig = {
    PREFIX: `http://localhost:${port}`,
    EMPTY_PAGE: `http://localhost:${port}/empty.html`,
  };
  state.browser = (yield puppeteer.launch(defaultBrowserOptions));
});});

afterAll(/* async */ state => {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
  (yield Promise.all([
    state.server.stop(),
    state.browser.close()
  ]));
  state.browser = null;
  state.server = null;
});});

beforeEach(/* async */ state => {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
  state.page = (yield state.browser.newPage());
  (yield state.page.evaluateOnNewDocument(puppeteerWeb));
  (yield state.page.addScriptTag({
    content: puppeteerWeb + '\n//# sourceURL=puppeteer-web.js'
  }));
});});

afterEach(/* async */ state => {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
  (yield state.page.close());
  state.page = null;
});});

describe('Puppeteer-Web', () => {
  it('should work over web socket', /* async */({page, serverConfig}) => {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
    const browser2 = (yield puppeteer.launch(defaultBrowserOptions));
    // Use in-page puppeteer to create a new page and navigate it to the EMPTY_PAGE
    (yield page.evaluate(/* async */(browserWSEndpoint, serverConfig) => {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
      const puppeteer = require('puppeteer');
      const browser = (yield puppeteer.connect({browserWSEndpoint}));
      const page = (yield browser.newPage());
      (yield page.goto(serverConfig.EMPTY_PAGE));
    });}, browser2.wsEndpoint(), serverConfig));
    const pageURLs = ((yield browser2.pages())).map(page => page.url()).sort();
    expect(pageURLs).toEqual([
      'about:blank',
      serverConfig.EMPTY_PAGE
    ]);
    (yield browser2.close());
  });});
  it('should work over exposed DevTools protocol', /* async */({browser, page, serverConfig}) => {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
    // Expose devtools protocol binding into page.
    const session = (yield browser.target().createCDPSession());
    const pageInfo = ((yield session.send('Target.getTargets'))).targetInfos.find(info => info.attached);
    (yield session.send('Target.exposeDevToolsProtocol', {targetId: pageInfo.targetId}));
    (yield session.detach());

    // Use in-page puppeteer to create a new page and navigate it to the EMPTY_PAGE
    (yield page.evaluate(/* async */ serverConfig  => {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
      const puppeteer = require('puppeteer');
      window.cdp.close = () => {};
      const browser = (yield puppeteer.connect({transport: window.cdp}));
      const page = (yield browser.newPage());
      (yield page.goto(serverConfig.EMPTY_PAGE));
    });}, serverConfig));
    const pageURLs = ((yield browser.pages())).map(page => page.url()).sort();
    expect(pageURLs).toEqual([
      'about:blank',
      'about:blank',
      serverConfig.EMPTY_PAGE
    ]);
  });});
});

if (process.env.CI && testRunner.hasFocusedTestsOrSuites()) {
  console.error('ERROR: "focused" tests/suites are prohibitted on bots. Remove any "fit"/"fdescribe" declarations.');
  process.exit(1);
}

new Reporter(testRunner);
testRunner.run();

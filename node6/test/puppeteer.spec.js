/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const {helper} = require('../lib/helper');
const rmAsync = helper.promisify(require('rimraf'));
const mkdtempAsync = helper.promisify(fs.mkdtemp);
const readFileAsync = helper.promisify(fs.readFile);
const statAsync = helper.promisify(fs.stat);
const TMP_FOLDER = path.join(os.tmpdir(), 'pptr_tmp_folder-');
const utils = require('./utils');
const puppeteer = utils.requireRoot('index');

module.exports.addTests = function({testRunner, expect, defaultBrowserOptions}) {
  const {describe, xdescribe, fdescribe} = testRunner;
  const {it, fit, xit} = testRunner;
  const {beforeAll, beforeEach, afterAll, afterEach} = testRunner;

  describe('Puppeteer', function() {
    describe('BrowserFetcher', function() {
      it('should download and extract linux binary', /* async */({server}) => {return (fn => {
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
        const downloadsFolder = (yield mkdtempAsync(TMP_FOLDER));
        const browserFetcher = puppeteer.createBrowserFetcher({
          platform: 'linux',
          path: downloadsFolder,
          host: server.PREFIX
        });
        let revisionInfo = browserFetcher.revisionInfo('123456');
        server.setRoute(revisionInfo.url.substring(server.PREFIX.length), (req, res) => {
          server.serveFile(req, res, '/chromium-linux.zip');
        });

        expect(revisionInfo.local).toBe(false);
        expect(browserFetcher.platform()).toBe('linux');
        expect((yield browserFetcher.canDownload('100000'))).toBe(false);
        expect((yield browserFetcher.canDownload('123456'))).toBe(true);

        revisionInfo = (yield browserFetcher.download('123456'));
        expect(revisionInfo.local).toBe(true);
        expect((yield readFileAsync(revisionInfo.executablePath, 'utf8'))).toBe('LINUX BINARY\n');
        const expectedPermissions = os.platform() === 'win32' ? 0666 : 0755;
        expect(((yield statAsync(revisionInfo.executablePath))).mode & 0777).toBe(expectedPermissions);
        expect((yield browserFetcher.localRevisions())).toEqual(['123456']);
        (yield browserFetcher.remove('123456'));
        expect((yield browserFetcher.localRevisions())).toEqual([]);
        (yield rmAsync(downloadsFolder));
      });});
    });
    describe('Browser.disconnect', function() {
      it('should reject navigation when browser closes', /* async */({server}) => {return (fn => {
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
        server.setRoute('/one-style.css', () => {});
        const browser = (yield puppeteer.launch(defaultBrowserOptions));
        const remote = (yield puppeteer.connect({browserWSEndpoint: browser.wsEndpoint()}));
        const page = (yield remote.newPage());
        const navigationPromise = page.goto(server.PREFIX + '/one-style.html', {timeout: 60000}).catch(e => e);
        (yield server.waitForRequest('/one-style.css'));
        (yield remote.disconnect());
        const error = (yield navigationPromise);
        expect(error.message).toBe('Navigation failed because browser has disconnected!');
        (yield browser.close());
      });});
      it('should reject waitForSelector when browser closes', /* async */({server}) => {return (fn => {
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
        server.setRoute('/empty.html', () => {});
        const browser = (yield puppeteer.launch(defaultBrowserOptions));
        const remote = (yield puppeteer.connect({browserWSEndpoint: browser.wsEndpoint()}));
        const page = (yield remote.newPage());
        const watchdog = page.waitForSelector('div', {timeout: 60000}).catch(e => e);
        (yield remote.disconnect());
        const error = (yield watchdog);
        expect(error.message).toBe('Protocol error (Runtime.callFunctionOn): Session closed. Most likely the page has been closed.');
        (yield browser.close());
      });});
    });
    describe('Puppeteer.launch', function() {
      it('should reject all promises when browser is closed', /* async */() => {return (fn => {
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
        const browser = (yield puppeteer.launch(defaultBrowserOptions));
        const page = (yield browser.newPage());
        let error = null;
        const neverResolves = page.evaluate(() => new Promise(r => {})).catch(e => error = e);
        (yield browser.close());
        (yield neverResolves);
        expect(error.message).toContain('Protocol error');
      });});
      it('should reject if executable path is invalid', /* async */({server}) => {return (fn => {
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
        let waitError = null;
        const options = Object.assign({}, defaultBrowserOptions, {executablePath: 'random-invalid-path'});
        (yield puppeteer.launch(options).catch(e => waitError = e));
        expect(waitError.message.startsWith('Failed to launch chrome! spawn random-invalid-path ENOENT')).toBe(true);
      });});
      it('userDataDir option', /* async */({server}) => {return (fn => {
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
        const userDataDir = (yield mkdtempAsync(TMP_FOLDER));
        const options = Object.assign({userDataDir}, defaultBrowserOptions);
        const browser = (yield puppeteer.launch(options));
        // Open a page to make sure its functional.
        (yield browser.newPage());
        expect(fs.readdirSync(userDataDir).length).toBeGreaterThan(0);
        (yield browser.close());
        expect(fs.readdirSync(userDataDir).length).toBeGreaterThan(0);
        // This might throw. See https://github.com/GoogleChrome/puppeteer/issues/2778
        (yield rmAsync(userDataDir).catch(e => {}));
      });});
      it('userDataDir argument', /* async */({server}) => {return (fn => {
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
        const userDataDir = (yield mkdtempAsync(TMP_FOLDER));
        const options = Object.assign({}, defaultBrowserOptions);
        options.args = [`--user-data-dir=${userDataDir}`].concat(options.args);
        const browser = (yield puppeteer.launch(options));
        expect(fs.readdirSync(userDataDir).length).toBeGreaterThan(0);
        (yield browser.close());
        expect(fs.readdirSync(userDataDir).length).toBeGreaterThan(0);
        // This might throw. See https://github.com/GoogleChrome/puppeteer/issues/2778
        (yield rmAsync(userDataDir).catch(e => {}));
      });});
      it('userDataDir option should restore state', /* async */({server}) => {return (fn => {
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
        const userDataDir = (yield mkdtempAsync(TMP_FOLDER));
        const options = Object.assign({userDataDir}, defaultBrowserOptions);
        const browser = (yield puppeteer.launch(options));
        const page = (yield browser.newPage());
        (yield page.goto(server.EMPTY_PAGE));
        (yield page.evaluate(() => localStorage.hey = 'hello'));
        (yield browser.close());

        const browser2 = (yield puppeteer.launch(options));
        const page2 = (yield browser2.newPage());
        (yield page2.goto(server.EMPTY_PAGE));
        expect((yield page2.evaluate(() => localStorage.hey))).toBe('hello');
        (yield browser2.close());
        // This might throw. See https://github.com/GoogleChrome/puppeteer/issues/2778
        (yield rmAsync(userDataDir).catch(e => {}));
      });});
      it('userDataDir option should restore cookies', /* async */({server}) => {return (fn => {
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
        const userDataDir = (yield mkdtempAsync(TMP_FOLDER));
        const options = Object.assign({userDataDir}, defaultBrowserOptions);
        const browser = (yield puppeteer.launch(options));
        const page = (yield browser.newPage());
        (yield page.goto(server.EMPTY_PAGE));
        (yield page.evaluate(() => document.cookie = 'doSomethingOnlyOnce=true; expires=Fri, 31 Dec 9999 23:59:59 GMT'));
        (yield browser.close());

        const browser2 = (yield puppeteer.launch(options));
        const page2 = (yield browser2.newPage());
        (yield page2.goto(server.EMPTY_PAGE));
        expect((yield page2.evaluate(() => document.cookie))).toBe('doSomethingOnlyOnce=true');
        (yield browser2.close());
        // This might throw. See https://github.com/GoogleChrome/puppeteer/issues/2778
        (yield rmAsync(userDataDir).catch(e => {}));
      });});
      it('should return the default chrome arguments', /* async */() => {return (fn => {
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
        expect(puppeteer.defaultArgs()).toContain('--no-first-run');
        expect(puppeteer.defaultArgs()).toContain('--headless');
        expect(puppeteer.defaultArgs({headless: false})).not.toContain('--headless');
        expect(puppeteer.defaultArgs({userDataDir: 'foo'})).toContain('--user-data-dir=foo');
      });});
      it('should dump browser process stderr', /* async */({server}) => {return (fn => {
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
        const dumpioTextToLog = 'MAGIC_DUMPIO_TEST';
        let dumpioData = '';
        const {spawn} = require('child_process');
        const options = Object.assign({}, defaultBrowserOptions, {dumpio: true});
        const res = spawn('node',
            [path.join(__dirname, 'fixtures', 'dumpio.js'), utils.projectRoot(), JSON.stringify(options), server.EMPTY_PAGE, dumpioTextToLog]);
        res.stderr.on('data', data => dumpioData += data.toString('utf8'));
        (yield new Promise(resolve => res.on('close', resolve)));

        expect(dumpioData).toContain(dumpioTextToLog);
      });});
      it('should close the browser when the node process closes', /* async */({ server }) => {return (fn => {
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
        const {spawn, execSync} = require('child_process');
        const res = spawn('node', [path.join(__dirname, 'fixtures', 'closeme.js'), utils.projectRoot(), JSON.stringify(defaultBrowserOptions)]);
        let wsEndPointCallback;
        const wsEndPointPromise = new Promise(x => wsEndPointCallback = x);
        let output = '';
        res.stdout.on('data', data => {
          output += data;
          if (output.indexOf('\n'))
            wsEndPointCallback(output.substring(0, output.indexOf('\n')));
        });
        const browser = (yield puppeteer.connect({ browserWSEndpoint: (yield wsEndPointPromise) }));
        const promises = [
          new Promise(resolve => browser.once('disconnected', resolve)),
          new Promise(resolve => res.on('close', resolve))];
        if (process.platform === 'win32')
          execSync(`taskkill /pid ${res.pid} /T /F`);
        else
          process.kill(res.pid);
        (yield Promise.all(promises));
      });});
      it('should support the pipe option', /* async */() => {return (fn => {
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
        const options = Object.assign({pipe: true}, defaultBrowserOptions);
        const browser = (yield puppeteer.launch(options));
        expect(((yield browser.pages())).length).toBe(1);
        expect(browser.wsEndpoint()).toBe('');
        const page = (yield browser.newPage());
        expect((yield page.evaluate('11 * 11'))).toBe(121);
        (yield page.close());
        (yield browser.close());
      });});
      it('should support the pipe argument', /* async */() => {return (fn => {
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
        const options = Object.assign({}, defaultBrowserOptions);
        options.args = ['--remote-debugging-pipe'].concat(options.args);
        const browser = (yield puppeteer.launch(options));
        expect(browser.wsEndpoint()).toBe('');
        const page = (yield browser.newPage());
        expect((yield page.evaluate('11 * 11'))).toBe(121);
        (yield page.close());
        (yield browser.close());
      });});
      it('should fire "disconnected" when closing with pipe', /* async */() => {return (fn => {
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
        const options = Object.assign({pipe: true}, defaultBrowserOptions);
        const browser = (yield puppeteer.launch(options));
        const disconnectedEventPromise = new Promise(resolve => browser.once('disconnected', resolve));
        // Emulate user exiting browser.
        browser.process().kill();
        (yield disconnectedEventPromise);
      });});
      it('should work with no default arguments', /* async */() => {return (fn => {
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
        const options = Object.assign({}, defaultBrowserOptions);
        options.ignoreDefaultArgs = true;
        const browser = (yield puppeteer.launch(options));
        const page = (yield browser.newPage());
        expect((yield page.evaluate('11 * 11'))).toBe(121);
        (yield page.close());
        (yield browser.close());
      });});
      it('should filter out ignored default arguments', /* async */() => {return (fn => {
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
        // Make sure we launch with `--enable-automation` by default.
        const defaultArgs = puppeteer.defaultArgs();
        const browser = (yield puppeteer.launch(Object.assign({}, defaultBrowserOptions, {
          // Ignore first and third default argument.
          ignoreDefaultArgs: [ defaultArgs[0], defaultArgs[2] ],
        })));
        const spawnargs = browser.process().spawnargs;
        expect(spawnargs.indexOf(defaultArgs[0])).toBe(-1);
        expect(spawnargs.indexOf(defaultArgs[1])).not.toBe(-1);
        expect(spawnargs.indexOf(defaultArgs[2])).toBe(-1);
        (yield browser.close());
      });});
      it('should have default url when launching browser', /* async */ function() {return (fn => {
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
        const browser = (yield puppeteer.launch(defaultBrowserOptions));
        const pages = ((yield browser.pages())).map(page => page.url());
        expect(pages).toEqual(['about:blank']);
        (yield browser.close());
      });});
      it('should have custom url when launching browser', /* async */ function({server}) {return (fn => {
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
        const customUrl = server.PREFIX + '/empty.html';
        const options = Object.assign({}, defaultBrowserOptions);
        options.args = [customUrl].concat(options.args);
        const browser = (yield puppeteer.launch(options));
        const pages = (yield browser.pages());
        expect(pages.length).toBe(1);
        if (pages[0].url() !== customUrl)
          (yield pages[0].waitForNavigation());
        expect(pages[0].url()).toBe(customUrl);
        (yield browser.close());
      });});
      it('should set the default viewport', /* async */() => {return (fn => {
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
        const options = Object.assign({}, defaultBrowserOptions, {
          defaultViewport: {
            width: 456,
            height: 789
          }
        });
        const browser = (yield puppeteer.launch(options));
        const page = (yield browser.newPage());
        expect((yield page.evaluate('window.innerWidth'))).toBe(456);
        expect((yield page.evaluate('window.innerHeight'))).toBe(789);
        (yield browser.close());
      });});
      it('should disable the default viewport', /* async */() => {return (fn => {
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
        const options = Object.assign({}, defaultBrowserOptions, {
          defaultViewport: null
        });
        const browser = (yield puppeteer.launch(options));
        const page = (yield browser.newPage());
        expect(page.viewport()).toBe(null);
        (yield browser.close());
      });});
      it('should take fullPage screenshots when defaultViewport is null', /* async */({server}) => {return (fn => {
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
        const options = Object.assign({}, defaultBrowserOptions, {
          defaultViewport: null
        });
        const browser = (yield puppeteer.launch(options));
        const page = (yield browser.newPage());
        (yield page.goto(server.PREFIX + '/grid.html'));
        const screenshot = (yield page.screenshot({
          fullPage: true
        }));
        expect(screenshot).toBeInstanceOf(Buffer);
        (yield browser.close());
      });});
    });
    describe('Puppeteer.connect', function() {
      it('should be able to connect multiple times to the same browser', /* async */({server}) => {return (fn => {
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
        const originalBrowser = (yield puppeteer.launch(defaultBrowserOptions));
        const browser = (yield puppeteer.connect({
          browserWSEndpoint: originalBrowser.wsEndpoint()
        }));
        const page = (yield browser.newPage());
        expect((yield page.evaluate(() => 7 * 8))).toBe(56);
        browser.disconnect();

        const secondPage = (yield originalBrowser.newPage());
        expect((yield secondPage.evaluate(() => 7 * 6))).toBe(42, 'original browser should still work');
        (yield originalBrowser.close());
      });});
      it('should support ignoreHTTPSErrors option', /* async */({httpsServer}) => {return (fn => {
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
        const originalBrowser = (yield puppeteer.launch(defaultBrowserOptions));
        const browserWSEndpoint = originalBrowser.wsEndpoint();

        const browser = (yield puppeteer.connect({browserWSEndpoint, ignoreHTTPSErrors: true}));
        const page = (yield browser.newPage());
        let error = null;
        const response = (yield page.goto(httpsServer.EMPTY_PAGE).catch(e => error = e));
        expect(error).toBe(null);
        expect(response.ok()).toBe(true);
        expect(response.securityDetails()).toBeTruthy();
        expect(response.securityDetails().protocol()).toBe('TLS 1.2');
        (yield page.close());
        (yield browser.close());
      });});
      it('should be able to reconnect to a disconnected browser', /* async */({server}) => {return (fn => {
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
        const originalBrowser = (yield puppeteer.launch(defaultBrowserOptions));
        const browserWSEndpoint = originalBrowser.wsEndpoint();
        const page = (yield originalBrowser.newPage());
        (yield page.goto(server.PREFIX + '/frames/nested-frames.html'));
        originalBrowser.disconnect();

        const browser = (yield puppeteer.connect({browserWSEndpoint}));
        const pages = (yield browser.pages());
        const restoredPage = pages.find(page => page.url() === server.PREFIX + '/frames/nested-frames.html');
        expect(utils.dumpFrames(restoredPage.mainFrame())).toBeGolden('reconnect-nested-frames.txt');
        expect((yield restoredPage.evaluate(() => 7 * 8))).toBe(56);
        (yield browser.close());
      });});
    });
    describe('Puppeteer.executablePath', function() {
      it('should work', /* async */({server}) => {return (fn => {
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
        const executablePath = puppeteer.executablePath();
        expect(fs.existsSync(executablePath)).toBe(true);
      });});
    });
  });

  describe('Browser target events', function() {
    it('should work', /* async */({server}) => {return (fn => {
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
      const browser = (yield puppeteer.launch(defaultBrowserOptions));
      const events = [];
      browser.on('targetcreated', () => events.push('CREATED'));
      browser.on('targetchanged', () => events.push('CHANGED'));
      browser.on('targetdestroyed', () => events.push('DESTROYED'));
      const page = (yield browser.newPage());
      (yield page.goto(server.EMPTY_PAGE));
      (yield page.close());
      expect(events).toEqual(['CREATED', 'CHANGED', 'DESTROYED']);
      (yield browser.close());
    });});
  });

  describe('Browser.Events.disconnected', function() {
    it('should be emitted when: browser gets closed, disconnected or underlying websocket gets closed', /* async */() => {return (fn => {
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
      const originalBrowser = (yield puppeteer.launch(defaultBrowserOptions));
      const browserWSEndpoint = originalBrowser.wsEndpoint();
      const remoteBrowser1 = (yield puppeteer.connect({browserWSEndpoint}));
      const remoteBrowser2 = (yield puppeteer.connect({browserWSEndpoint}));

      let disconnectedOriginal = 0;
      let disconnectedRemote1 = 0;
      let disconnectedRemote2 = 0;
      originalBrowser.on('disconnected', () => ++disconnectedOriginal);
      remoteBrowser1.on('disconnected', () => ++disconnectedRemote1);
      remoteBrowser2.on('disconnected', () => ++disconnectedRemote2);

      (yield Promise.all([
        utils.waitEvent(remoteBrowser2, 'disconnected'),
        remoteBrowser2.disconnect(),
      ]));

      expect(disconnectedOriginal).toBe(0);
      expect(disconnectedRemote1).toBe(0);
      expect(disconnectedRemote2).toBe(1);

      (yield Promise.all([
        utils.waitEvent(remoteBrowser1, 'disconnected'),
        utils.waitEvent(originalBrowser, 'disconnected'),
        originalBrowser.close(),
      ]));

      expect(disconnectedOriginal).toBe(1);
      expect(disconnectedRemote1).toBe(1);
      expect(disconnectedRemote2).toBe(1);
    });});
  });

};

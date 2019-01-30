/**
 * Copyright 2018 Google Inc. All rights reserved.
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

const path = require('path');
const os = require('os');
const fs = require('fs');
const {helper} = require('../lib/helper');
const rmAsync = helper.promisify(require('rimraf'));
const utils = require('./utils');
const {waitEvent} = utils;
const puppeteer = utils.requireRoot('index.js');
const mkdtempAsync = helper.promisify(fs.mkdtemp);

const TMP_FOLDER = path.join(os.tmpdir(), 'pptr_tmp_folder-');

function waitForBackgroundPageTarget(browser) {
  const target = browser.targets().find(target => target.type() === 'background_page');
  if (target)
    return Promise.resolve(target);
  return new Promise(resolve => {
    browser.on('targetcreated', function listener(target) {
      if (target.type() !== 'background_page')
        return;
      browser.removeListener(listener);
      resolve(target);
    });
  });
}

module.exports.addTests = function({testRunner, expect, defaultBrowserOptions}) {
  const {describe, xdescribe, fdescribe} = testRunner;
  const {it, fit, xit} = testRunner;
  const {beforeAll, beforeEach, afterAll, afterEach} = testRunner;

  const headfulOptions = Object.assign({}, defaultBrowserOptions, {
    headless: false
  });
  const headlessOptions = Object.assign({}, defaultBrowserOptions, {
    headless: true
  });
  const extensionPath = path.join(__dirname, 'assets', 'simple-extension');
  const extensionOptions = Object.assign({}, defaultBrowserOptions, {
    headless: false,
    args: [
      '--no-sandbox',
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
    ],
  });

  describe('HEADFUL', function() {
    it('background_page target type should be available', /* async */() => {return (fn => {
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
      const browserWithExtension = (yield puppeteer.launch(extensionOptions));
      const page = (yield browserWithExtension.newPage());
      const backgroundPageTarget = (yield waitForBackgroundPageTarget(browserWithExtension));
      (yield page.close());
      (yield browserWithExtension.close());
      expect(backgroundPageTarget).toBeTruthy();
    });});
    it('target.page() should return a background_page', /* async */({}) => {return (fn => {
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
      const browserWithExtension = (yield puppeteer.launch(extensionOptions));
      const backgroundPageTarget = (yield waitForBackgroundPageTarget(browserWithExtension));
      const page = (yield backgroundPageTarget.page());
      expect((yield page.evaluate(() => 2 * 3))).toBe(6);
      (yield browserWithExtension.close());
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
      const browser = (yield puppeteer.launch(extensionOptions));
      const pages = ((yield browser.pages())).map(page => page.url());
      expect(pages).toEqual(['about:blank']);
      (yield browser.close());
    });});
    it('headless should be able to read cookies written by headful', /* async */({server}) => {return (fn => {
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
      // Write a cookie in headful chrome
      const headfulBrowser = (yield puppeteer.launch(Object.assign({userDataDir}, headfulOptions)));
      const headfulPage = (yield headfulBrowser.newPage());
      (yield headfulPage.goto(server.EMPTY_PAGE));
      (yield headfulPage.evaluate(() => document.cookie = 'foo=true; expires=Fri, 31 Dec 9999 23:59:59 GMT'));
      (yield headfulBrowser.close());
      // Read the cookie from headless chrome
      const headlessBrowser = (yield puppeteer.launch(Object.assign({userDataDir}, headlessOptions)));
      const headlessPage = (yield headlessBrowser.newPage());
      (yield headlessPage.goto(server.EMPTY_PAGE));
      const cookie = (yield headlessPage.evaluate(() => document.cookie));
      (yield headlessBrowser.close());
      // This might throw. See https://github.com/GoogleChrome/puppeteer/issues/2778
      (yield rmAsync(userDataDir).catch(e => {}));
      expect(cookie).toBe('foo=true');
    });});
    it('OOPIF: should report google.com frame', /* async */({server}) => {return (fn => {
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
      // https://google.com is isolated by default in Chromium embedder.
      const browser = (yield puppeteer.launch(headfulOptions));
      const page = (yield browser.newPage());
      (yield page.goto(server.EMPTY_PAGE));
      (yield page.setRequestInterception(true));
      page.on('request', r => r.respond({body: 'YO, GOOGLE.COM'}));
      (yield page.evaluate(() => {
        const frame = document.createElement('iframe');
        frame.setAttribute('src', 'https://google.com/');
        document.body.appendChild(frame);
        return new Promise(x => frame.onload = x);
      }));
      (yield page.waitForSelector('iframe[src="https://google.com/"]'));
      const urls = page.frames().map(frame => frame.url()).sort();
      expect(urls).toEqual([
        server.EMPTY_PAGE,
        'https://google.com/'
      ]);
      (yield browser.close());
    });});
  });
};


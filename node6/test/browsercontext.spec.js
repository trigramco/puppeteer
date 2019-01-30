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

const utils = require('./utils');
const puppeteer = utils.requireRoot('index');
const {TimeoutError} = utils.requireRoot('Errors');

module.exports.addTests = function({testRunner, expect}) {
  const {describe, xdescribe, fdescribe} = testRunner;
  const {it, fit, xit} = testRunner;
  const {beforeAll, beforeEach, afterAll, afterEach} = testRunner;

  describe('BrowserContext', function() {
    it('should have default context', /* async */ function({browser, server}) {return (fn => {
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
      expect(browser.browserContexts().length).toBe(1);
      const defaultContext = browser.browserContexts()[0];
      expect(defaultContext.isIncognito()).toBe(false);
      let error = null;
      (yield defaultContext.close().catch(e => error = e));
      expect(browser.defaultBrowserContext()).toBe(defaultContext);
      expect(error.message).toContain('cannot be closed');
    });});
    it('should create new incognito context', /* async */ function({browser, server}) {return (fn => {
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
      expect(browser.browserContexts().length).toBe(1);
      const context = (yield browser.createIncognitoBrowserContext());
      expect(context.isIncognito()).toBe(true);
      expect(browser.browserContexts().length).toBe(2);
      expect(browser.browserContexts().indexOf(context) !== -1).toBe(true);
      (yield context.close());
      expect(browser.browserContexts().length).toBe(1);
    });});
    it('should close all belonging targets once closing context', /* async */ function({browser, server}) {return (fn => {
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
      expect(((yield browser.pages())).length).toBe(1);

      const context = (yield browser.createIncognitoBrowserContext());
      (yield context.newPage());
      expect(((yield browser.pages())).length).toBe(2);
      expect(((yield context.pages())).length).toBe(1);

      (yield context.close());
      expect(((yield browser.pages())).length).toBe(1);
    });});
    it('window.open should use parent tab context', /* async */ function({browser, server}) {return (fn => {
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
      const context = (yield browser.createIncognitoBrowserContext());
      const page = (yield context.newPage());
      (yield page.goto(server.EMPTY_PAGE));
      const [popupTarget] = (yield Promise.all([
        utils.waitEvent(browser, 'targetcreated'),
        page.evaluate(url => window.open(url), server.EMPTY_PAGE)
      ]));
      expect(popupTarget.browserContext()).toBe(context);
      (yield context.close());
    });});
    it('should fire target events', /* async */ function({browser, server}) {return (fn => {
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
      const context = (yield browser.createIncognitoBrowserContext());
      const events = [];
      context.on('targetcreated', target => events.push('CREATED: ' + target.url()));
      context.on('targetchanged', target => events.push('CHANGED: ' + target.url()));
      context.on('targetdestroyed', target => events.push('DESTROYED: ' + target.url()));
      const page = (yield context.newPage());
      (yield page.goto(server.EMPTY_PAGE));
      (yield page.close());
      expect(events).toEqual([
        'CREATED: about:blank',
        `CHANGED: ${server.EMPTY_PAGE}`,
        `DESTROYED: ${server.EMPTY_PAGE}`
      ]);
      (yield context.close());
    });});
    it('should wait for a target', /* async */ function({browser, server}) {return (fn => {
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
      const context = (yield browser.createIncognitoBrowserContext());
      let resolved = false;
      const targetPromise = context.waitForTarget(target => target.url() === server.EMPTY_PAGE);
      targetPromise.then(() => resolved = true);
      const page = (yield context.newPage());
      expect(resolved).toBe(false);
      (yield page.goto(server.EMPTY_PAGE));
      const target = (yield targetPromise);
      expect((yield target.page())).toBe(page);
      (yield context.close());
    });});
    it('should timeout waiting for a non-existent target', /* async */ function({browser, server}) {return (fn => {
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
      const context = (yield browser.createIncognitoBrowserContext());
      const error = (yield context.waitForTarget(target => target.url() === server.EMPTY_PAGE, {timeout: 1}).catch(e => e));
      expect(error).toBeInstanceOf(TimeoutError);
      (yield context.close());
    });});
    it('should isolate localStorage and cookies', /* async */ function({browser, server}) {return (fn => {
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
      // Create two incognito contexts.
      const context1 = (yield browser.createIncognitoBrowserContext());
      const context2 = (yield browser.createIncognitoBrowserContext());
      expect(context1.targets().length).toBe(0);
      expect(context2.targets().length).toBe(0);

      // Create a page in first incognito context.
      const page1 = (yield context1.newPage());
      (yield page1.goto(server.EMPTY_PAGE));
      (yield page1.evaluate(() => {
        localStorage.setItem('name', 'page1');
        document.cookie = 'name=page1';
      }));

      expect(context1.targets().length).toBe(1);
      expect(context2.targets().length).toBe(0);

      // Create a page in second incognito context.
      const page2 = (yield context2.newPage());
      (yield page2.goto(server.EMPTY_PAGE));
      (yield page2.evaluate(() => {
        localStorage.setItem('name', 'page2');
        document.cookie = 'name=page2';
      }));

      expect(context1.targets().length).toBe(1);
      expect(context1.targets()[0]).toBe(page1.target());
      expect(context2.targets().length).toBe(1);
      expect(context2.targets()[0]).toBe(page2.target());

      // Make sure pages don't share localstorage or cookies.
      expect((yield page1.evaluate(() => localStorage.getItem('name')))).toBe('page1');
      expect((yield page1.evaluate(() => document.cookie))).toBe('name=page1');
      expect((yield page2.evaluate(() => localStorage.getItem('name')))).toBe('page2');
      expect((yield page2.evaluate(() => document.cookie))).toBe('name=page2');

      // Cleanup contexts.
      (yield Promise.all([
        context1.close(),
        context2.close()
      ]));
      expect(browser.browserContexts().length).toBe(1);
    });});
    it('should work across sessions', /* async */ function({browser, server}) {return (fn => {
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
      expect(browser.browserContexts().length).toBe(1);
      const context = (yield browser.createIncognitoBrowserContext());
      expect(browser.browserContexts().length).toBe(2);
      const remoteBrowser = (yield puppeteer.connect({
        browserWSEndpoint: browser.wsEndpoint()
      }));
      const contexts = remoteBrowser.browserContexts();
      expect(contexts.length).toBe(2);
      (yield remoteBrowser.disconnect());
      (yield context.close());
    });});
  });
};

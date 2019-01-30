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
const {waitEvent} = utils;

module.exports.addTests = function({testRunner, expect}) {
  const {describe, xdescribe, fdescribe} = testRunner;
  const {it, fit, xit} = testRunner;
  const {beforeAll, beforeEach, afterAll, afterEach} = testRunner;

  describe('Target', function() {
    it('Browser.targets should return all of the targets', /* async */({page, server, browser}) => {return (fn => {
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
      // The pages will be the testing page and the original newtab page
      const targets = browser.targets();
      expect(targets.some(target => target.type() === 'page' &&
        target.url() === 'about:blank')).toBeTruthy('Missing blank page');
      expect(targets.some(target => target.type() === 'browser')).toBeTruthy('Missing browser target');
    });});
    it('Browser.pages should return all of the pages', /* async */({page, server, context}) => {return (fn => {
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
      // The pages will be the testing page
      const allPages = (yield context.pages());
      expect(allPages.length).toBe(1);
      expect(allPages).toContain(page);
      expect(allPages[0]).not.toBe(allPages[1]);
    });});
    it('should contain browser target', /* async */({browser}) => {return (fn => {
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
      const targets = browser.targets();
      const browserTarget = targets.find(target => target.type() === 'browser');
      expect(browserTarget).toBeTruthy();
    });});
    it('should be able to use the default page in the browser', /* async */({page, server, browser}) => {return (fn => {
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
      // The pages will be the testing page and the original newtab page
      const allPages = (yield browser.pages());
      const originalPage = allPages.find(p => p !== page);
      expect((yield originalPage.evaluate(() => ['Hello', 'world'].join(' ')))).toBe('Hello world');
      expect((yield originalPage.$('body'))).toBeTruthy();
    });});
    it('should report when a new page is created and closed', /* async */({page, server, context}) => {return (fn => {
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
      const otherPagePromise = new Promise(fulfill => context.once('targetcreated', target => fulfill(target.page())));
      (yield page.evaluate(url => window.open(url), server.CROSS_PROCESS_PREFIX));
      const otherPage = (yield otherPagePromise);
      expect(otherPage.url()).toContain(server.CROSS_PROCESS_PREFIX);

      expect((yield otherPage.evaluate(() => ['Hello', 'world'].join(' ')))).toBe('Hello world');
      expect((yield otherPage.$('body'))).toBeTruthy();

      let allPages = (yield context.pages());
      expect(allPages).toContain(page);
      expect(allPages).toContain(otherPage);

      const closePagePromise = new Promise(fulfill => context.once('targetdestroyed', target => fulfill(target.page())));
      (yield otherPage.close());
      expect((yield closePagePromise)).toBe(otherPage);

      allPages = (yield Promise.all(context.targets().map(target => target.page())));
      expect(allPages).toContain(page);
      expect(allPages).not.toContain(otherPage);
    });});
    it('should report when a service worker is created and destroyed', /* async */({page, server, context}) => {return (fn => {
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
      (yield page.goto(server.EMPTY_PAGE));
      const createdTarget = new Promise(fulfill => context.once('targetcreated', target => fulfill(target)));

      (yield page.goto(server.PREFIX + '/serviceworkers/empty/sw.html'));

      expect(((yield createdTarget)).type()).toBe('service_worker');
      expect(((yield createdTarget)).url()).toBe(server.PREFIX + '/serviceworkers/empty/sw.js');

      const destroyedTarget = new Promise(fulfill => context.once('targetdestroyed', target => fulfill(target)));
      (yield page.evaluate(() => window.registrationPromise.then(registration => registration.unregister())));
      expect((yield destroyedTarget)).toBe((yield createdTarget));
    });});
    it('should report when a target url changes', /* async */({page, server, context}) => {return (fn => {
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
      (yield page.goto(server.EMPTY_PAGE));
      let changedTarget = new Promise(fulfill => context.once('targetchanged', target => fulfill(target)));
      (yield page.goto(server.CROSS_PROCESS_PREFIX + '/'));
      expect(((yield changedTarget)).url()).toBe(server.CROSS_PROCESS_PREFIX + '/');

      changedTarget = new Promise(fulfill => context.once('targetchanged', target => fulfill(target)));
      (yield page.goto(server.EMPTY_PAGE));
      expect(((yield changedTarget)).url()).toBe(server.EMPTY_PAGE);
    });});
    it('should not report uninitialized pages', /* async */({page, server, context}) => {return (fn => {
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
      let targetChanged = false;
      const listener = () => targetChanged = true;
      context.on('targetchanged', listener);
      const targetPromise = new Promise(fulfill => context.once('targetcreated', target => fulfill(target)));
      const newPagePromise = context.newPage();
      const target = (yield targetPromise);
      expect(target.url()).toBe('about:blank');

      const newPage = (yield newPagePromise);
      const targetPromise2 = new Promise(fulfill => context.once('targetcreated', target => fulfill(target)));
      const evaluatePromise = newPage.evaluate(() => window.open('about:blank'));
      const target2 = (yield targetPromise2);
      expect(target2.url()).toBe('about:blank');
      (yield evaluatePromise);
      (yield newPage.close());
      expect(targetChanged).toBe(false, 'target should not be reported as changed');
      context.removeListener('targetchanged', listener);
    });});
    it('should not crash while redirecting if original request was missed', /* async */({page, server, context}) => {return (fn => {
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
      let serverResponse = null;
      server.setRoute('/one-style.css', (req, res) => serverResponse = res);
      // Open a new page. Use window.open to connect to the page later.
      (yield Promise.all([
        page.evaluate(url => window.open(url), server.PREFIX + '/one-style.html'),
        server.waitForRequest('/one-style.css')
      ]));
      // Connect to the opened page.
      const target = (yield context.waitForTarget(target => target.url().includes('one-style.html')));
      const newPage = (yield target.page());
      // Issue a redirect.
      serverResponse.writeHead(302, { location: '/injectedstyle.css' });
      serverResponse.end();
      // Wait for the new page to load.
      (yield waitEvent(newPage, 'load'));
      // Cleanup.
      (yield newPage.close());
    });});
    it('should have an opener', /* async */({page, server, context}) => {return (fn => {
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
      (yield page.goto(server.EMPTY_PAGE));
      const [createdTarget] = (yield Promise.all([
        new Promise(fulfill => context.once('targetcreated', target => fulfill(target))),
        page.goto(server.PREFIX + '/popup/window-open.html')
      ]));
      expect(((yield createdTarget.page())).url()).toBe(server.PREFIX + '/popup/popup.html');
      expect(createdTarget.opener()).toBe(page.target());
      expect(page.target().opener()).toBe(null);
    });});
  });
};

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
const {TimeoutError} = utils.requireRoot('Errors');

module.exports.addTests = function({testRunner, expect}) {
  const {describe, xdescribe, fdescribe} = testRunner;
  const {it, fit, xit} = testRunner;
  const {beforeAll, beforeEach, afterAll, afterEach} = testRunner;

  describe('Frame.executionContext', function() {
    it('should work', /* async */({page, server}) => {return (fn => {
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
      (yield utils.attachFrame(page, 'frame1', server.EMPTY_PAGE));
      expect(page.frames().length).toBe(2);
      const [frame1, frame2] = page.frames();
      const context1 = (yield frame1.executionContext());
      const context2 = (yield frame2.executionContext());
      expect(context1).toBeTruthy();
      expect(context2).toBeTruthy();
      expect(context1 !== context2).toBeTruthy();
      expect(context1.frame()).toBe(frame1);
      expect(context2.frame()).toBe(frame2);

      (yield Promise.all([
        context1.evaluate(() => window.a = 1),
        context2.evaluate(() => window.a = 2)
      ]));
      const [a1, a2] = (yield Promise.all([
        context1.evaluate(() => window.a),
        context2.evaluate(() => window.a)
      ]));
      expect(a1).toBe(1);
      expect(a2).toBe(2);
    });});
  });

  describe('Frame.goto', function() {
    it('should navigate subframes', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/frames/one-frame.html'));
      expect(page.frames()[0].url()).toContain('/frames/one-frame.html');
      expect(page.frames()[1].url()).toContain('/frames/frame.html');

      const response = (yield page.frames()[1].goto(server.EMPTY_PAGE));
      expect(response.ok()).toBe(true);
      expect(response.frame()).toBe(page.frames()[1]);
    });});
    it('should reject when frame detaches', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/frames/one-frame.html'));

      server.setRoute('/empty.html', () => {});
      const navigationPromise = page.frames()[1].goto(server.EMPTY_PAGE).catch(e => e);
      (yield server.waitForRequest('/empty.html'));

      (yield page.$eval('iframe', frame => frame.remove()));
      const error = (yield navigationPromise);
      expect(error.message).toBe('Navigating frame was detached');
    });});
    it('should return matching responses', /* async */({page, server}) => {return (fn => {
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
      // Disable cache: otherwise, chromium will cache similar requests.
      (yield page.setCacheEnabled(false));
      (yield page.goto(server.EMPTY_PAGE));
      // Attach three frames.
      const frames = (yield Promise.all([
        utils.attachFrame(page, 'frame1', server.EMPTY_PAGE),
        utils.attachFrame(page, 'frame2', server.EMPTY_PAGE),
        utils.attachFrame(page, 'frame3', server.EMPTY_PAGE),
      ]));
      // Navigate all frames to the same URL.
      const serverResponses = [];
      server.setRoute('/one-style.html', (req, res) => serverResponses.push(res));
      const navigations = [];
      for (let i = 0; i < 3; ++i) {
        navigations.push(frames[i].goto(server.PREFIX + '/one-style.html'));
        (yield server.waitForRequest('/one-style.html'));
      }
      // Respond from server out-of-order.
      const serverResponseTexts = ['AAA', 'BBB', 'CCC'];
      for (const i of [1, 2, 0]) {
        serverResponses[i].end(serverResponseTexts[i]);
        const response = (yield navigations[i]);
        expect(response.frame()).toBe(frames[i]);
        expect((yield response.text())).toBe(serverResponseTexts[i]);
      }
    });});
  });

  describe('Frame.waitForNavigation', function() {
    it('should work', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/frames/one-frame.html'));
      const frame = page.frames()[1];
      const [response] = (yield Promise.all([
        frame.waitForNavigation(),
        frame.evaluate(url => window.location.href = url, server.PREFIX + '/grid.html')
      ]));
      expect(response.ok()).toBe(true);
      expect(response.url()).toContain('grid.html');
      expect(response.frame()).toBe(frame);
      expect(page.url()).toContain('/frames/one-frame.html');
    });});
    it('should reject when frame detaches', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/frames/one-frame.html'));
      const frame = page.frames()[1];

      server.setRoute('/empty.html', () => {});
      const navigationPromise = frame.waitForNavigation();
      (yield Promise.all([
        server.waitForRequest('/empty.html'),
        frame.evaluate(() => window.location = '/empty.html')
      ]));
      (yield page.$eval('iframe', frame => frame.remove()));
      (yield navigationPromise);
    });});
  });

  describe('Frame.evaluateHandle', function() {
    it('should work', /* async */({page, server}) => {return (fn => {
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
      const mainFrame = page.mainFrame();
      const windowHandle = (yield mainFrame.evaluateHandle(() => window));
      expect(windowHandle).toBeTruthy();
    });});
  });

  describe('Frame.evaluate', function() {
    it('should have different execution contexts', /* async */({page, server}) => {return (fn => {
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
      (yield utils.attachFrame(page, 'frame1', server.EMPTY_PAGE));
      expect(page.frames().length).toBe(2);
      const frame1 = page.frames()[0];
      const frame2 = page.frames()[1];
      (yield frame1.evaluate(() => window.FOO = 'foo'));
      (yield frame2.evaluate(() => window.FOO = 'bar'));
      expect((yield frame1.evaluate(() => window.FOO))).toBe('foo');
      expect((yield frame2.evaluate(() => window.FOO))).toBe('bar');
    });});
    it('should execute after cross-site navigation', /* async */({page, server}) => {return (fn => {
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
      const mainFrame = page.mainFrame();
      expect((yield mainFrame.evaluate(() => window.location.href))).toContain('localhost');
      (yield page.goto(server.CROSS_PROCESS_PREFIX + '/empty.html'));
      expect((yield mainFrame.evaluate(() => window.location.href))).toContain('127');
    });});
  });

  describe('Frame.waitForFunction', function() {
    it('should accept a string', /* async */({page, server}) => {return (fn => {
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
      const watchdog = page.waitForFunction('window.__FOO === 1');
      (yield page.evaluate(() => window.__FOO = 1));
      (yield watchdog);
    });});
    it('should work when resolved right before execution context disposal', /* async */({page, server}) => {return (fn => {
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
      (yield page.evaluateOnNewDocument(() => window.__RELOADED = true));
      (yield page.waitForFunction(() => {
        if (!window.__RELOADED)
          window.location.reload();
        return true;
      }));
    });});
    it('should poll on interval', /* async */({page, server}) => {return (fn => {
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
      let success = false;
      const startTime = Date.now();
      const polling = 100;
      const watchdog = page.waitForFunction(() => window.__FOO === 'hit', {polling})
          .then(() => success = true);
      (yield page.evaluate(() => window.__FOO = 'hit'));
      expect(success).toBe(false);
      (yield page.evaluate(() => document.body.appendChild(document.createElement('div'))));
      (yield watchdog);
      expect(Date.now() - startTime).not.toBeLessThan(polling / 2);
    });});
    it('should poll on mutation', /* async */({page, server}) => {return (fn => {
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
      let success = false;
      const watchdog = page.waitForFunction(() => window.__FOO === 'hit', {polling: 'mutation'})
          .then(() => success = true);
      (yield page.evaluate(() => window.__FOO = 'hit'));
      expect(success).toBe(false);
      (yield page.evaluate(() => document.body.appendChild(document.createElement('div'))));
      (yield watchdog);
    });});
    it('should poll on raf', /* async */({page, server}) => {return (fn => {
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
      const watchdog = page.waitForFunction(() => window.__FOO === 'hit', {polling: 'raf'});
      (yield page.evaluate(() => window.__FOO = 'hit'));
      (yield watchdog);
    });});
    it('should work with strict CSP policy', /* async */({page, server}) => {return (fn => {
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
      server.setCSP('/empty.html', 'script-src ' + server.PREFIX);
      (yield page.goto(server.EMPTY_PAGE));
      const watchdog = page.waitForFunction(() => window.__FOO === 'hit', {polling: 'raf'});
      (yield page.evaluate(() => window.__FOO = 'hit'));
      (yield watchdog);
    });});
    it('should throw on bad polling value', /* async */({page, server}) => {return (fn => {
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
      let error = null;
      try {
        (yield page.waitForFunction(() => !!document.body, {polling: 'unknown'}));
      } catch (e) {
        error = e;
      }
      expect(error).toBeTruthy();
      expect(error.message).toContain('polling');
    });});
    it('should throw negative polling interval', /* async */({page, server}) => {return (fn => {
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
      let error = null;
      try {
        (yield page.waitForFunction(() => !!document.body, {polling: -10}));
      } catch (e) {
        error = e;
      }
      expect(error).toBeTruthy();
      expect(error.message).toContain('Cannot poll with non-positive interval');
    });});
    it('should return the success value as a JSHandle', /* async */({page}) => {return (fn => {
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
      expect((yield ((yield page.waitForFunction(() => 5))).jsonValue())).toBe(5);
    });});
    it('should return the window as a success value', /* async */({ page }) => {return (fn => {
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
      expect((yield page.waitForFunction(() => window))).toBeTruthy();
    });});
    it('should accept ElementHandle arguments', /* async */({page}) => {return (fn => {
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
      (yield page.setContent('<div></div>'));
      const div = (yield page.$('div'));
      let resolved = false;
      const waitForFunction = page.waitForFunction(element => !element.parentElement, {}, div).then(() => resolved = true);
      expect(resolved).toBe(false);
      (yield page.evaluate(element => element.remove(), div));
      (yield waitForFunction);
    });});
    it('should respect timeout', /* async */({page}) => {return (fn => {
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
      let error = null;
      (yield page.waitForFunction('false', {timeout: 10}).catch(e => error = e));
      expect(error).toBeTruthy();
      expect(error.message).toContain('waiting for function failed: timeout');
      expect(error).toBeInstanceOf(TimeoutError);
    });});
    it('should disable timeout when its set to 0', /* async */({page}) => {return (fn => {
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
      const watchdog = page.waitForFunction(() => {
        window.__counter = (window.__counter || 0) + 1;
        return window.__injected;
      }, {timeout: 0, polling: 10});
      (yield page.waitForFunction(() => window.__counter > 10));
      (yield page.evaluate(() => window.__injected = true));
      (yield watchdog);
    });});
  });

  describe('Frame.waitForSelector', function() {
    const addElement = tag => document.body.appendChild(document.createElement(tag));

    it('should immediately resolve promise if node exists', /* async */({page, server}) => {return (fn => {
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
      const frame = page.mainFrame();
      (yield frame.waitForSelector('*'));
      (yield frame.evaluate(addElement, 'div'));
      (yield frame.waitForSelector('div'));
    });});

    it('should resolve promise when node is added', /* async */({page, server}) => {return (fn => {
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
      const frame = page.mainFrame();
      const watchdog = frame.waitForSelector('div');
      (yield frame.evaluate(addElement, 'br'));
      (yield frame.evaluate(addElement, 'div'));
      const eHandle = (yield watchdog);
      const tagName = (yield eHandle.getProperty('tagName').then(e => e.jsonValue()));
      expect(tagName).toBe('DIV');
    });});

    it('should work when node is added through innerHTML', /* async */({page, server}) => {return (fn => {
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
      const watchdog = page.waitForSelector('h3 div');
      (yield page.evaluate(addElement, 'span'));
      (yield page.evaluate(() => document.querySelector('span').innerHTML = '<h3><div></div></h3>'));
      (yield watchdog);
    });});

    it('Page.waitForSelector is shortcut for main frame', /* async */({page, server}) => {return (fn => {
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
      (yield utils.attachFrame(page, 'frame1', server.EMPTY_PAGE));
      const otherFrame = page.frames()[1];
      const watchdog = page.waitForSelector('div');
      (yield otherFrame.evaluate(addElement, 'div'));
      (yield page.evaluate(addElement, 'div'));
      const eHandle = (yield watchdog);
      expect(eHandle.executionContext().frame()).toBe(page.mainFrame());
    });});

    it('should run in specified frame', /* async */({page, server}) => {return (fn => {
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
      (yield utils.attachFrame(page, 'frame1', server.EMPTY_PAGE));
      (yield utils.attachFrame(page, 'frame2', server.EMPTY_PAGE));
      const frame1 = page.frames()[1];
      const frame2 = page.frames()[2];
      const waitForSelectorPromise = frame2.waitForSelector('div');
      (yield frame1.evaluate(addElement, 'div'));
      (yield frame2.evaluate(addElement, 'div'));
      const eHandle = (yield waitForSelectorPromise);
      expect(eHandle.executionContext().frame()).toBe(frame2);
    });});

    it('should throw if evaluation failed', /* async */({page, server}) => {return (fn => {
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
      (yield page.evaluateOnNewDocument(function() {
        document.querySelector = null;
      }));
      (yield page.goto(server.EMPTY_PAGE));
      let error = null;
      (yield page.waitForSelector('*').catch(e => error = e));
      expect(error.message).toContain('document.querySelector is not a function');
    });});
    it('should throw when frame is detached', /* async */({page, server}) => {return (fn => {
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
      (yield utils.attachFrame(page, 'frame1', server.EMPTY_PAGE));
      const frame = page.frames()[1];
      let waitError = null;
      const waitPromise = frame.waitForSelector('.box').catch(e => waitError = e);
      (yield utils.detachFrame(page, 'frame1'));
      (yield waitPromise);
      expect(waitError).toBeTruthy();
      expect(waitError.message).toContain('waitForFunction failed: frame got detached.');
    });});
    it('should survive cross-process navigation', /* async */({page, server}) => {return (fn => {
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
      let boxFound = false;
      const waitForSelector = page.waitForSelector('.box').then(() => boxFound = true);
      (yield page.goto(server.EMPTY_PAGE));
      expect(boxFound).toBe(false);
      (yield page.reload());
      expect(boxFound).toBe(false);
      (yield page.goto(server.CROSS_PROCESS_PREFIX + '/grid.html'));
      (yield waitForSelector);
      expect(boxFound).toBe(true);
    });});
    it('should wait for visible', /* async */({page, server}) => {return (fn => {
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
      let divFound = false;
      const waitForSelector = page.waitForSelector('div', {visible: true}).then(() => divFound = true);
      (yield page.setContent(`<div style='display: none; visibility: hidden;'>1</div>`));
      expect(divFound).toBe(false);
      (yield page.evaluate(() => document.querySelector('div').style.removeProperty('display')));
      expect(divFound).toBe(false);
      (yield page.evaluate(() => document.querySelector('div').style.removeProperty('visibility')));
      expect((yield waitForSelector)).toBe(true);
      expect(divFound).toBe(true);
    });});
    it('should wait for visible recursively', /* async */({page, server}) => {return (fn => {
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
      let divVisible = false;
      const waitForSelector = page.waitForSelector('div#inner', {visible: true}).then(() => divVisible = true);
      (yield page.setContent(`<div style='display: none; visibility: hidden;'><div id="inner">hi</div></div>`));
      expect(divVisible).toBe(false);
      (yield page.evaluate(() => document.querySelector('div').style.removeProperty('display')));
      expect(divVisible).toBe(false);
      (yield page.evaluate(() => document.querySelector('div').style.removeProperty('visibility')));
      expect((yield waitForSelector)).toBe(true);
      expect(divVisible).toBe(true);
    });});
    it('hidden should wait for visibility: hidden', /* async */({page, server}) => {return (fn => {
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
      let divHidden = false;
      (yield page.setContent(`<div style='display: block;'></div>`));
      const waitForSelector = page.waitForSelector('div', {hidden: true}).then(() => divHidden = true);
      (yield page.waitForSelector('div')); // do a round trip
      expect(divHidden).toBe(false);
      (yield page.evaluate(() => document.querySelector('div').style.setProperty('visibility', 'hidden')));
      expect((yield waitForSelector)).toBe(true);
      expect(divHidden).toBe(true);
    });});
    it('hidden should wait for display: none', /* async */({page, server}) => {return (fn => {
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
      let divHidden = false;
      (yield page.setContent(`<div style='display: block;'></div>`));
      const waitForSelector = page.waitForSelector('div', {hidden: true}).then(() => divHidden = true);
      (yield page.waitForSelector('div')); // do a round trip
      expect(divHidden).toBe(false);
      (yield page.evaluate(() => document.querySelector('div').style.setProperty('display', 'none')));
      expect((yield waitForSelector)).toBe(true);
      expect(divHidden).toBe(true);
    });});
    it('hidden should wait for removal', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent(`<div></div>`));
      let divRemoved = false;
      const waitForSelector = page.waitForSelector('div', {hidden: true}).then(() => divRemoved = true);
      (yield page.waitForSelector('div')); // do a round trip
      expect(divRemoved).toBe(false);
      (yield page.evaluate(() => document.querySelector('div').remove()));
      expect((yield waitForSelector)).toBe(true);
      expect(divRemoved).toBe(true);
    });});
    it('should respect timeout', /* async */({page, server}) => {return (fn => {
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
      let error = null;
      (yield page.waitForSelector('div', {timeout: 10}).catch(e => error = e));
      expect(error).toBeTruthy();
      expect(error.message).toContain('waiting for selector "div" failed: timeout');
      expect(error).toBeInstanceOf(TimeoutError);
    });});
    it('should have an error message specifically for awaiting an element to be hidden', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent(`<div></div>`));
      let error = null;
      (yield page.waitForSelector('div', {hidden: true, timeout: 10}).catch(e => error = e));
      expect(error).toBeTruthy();
      expect(error.message).toContain('waiting for selector "div" to be hidden failed: timeout');
    });});

    it('should respond to node attribute mutation', /* async */({page, server}) => {return (fn => {
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
      let divFound = false;
      const waitForSelector = page.waitForSelector('.zombo').then(() => divFound = true);
      (yield page.setContent(`<div class='notZombo'></div>`));
      expect(divFound).toBe(false);
      (yield page.evaluate(() => document.querySelector('div').className = 'zombo'));
      expect((yield waitForSelector)).toBe(true);
    });});
    it('should return the element handle', /* async */({page, server}) => {return (fn => {
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
      const waitForSelector = page.waitForSelector('.zombo');
      (yield page.setContent(`<div class='zombo'>anything</div>`));
      expect((yield page.evaluate(x => x.textContent, (yield waitForSelector)))).toBe('anything');
    });});
    it('should have correct stack trace for timeout', /* async */({page, server}) => {return (fn => {
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
      let error;
      (yield page.waitForSelector('.zombo', {timeout: 10}).catch(e => error = e));
      expect(error.stack).toContain('frame.spec.js');
    });});
  });

  describe('Frame.waitForXPath', function() {
    const addElement = tag => document.body.appendChild(document.createElement(tag));

    it('should support some fancy xpath', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent(`<p>red herring</p><p>hello  world  </p>`));
      const waitForXPath = page.waitForXPath('//p[normalize-space(.)="hello world"]');
      expect((yield page.evaluate(x => x.textContent, (yield waitForXPath)))).toBe('hello  world  ');
    });});
    it('should respect timeout', /* async */({page}) => {return (fn => {
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
      let error = null;
      (yield page.waitForXPath('//div', {timeout: 10}).catch(e => error = e));
      expect(error).toBeTruthy();
      expect(error.message).toContain('waiting for XPath "//div" failed: timeout');
      expect(error).toBeInstanceOf(TimeoutError);
    });});
    it('should run in specified frame', /* async */({page, server}) => {return (fn => {
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
      (yield utils.attachFrame(page, 'frame1', server.EMPTY_PAGE));
      (yield utils.attachFrame(page, 'frame2', server.EMPTY_PAGE));
      const frame1 = page.frames()[1];
      const frame2 = page.frames()[2];
      const waitForXPathPromise = frame2.waitForXPath('//div');
      (yield frame1.evaluate(addElement, 'div'));
      (yield frame2.evaluate(addElement, 'div'));
      const eHandle = (yield waitForXPathPromise);
      expect(eHandle.executionContext().frame()).toBe(frame2);
    });});
    it('should throw if evaluation failed', /* async */({page, server}) => {return (fn => {
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
      (yield page.evaluateOnNewDocument(function() {
        document.evaluate = null;
      }));
      (yield page.goto(server.EMPTY_PAGE));
      let error = null;
      (yield page.waitForXPath('*').catch(e => error = e));
      expect(error.message).toContain('document.evaluate is not a function');
    });});
    it('should throw when frame is detached', /* async */({page, server}) => {return (fn => {
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
      (yield utils.attachFrame(page, 'frame1', server.EMPTY_PAGE));
      const frame = page.frames()[1];
      let waitError = null;
      const waitPromise = frame.waitForXPath('//*[@class="box"]').catch(e => waitError = e);
      (yield utils.detachFrame(page, 'frame1'));
      (yield waitPromise);
      expect(waitError).toBeTruthy();
      expect(waitError.message).toContain('waitForFunction failed: frame got detached.');
    });});
    it('hidden should wait for display: none', /* async */({page, server}) => {return (fn => {
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
      let divHidden = false;
      (yield page.setContent(`<div style='display: block;'></div>`));
      const waitForXPath = page.waitForXPath('//div', {hidden: true}).then(() => divHidden = true);
      (yield page.waitForXPath('//div')); // do a round trip
      expect(divHidden).toBe(false);
      (yield page.evaluate(() => document.querySelector('div').style.setProperty('display', 'none')));
      expect((yield waitForXPath)).toBe(true);
      expect(divHidden).toBe(true);
    });});
    it('should return the element handle', /* async */({page, server}) => {return (fn => {
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
      const waitForXPath = page.waitForXPath('//*[@class="zombo"]');
      (yield page.setContent(`<div class='zombo'>anything</div>`));
      expect((yield page.evaluate(x => x.textContent, (yield waitForXPath)))).toBe('anything');
    });});
    it('should allow you to select a text node', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent(`<div>some text</div>`));
      const text = (yield page.waitForXPath('//div/text()'));
      expect((yield ((yield text.getProperty('nodeType'))).jsonValue())).toBe(3 /* Node.TEXT_NODE */);
    });});
    it('should allow you to select an element with single slash', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent(`<div>some text</div>`));
      const waitForXPath = page.waitForXPath('/html/body/div');
      expect((yield page.evaluate(x => x.textContent, (yield waitForXPath)))).toBe('some text');
    });});
  });

  describe('Frame Management', function() {
    it('should handle nested frames', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/frames/nested-frames.html'));
      expect(utils.dumpFrames(page.mainFrame())).toBeGolden('nested-frames.txt');
    });});
    it('should send events when frames are manipulated dynamically', /* async */({page, server}) => {return (fn => {
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
      // validate frameattached events
      const attachedFrames = [];
      page.on('frameattached', frame => attachedFrames.push(frame));
      (yield utils.attachFrame(page, 'frame1', './assets/frame.html'));
      expect(attachedFrames.length).toBe(1);
      expect(attachedFrames[0].url()).toContain('/assets/frame.html');

      // validate framenavigated events
      const navigatedFrames = [];
      page.on('framenavigated', frame => navigatedFrames.push(frame));
      (yield utils.navigateFrame(page, 'frame1', './empty.html'));
      expect(navigatedFrames.length).toBe(1);
      expect(navigatedFrames[0].url()).toBe(server.EMPTY_PAGE);

      // validate framedetached events
      const detachedFrames = [];
      page.on('framedetached', frame => detachedFrames.push(frame));
      (yield utils.detachFrame(page, 'frame1'));
      expect(detachedFrames.length).toBe(1);
      expect(detachedFrames[0].isDetached()).toBe(true);
    });});
    it('should send "framenavigated" when navigating on anchor URLs', /* async */({page, server}) => {return (fn => {
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
      (yield Promise.all([
        page.goto(server.EMPTY_PAGE + '#foo'),
        utils.waitEvent(page, 'framenavigated')
      ]));
      expect(page.url()).toBe(server.EMPTY_PAGE + '#foo');
    });});
    it('should persist mainFrame on cross-process navigation', /* async */({page, server}) => {return (fn => {
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
      const mainFrame = page.mainFrame();
      (yield page.goto(server.CROSS_PROCESS_PREFIX + '/empty.html'));
      expect(page.mainFrame() === mainFrame).toBeTruthy();
    });});
    it('should not send attach/detach events for main frame', /* async */({page, server}) => {return (fn => {
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
      let hasEvents = false;
      page.on('frameattached', frame => hasEvents = true);
      page.on('framedetached', frame => hasEvents = true);
      (yield page.goto(server.EMPTY_PAGE));
      expect(hasEvents).toBe(false);
    });});
    it('should detach child frames on navigation', /* async */({page, server}) => {return (fn => {
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
      let attachedFrames = [];
      let detachedFrames = [];
      let navigatedFrames = [];
      page.on('frameattached', frame => attachedFrames.push(frame));
      page.on('framedetached', frame => detachedFrames.push(frame));
      page.on('framenavigated', frame => navigatedFrames.push(frame));
      (yield page.goto(server.PREFIX + '/frames/nested-frames.html'));
      expect(attachedFrames.length).toBe(4);
      expect(detachedFrames.length).toBe(0);
      expect(navigatedFrames.length).toBe(5);

      attachedFrames = [];
      detachedFrames = [];
      navigatedFrames = [];
      (yield page.goto(server.EMPTY_PAGE));
      expect(attachedFrames.length).toBe(0);
      expect(detachedFrames.length).toBe(4);
      expect(navigatedFrames.length).toBe(1);
    });});
    it('should report frame.name()', /* async */({page, server}) => {return (fn => {
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
      (yield utils.attachFrame(page, 'theFrameId', server.EMPTY_PAGE));
      (yield page.evaluate(url => {
        const frame = document.createElement('iframe');
        frame.name = 'theFrameName';
        frame.src = url;
        document.body.appendChild(frame);
        return new Promise(x => frame.onload = x);
      }, server.EMPTY_PAGE));
      expect(page.frames()[0].name()).toBe('');
      expect(page.frames()[1].name()).toBe('theFrameId');
      expect(page.frames()[2].name()).toBe('theFrameName');
    });});
    it('should report frame.parent()', /* async */({page, server}) => {return (fn => {
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
      (yield utils.attachFrame(page, 'frame1', server.EMPTY_PAGE));
      (yield utils.attachFrame(page, 'frame2', server.EMPTY_PAGE));
      expect(page.frames()[0].parentFrame()).toBe(null);
      expect(page.frames()[1].parentFrame()).toBe(page.mainFrame());
      expect(page.frames()[2].parentFrame()).toBe(page.mainFrame());
    });});
  });
};

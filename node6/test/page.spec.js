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
const path = require('path');
const utils = require('./utils');
const {waitEvent} = utils;
const {TimeoutError} = utils.requireRoot('Errors');

const DeviceDescriptors = utils.requireRoot('DeviceDescriptors');
const iPhone = DeviceDescriptors['iPhone 6'];
const iPhoneLandscape = DeviceDescriptors['iPhone 6 landscape'];

let asyncawait = true;
try {
  new Function('async function foo() {await 1}');
} catch (e) {
  asyncawait = false;
}

module.exports.addTests = function({testRunner, expect, headless}) {
  const {describe, xdescribe, fdescribe} = testRunner;
  const {it, fit, xit} = testRunner;
  const {beforeAll, beforeEach, afterAll, afterEach} = testRunner;

  describe('Page.close', function() {
    it('should reject all promises when page is closed', /* async */({context}) => {return (fn => {
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
      const newPage = (yield context.newPage());
      const neverResolves = newPage.evaluate(() => new Promise(r => {}));
      newPage.close();
      let error = null;
      (yield neverResolves.catch(e => error = e));
      expect(error.message).toContain('Protocol error');
    });});
    it('should not be visible in browser.pages', /* async */({browser}) => {return (fn => {
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
      const newPage = (yield browser.newPage());
      expect((yield browser.pages())).toContain(newPage);
      (yield newPage.close());
      expect((yield browser.pages())).not.toContain(newPage);
    });});
    it('should run beforeunload if asked for', /* async */({context, server}) => {return (fn => {
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
      const newPage = (yield context.newPage());
      (yield newPage.goto(server.PREFIX + '/beforeunload.html'));
      // We have to interact with a page so that 'beforeunload' handlers
      // fire.
      (yield newPage.click('body'));
      newPage.close({ runBeforeUnload: true });
      const dialog = (yield waitEvent(newPage, 'dialog'));
      expect(dialog.type()).toBe('beforeunload');
      expect(dialog.defaultValue()).toBe('');
      expect(dialog.message()).toBe('');
      dialog.accept();
      (yield waitEvent(newPage, 'close'));
    });});
    it('should set the page close state', /* async */({context}) => {return (fn => {
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
      const newPage = (yield context.newPage());
      expect(newPage.isClosed()).toBe(false);
      (yield newPage.close());
      expect(newPage.isClosed()).toBe(true);
    });});
  });

  (asyncawait ? describe : xdescribe)('Async stacks', () => {
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
      server.setRoute('/empty.html', (req, res) => {
        res.statusCode = 204;
        res.end();
      });
      let error = null;
      (yield page.goto(server.EMPTY_PAGE).catch(e => error = e));
      expect(error).not.toBe(null);
      expect(error.message).toContain('net::ERR_ABORTED');
    });});
  });

  describe('Page.Events.error', function() {
    it('should throw when page crashes', /* async */({page}) => {return (fn => {
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
      page.on('error', err => error = err);
      page.goto('chrome://crash').catch(e => {});
      (yield waitEvent(page, 'error'));
      expect(error.message).toBe('Page crashed!');
    });});
  });

  describe('BrowserContext.overridePermissions', function() {
    function getPermission(page, name) {
      return page.evaluate(name => navigator.permissions.query({name}).then(result => result.state), name);
    }

    it('should be prompt by default', /* async */({page, server, context}) => {return (fn => {
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
      expect((yield getPermission(page, 'geolocation'))).toBe('prompt');
    });});
    it('should deny permission when not listed', /* async */({page, server, context}) => {return (fn => {
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
      (yield context.overridePermissions(server.EMPTY_PAGE, []));
      expect((yield getPermission(page, 'geolocation'))).toBe('denied');
    });});
    it('should fail when bad permission is given', /* async */({page, server, context}) => {return (fn => {
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
      let error = null;
      (yield context.overridePermissions(server.EMPTY_PAGE, ['foo']).catch(e => error = e));
      expect(error.message).toBe('Unknown permission: foo');
    });});
    it('should grant permission when listed', /* async */({page, server, context}) => {return (fn => {
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
      (yield context.overridePermissions(server.EMPTY_PAGE, ['geolocation']));
      expect((yield getPermission(page, 'geolocation'))).toBe('granted');
    });});
    it('should reset permissions', /* async */({page, server, context}) => {return (fn => {
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
      (yield context.overridePermissions(server.EMPTY_PAGE, ['geolocation']));
      expect((yield getPermission(page, 'geolocation'))).toBe('granted');
      (yield context.clearPermissionOverrides());
      expect((yield getPermission(page, 'geolocation'))).toBe('prompt');
    });});
    it('should trigger permission onchange', /* async */({page, server, context}) => {return (fn => {
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
      (yield page.evaluate(() => {
        window.events = [];
        return navigator.permissions.query({name: 'clipboard-read'}).then(function(result) {
          window.events.push(result.state);
          result.onchange = function() {
            window.events.push(result.state);
          };
        });
      }));
      expect((yield page.evaluate(() => window.events))).toEqual(['prompt']);
      (yield context.overridePermissions(server.EMPTY_PAGE, []));
      expect((yield page.evaluate(() => window.events))).toEqual(['prompt', 'denied']);
      (yield context.overridePermissions(server.EMPTY_PAGE, ['clipboard-read']));
      expect((yield page.evaluate(() => window.events))).toEqual(['prompt', 'denied', 'granted']);
      (yield context.clearPermissionOverrides());
      expect((yield page.evaluate(() => window.events))).toEqual(['prompt', 'denied', 'granted', 'prompt']);
    });});
  });

  describe('Page.setGeolocation', function() {
    it('should work', /* async */({page, server, context}) => {return (fn => {
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
      (yield context.overridePermissions(server.PREFIX, ['geolocation']));
      (yield page.goto(server.EMPTY_PAGE));
      (yield page.setGeolocation({longitude: 10, latitude: 10}));
      const geolocation = (yield page.evaluate(() => new Promise(resolve => navigator.geolocation.getCurrentPosition(position => {
        resolve({latitude: position.coords.latitude, longitude: position.coords.longitude});
      }))));
      expect(geolocation).toEqual({
        latitude: 10,
        longitude: 10
      });
    });});
    it('should throw when invalid longitude', /* async */({page, server, context}) => {return (fn => {
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
        (yield page.setGeolocation({longitude: 200, latitude: 10}));
      } catch (e) {
        error = e;
      }
      expect(error.message).toContain('Invalid longitude "200"');
    });});
  });

  describe('Page.evaluate', function() {
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
      const result = (yield page.evaluate(() => 7 * 3));
      expect(result).toBe(21);
    });});
    (asyncawait ? it : xit)('should work with function shorthands', /* async */({page, server}) => {return (fn => {
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
      // trick node6 transpiler to not touch our object.
      // TODO(lushnikov): remove eval once Node6 is dropped.
      const a = eval(`({
        sum(a, b) { return a + b; },

        async mult(a, b) { return a * b; }
      })`);
      expect((yield page.evaluate(a.sum, 1, 2))).toBe(3);
      expect((yield page.evaluate(a.mult, 2, 4))).toBe(8);
    });});
    it('should throw when evaluation triggers reload', /* async */({page, server}) => {return (fn => {
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
      (yield page.evaluate(() => {
        location.reload();
        return new Promise(resolve => {
          setTimeout(() => resolve(1), 0);
        });
      }).catch(e => error = e));
      expect(error.message).toContain('Protocol error');
    });});
    it('should await promise', /* async */({page, server}) => {return (fn => {
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
      const result = (yield page.evaluate(() => Promise.resolve(8 * 7)));
      expect(result).toBe(56);
    });});
    it('should work right after framenavigated', /* async */({page, server}) => {return (fn => {
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
      let frameEvaluation = null;
      page.on('framenavigated', /* async */ frame => {return (fn => {
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
        frameEvaluation = frame.evaluate(() => 6 * 7);
      });});
      (yield page.goto(server.EMPTY_PAGE));
      expect((yield frameEvaluation)).toBe(42);
    });});
    it('should work from-inside an exposed function', /* async */({page, server}) => {return (fn => {
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
      // Setup inpage callback, which calls Page.evaluate
      (yield page.exposeFunction('callController', /* async */ function(a, b) {return (fn => {
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
        return (yield page.evaluate((a, b) => a * b, a, b));
      });}));
      const result = (yield page.evaluate(/* async */ function() {return (fn => {
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
        return (yield callController(9, 3));
      });}));
      expect(result).toBe(27);
    });});
    it('should reject promise with exception', /* async */({page, server}) => {return (fn => {
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
      (yield page.evaluate(() => not.existing.object.property).catch(e => error = e));
      expect(error).toBeTruthy();
      expect(error.message).toContain('not is not defined');
    });});
    it('should support thrown strings as error messages', /* async */({page, server}) => {return (fn => {
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
      (yield page.evaluate(() => { throw 'qwerty'; }).catch(e => error = e));
      expect(error).toBeTruthy();
      expect(error.message).toContain('qwerty');
    });});
    it('should support thrown numbers as error messages', /* async */({page, server}) => {return (fn => {
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
      (yield page.evaluate(() => { throw 100500; }).catch(e => error = e));
      expect(error).toBeTruthy();
      expect(error.message).toContain('100500');
    });});
    it('should return complex objects', /* async */({page, server}) => {return (fn => {
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
      const object = {foo: 'bar!'};
      const result = (yield page.evaluate(a => a, object));
      expect(result).not.toBe(object);
      expect(result).toEqual(object);
    });});
    it('should return NaN', /* async */({page, server}) => {return (fn => {
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
      const result = (yield page.evaluate(() => NaN));
      expect(Object.is(result, NaN)).toBe(true);
    });});
    it('should return -0', /* async */({page, server}) => {return (fn => {
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
      const result = (yield page.evaluate(() => -0));
      expect(Object.is(result, -0)).toBe(true);
    });});
    it('should return Infinity', /* async */({page, server}) => {return (fn => {
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
      const result = (yield page.evaluate(() => Infinity));
      expect(Object.is(result, Infinity)).toBe(true);
    });});
    it('should return -Infinity', /* async */({page, server}) => {return (fn => {
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
      const result = (yield page.evaluate(() => -Infinity));
      expect(Object.is(result, -Infinity)).toBe(true);
    });});
    it('should accept "undefined" as one of multiple parameters', /* async */({page, server}) => {return (fn => {
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
      const result = (yield page.evaluate((a, b) => Object.is(a, undefined) && Object.is(b, 'foo'), undefined, 'foo'));
      expect(result).toBe(true);
    });});
    it('should properly serialize null fields', /* async */({page}) => {return (fn => {
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
      expect((yield page.evaluate(() => ({a: undefined})))).toEqual({});
    });});
    it('should return undefined for non-serializable objects', /* async */({page, server}) => {return (fn => {
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
      expect((yield page.evaluate(() => window))).toBe(undefined);
      expect((yield page.evaluate(() => [Symbol('foo4')]))).toBe(undefined);
    });});
    it('should fail for circular object', /* async */({page, server}) => {return (fn => {
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
      const result = (yield page.evaluate(() => {
        const a = {};
        const b = {a};
        a.b = b;
        return a;
      }));
      expect(result).toBe(undefined);
    });});
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
      const result = (yield page.evaluate('1 + 2'));
      expect(result).toBe(3);
    });});
    it('should accept a string with semi colons', /* async */({page, server}) => {return (fn => {
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
      const result = (yield page.evaluate('1 + 5;'));
      expect(result).toBe(6);
    });});
    it('should accept a string with comments', /* async */({page, server}) => {return (fn => {
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
      const result = (yield page.evaluate('2 + 5;\n// do some math!'));
      expect(result).toBe(7);
    });});
    it('should accept element handle as an argument', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent('<section>42</section>'));
      const element = (yield page.$('section'));
      const text = (yield page.evaluate(e => e.textContent, element));
      expect(text).toBe('42');
    });});
    it('should throw if underlying element was disposed', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent('<section>39</section>'));
      const element = (yield page.$('section'));
      expect(element).toBeTruthy();
      (yield element.dispose());
      let error = null;
      (yield page.evaluate(e => e.textContent, element).catch(e => error = e));
      expect(error.message).toContain('JSHandle is disposed');
    });});
    it('should throw if elementHandles are from other frames', /* async */({page, server}) => {return (fn => {
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
      const bodyHandle = (yield page.frames()[1].$('body'));
      let error = null;
      (yield page.evaluate(body => body.innerHTML, bodyHandle).catch(e => error = e));
      expect(error).toBeTruthy();
      expect(error.message).toContain('JSHandles can be evaluated only in the context they were created');
    });});
    it('should accept object handle as an argument', /* async */({page, server}) => {return (fn => {
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
      const navigatorHandle = (yield page.evaluateHandle(() => navigator));
      const text = (yield page.evaluate(e => e.userAgent, navigatorHandle));
      expect(text).toContain('Mozilla');
    });});
    it('should accept object handle to primitive types', /* async */({page, server}) => {return (fn => {
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
      const aHandle = (yield page.evaluateHandle(() => 5));
      const isFive = (yield page.evaluate(e => Object.is(e, 5), aHandle));
      expect(isFive).toBeTruthy();
    });});
    it('should simulate a user gesture', /* async */({page, server}) => {return (fn => {
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
      (yield page.evaluate(playAudio));
      // also test evaluating strings
      (yield page.evaluate(`(${playAudio})()`));

      function playAudio() {
        const audio = document.createElement('audio');
        audio.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
        // This returns a promise which throws if it was not triggered by a user gesture.
        return audio.play();
      }
    });});
    it('should throw a nice error after a navigation', /* async */({page, server}) => {return (fn => {
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
      const executionContext = (yield page.mainFrame().executionContext());

      (yield Promise.all([
        page.waitForNavigation(),
        executionContext.evaluate(() => window.location.reload())
      ]));
      const error = (yield executionContext.evaluate(() => null).catch(e => e));
      expect(error.message).toContain('navigation');
    });});
  });

  describe('Page.setOfflineMode', function() {
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
      (yield page.setOfflineMode(true));
      let error = null;
      (yield page.goto(server.EMPTY_PAGE).catch(e => error = e));
      expect(error).toBeTruthy();
      (yield page.setOfflineMode(false));
      const response = (yield page.reload());
      expect(response.status()).toBe(200);
    });});
    it('should emulate navigator.onLine', /* async */({page, server}) => {return (fn => {
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
      expect((yield page.evaluate(() => window.navigator.onLine))).toBe(true);
      (yield page.setOfflineMode(true));
      expect((yield page.evaluate(() => window.navigator.onLine))).toBe(false);
      (yield page.setOfflineMode(false));
      expect((yield page.evaluate(() => window.navigator.onLine))).toBe(true);
    });});
  });

  describe('Page.evaluateHandle', function() {
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
      const windowHandle = (yield page.evaluateHandle(() => window));
      expect(windowHandle).toBeTruthy();
    });});
  });

  describe('ExecutionContext.queryObjects', function() {
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
      // Instantiate an object
      (yield page.evaluate(() => window.set = new Set(['hello', 'world'])));
      const prototypeHandle = (yield page.evaluateHandle(() => Set.prototype));
      const objectsHandle = (yield page.queryObjects(prototypeHandle));
      const count = (yield page.evaluate(objects => objects.length, objectsHandle));
      expect(count).toBe(1);
      const values = (yield page.evaluate(objects => Array.from(objects[0].values()), objectsHandle));
      expect(values).toEqual(['hello', 'world']);
    });});
    it('should fail for disposed handles', /* async */({page, server}) => {return (fn => {
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
      const prototypeHandle = (yield page.evaluateHandle(() => HTMLBodyElement.prototype));
      (yield prototypeHandle.dispose());
      let error = null;
      (yield page.queryObjects(prototypeHandle).catch(e => error = e));
      expect(error.message).toBe('Prototype JSHandle is disposed!');
    });});
    it('should fail primitive values as prototypes', /* async */({page, server}) => {return (fn => {
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
      const prototypeHandle = (yield page.evaluateHandle(() => 42));
      let error = null;
      (yield page.queryObjects(prototypeHandle).catch(e => error = e));
      expect(error.message).toBe('Prototype JSHandle must not be referencing primitive value');
    });});
  });

  describe('Page.waitFor', function() {
    it('should wait for selector', /* async */({page, server}) => {return (fn => {
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
      let found = false;
      const waitFor = page.waitFor('div').then(() => found = true);
      (yield page.goto(server.EMPTY_PAGE));
      expect(found).toBe(false);
      (yield page.goto(server.PREFIX + '/grid.html'));
      (yield waitFor);
      expect(found).toBe(true);
    });});
    it('should wait for an xpath', /* async */({page, server}) => {return (fn => {
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
      let found = false;
      const waitFor = page.waitFor('//div').then(() => found = true);
      (yield page.goto(server.EMPTY_PAGE));
      expect(found).toBe(false);
      (yield page.goto(server.PREFIX + '/grid.html'));
      (yield waitFor);
      expect(found).toBe(true);
    });});
    it('should not allow you to select an element with single slash xpath', /* async */({page, server}) => {return (fn => {
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
      let error = null;
      (yield page.waitFor('/html/body/div').catch(e => error = e));
      expect(error).toBeTruthy();
    });});
    it('should timeout', /* async */({page, server}) => {return (fn => {
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
      const startTime = Date.now();
      const timeout = 42;
      (yield page.waitFor(timeout));
      expect(Date.now() - startTime).not.toBeLessThan(timeout / 2);
    });});
    it('should wait for predicate', /* async */({page, server}) => {return (fn => {
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
      const watchdog = page.waitFor(() => window.innerWidth < 100);
      page.setViewport({width: 10, height: 10});
      (yield watchdog);
    });});
    it('should throw when unknown type', /* async */({page, server}) => {return (fn => {
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
      (yield page.waitFor({foo: 'bar'}).catch(e => error = e));
      expect(error.message).toContain('Unsupported target type');
    });});
    it('should wait for predicate with arguments', /* async */({page, server}) => {return (fn => {
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
      (yield page.waitFor((arg1, arg2) => arg1 !== arg2, {}, 1, 2));
    });});
  });

  describe('Page.Events.Console', function() {
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
      let message = null;
      page.once('console', m => message = m);
      (yield Promise.all([
        page.evaluate(() => console.log('hello', 5, {foo: 'bar'})),
        waitEvent(page, 'console')
      ]));
      expect(message.text()).toEqual('hello 5 JSHandle@object');
      expect(message.type()).toEqual('log');
      expect((yield message.args()[0].jsonValue())).toEqual('hello');
      expect((yield message.args()[1].jsonValue())).toEqual(5);
      expect((yield message.args()[2].jsonValue())).toEqual({foo: 'bar'});
    });});
    it('should work for different console API calls', /* async */({page, server}) => {return (fn => {
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
      const messages = [];
      page.on('console', msg => messages.push(msg));
      // All console events will be reported before `page.evaluate` is finished.
      (yield page.evaluate(() => {
        // A pair of time/timeEnd generates only one Console API call.
        console.time('calling console.time');
        console.timeEnd('calling console.time');
        console.trace('calling console.trace');
        console.dir('calling console.dir');
        console.warn('calling console.warn');
        console.error('calling console.error');
        console.log(Promise.resolve('should not wait until resolved!'));
      }));
      expect(messages.map(msg => msg.type())).toEqual([
        'timeEnd', 'trace', 'dir', 'warning', 'error', 'log'
      ]);
      expect(messages[0].text()).toContain('calling console.time');
      expect(messages.slice(1).map(msg => msg.text())).toEqual([
        'calling console.trace',
        'calling console.dir',
        'calling console.warn',
        'calling console.error',
        'JSHandle@promise',
      ]);
    });});
    it('should not fail for window object', /* async */({page, server}) => {return (fn => {
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
      let message = null;
      page.once('console', msg => message = msg);
      (yield Promise.all([
        page.evaluate(() => console.error(window)),
        waitEvent(page, 'console')
      ]));
      expect(message.text()).toBe('JSHandle@object');
    });});
    it('should trigger correct Log', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto('about:blank'));
      const [message] = (yield Promise.all([
        waitEvent(page, 'console'),
        page.evaluate(/* async */ url => {return (fn => {
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
})(function*(){ return fetch(url).catch(e => {}); });}, server.EMPTY_PAGE)
      ]));
      expect(message.text()).toContain('No \'Access-Control-Allow-Origin\'');
      expect(message.type()).toEqual('error');
    });});
  });

  describe('Page.Events.DOMContentLoaded', function() {
    it('should fire when expected', /* async */({page, server}) => {return (fn => {
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
      page.goto('about:blank');
      (yield waitEvent(page, 'domcontentloaded'));
    });});
  });

  describe('Page.metrics', function() {
    it('should get metrics from a page', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto('about:blank'));
      const metrics = (yield page.metrics());
      checkMetrics(metrics);
    });});
    it('metrics event fired on console.timeStamp', /* async */({page, server}) => {return (fn => {
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
      const metricsPromise = new Promise(fulfill => page.once('metrics', fulfill));
      (yield page.evaluate(() => console.timeStamp('test42')));
      const metrics = (yield metricsPromise);
      expect(metrics.title).toBe('test42');
      checkMetrics(metrics.metrics);
    });});
    function checkMetrics(metrics) {
      const metricsToCheck = new Set([
        'Timestamp',
        'Documents',
        'Frames',
        'JSEventListeners',
        'Nodes',
        'LayoutCount',
        'RecalcStyleCount',
        'LayoutDuration',
        'RecalcStyleDuration',
        'ScriptDuration',
        'TaskDuration',
        'JSHeapUsedSize',
        'JSHeapTotalSize',
      ]);
      for (const name in metrics) {
        expect(metricsToCheck.has(name)).toBeTruthy();
        expect(metrics[name]).toBeGreaterThanOrEqual(0);
        metricsToCheck.delete(name);
      }
      expect(metricsToCheck.size).toBe(0);
    }
  });

  describe('Page.goto', function() {
    it('should navigate to about:blank', /* async */({page, server}) => {return (fn => {
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
      const response = (yield page.goto('about:blank'));
      expect(response).toBe(null);
    });});
    it('should return response when page changes its URL after load', /* async */({page, server}) => {return (fn => {
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
      const response = (yield page.goto(server.PREFIX + '/historyapi.html'));
      expect(response.status()).toBe(200);
    });});
    it('should work with subframes return 204', /* async */({page, server}) => {return (fn => {
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
      server.setRoute('/frames/frame.html', (req, res) => {
        res.statusCode = 204;
        res.end();
      });
      (yield page.goto(server.PREFIX + '/frames/one-frame.html'));
    });});
    it('should fail when server returns 204', /* async */({page, server}) => {return (fn => {
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
      server.setRoute('/empty.html', (req, res) => {
        res.statusCode = 204;
        res.end();
      });
      let error = null;
      (yield page.goto(server.EMPTY_PAGE).catch(e => error = e));
      expect(error).not.toBe(null);
      expect(error.message).toContain('net::ERR_ABORTED');
    });});
    it('should navigate to empty page with domcontentloaded', /* async */({page, server}) => {return (fn => {
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
      const response = (yield page.goto(server.EMPTY_PAGE, {waitUntil: 'domcontentloaded'}));
      expect(response.status()).toBe(200);
      expect(response.securityDetails()).toBe(null);
    });});
    it('should work when page calls history API in beforeunload', /* async */({page, server}) => {return (fn => {
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
      (yield page.evaluate(() => {
        window.addEventListener('beforeunload', () => history.replaceState(null, 'initial', window.location.href), false);
      }));
      const response = (yield page.goto(server.PREFIX + '/grid.html'));
      expect(response.status()).toBe(200);
    });});
    it('should navigate to empty page with networkidle0', /* async */({page, server}) => {return (fn => {
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
      const response = (yield page.goto(server.EMPTY_PAGE, {waitUntil: 'networkidle0'}));
      expect(response.status()).toBe(200);
    });});
    it('should navigate to empty page with networkidle2', /* async */({page, server}) => {return (fn => {
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
      const response = (yield page.goto(server.EMPTY_PAGE, {waitUntil: 'networkidle2'}));
      expect(response.status()).toBe(200);
    });});
    it('should fail when navigating to bad url', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto('asdfasdf').catch(e => error = e));
      expect(error.message).toContain('Cannot navigate to invalid URL');
    });});
    it('should fail when navigating to bad SSL', /* async */({page, httpsServer}) => {return (fn => {
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
      // Make sure that network events do not emit 'undefined'.
      // @see https://crbug.com/750469
      page.on('request', request => expect(request).toBeTruthy());
      page.on('requestfinished', request => expect(request).toBeTruthy());
      page.on('requestfailed', request => expect(request).toBeTruthy());
      let error = null;
      (yield page.goto(httpsServer.EMPTY_PAGE).catch(e => error = e));
      expect(error.message).toContain('net::ERR_CERT_AUTHORITY_INVALID');
    });});
    it('should fail when navigating to bad SSL after redirects', /* async */({page, server, httpsServer}) => {return (fn => {
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
      server.setRedirect('/redirect/1.html', '/redirect/2.html');
      server.setRedirect('/redirect/2.html', '/empty.html');
      let error = null;
      (yield page.goto(httpsServer.PREFIX + '/redirect/1.html').catch(e => error = e));
      expect(error.message).toContain('net::ERR_CERT_AUTHORITY_INVALID');
    });});
    it('should throw if networkidle is passed as an option', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.EMPTY_PAGE, {waitUntil: 'networkidle'}).catch(err => error = err));
      expect(error.message).toContain('"networkidle" option is no longer supported');
    });});
    it('should fail when main resources failed to load', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto('http://localhost:44123/non-existing-url').catch(e => error = e));
      expect(error.message).toContain('net::ERR_CONNECTION_REFUSED');
    });});
    it('should fail when exceeding maximum navigation timeout', /* async */({page, server}) => {return (fn => {
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
      // Hang for request to the empty.html
      server.setRoute('/empty.html', (req, res) => { });
      let error = null;
      (yield page.goto(server.PREFIX + '/empty.html', {timeout: 1}).catch(e => error = e));
      expect(error.message).toContain('Navigation Timeout Exceeded: 1ms');
      expect(error).toBeInstanceOf(TimeoutError);
    });});
    it('should fail when exceeding default maximum navigation timeout', /* async */({page, server}) => {return (fn => {
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
      // Hang for request to the empty.html
      server.setRoute('/empty.html', (req, res) => { });
      let error = null;
      page.setDefaultNavigationTimeout(1);
      (yield page.goto(server.PREFIX + '/empty.html').catch(e => error = e));
      expect(error.message).toContain('Navigation Timeout Exceeded: 1ms');
      expect(error).toBeInstanceOf(TimeoutError);
    });});
    it('should disable timeout when its set to 0', /* async */({page, server}) => {return (fn => {
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
      let loaded = false;
      page.once('load', () => loaded = true);
      (yield page.goto(server.PREFIX + '/grid.html', {timeout: 0, waitUntil: ['load']}).catch(e => error = e));
      expect(error).toBe(null);
      expect(loaded).toBe(true);
    });});
    it('should work when navigating to valid url', /* async */({page, server}) => {return (fn => {
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
      const response = (yield page.goto(server.EMPTY_PAGE));
      expect(response.ok()).toBe(true);
    });});
    it('should work when navigating to data url', /* async */({page, server}) => {return (fn => {
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
      const response = (yield page.goto('data:text/html,hello'));
      expect(response.ok()).toBe(true);
    });});
    it('should work when navigating to 404', /* async */({page, server}) => {return (fn => {
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
      const response = (yield page.goto(server.PREFIX + '/not-found'));
      expect(response.ok()).toBe(false);
      expect(response.status()).toBe(404);
    });});
    it('should return last response in redirect chain', /* async */({page, server}) => {return (fn => {
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
      server.setRedirect('/redirect/1.html', '/redirect/2.html');
      server.setRedirect('/redirect/2.html', '/redirect/3.html');
      server.setRedirect('/redirect/3.html', server.EMPTY_PAGE);
      const response = (yield page.goto(server.PREFIX + '/redirect/1.html'));
      expect(response.ok()).toBe(true);
      expect(response.url()).toBe(server.EMPTY_PAGE);
    });});
    it('should wait for network idle to succeed navigation', /* async */({page, server}) => {return (fn => {
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
      let responses = [];
      // Hold on to a bunch of requests without answering.
      server.setRoute('/fetch-request-a.js', (req, res) => responses.push(res));
      server.setRoute('/fetch-request-b.js', (req, res) => responses.push(res));
      server.setRoute('/fetch-request-c.js', (req, res) => responses.push(res));
      server.setRoute('/fetch-request-d.js', (req, res) => responses.push(res));
      const initialFetchResourcesRequested = Promise.all([
        server.waitForRequest('/fetch-request-a.js'),
        server.waitForRequest('/fetch-request-b.js'),
        server.waitForRequest('/fetch-request-c.js'),
      ]);
      const secondFetchResourceRequested = server.waitForRequest('/fetch-request-d.js');

      // Navigate to a page which loads immediately and then does a bunch of
      // requests via javascript's fetch method.
      const navigationPromise = page.goto(server.PREFIX + '/networkidle.html', {
        waitUntil: 'networkidle0',
      });
      // Track when the navigation gets completed.
      let navigationFinished = false;
      navigationPromise.then(() => navigationFinished = true);

      // Wait for the page's 'load' event.
      (yield new Promise(fulfill => page.once('load', fulfill)));
      expect(navigationFinished).toBe(false);

      // Wait for the initial three resources to be requested.
      (yield initialFetchResourcesRequested);

      // Expect navigation still to be not finished.
      expect(navigationFinished).toBe(false);

      // Respond to initial requests.
      for (const response of responses) {
        response.statusCode = 404;
        response.end(`File not found`);
      }

      // Reset responses array
      responses = [];

      // Wait for the second round to be requested.
      (yield secondFetchResourceRequested);
      // Expect navigation still to be not finished.
      expect(navigationFinished).toBe(false);

      // Respond to requests.
      for (const response of responses) {
        response.statusCode = 404;
        response.end(`File not found`);
      }

      const response = (yield navigationPromise);
      // Expect navigation to succeed.
      expect(response.ok()).toBe(true);
    });});
    it('should not leak listeners during navigation', /* async */({page, server}) => {return (fn => {
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
      let warning = null;
      const warningHandler = w => warning = w;
      process.on('warning', warningHandler);
      for (let i = 0; i < 20; ++i)
        (yield page.goto(server.EMPTY_PAGE));
      process.removeListener('warning', warningHandler);
      expect(warning).toBe(null);
    });});
    it('should not leak listeners during bad navigation', /* async */({page, server}) => {return (fn => {
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
      let warning = null;
      const warningHandler = w => warning = w;
      process.on('warning', warningHandler);
      for (let i = 0; i < 20; ++i)
        (yield page.goto('asdf').catch(e => {/* swallow navigation error */}));
      process.removeListener('warning', warningHandler);
      expect(warning).toBe(null);
    });});
    it('should navigate to dataURL and fire dataURL requests', /* async */({page, server}) => {return (fn => {
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
      const requests = [];
      page.on('request', request => requests.push(request));
      const dataURL = 'data:text/html,<div>yo</div>';
      const response = (yield page.goto(dataURL));
      expect(response.status()).toBe(200);
      expect(requests.length).toBe(1);
      expect(requests[0].url()).toBe(dataURL);
    });});
    it('should navigate to URL with hash and fire requests without hash', /* async */({page, server}) => {return (fn => {
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
      const requests = [];
      page.on('request', request => requests.push(request));
      const response = (yield page.goto(server.EMPTY_PAGE + '#hash'));
      expect(response.status()).toBe(200);
      expect(response.url()).toBe(server.EMPTY_PAGE);
      expect(requests.length).toBe(1);
      expect(requests[0].url()).toBe(server.EMPTY_PAGE);
    });});
    it('should work with self requesting page', /* async */({page, server}) => {return (fn => {
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
      const response = (yield page.goto(server.PREFIX + '/self-request.html'));
      expect(response.status()).toBe(200);
      expect(response.url()).toContain('self-request.html');
    });});
    it('should fail when navigating and show the url at the error message', /* async */ function({page, server, httpsServer}) {return (fn => {
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
      const url = httpsServer.PREFIX + '/redirect/1.html';
      let error = null;
      try {
        (yield page.goto(url));
      } catch (e) {
        error = e;
      }
      expect(error.message).toContain(url);
    });});
    it('should send referer', /* async */({page, server}) => {return (fn => {
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
      const [request1, request2] = (yield Promise.all([
        server.waitForRequest('/grid.html'),
        server.waitForRequest('/digits/1.png'),
        page.goto(server.PREFIX + '/grid.html', {
          referer: 'http://google.com/',
        }),
      ]));
      expect(request1.headers['referer']).toBe('http://google.com/');
      // Make sure subresources do not inherit referer.
      expect(request2.headers['referer']).toBe(server.PREFIX + '/grid.html');
    });});
  });

  describe('Page.waitForNavigation', function() {
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
      const [response] = (yield Promise.all([
        page.waitForNavigation(),
        page.evaluate(url => window.location.href = url, server.PREFIX + '/grid.html')
      ]));
      expect(response.ok()).toBe(true);
      expect(response.url()).toContain('grid.html');
    });});
    it('should work with both domcontentloaded and load', /* async */({page, server}) => {return (fn => {
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
      let response = null;
      server.setRoute('/one-style.css', (req, res) => response = res);
      const navigationPromise = page.goto(server.PREFIX + '/one-style.html');
      const domContentLoadedPromise = page.waitForNavigation({
        waitUntil: 'domcontentloaded'
      });

      let bothFired = false;
      const bothFiredPromise = page.waitForNavigation({
        waitUntil: ['load', 'domcontentloaded']
      }).then(() => bothFired = true);

      (yield server.waitForRequest('/one-style.css'));
      (yield domContentLoadedPromise);
      expect(bothFired).toBe(false);
      response.end();
      (yield bothFiredPromise);
      (yield navigationPromise);
    });});
    it('should work with clicking on anchor links', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent(`<a href='#foobar'>foobar</a>`));
      const [response] = (yield Promise.all([
        page.waitForNavigation(),
        page.click('a'),
      ]));
      expect(response).toBe(null);
      expect(page.url()).toBe(server.EMPTY_PAGE + '#foobar');
    });});
    it('should work with history.pushState()', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent(`
        <a onclick='javascript:pushState()'>SPA</a>
        <script>
          function pushState() { history.pushState({}, '', 'wow.html') }
        </script>
      `));
      const [response] = (yield Promise.all([
        page.waitForNavigation(),
        page.click('a'),
      ]));
      expect(response).toBe(null);
      expect(page.url()).toBe(server.PREFIX + '/wow.html');
    });});
    it('should work with history.replaceState()', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent(`
        <a onclick='javascript:replaceState()'>SPA</a>
        <script>
          function replaceState() { history.replaceState({}, '', '/replaced.html') }
        </script>
      `));
      const [response] = (yield Promise.all([
        page.waitForNavigation(),
        page.click('a'),
      ]));
      expect(response).toBe(null);
      expect(page.url()).toBe(server.PREFIX + '/replaced.html');
    });});
    it('should work with DOM history.back()/history.forward()', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent(`
        <a id=back onclick='javascript:goBack()'>back</a>
        <a id=forward onclick='javascript:goForward()'>forward</a>
        <script>
          function goBack() { history.back(); }
          function goForward() { history.forward(); }
          history.pushState({}, '', '/first.html');
          history.pushState({}, '', '/second.html');
        </script>
      `));
      expect(page.url()).toBe(server.PREFIX + '/second.html');
      const [backResponse] = (yield Promise.all([
        page.waitForNavigation(),
        page.click('a#back'),
      ]));
      expect(backResponse).toBe(null);
      expect(page.url()).toBe(server.PREFIX + '/first.html');
      const [forwardResponse] = (yield Promise.all([
        page.waitForNavigation(),
        page.click('a#forward'),
      ]));
      expect(forwardResponse).toBe(null);
      expect(page.url()).toBe(server.PREFIX + '/second.html');
    });});
    it('should work when subframe issues window.stop()', /* async */({page, server}) => {return (fn => {
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
      server.setRoute('/frames/style.css', (req, res) => {});
      const navigationPromise = page.goto(server.PREFIX + '/frames/one-frame.html');
      const frame = (yield utils.waitEvent(page, 'frameattached'));
      (yield new Promise(fulfill => {
        page.on('framenavigated', f => {
          if (f === frame)
            fulfill();
        });
      }));
      (yield Promise.all([
        frame.evaluate(() => window.stop()),
        navigationPromise
      ]));
    });});
  });

  describe('Page.waitForRequest', function() {
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
      const [request] = (yield Promise.all([
        page.waitForRequest(server.PREFIX + '/digits/2.png'),
        page.evaluate(() => {
          fetch('/digits/1.png');
          fetch('/digits/2.png');
          fetch('/digits/3.png');
        })
      ]));
      expect(request.url()).toBe(server.PREFIX + '/digits/2.png');
    });});
    it('should work with predicate', /* async */({page, server}) => {return (fn => {
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
      const [request] = (yield Promise.all([
        page.waitForRequest(request => request.url() === server.PREFIX + '/digits/2.png'),
        page.evaluate(() => {
          fetch('/digits/1.png');
          fetch('/digits/2.png');
          fetch('/digits/3.png');
        })
      ]));
      expect(request.url()).toBe(server.PREFIX + '/digits/2.png');
    });});
    it('should work with no timeout', /* async */({page, server}) => {return (fn => {
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
      const [request] = (yield Promise.all([
        page.waitForRequest(server.PREFIX + '/digits/2.png', {timeout: 0}),
        page.evaluate(() => setTimeout(() => {
          fetch('/digits/1.png');
          fetch('/digits/2.png');
          fetch('/digits/3.png');
        }, 50))
      ]));
      expect(request.url()).toBe(server.PREFIX + '/digits/2.png');
    });});
  });

  describe('Page.waitForResponse', function() {
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
      const [response] = (yield Promise.all([
        page.waitForResponse(server.PREFIX + '/digits/2.png'),
        page.evaluate(() => {
          fetch('/digits/1.png');
          fetch('/digits/2.png');
          fetch('/digits/3.png');
        })
      ]));
      expect(response.url()).toBe(server.PREFIX + '/digits/2.png');
    });});
    it('should work with predicate', /* async */({page, server}) => {return (fn => {
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
      const [response] = (yield Promise.all([
        page.waitForResponse(response => response.url() === server.PREFIX + '/digits/2.png'),
        page.evaluate(() => {
          fetch('/digits/1.png');
          fetch('/digits/2.png');
          fetch('/digits/3.png');
        })
      ]));
      expect(response.url()).toBe(server.PREFIX + '/digits/2.png');
    });});
    it('should work with no timeout', /* async */({page, server}) => {return (fn => {
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
      const [response] = (yield Promise.all([
        page.waitForResponse(server.PREFIX + '/digits/2.png', {timeout: 0}),
        page.evaluate(() => setTimeout(() => {
          fetch('/digits/1.png');
          fetch('/digits/2.png');
          fetch('/digits/3.png');
        }, 50))
      ]));
      expect(response.url()).toBe(server.PREFIX + '/digits/2.png');
    });});
  });

  describe('Page.goBack', function() {
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
      (yield page.goto(server.PREFIX + '/grid.html'));

      let response = (yield page.goBack());
      expect(response.ok()).toBe(true);
      expect(response.url()).toContain(server.EMPTY_PAGE);

      response = (yield page.goForward());
      expect(response.ok()).toBe(true);
      expect(response.url()).toContain('/grid.html');

      response = (yield page.goForward());
      expect(response).toBe(null);
    });});
    it('should work with HistoryAPI', /* async */({page, server}) => {return (fn => {
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
      (yield page.evaluate(() => {
        history.pushState({}, '', '/first.html');
        history.pushState({}, '', '/second.html');
      }));
      expect(page.url()).toBe(server.PREFIX + '/second.html');

      (yield page.goBack());
      expect(page.url()).toBe(server.PREFIX + '/first.html');
      (yield page.goBack());
      expect(page.url()).toBe(server.EMPTY_PAGE);
      (yield page.goForward());
      expect(page.url()).toBe(server.PREFIX + '/first.html');
    });});
  });

  describe('Page.exposeFunction', function() {
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
      (yield page.exposeFunction('compute', function(a, b) {
        return a * b;
      }));
      const result = (yield page.evaluate(/* async */ function() {return (fn => {
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
        return (yield compute(9, 4));
      });}));
      expect(result).toBe(36);
    });});
    it('should be callable from-inside evaluateOnNewDocument', /* async */({page, server}) => {return (fn => {
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
      let called = false;
      (yield page.exposeFunction('woof', function() {
        called = true;
      }));
      (yield page.evaluateOnNewDocument(() => woof()));
      (yield page.reload());
      expect(called).toBe(true);
    });});
    it('should survive navigation', /* async */({page, server}) => {return (fn => {
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
      (yield page.exposeFunction('compute', function(a, b) {
        return a * b;
      }));

      (yield page.goto(server.EMPTY_PAGE));
      const result = (yield page.evaluate(/* async */ function() {return (fn => {
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
        return (yield compute(9, 4));
      });}));
      expect(result).toBe(36);
    });});
    it('should await returned promise', /* async */({page, server}) => {return (fn => {
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
      (yield page.exposeFunction('compute', function(a, b) {
        return Promise.resolve(a * b);
      }));

      const result = (yield page.evaluate(/* async */ function() {return (fn => {
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
        return (yield compute(3, 5));
      });}));
      expect(result).toBe(15);
    });});
    it('should work on frames', /* async */({page, server}) => {return (fn => {
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
      (yield page.exposeFunction('compute', function(a, b) {
        return Promise.resolve(a * b);
      }));

      (yield page.goto(server.PREFIX + '/frames/nested-frames.html'));
      const frame = page.frames()[1];
      const result = (yield frame.evaluate(/* async */ function() {return (fn => {
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
        return (yield compute(3, 5));
      });}));
      expect(result).toBe(15);
    });});
    it('should work on frames before navigation', /* async */({page, server}) => {return (fn => {
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
      (yield page.exposeFunction('compute', function(a, b) {
        return Promise.resolve(a * b);
      }));

      const frame = page.frames()[1];
      const result = (yield frame.evaluate(/* async */ function() {return (fn => {
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
        return (yield compute(3, 5));
      });}));
      expect(result).toBe(15);
    });});
  });

  describe('Page.Events.Dialog', function() {
    it('should fire', /* async */({page, server}) => {return (fn => {
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
      page.on('dialog', dialog => {
        expect(dialog.type()).toBe('alert');
        expect(dialog.defaultValue()).toBe('');
        expect(dialog.message()).toBe('yo');
        dialog.accept();
      });
      (yield page.evaluate(() => alert('yo')));
    });});
    it('should allow accepting prompts', /* async */({page, server}) => {return (fn => {
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
      page.on('dialog', dialog => {
        expect(dialog.type()).toBe('prompt');
        expect(dialog.defaultValue()).toBe('yes.');
        expect(dialog.message()).toBe('question?');
        dialog.accept('answer!');
      });
      const result = (yield page.evaluate(() => prompt('question?', 'yes.')));
      expect(result).toBe('answer!');
    });});
    it('should dismiss the prompt', /* async */({page, server}) => {return (fn => {
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
      page.on('dialog', dialog => {
        dialog.dismiss();
      });
      const result = (yield page.evaluate(() => prompt('question?')));
      expect(result).toBe(null);
    });});
  });

  describe('Page.Events.PageError', function() {
    it('should fire', /* async */({page, server}) => {return (fn => {
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
      page.once('pageerror', e => error = e);
      (yield Promise.all([
        page.goto(server.PREFIX + '/error.html'),
        waitEvent(page, 'pageerror')
      ]));
      expect(error.message).toContain('Fancy');
    });});
  });

  describe('Page.$eval', function() {
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
      (yield page.setContent('<section id="testAttribute">43543</section>'));
      const idAttribute = (yield page.$eval('section', e => e.id));
      expect(idAttribute).toBe('testAttribute');
    });});
    it('should accept arguments', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent('<section>hello</section>'));
      const text = (yield page.$eval('section', (e, suffix) => e.textContent + suffix, ' world!'));
      expect(text).toBe('hello world!');
    });});
    it('should accept ElementHandles as arguments', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent('<section>hello</section><div> world</div>'));
      const divHandle = (yield page.$('div'));
      const text = (yield page.$eval('section', (e, div) => e.textContent + div.textContent, divHandle));
      expect(text).toBe('hello world');
    });});
    it('should throw error if no element is found', /* async */({page, server}) => {return (fn => {
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
      (yield page.$eval('section', e => e.id).catch(e => error = e));
      expect(error.message).toContain('failed to find element matching selector "section"');
    });});
  });

  describe('Page.$$eval', function() {
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
      (yield page.setContent('<div>hello</div><div>beautiful</div><div>world!</div>'));
      const divsCount = (yield page.$$eval('div', divs => divs.length));
      expect(divsCount).toBe(3);
    });});
  });

  describe('Page.$', function() {
    it('should query existing element', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent('<section>test</section>'));
      const element = (yield page.$('section'));
      expect(element).toBeTruthy();
    });});
    it('should return null for non-existing element', /* async */({page, server}) => {return (fn => {
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
      const element = (yield page.$('non-existing-element'));
      expect(element).toBe(null);
    });});
  });

  describe('Page.$$', function() {
    it('should query existing elements', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent('<div>A</div><br/><div>B</div>'));
      const elements = (yield page.$$('div'));
      expect(elements.length).toBe(2);
      const promises = elements.map(element => page.evaluate(e => e.textContent, element));
      expect((yield Promise.all(promises))).toEqual(['A', 'B']);
    });});
    it('should return empty array if nothing is found', /* async */({page, server}) => {return (fn => {
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
      const elements = (yield page.$$('div'));
      expect(elements.length).toBe(0);
    });});
  });

  describe('Path.$x', function() {
    it('should query existing element', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent('<section>test</section>'));
      const elements = (yield page.$x('/html/body/section'));
      expect(elements[0]).toBeTruthy();
      expect(elements.length).toBe(1);
    });});
    it('should return empty array for non-existing element', /* async */({page, server}) => {return (fn => {
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
      const element = (yield page.$x('/html/body/non-existing-element'));
      expect(element).toEqual([]);
    });});
    it('should return multiple elements', /* async */({page, sever}) => {return (fn => {
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
      (yield page.setContent('<div></div><div></div>'));
      const elements = (yield page.$x('/html/body/div'));
      expect(elements.length).toBe(2);
    });});
  });

  describe('Page.setUserAgent', function() {
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
      expect((yield page.evaluate(() => navigator.userAgent))).toContain('Mozilla');
      page.setUserAgent('foobar');
      const [request] = (yield Promise.all([
        server.waitForRequest('/empty.html'),
        page.goto(server.EMPTY_PAGE),
      ]));
      expect(request.headers['user-agent']).toBe('foobar');
    });});
    it('should emulate device user-agent', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/mobile.html'));
      expect((yield page.evaluate(() => navigator.userAgent))).toContain('Chrome');
      (yield page.setUserAgent(iPhone.userAgent));
      expect((yield page.evaluate(() => navigator.userAgent))).toContain('Safari');
    });});
  });

  describe('Page.setContent', function() {
    const expectedOutput = '<html><head></head><body><div>hello</div></body></html>';
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
      (yield page.setContent('<div>hello</div>'));
      const result = (yield page.content());
      expect(result).toBe(expectedOutput);
    });});
    it('should work with doctype', /* async */({page, server}) => {return (fn => {
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
      const doctype = '<!DOCTYPE html>';
      (yield page.setContent(`${doctype}<div>hello</div>`));
      const result = (yield page.content());
      expect(result).toBe(`${doctype}${expectedOutput}`);
    });});
    it('should work with HTML 4 doctype', /* async */({page, server}) => {return (fn => {
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
      const doctype = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" ' +
        '"http://www.w3.org/TR/html4/strict.dtd">';
      (yield page.setContent(`${doctype}<div>hello</div>`));
      const result = (yield page.content());
      expect(result).toBe(`${doctype}${expectedOutput}`);
    });});
  });

  describe('Page.setBypassCSP', function() {
    it('should bypass CSP meta tag', /* async */({page, server}) => {return (fn => {
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
      // Make sure CSP prohibits addScriptTag.
      (yield page.goto(server.PREFIX + '/csp.html'));
      (yield page.addScriptTag({content: 'window.__injected = 42;'}).catch(e => void e));
      expect((yield page.evaluate(() => window.__injected))).toBe(undefined);

      // By-pass CSP and try one more time.
      (yield page.setBypassCSP(true));
      (yield page.reload());
      (yield page.addScriptTag({content: 'window.__injected = 42;'}));
      expect((yield page.evaluate(() => window.__injected))).toBe(42);
    });});

    it('should bypass CSP header', /* async */({page, server}) => {return (fn => {
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
      // Make sure CSP prohibits addScriptTag.
      server.setCSP('/empty.html', 'default-src "self"');
      (yield page.goto(server.EMPTY_PAGE));
      (yield page.addScriptTag({content: 'window.__injected = 42;'}).catch(e => void e));
      expect((yield page.evaluate(() => window.__injected))).toBe(undefined);

      // By-pass CSP and try one more time.
      (yield page.setBypassCSP(true));
      (yield page.reload());
      (yield page.addScriptTag({content: 'window.__injected = 42;'}));
      expect((yield page.evaluate(() => window.__injected))).toBe(42);
    });});

    it('should bypass after cross-process navigation', /* async */({page, server}) => {return (fn => {
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
      (yield page.setBypassCSP(true));
      (yield page.goto(server.PREFIX + '/csp.html'));
      (yield page.addScriptTag({content: 'window.__injected = 42;'}));
      expect((yield page.evaluate(() => window.__injected))).toBe(42);

      (yield page.goto(server.CROSS_PROCESS_PREFIX + '/csp.html'));
      (yield page.addScriptTag({content: 'window.__injected = 42;'}));
      expect((yield page.evaluate(() => window.__injected))).toBe(42);
    });});
  });

  describe('Page.addScriptTag', function() {
    it('should throw an error if no options are provided', /* async */({page, server}) => {return (fn => {
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
        (yield page.addScriptTag('/injectedfile.js'));
      } catch (e) {
        error = e;
      }
      expect(error.message).toBe('Provide an object with a `url`, `path` or `content` property');
    });});

    it('should work with a url', /* async */({page, server}) => {return (fn => {
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
      const scriptHandle = (yield page.addScriptTag({ url: '/injectedfile.js' }));
      expect(scriptHandle.asElement()).not.toBeNull();
      expect((yield page.evaluate(() => __injected))).toBe(42);
    });});

    it('should work with a url and type=module', /* async */({page, server}) => {return (fn => {
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
      (yield page.addScriptTag({ url: '/es6/es6import.js', type: 'module' }));
      expect((yield page.evaluate(() => __es6injected))).toBe(42);
    });});

    it('should work with a path and type=module', /* async */({page, server}) => {return (fn => {
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
      (yield page.addScriptTag({ path: path.join(__dirname, 'assets/es6/es6pathimport.js'), type: 'module' }));
      (yield page.waitForFunction('window.__es6injected'));
      expect((yield page.evaluate(() => __es6injected))).toBe(42);
    });});

    it('should work with a content and type=module', /* async */({page, server}) => {return (fn => {
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
      (yield page.addScriptTag({ content: `import num from '/es6/es6module.js';window.__es6injected = num;`, type: 'module' }));
      (yield page.waitForFunction('window.__es6injected'));
      expect((yield page.evaluate(() => __es6injected))).toBe(42);
    });});

    it('should throw an error if loading from url fail', /* async */({page, server}) => {return (fn => {
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
      let error = null;
      try {
        (yield page.addScriptTag({ url: '/nonexistfile.js' }));
      } catch (e) {
        error = e;
      }
      expect(error.message).toBe('Loading script from /nonexistfile.js failed');
    });});

    it('should work with a path', /* async */({page, server}) => {return (fn => {
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
      const scriptHandle = (yield page.addScriptTag({ path: path.join(__dirname, 'assets/injectedfile.js') }));
      expect(scriptHandle.asElement()).not.toBeNull();
      expect((yield page.evaluate(() => __injected))).toBe(42);
    });});

    it('should include sourcemap when path is provided', /* async */({page, server}) => {return (fn => {
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
      (yield page.addScriptTag({ path: path.join(__dirname, 'assets/injectedfile.js') }));
      const result = (yield page.evaluate(() => __injectedError.stack));
      expect(result).toContain(path.join('assets', 'injectedfile.js'));
    });});

    it('should work with content', /* async */({page, server}) => {return (fn => {
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
      const scriptHandle = (yield page.addScriptTag({ content: 'window.__injected = 35;' }));
      expect(scriptHandle.asElement()).not.toBeNull();
      expect((yield page.evaluate(() => __injected))).toBe(35);
    });});

    it('should throw when added with content to the CSP page', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/csp.html'));
      let error = null;
      (yield page.addScriptTag({ content: 'window.__injected = 35;' }).catch(e => error = e));
      expect(error).toBeTruthy();
    });});

    it('should throw when added with URL to the CSP page', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/csp.html'));
      let error = null;
      (yield page.addScriptTag({ url: server.CROSS_PROCESS_PREFIX + '/injectedfile.js' }).catch(e => error = e));
      expect(error).toBeTruthy();
    });});
  });

  describe('Page.addStyleTag', function() {
    it('should throw an error if no options are provided', /* async */({page, server}) => {return (fn => {
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
        (yield page.addStyleTag('/injectedstyle.css'));
      } catch (e) {
        error = e;
      }
      expect(error.message).toBe('Provide an object with a `url`, `path` or `content` property');
    });});

    it('should work with a url', /* async */({page, server}) => {return (fn => {
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
      const styleHandle = (yield page.addStyleTag({ url: '/injectedstyle.css' }));
      expect(styleHandle.asElement()).not.toBeNull();
      expect((yield page.evaluate(`window.getComputedStyle(document.querySelector('body')).getPropertyValue('background-color')`))).toBe('rgb(255, 0, 0)');
    });});

    it('should throw an error if loading from url fail', /* async */({page, server}) => {return (fn => {
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
      let error = null;
      try {
        (yield page.addStyleTag({ url: '/nonexistfile.js' }));
      } catch (e) {
        error = e;
      }
      expect(error.message).toBe('Loading style from /nonexistfile.js failed');
    });});

    it('should work with a path', /* async */({page, server}) => {return (fn => {
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
      const styleHandle = (yield page.addStyleTag({ path: path.join(__dirname, 'assets/injectedstyle.css') }));
      expect(styleHandle.asElement()).not.toBeNull();
      expect((yield page.evaluate(`window.getComputedStyle(document.querySelector('body')).getPropertyValue('background-color')`))).toBe('rgb(255, 0, 0)');
    });});

    it('should include sourcemap when path is provided', /* async */({page, server}) => {return (fn => {
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
      (yield page.addStyleTag({ path: path.join(__dirname, 'assets/injectedstyle.css') }));
      const styleHandle = (yield page.$('style'));
      const styleContent = (yield page.evaluate(style => style.innerHTML, styleHandle));
      expect(styleContent).toContain(path.join('assets', 'injectedstyle.css'));
    });});

    it('should work with content', /* async */({page, server}) => {return (fn => {
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
      const styleHandle = (yield page.addStyleTag({ content: 'body { background-color: green; }' }));
      expect(styleHandle.asElement()).not.toBeNull();
      expect((yield page.evaluate(`window.getComputedStyle(document.querySelector('body')).getPropertyValue('background-color')`))).toBe('rgb(0, 128, 0)');
    });});

    it('should throw when added with content to the CSP page', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/csp.html'));
      let error = null;
      (yield page.addStyleTag({ content: 'body { background-color: green; }' }).catch(e => error = e));
      expect(error).toBeTruthy();
    });});

    it('should throw when added with URL to the CSP page', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/csp.html'));
      let error = null;
      (yield page.addStyleTag({ url: server.CROSS_PROCESS_PREFIX + '/injectedstyle.css' }).catch(e => error = e));
      expect(error).toBeTruthy();
    });});
  });

  describe('Page.url', function() {
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
      expect(page.url()).toBe('about:blank');
      (yield page.goto(server.EMPTY_PAGE));
      expect(page.url()).toBe(server.EMPTY_PAGE);
    });});
  });

  describe('Page.viewport', function() {
    it('should get the proper viewport size', /* async */({page, server}) => {return (fn => {
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
      expect(page.viewport()).toEqual({width: 800, height: 600});
      (yield page.setViewport({width: 123, height: 456}));
      expect(page.viewport()).toEqual({width: 123, height: 456});
    });});
    it('should support mobile emulation', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/mobile.html'));
      expect((yield page.evaluate(() => window.innerWidth))).toBe(800);
      (yield page.setViewport(iPhone.viewport));
      expect((yield page.evaluate(() => window.innerWidth))).toBe(375);
      (yield page.setViewport({width: 400, height: 300}));
      expect((yield page.evaluate(() => window.innerWidth))).toBe(400);
    });});
    it('should support touch emulation', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/mobile.html'));
      expect((yield page.evaluate(() => 'ontouchstart' in window))).toBe(false);
      (yield page.setViewport(iPhone.viewport));
      expect((yield page.evaluate(() => 'ontouchstart' in window))).toBe(true);
      expect((yield page.evaluate(dispatchTouch))).toBe('Received touch');
      (yield page.setViewport({width: 100, height: 100}));
      expect((yield page.evaluate(() => 'ontouchstart' in window))).toBe(false);

      function dispatchTouch() {
        let fulfill;
        const promise = new Promise(x => fulfill = x);
        window.ontouchstart = function(e) {
          fulfill('Received touch');
        };
        window.dispatchEvent(new Event('touchstart'));

        fulfill('Did not receive touch');

        return promise;
      }
    });});
    it('should be detectable by Modernizr', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/detect-touch.html'));
      expect((yield page.evaluate(() => document.body.textContent.trim()))).toBe('NO');
      (yield page.setViewport(iPhone.viewport));
      (yield page.goto(server.PREFIX + '/detect-touch.html'));
      expect((yield page.evaluate(() => document.body.textContent.trim()))).toBe('YES');
    });});
    it('should detect touch when applying viewport with touches', /* async */({page, server}) => {return (fn => {
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
      (yield page.setViewport({ width: 800, height: 600, hasTouch: true }));
      (yield page.addScriptTag({url: server.PREFIX + '/modernizr.js'}));
      expect((yield page.evaluate(() => Modernizr.touchevents))).toBe(true);
    });});
    it('should support landscape emulation', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/mobile.html'));
      expect((yield page.evaluate(() => screen.orientation.type))).toBe('portrait-primary');
      (yield page.setViewport(iPhoneLandscape.viewport));
      expect((yield page.evaluate(() => screen.orientation.type))).toBe('landscape-primary');
      (yield page.setViewport({width: 100, height: 100}));
      expect((yield page.evaluate(() => screen.orientation.type))).toBe('portrait-primary');
    });});
  });

  describe('Page.emulate', function() {
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
      (yield page.goto(server.PREFIX + '/mobile.html'));
      (yield page.emulate(iPhone));
      expect((yield page.evaluate(() => window.innerWidth))).toBe(375);
      expect((yield page.evaluate(() => navigator.userAgent))).toContain('Safari');
    });});
    it('should support clicking', /* async */({page, server}) => {return (fn => {
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
      (yield page.emulate(iPhone));
      (yield page.goto(server.PREFIX + '/input/button.html'));
      const button = (yield page.$('button'));
      (yield page.evaluate(button => button.style.marginTop = '200px', button));
      (yield button.click());
      expect((yield page.evaluate(() => result))).toBe('Clicked');
    });});
  });

  describe('Page.emulateMedia', function() {
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
      expect((yield page.evaluate(() => window.matchMedia('screen').matches))).toBe(true);
      expect((yield page.evaluate(() => window.matchMedia('print').matches))).toBe(false);
      (yield page.emulateMedia('print'));
      expect((yield page.evaluate(() => window.matchMedia('screen').matches))).toBe(false);
      expect((yield page.evaluate(() => window.matchMedia('print').matches))).toBe(true);
      (yield page.emulateMedia(null));
      expect((yield page.evaluate(() => window.matchMedia('screen').matches))).toBe(true);
      expect((yield page.evaluate(() => window.matchMedia('print').matches))).toBe(false);
    });});
    it('should throw in case of bad argument', /* async */({page, server}) => {return (fn => {
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
      (yield page.emulateMedia('bad').catch(e => error = e));
      expect(error.message).toBe('Unsupported media type: bad');
    });});
  });

  describe('Page.setJavaScriptEnabled', function() {
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
      (yield page.setJavaScriptEnabled(false));
      (yield page.goto('data:text/html, <script>var something = "forbidden"</script>'));
      let error = null;
      (yield page.evaluate('something').catch(e => error = e));
      expect(error.message).toContain('something is not defined');

      (yield page.setJavaScriptEnabled(true));
      (yield page.goto('data:text/html, <script>var something = "forbidden"</script>'));
      expect((yield page.evaluate('something'))).toBe('forbidden');
    });});
  });

  describe('Page.evaluateOnNewDocument', function() {
    it('should evaluate before anything else on the page', /* async */({page, server}) => {return (fn => {
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
      (yield page.evaluateOnNewDocument(function(){
        window.injected = 123;
      }));
      (yield page.goto(server.PREFIX + '/tamperable.html'));
      expect((yield page.evaluate(() => window.result))).toBe(123);
    });});
    it('should work with CSP', /* async */({page, server}) => {return (fn => {
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
      (yield page.evaluateOnNewDocument(function(){
        window.injected = 123;
      }));
      (yield page.goto(server.PREFIX + '/empty.html'));
      expect((yield page.evaluate(() => window.injected))).toBe(123);

      // Make sure CSP works.
      (yield page.addScriptTag({content: 'window.e = 10;'}).catch(e => void e));
      expect((yield page.evaluate(() => window.e))).toBe(undefined);
    });});
  });

  describe('Page.setCacheEnabled', function() {
    it('should enable or disable the cache based on the state passed', /* async */({page, server}) => {return (fn => {
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
      const responses = new Map();
      page.on('response', r => responses.set(r.url().split('/').pop(), r));

      (yield page.goto(server.PREFIX + '/cached/one-style.html', {waitUntil: 'networkidle2'}));
      (yield page.reload({waitUntil: 'networkidle2'}));
      expect(responses.get('one-style.css').fromCache()).toBe(true);

      (yield page.setCacheEnabled(false));
      (yield page.reload({waitUntil: 'networkidle2'}));
      expect(responses.get('one-style.css').fromCache()).toBe(false);
    });});
  });

  // Printing to pdf is currently only supported in headless
  (headless ? describe : xdescribe)('Page.pdf', function() {
    it('should be able to save file', /* async */({page, server}) => {return (fn => {
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
      const outputFile = __dirname + '/assets/output.pdf';
      (yield page.pdf({path: outputFile}));
      expect(fs.readFileSync(outputFile).byteLength).toBeGreaterThan(0);
      fs.unlinkSync(outputFile);
    });});
  });

  describe('Page.title', function() {
    it('should return the page title', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/button.html'));
      expect((yield page.title())).toBe('Button test');
    });});
  });

  describe('Page.screenshot', function() {
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
      (yield page.setViewport({width: 500, height: 500}));
      (yield page.goto(server.PREFIX + '/grid.html'));
      const screenshot = (yield page.screenshot());
      expect(screenshot).toBeGolden('screenshot-sanity.png');
    });});
    it('should clip rect', /* async */({page, server}) => {return (fn => {
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
      (yield page.setViewport({width: 500, height: 500}));
      (yield page.goto(server.PREFIX + '/grid.html'));
      const screenshot = (yield page.screenshot({
        clip: {
          x: 50,
          y: 100,
          width: 150,
          height: 100
        }
      }));
      expect(screenshot).toBeGolden('screenshot-clip-rect.png');
    });});
    it('should work for offscreen clip', /* async */({page, server}) => {return (fn => {
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
      (yield page.setViewport({width: 500, height: 500}));
      (yield page.goto(server.PREFIX + '/grid.html'));
      const screenshot = (yield page.screenshot({
        clip: {
          x: 50,
          y: 600,
          width: 100,
          height: 100
        }
      }));
      expect(screenshot).toBeGolden('screenshot-offscreen-clip.png');
    });});
    it('should run in parallel', /* async */({page, server}) => {return (fn => {
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
      (yield page.setViewport({width: 500, height: 500}));
      (yield page.goto(server.PREFIX + '/grid.html'));
      const promises = [];
      for (let i = 0; i < 3; ++i) {
        promises.push(page.screenshot({
          clip: {
            x: 50 * i,
            y: 0,
            width: 50,
            height: 50
          }
        }));
      }
      const screenshots = (yield Promise.all(promises));
      expect(screenshots[1]).toBeGolden('grid-cell-1.png');
    });});
    it('should take fullPage screenshots', /* async */({page, server}) => {return (fn => {
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
      (yield page.setViewport({width: 500, height: 500}));
      (yield page.goto(server.PREFIX + '/grid.html'));
      const screenshot = (yield page.screenshot({
        fullPage: true
      }));
      expect(screenshot).toBeGolden('screenshot-grid-fullpage.png');
    });});
    it('should run in parallel in multiple pages', /* async */({page, server, context}) => {return (fn => {
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
      const N = 2;
      const pages = (yield Promise.all(Array(N).fill(0).map(/* async */() => {return (fn => {
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
        const page = (yield context.newPage());
        (yield page.goto(server.PREFIX + '/grid.html'));
        return page;
      });})));
      const promises = [];
      for (let i = 0; i < N; ++i)
        promises.push(pages[i].screenshot({ clip: { x: 50 * i, y: 0, width: 50, height: 50 } }));
      const screenshots = (yield Promise.all(promises));
      for (let i = 0; i < N; ++i)
        expect(screenshots[i]).toBeGolden(`grid-cell-${i}.png`);
      (yield Promise.all(pages.map(page => page.close())));
    });});
    it('should allow transparency', /* async */({page, server}) => {return (fn => {
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
      (yield page.setViewport({ width: 100, height: 100 }));
      (yield page.goto(server.EMPTY_PAGE));
      const screenshot = (yield page.screenshot({omitBackground: true}));
      expect(screenshot).toBeGolden('transparent.png');
    });});
    it('should render white background on jpeg file', /* async */({page, server}) => {return (fn => {
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
      (yield page.setViewport({ width: 100, height: 100 }));
      (yield page.goto(server.EMPTY_PAGE));
      const screenshot = (yield page.screenshot({omitBackground: true, type: 'jpeg'}));
      expect(screenshot).toBeGolden('white.jpg');
    });});
    it('should work with odd clip size on Retina displays', /* async */({page, server}) => {return (fn => {
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
      const screenshot = (yield page.screenshot({
        clip: {
          x: 0,
          y: 0,
          width: 11,
          height: 11,
        }
      }));
      expect(screenshot).toBeGolden('screenshot-clip-odd-size.png');
    });});
    it('should return base64', /* async */({page, server}) => {return (fn => {
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
      (yield page.setViewport({width: 500, height: 500}));
      (yield page.goto(server.PREFIX + '/grid.html'));
      const screenshot = (yield page.screenshot({
        encoding: 'base64'
      }));
      expect(Buffer.from(screenshot, 'base64')).toBeGolden('screenshot-sanity.png');
    });});
  });

  describe('Page.select', function() {
    it('should select single option', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/select.html'));
      (yield page.select('select', 'blue'));
      expect((yield page.evaluate(() => result.onInput))).toEqual(['blue']);
      expect((yield page.evaluate(() => result.onChange))).toEqual(['blue']);
    });});
    it('should select only first option', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/select.html'));
      (yield page.select('select', 'blue', 'green', 'red'));
      expect((yield page.evaluate(() => result.onInput))).toEqual(['blue']);
      expect((yield page.evaluate(() => result.onChange))).toEqual(['blue']);
    });});
    it('should select multiple options', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/select.html'));
      (yield page.evaluate(() => makeMultiple()));
      (yield page.select('select', 'blue', 'green', 'red'));
      expect((yield page.evaluate(() => result.onInput))).toEqual(['blue', 'green', 'red']);
      expect((yield page.evaluate(() => result.onChange))).toEqual(['blue', 'green', 'red']);
    });});
    it('should respect event bubbling', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/select.html'));
      (yield page.select('select', 'blue'));
      expect((yield page.evaluate(() => result.onBubblingInput))).toEqual(['blue']);
      expect((yield page.evaluate(() => result.onBubblingChange))).toEqual(['blue']);
    });});
    it('should throw when element is not a <select>', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/select.html'));
      (yield page.select('body', '').catch(e => error = e));
      expect(error.message).toContain('Element is not a <select> element.');
    });});
    it('should return [] on no matched values', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/select.html'));
      const result = (yield page.select('select','42','abc'));
      expect(result).toEqual([]);
    });});
    it('should return an array of matched values', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/select.html'));
      (yield page.evaluate(() => makeMultiple()));
      const result = (yield page.select('select','blue','black','magenta'));
      expect(result.reduce((accumulator,current) => ['blue', 'black', 'magenta'].includes(current) && accumulator, true)).toEqual(true);
    });});
    it('should return an array of one element when multiple is not set', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/select.html'));
      const result = (yield page.select('select','42','blue','black','magenta'));
      expect(result.length).toEqual(1);
    });});
    it('should return [] on no values',/* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/select.html'));
      const result = (yield page.select('select'));
      expect(result).toEqual([]);
    });});
    it('should deselect all options when passed no values for a multiple select',/* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/select.html'));
      (yield page.evaluate(() => makeMultiple()));
      (yield page.select('select','blue','black','magenta'));
      (yield page.select('select'));
      expect((yield page.$eval('select', select => Array.from(select.options).every(option => !option.selected)))).toEqual(true);
    });});
    it('should deselect all options when passed no values for a select without multiple',/* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/select.html'));
      (yield page.select('select','blue','black','magenta'));
      (yield page.select('select'));
      expect((yield page.$eval('select', select => Array.from(select.options).every(option => !option.selected)))).toEqual(true);
    });});
    it('should throw if passed in non-strings', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent('<select><option value="12"/></select>'));
      let error = null;
      try {
        (yield page.select('select', 12));
      } catch (e) {
        error = e;
      }
      expect(error.message).toContain('Values must be strings');
    });});
    // @see https://github.com/GoogleChrome/puppeteer/issues/3327
    xit('should work when re-defining top-level Event class', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/select.html'));
      (yield page.evaluate(() => window.Event = null));
      (yield page.select('select', 'blue'));
      expect((yield page.evaluate(() => result.onInput))).toEqual(['blue']);
      expect((yield page.evaluate(() => result.onChange))).toEqual(['blue']);
    });});
  });

  describe('Connection', function() {
    it('should throw nice errors', /* async */ function({page}) {return (fn => {
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
      const error = (yield theSourceOfTheProblems().catch(error => error));
      expect(error.stack).toContain('theSourceOfTheProblems');
      expect(error.message).toContain('ThisCommand.DoesNotExist');
      /* async */ function theSourceOfTheProblems() {return (fn => {
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
        (yield page._client.send('ThisCommand.DoesNotExist'));
      });}
    });});
  });

  describe('Page.Events.Close', function() {
    it('should work with window.close', /* async */ function({ page, context, server }) {return (fn => {
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
      const newPagePromise = new Promise(fulfill => context.once('targetcreated', target => fulfill(target.page())));
      (yield page.evaluate(() => window['newPage'] = window.open('about:blank')));
      const newPage = (yield newPagePromise);
      const closedPromise = new Promise(x => newPage.on('close', x));
      (yield page.evaluate(() => window['newPage'].close()));
      (yield closedPromise);
    });});
    it('should work with page.close', /* async */ function({ page, context, server }) {return (fn => {
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
      const newPage = (yield context.newPage());
      const closedPromise = new Promise(x => newPage.on('close', x));
      (yield newPage.close());
      (yield closedPromise);
    });});
  });

  describe('Page.browser', function() {
    it('should return the correct browser instance', /* async */ function({ page, browser }) {return (fn => {
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
      expect(page.browser()).toBe(browser);
    });});
  });
};

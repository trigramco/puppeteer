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

const {waitEvent} = require('./utils');

module.exports.addTests = function({testRunner, expect}) {
  const {describe, xdescribe, fdescribe} = testRunner;
  const {it, fit, xit} = testRunner;
  const {beforeAll, beforeEach, afterAll, afterEach} = testRunner;

  describe('Target.createCDPSession', function() {
    it('should work', /* async */ function({page, server}) {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
      const client = (yield page.target().createCDPSession());

      (yield Promise.all([
        client.send('Runtime.enable'),
        client.send('Runtime.evaluate', { expression: 'window.foo = "bar"' })
      ]));
      const foo = (yield page.evaluate(() => window.foo));
      expect(foo).toBe('bar');
    });});
    it('should send events', /* async */ function({page, server}) {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
      const client = (yield page.target().createCDPSession());
      (yield client.send('Network.enable'));
      const events = [];
      client.on('Network.requestWillBeSent', event => events.push(event));
      (yield page.goto(server.EMPTY_PAGE));
      expect(events.length).toBe(1);
    });});
    it('should enable and disable domains independently', /* async */ function({page, server}) {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
      const client = (yield page.target().createCDPSession());
      (yield client.send('Runtime.enable'));
      (yield client.send('Debugger.enable'));
      // JS coverage enables and then disables Debugger domain.
      (yield page.coverage.startJSCoverage());
      (yield page.coverage.stopJSCoverage());
      // generate a script in page and wait for the event.
      const [event] = (yield Promise.all([
        waitEvent(client, 'Debugger.scriptParsed'),
        page.evaluate('//# sourceURL=foo.js')
      ]));
      // expect events to be dispatched.
      expect(event.url).toBe('foo.js');
    });});
    it('should be able to detach session', /* async */ function({page, server}) {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
      const client = (yield page.target().createCDPSession());
      (yield client.send('Runtime.enable'));
      const evalResponse = (yield client.send('Runtime.evaluate', {expression: '1 + 2', returnByValue: true}));
      expect(evalResponse.result.value).toBe(3);
      (yield client.detach());
      let error = null;
      try {
        (yield client.send('Runtime.evaluate', {expression: '3 + 1', returnByValue: true}));
      } catch (e) {
        error = e;
      }
      expect(error.message).toContain('Session closed.');
    });});
  });
};

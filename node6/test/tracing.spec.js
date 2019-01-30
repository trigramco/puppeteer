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

module.exports.addTests = function({testRunner, expect}) {
  const {describe, xdescribe, fdescribe} = testRunner;
  const {it, fit, xit} = testRunner;
  const {beforeAll, beforeEach, afterAll, afterEach} = testRunner;

  describe('Tracing', function() {
    beforeEach(function(state) {
      state.outputFile = path.join(__dirname, 'assets', `trace-${state.parallelIndex}.json`);
    });
    afterEach(function(state) {
      if (fs.existsSync(state.outputFile)) {
        fs.unlinkSync(state.outputFile);
        state.outputFile = null;
      }
    });
    it('should output a trace', /* async */({page, server, outputFile}) => {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
      (yield page.tracing.start({screenshots: true, path: outputFile}));
      (yield page.goto(server.PREFIX + '/grid.html'));
      (yield page.tracing.stop());
      expect(fs.existsSync(outputFile)).toBe(true);
    });});
    it('should run with custom categories if provided', /* async */({page, outputFile}) => {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
      (yield page.tracing.start({path: outputFile, categories: ['disabled-by-default-v8.cpu_profiler.hires']}));
      (yield page.tracing.stop());

      const traceJson = JSON.parse(fs.readFileSync(outputFile));
      expect(traceJson.metadata['trace-config']).toContain('disabled-by-default-v8.cpu_profiler.hires');
    });});
    it('should throw if tracing on two pages', /* async */({page, server, browser, outputFile}) => {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
      (yield page.tracing.start({path: outputFile}));
      const newPage = (yield browser.newPage());
      let error = null;
      (yield newPage.tracing.start({path: outputFile}).catch(e => error = e));
      (yield newPage.close());
      expect(error).toBeTruthy();
      (yield page.tracing.stop());
    });});
    it('should return a buffer', /* async */({page, server, outputFile}) => {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
      (yield page.tracing.start({screenshots: true, path: outputFile}));
      (yield page.goto(server.PREFIX + '/grid.html'));
      const trace = (yield page.tracing.stop());
      const buf = fs.readFileSync(outputFile);
      expect(trace.toString()).toEqual(buf.toString());
    });});
    it('should return null in case of Buffer error', /* async */({page, server}) => {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
      (yield page.tracing.start({screenshots: true}));
      (yield page.goto(server.PREFIX + '/grid.html'));
      const oldBufferConcat = Buffer.concat;
      Buffer.concat = bufs => {
        throw 'error';
      };
      const trace = (yield page.tracing.stop());
      expect(trace).toEqual(null);
      Buffer.concat = oldBufferConcat;
    });});
    it('should support a buffer without a path', /* async */({page, server}) => {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
      (yield page.tracing.start({screenshots: true}));
      (yield page.goto(server.PREFIX + '/grid.html'));
      const trace = (yield page.tracing.stop());
      expect(trace.toString()).toContain('screenshot');
    });});
  });
};

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
const PROJECT_ROOT = fs.existsSync(path.join(__dirname, '..', 'package.json')) ? path.join(__dirname, '..') : path.join(__dirname, '..', '..');

const utils = module.exports = {
  /**
   * @return {string}
   */
  projectRoot: function() {
    return PROJECT_ROOT;
  },

  /**
   * @return {*}
   */
  requireRoot: function(name) {
    return require(path.join(PROJECT_ROOT, name));
  },

  /**
   * @param {!Page} page
   * @param {string} frameId
   * @param {string} url
   * @return {!Puppeteer.Frame}
   */
  attachFrame: /* async */ function(page, frameId, url) {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
    const handle = (yield page.evaluateHandle(attachFrame, frameId, url));
    return (yield handle.asElement().contentFrame());

    /* async */ function attachFrame(frameId, url) {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
      const frame = document.createElement('iframe');
      frame.src = url;
      frame.id = frameId;
      document.body.appendChild(frame);
      (yield new Promise(x => frame.onload = x));
      return frame;
    });}
  });},

  /**
   * @param {!Page} page
   * @param {string} frameId
   */
  detachFrame: /* async */ function(page, frameId) {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
    (yield page.evaluate(detachFrame, frameId));

    function detachFrame(frameId) {
      const frame = document.getElementById(frameId);
      frame.remove();
    }
  });},

  /**
   * @param {!Page} page
   * @param {string} frameId
   * @param {string} url
   */
  navigateFrame: /* async */ function(page, frameId, url) {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
    (yield page.evaluate(navigateFrame, frameId, url));

    function navigateFrame(frameId, url) {
      const frame = document.getElementById(frameId);
      frame.src = url;
      return new Promise(x => frame.onload = x);
    }
  });},

  /**
   * @param {!Frame} frame
   * @param {string=} indentation
   * @return {string}
   */
  dumpFrames: function(frame, indentation) {
    indentation = indentation || '';
    let result = indentation + frame.url().replace(/:\d{4}\//, ':<PORT>/');
    for (const child of frame.childFrames())
      result += '\n' + utils.dumpFrames(child, '    ' + indentation);
    return result;
  },

  /**
   * @param {!EventEmitter} emitter
   * @param {string} eventName
   * @return {!Promise<!Object>}
   */
  waitEvent: function(emitter, eventName, predicate = () => true) {
    return new Promise(fulfill => {
      emitter.on(eventName, function listener(event) {
        if (!predicate(event))
          return;
        emitter.removeListener(eventName, listener);
        fulfill(event);
      });
    });
  },
};

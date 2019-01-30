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

const path = require('path');
const fs = require('fs');

const readFileAsync = promisify(fs.readFile);
const readdirAsync = promisify(fs.readdir);
const writeFileAsync = promisify(fs.writeFile);

const PROJECT_DIR = path.join(__dirname, '..', '..');

class Source {
  /**
   * @param {string} filePath
   * @param {string} text
   */
  constructor(filePath, text) {
    this._filePath = filePath;
    this._projectPath = path.relative(PROJECT_DIR, filePath);
    this._name = path.basename(filePath);
    this._text = text;
    this._hasUpdatedText = false;
  }

  /**
   * @return {string}
   */
  filePath() {
    return this._filePath;
  }

  /**
   * @return {string}
   */
  projectPath() {
    return this._projectPath;
  }

  /**
   * @return {string}
   */
  name() {
    return this._name;
  }

  /**
   * @param {string} text
   * @return {boolean}
   */
  setText(text) {
    if (text === this._text)
      return false;
    this._hasUpdatedText = true;
    this._text = text;
    return true;
  }

  /**
   * @return {string}
   */
  text() {
    return this._text;
  }

  /**
   * @return {boolean}
   */
  hasUpdatedText() {
    return this._hasUpdatedText;
  }

  /* async */ save() {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
    (yield writeFileAsync(this.filePath(), this.text()));
  });}

  /**
   * @param {string} filePath
   * @return {!Promise<Source>}
   */
  static /* async */ readFile(filePath) {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
    filePath = path.resolve(filePath);
    const text = (yield readFileAsync(filePath, {encoding: 'utf8'}));
    return new Source(filePath, text);
  });}

  /**
   * @param {string} dirPath
   * @param {string=} extension
   * @return {!Promise<!Array<!Source>>}
   */
  static /* async */ readdir(dirPath, extension = '') {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
    const fileNames = (yield readdirAsync(dirPath));
    const filePaths = fileNames.filter(fileName => fileName.endsWith(extension)).map(fileName => path.join(dirPath, fileName));
    return Promise.all(filePaths.map(filePath => Source.readFile(filePath)));
  });}
}
module.exports = Source;

/**
 * @param {function(?)} nodeFunction
 * @return {function(?):!Promise<?>}
 */
function promisify(nodeFunction) {
  /**
   * @param {!Array<?>} options
   * @return {!Promise<?>}
   */
  return function(...options) {
    return new Promise(function(fulfill, reject) {
      options.push(callback);
      nodeFunction.call(null, ...options);
      function callback(err, result) {
        if (err)
          reject(err);
        else
          fulfill(result);
      }
    });
  };
}


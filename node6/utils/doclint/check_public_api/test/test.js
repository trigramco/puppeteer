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
const puppeteer = require('../../../..');
const checkPublicAPI = require('..');
const Source = require('../../Source');
const mdBuilder = require('../MDBuilder');
const jsBuilder = require('../JSBuilder');
const GoldenUtils = require('../../../../test/golden-utils');

const {TestRunner, Reporter, Matchers}  = require('../../../testrunner/');
const runner = new TestRunner();
const reporter = new Reporter(runner);

const {describe, xdescribe, fdescribe} = runner;
const {it, fit, xit} = runner;
const {beforeAll, beforeEach, afterAll, afterEach} = runner;

let browser;
let page;

beforeAll(/* async */ function() {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
  browser = (yield puppeteer.launch({args: ['--no-sandbox']}));
  page = (yield browser.newPage());
});});

afterAll(/* async */ function() {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
  (yield browser.close());
});});

describe('checkPublicAPI', function() {
  it('diff-classes', testLint);
  it('diff-methods', testLint);
  it('diff-properties', testLint);
  it('diff-arguments', testLint);
  it('diff-events', testLint);
  it('check-duplicates', testLint);
  it('check-sorting', testLint);
  it('check-returns', testLint);
  it('js-builder-common', testJSBuilder);
  it('js-builder-inheritance', testJSBuilder);
  it('md-builder-common', testMDBuilder);
});

runner.run();

/* async */ function testLint(state, test) {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
  const dirPath = path.join(__dirname, test.name);
  const {expect} = new Matchers({
    toBeGolden: GoldenUtils.compare.bind(null, dirPath, dirPath)
  });

  const mdSources = (yield Source.readdir(dirPath, '.md'));
  const jsSources = (yield Source.readdir(dirPath, '.js'));
  const messages = (yield checkPublicAPI(page, mdSources, jsSources));
  const errors = messages.map(message => message.text);
  expect(errors.join('\n')).toBeGolden('result.txt');
});}

/* async */ function testMDBuilder(state, test) {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
  const dirPath = path.join(__dirname, test.name);
  const {expect} = new Matchers({
    toBeGolden: GoldenUtils.compare.bind(null, dirPath, dirPath)
  });
  const sources = (yield Source.readdir(dirPath, '.md'));
  const {documentation} = (yield mdBuilder(page, sources));
  expect(serialize(documentation)).toBeGolden('result.txt');
});}

/* async */ function testJSBuilder(state, test) {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
  const dirPath = path.join(__dirname, test.name);
  const {expect} = new Matchers({
    toBeGolden: GoldenUtils.compare.bind(null, dirPath, dirPath)
  });
  const sources = (yield Source.readdir(dirPath, '.js'));
  const {documentation} = (yield jsBuilder(sources));
  expect(serialize(documentation)).toBeGolden('result.txt');
});}

function serialize(doc) {
  const result = {classes: []};
  for (let cls of doc.classesArray) {
    const classJSON = {
      name: cls.name,
      members: []
    };
    result.classes.push(classJSON);
    for (let member of cls.membersArray) {
      classJSON.members.push({
        name: member.name,
        type: member.type,
        hasReturn: member.hasReturn,
        async: member.async,
        args: member.argsArray.map(arg => arg.name)
      });
    }
  }
  return JSON.stringify(result, null, 2);
}



module.exports.addTests = function({testRunner, expect}) {
  const {describe, xdescribe, fdescribe} = testRunner;
  const {it, fit, xit} = testRunner;
  const {beforeAll, beforeEach, afterAll, afterEach} = testRunner;

  describe('Workers', function() {
    it('Page.workers', /* async */ function({page, server}) {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
      (yield Promise.all([
        new Promise(x => page.once('workercreated', x)),
        page.goto(server.PREFIX + '/worker/worker.html')]));
      const worker = page.workers()[0];
      expect(worker.url()).toContain('worker.js');

      expect((yield worker.evaluate(() => self.workerFunction()))).toBe('worker function result');

      (yield page.goto(server.EMPTY_PAGE));
      expect(page.workers()).toEqual([]);
    });});
    it('should emit created and destroyed events', /* async */ function({page}) {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
      const workerCreatedPromise = new Promise(x => page.once('workercreated', x));
      const workerObj = (yield page.evaluateHandle(() => new Worker('data:text/javascript,1')));
      const worker = (yield workerCreatedPromise);
      const workerThisObj = (yield worker.evaluateHandle(() => this));
      const workerDestroyedPromise = new Promise(x => page.once('workerdestroyed', x));
      (yield page.evaluate(workerObj => workerObj.terminate(), workerObj));
      expect((yield workerDestroyedPromise)).toBe(worker);
      const error = (yield workerThisObj.getProperty('self').catch(error => error));
      expect(error.message).toContain('Most likely the worker has been closed.');
    });});
    it('should report console logs', /* async */ function({page}) {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
      const logPromise = new Promise(x => page.on('console', x));
      (yield page.evaluate(() => new Worker(`data:text/javascript,console.log(1)`)));
      const log = (yield logPromise);
      expect(log.text()).toBe('1');
    });});
    it('should have JSHandles for console logs', /* async */ function({page}) {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
      const logPromise = new Promise(x => page.on('console', x));
      (yield page.evaluate(() => new Worker(`data:text/javascript,console.log(1,2,3,this)`)));
      const log = (yield logPromise);
      expect(log.text()).toBe('1 2 3 JSHandle@object');
      expect(log.args().length).toBe(4);
      expect((yield ((yield log.args()[3].getProperty('origin'))).jsonValue())).toBe('null');
    });});
    it('should have an execution context', /* async */ function({page}) {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
      const workerCreatedPromise = new Promise(x => page.once('workercreated', x));
      (yield page.evaluate(() => new Worker(`data:text/javascript,console.log(1)`)));
      const worker = (yield workerCreatedPromise);
      expect((yield ((yield worker.executionContext())).evaluate('1+1'))).toBe(2);
    });});
    it('should report errors', /* async */ function({page}) {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
      const errorPromise = new Promise(x => page.on('pageerror', x));
      (yield page.evaluate(() => new Worker(`data:text/javascript, throw new Error('this is my error');`)));
      const errorLog = (yield errorPromise);
      expect(errorLog.message).toContain('this is my error');
    });});
  });
};
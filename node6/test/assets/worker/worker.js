console.log('hello from the worker');

function workerFunction() {
  return 'worker function result';
}

self.addEventListener('message', event => {
  console.log('got this data: ' + event.data);
});

(/* async */ function() {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
  while (true) {
    self.postMessage(workerFunction.toString());
    (yield new Promise(x => setTimeout(x, 100)));
  }
});})();
(/* async */() => {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
  const [, , puppeteerRoot, options, emptyPage, dumpioTextToLog] = process.argv;
  const browser = (yield require(puppeteerRoot).launch(JSON.parse(options)));
  const page = (yield browser.newPage());
  (yield page.goto(emptyPage));
  (yield page.evaluate(_dumpioTextToLog => console.log(_dumpioTextToLog), dumpioTextToLog));
  (yield page.close());
  (yield browser.close());
});})();

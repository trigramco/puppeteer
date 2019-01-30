class Foo {
  return42() {
    return 42;
  }

  returnNothing() {
    let e = () => {
      return 10;
    }
    e();
  }

  www() {
    if (1 === 1)
      return 'df';
  }

  /* async */ asyncFunction() {return (fn => {
  const gen = fn.call(this);
  return new Promise((resolve, reject) => {
    function step(key, arg) {
      let info, value;
      try {
        info = gen[key](arg);
        value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        return Promise.resolve(value).then(
            value => {
              step('next', value);
            },
            err => {
              step('throw', err);
            });
      }
    }
    return step('next');
  });
})(function*(){
  });}
}

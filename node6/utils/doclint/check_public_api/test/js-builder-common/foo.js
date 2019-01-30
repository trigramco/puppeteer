class A {
  constructor(delegate) {
    this.property1 = 1;
    this._property2 = 2;
  }

  get getter() {
    return null;
  }

  /* async */ method(foo, bar) {return (fn => {
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

A.Events = {
  AnEvent: 'anevent'
};

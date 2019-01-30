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
const utils = require('./utils');
const DeviceDescriptors = utils.requireRoot('DeviceDescriptors');
const iPhone = DeviceDescriptors['iPhone 6'];

module.exports.addTests = function({testRunner, expect}) {
  const {describe, xdescribe, fdescribe} = testRunner;
  const {it, fit, xit} = testRunner;
  const {beforeAll, beforeEach, afterAll, afterEach} = testRunner;
  describe('input', function() {
    it('should click the button', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/button.html'));
      (yield page.click('button'));
      expect((yield page.evaluate(() => result))).toBe('Clicked');
    });});
    it('should click with disabled javascript', /* async */({page, server}) => {return (fn => {
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
      (yield page.setJavaScriptEnabled(false));
      (yield page.goto(server.PREFIX + '/wrappedlink.html'));
      (yield Promise.all([
        page.click('a'),
        page.waitForNavigation()
      ]));
      expect(page.url()).toBe(server.PREFIX + '/wrappedlink.html#clicked');
    });});

    it('should click offscreen buttons', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/offscreenbuttons.html'));
      const messages = [];
      page.on('console', msg => messages.push(msg.text()));
      for (let i = 0; i < 11; ++i) {
        // We might've scrolled to click a button - reset to (0, 0).
        (yield page.evaluate(() => window.scrollTo(0, 0)));
        (yield page.click(`#btn${i}`));
      }
      expect(messages).toEqual([
        'button #0 clicked',
        'button #1 clicked',
        'button #2 clicked',
        'button #3 clicked',
        'button #4 clicked',
        'button #5 clicked',
        'button #6 clicked',
        'button #7 clicked',
        'button #8 clicked',
        'button #9 clicked',
        'button #10 clicked'
      ]);
    });});

    it('should click wrapped links', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/wrappedlink.html'));
      (yield Promise.all([
        page.click('a'),
        page.waitForNavigation()
      ]));
      expect(page.url()).toBe(server.PREFIX + '/wrappedlink.html#clicked');
    });});

    it('should click on checkbox input and toggle', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/checkbox.html'));
      expect((yield page.evaluate(() => result.check))).toBe(null);
      (yield page.click('input#agree'));
      expect((yield page.evaluate(() => result.check))).toBe(true);
      expect((yield page.evaluate(() => result.events))).toEqual([
        'mouseover',
        'mouseenter',
        'mousemove',
        'mousedown',
        'mouseup',
        'click',
        'input',
        'change',
      ]);
      (yield page.click('input#agree'));
      expect((yield page.evaluate(() => result.check))).toBe(false);
    });});

    it('should click on checkbox label and toggle', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/checkbox.html'));
      expect((yield page.evaluate(() => result.check))).toBe(null);
      (yield page.click('label[for="agree"]'));
      expect((yield page.evaluate(() => result.check))).toBe(true);
      expect((yield page.evaluate(() => result.events))).toEqual([
        'click',
        'input',
        'change',
      ]);
      (yield page.click('label[for="agree"]'));
      expect((yield page.evaluate(() => result.check))).toBe(false);
    });});

    it('should fail to click a missing button', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/button.html'));
      let error = null;
      (yield page.click('button.does-not-exist').catch(e => error = e));
      expect(error.message).toBe('No node found for selector: button.does-not-exist');
    });});
    // @see https://github.com/GoogleChrome/puppeteer/issues/161
    it('should not hang with touch-enabled viewports', /* async */({page, server}) => {return (fn => {
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
      (yield page.setViewport(iPhone.viewport));
      (yield page.mouse.down());
      (yield page.mouse.move(100, 10));
      (yield page.mouse.up());
    });});
    it('should type into the textarea', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/textarea.html'));

      const textarea = (yield page.$('textarea'));
      (yield textarea.type('Type in this text!'));
      expect((yield page.evaluate(() => result))).toBe('Type in this text!');
    });});
    it('should click the button after navigation ', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/button.html'));
      (yield page.click('button'));
      (yield page.goto(server.PREFIX + '/input/button.html'));
      (yield page.click('button'));
      expect((yield page.evaluate(() => result))).toBe('Clicked');
    });});
    it('should upload the file', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/fileupload.html'));
      const filePath = path.relative(process.cwd(), __dirname + '/assets/file-to-upload.txt');
      const input = (yield page.$('input'));
      (yield input.uploadFile(filePath));
      expect((yield page.evaluate(e => e.files[0].name, input))).toBe('file-to-upload.txt');
      expect((yield page.evaluate(e => {
        const reader = new FileReader();
        const promise = new Promise(fulfill => reader.onload = fulfill);
        reader.readAsText(e.files[0]);
        return promise.then(() => reader.result);
      }, input))).toBe('contents of the file');
    });});
    it('should move with the arrow keys', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/textarea.html'));
      (yield page.type('textarea', 'Hello World!'));
      expect((yield page.evaluate(() => document.querySelector('textarea').value))).toBe('Hello World!');
      for (let i = 0; i < 'World!'.length; i++)
        page.keyboard.press('ArrowLeft');
      (yield page.keyboard.type('inserted '));
      expect((yield page.evaluate(() => document.querySelector('textarea').value))).toBe('Hello inserted World!');
      page.keyboard.down('Shift');
      for (let i = 0; i < 'inserted '.length; i++)
        page.keyboard.press('ArrowLeft');
      page.keyboard.up('Shift');
      (yield page.keyboard.press('Backspace'));
      expect((yield page.evaluate(() => document.querySelector('textarea').value))).toBe('Hello World!');
    });});
    it('should send a character with ElementHandle.press', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/textarea.html'));
      const textarea = (yield page.$('textarea'));
      (yield textarea.press('a', {text: 'f'}));
      expect((yield page.evaluate(() => document.querySelector('textarea').value))).toBe('f');

      (yield page.evaluate(() => window.addEventListener('keydown', e => e.preventDefault(), true)));

      (yield textarea.press('a', {text: 'y'}));
      expect((yield page.evaluate(() => document.querySelector('textarea').value))).toBe('f');
    });});
    it('should send a character with sendCharacter', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/textarea.html'));
      (yield page.focus('textarea'));
      (yield page.keyboard.sendCharacter('嗨'));
      expect((yield page.evaluate(() => document.querySelector('textarea').value))).toBe('嗨');
      (yield page.evaluate(() => window.addEventListener('keydown', e => e.preventDefault(), true)));
      (yield page.keyboard.sendCharacter('a'));
      expect((yield page.evaluate(() => document.querySelector('textarea').value))).toBe('嗨a');
    });});
    it('should report shiftKey', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/keyboard.html'));
      const keyboard = page.keyboard;
      const codeForKey = {'Shift': 16, 'Alt': 18, 'Meta': 91, 'Control': 17};
      for (const modifierKey in codeForKey) {
        (yield keyboard.down(modifierKey));
        expect((yield page.evaluate(() => getResult()))).toBe('Keydown: ' + modifierKey + ' ' + modifierKey + 'Left ' + codeForKey[modifierKey] + ' [' + modifierKey + ']');
        (yield keyboard.down('!'));
        // Shift+! will generate a keypress
        if (modifierKey === 'Shift')
          expect((yield page.evaluate(() => getResult()))).toBe('Keydown: ! Digit1 49 [' + modifierKey + ']\nKeypress: ! Digit1 33 33 33 [' + modifierKey + ']');
        else
          expect((yield page.evaluate(() => getResult()))).toBe('Keydown: ! Digit1 49 [' + modifierKey + ']');

        (yield keyboard.up('!'));
        expect((yield page.evaluate(() => getResult()))).toBe('Keyup: ! Digit1 49 [' + modifierKey + ']');
        (yield keyboard.up(modifierKey));
        expect((yield page.evaluate(() => getResult()))).toBe('Keyup: ' + modifierKey + ' ' + modifierKey + 'Left ' + codeForKey[modifierKey] + ' []');
      }
    });});
    it('should report multiple modifiers', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/keyboard.html'));
      const keyboard = page.keyboard;
      (yield keyboard.down('Control'));
      expect((yield page.evaluate(() => getResult()))).toBe('Keydown: Control ControlLeft 17 [Control]');
      (yield keyboard.down('Meta'));
      expect((yield page.evaluate(() => getResult()))).toBe('Keydown: Meta MetaLeft 91 [Control Meta]');
      (yield keyboard.down(';'));
      expect((yield page.evaluate(() => getResult()))).toBe('Keydown: ; Semicolon 186 [Control Meta]');
      (yield keyboard.up(';'));
      expect((yield page.evaluate(() => getResult()))).toBe('Keyup: ; Semicolon 186 [Control Meta]');
      (yield keyboard.up('Control'));
      expect((yield page.evaluate(() => getResult()))).toBe('Keyup: Control ControlLeft 17 [Meta]');
      (yield keyboard.up('Meta'));
      expect((yield page.evaluate(() => getResult()))).toBe('Keyup: Meta MetaLeft 91 []');
    });});
    it('should send proper codes while typing', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/keyboard.html'));
      (yield page.keyboard.type('!'));
      expect((yield page.evaluate(() => getResult()))).toBe(
          [ 'Keydown: ! Digit1 49 []',
            'Keypress: ! Digit1 33 33 33 []',
            'Keyup: ! Digit1 49 []'].join('\n'));
      (yield page.keyboard.type('^'));
      expect((yield page.evaluate(() => getResult()))).toBe(
          [ 'Keydown: ^ Digit6 54 []',
            'Keypress: ^ Digit6 94 94 94 []',
            'Keyup: ^ Digit6 54 []'].join('\n'));
    });});
    it('should send proper codes while typing with shift', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/keyboard.html'));
      const keyboard = page.keyboard;
      (yield keyboard.down('Shift'));
      (yield page.keyboard.type('~'));
      expect((yield page.evaluate(() => getResult()))).toBe(
          [ 'Keydown: Shift ShiftLeft 16 [Shift]',
            'Keydown: ~ Backquote 192 [Shift]', // 192 is ` keyCode
            'Keypress: ~ Backquote 126 126 126 [Shift]', // 126 is ~ charCode
            'Keyup: ~ Backquote 192 [Shift]'].join('\n'));
      (yield keyboard.up('Shift'));
    });});
    it('should not type canceled events', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/textarea.html'));
      (yield page.focus('textarea'));
      (yield page.evaluate(() => {
        window.addEventListener('keydown', event => {
          event.stopPropagation();
          event.stopImmediatePropagation();
          if (event.key === 'l')
            event.preventDefault();
          if (event.key === 'o')
            Promise.resolve().then(() => event.preventDefault());
        }, false);
      }));
      (yield page.keyboard.type('Hello World!'));
      expect((yield page.evaluate(() => textarea.value))).toBe('He Wrd!');
    });});
    it('keyboard.modifiers()', /* async */({page, server}) => {return (fn => {
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
      const keyboard = page.keyboard;
      expect(keyboard._modifiers).toBe(0);
      (yield keyboard.down('Shift'));
      expect(keyboard._modifiers).toBe(8);
      (yield keyboard.down('Alt'));
      expect(keyboard._modifiers).toBe(9);
      (yield keyboard.up('Shift'));
      (yield keyboard.up('Alt'));
      expect(keyboard._modifiers).toBe(0);
    });});
    it('should resize the textarea', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/textarea.html'));
      const {x, y, width, height} = (yield page.evaluate(dimensions));
      const mouse = page.mouse;
      (yield mouse.move(x + width - 4, y + height - 4));
      (yield mouse.down());
      (yield mouse.move(x + width + 100, y + height + 100));
      (yield mouse.up());
      const newDimensions = (yield page.evaluate(dimensions));
      expect(newDimensions.width).toBe(width + 104);
      expect(newDimensions.height).toBe(height + 104);
    });});
    it('should scroll and click the button', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/scrollable.html'));
      (yield page.click('#button-5'));
      expect((yield page.evaluate(() => document.querySelector('#button-5').textContent))).toBe('clicked');
      (yield page.click('#button-80'));
      expect((yield page.evaluate(() => document.querySelector('#button-80').textContent))).toBe('clicked');
    });});
    it('should double click the button', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/button.html'));
      (yield page.evaluate(() => {
        window.double = false;
        const button = document.querySelector('button');
        button.addEventListener('dblclick', event => {
          window.double = true;
        });
      }));
      const button = (yield page.$('button'));
      (yield button.click({ clickCount: 2 }));
      expect((yield page.evaluate('double'))).toBe(true);
      expect((yield page.evaluate('result'))).toBe('Clicked');
    });});
    it('should click a partially obscured button', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/button.html'));
      (yield page.evaluate(() => {
        const button = document.querySelector('button');
        button.textContent = 'Some really long text that will go offscreen';
        button.style.position = 'absolute';
        button.style.left = '368px';
      }));
      (yield page.click('button'));
      expect((yield page.evaluate(() => window.result))).toBe('Clicked');
    });});
    it('should click a rotated button', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/rotatedButton.html'));
      (yield page.click('button'));
      expect((yield page.evaluate(() => result))).toBe('Clicked');
    });});
    it('should select the text with mouse', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/textarea.html'));
      (yield page.focus('textarea'));
      const text = 'This is the text that we are going to try to select. Let\'s see how it goes.';
      (yield page.keyboard.type(text));
      (yield page.evaluate(() => document.querySelector('textarea').scrollTop = 0));
      const {x, y} = (yield page.evaluate(dimensions));
      (yield page.mouse.move(x + 2,y + 2));
      (yield page.mouse.down());
      (yield page.mouse.move(100,100));
      (yield page.mouse.up());
      expect((yield page.evaluate(() => window.getSelection().toString()))).toBe(text);
    });});
    it('should select the text by triple clicking', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/textarea.html'));
      (yield page.focus('textarea'));
      const text = 'This is the text that we are going to try to select. Let\'s see how it goes.';
      (yield page.keyboard.type(text));
      (yield page.click('textarea'));
      (yield page.click('textarea', {clickCount: 2}));
      (yield page.click('textarea', {clickCount: 3}));
      expect((yield page.evaluate(() => window.getSelection().toString()))).toBe(text);
    });});
    it('should trigger hover state', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/scrollable.html'));
      (yield page.hover('#button-6'));
      expect((yield page.evaluate(() => document.querySelector('button:hover').id))).toBe('button-6');
      (yield page.hover('#button-2'));
      expect((yield page.evaluate(() => document.querySelector('button:hover').id))).toBe('button-2');
      (yield page.hover('#button-91'));
      expect((yield page.evaluate(() => document.querySelector('button:hover').id))).toBe('button-91');
    });});
    it('should fire contextmenu event on right click', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/scrollable.html'));
      (yield page.click('#button-8', {button: 'right'}));
      expect((yield page.evaluate(() => document.querySelector('#button-8').textContent))).toBe('context menu');
    });});
    it('should set modifier keys on click', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/scrollable.html'));
      (yield page.evaluate(() => document.querySelector('#button-3').addEventListener('mousedown', e => window.lastEvent = e, true)));
      const modifiers = {'Shift': 'shiftKey', 'Control': 'ctrlKey', 'Alt': 'altKey', 'Meta': 'metaKey'};
      for (const modifier in modifiers) {
        (yield page.keyboard.down(modifier));
        (yield page.click('#button-3'));
        if (!((yield page.evaluate(mod => window.lastEvent[mod], modifiers[modifier]))))
          fail(modifiers[modifier] + ' should be true');
        (yield page.keyboard.up(modifier));
      }
      (yield page.click('#button-3'));
      for (const modifier in modifiers) {
        if (((yield page.evaluate(mod => window.lastEvent[mod], modifiers[modifier]))))
          fail(modifiers[modifier] + ' should be false');
      }
    });});
    it('should specify repeat property', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/textarea.html'));
      (yield page.focus('textarea'));
      (yield page.evaluate(() => document.querySelector('textarea').addEventListener('keydown', e => window.lastEvent = e, true)));
      (yield page.keyboard.down('a'));
      expect((yield page.evaluate(() => window.lastEvent.repeat))).toBe(false);
      (yield page.keyboard.press('a'));
      expect((yield page.evaluate(() => window.lastEvent.repeat))).toBe(true);

      (yield page.keyboard.down('b'));
      expect((yield page.evaluate(() => window.lastEvent.repeat))).toBe(false);
      (yield page.keyboard.down('b'));
      expect((yield page.evaluate(() => window.lastEvent.repeat))).toBe(true);

      (yield page.keyboard.up('a'));
      (yield page.keyboard.down('a'));
      expect((yield page.evaluate(() => window.lastEvent.repeat))).toBe(false);
    });});
    // @see https://github.com/GoogleChrome/puppeteer/issues/206
    it('should click links which cause navigation', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent(`<a href="${server.EMPTY_PAGE}">empty.html</a>`));
      // This await should not hang.
      (yield page.click('a'));
    });});
    it('should tween mouse movement', /* async */({page, server}) => {return (fn => {
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
      (yield page.mouse.move(100, 100));
      (yield page.evaluate(() => {
        window.result = [];
        document.addEventListener('mousemove', event => {
          window.result.push([event.clientX, event.clientY]);
        });
      }));
      (yield page.mouse.move(200, 300, {steps: 5}));
      expect((yield page.evaluate('result'))).toEqual([
        [120, 140],
        [140, 180],
        [160, 220],
        [180, 260],
        [200, 300]
      ]);
    });});
    it('should tap the button', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/button.html'));
      (yield page.tap('button'));
      expect((yield page.evaluate(() => result))).toBe('Clicked');
    });});
    xit('should report touches', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/touches.html'));
      const button = (yield page.$('button'));
      (yield button.tap());
      expect((yield page.evaluate(() => getResult()))).toEqual(['Touchstart: 0', 'Touchend: 0']);
    });});
    it('should click the button inside an iframe', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.EMPTY_PAGE));
      (yield page.setContent('<div style="width:100px;height:100px">spacer</div>'));
      (yield utils.attachFrame(page, 'button-test', server.PREFIX + '/input/button.html'));
      const frame = page.frames()[1];
      const button = (yield frame.$('button'));
      (yield button.click());
      expect((yield frame.evaluate(() => window.result))).toBe('Clicked');
    });});
    it('should click the button with deviceScaleFactor set', /* async */({page, server}) => {return (fn => {
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
      (yield page.setViewport({width: 400, height: 400, deviceScaleFactor: 5}));
      expect((yield page.evaluate(() => window.devicePixelRatio))).toBe(5);
      (yield page.setContent('<div style="width:100px;height:100px">spacer</div>'));
      (yield utils.attachFrame(page, 'button-test', server.PREFIX + '/input/button.html'));
      const frame = page.frames()[1];
      const button = (yield frame.$('button'));
      (yield button.click());
      expect((yield frame.evaluate(() => window.result))).toBe('Clicked');
    });});
    it('should type all kinds of characters', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/textarea.html'));
      (yield page.focus('textarea'));
      const text = 'This text goes onto two lines.\nThis character is 嗨.';
      (yield page.keyboard.type(text));
      expect((yield page.evaluate('result'))).toBe(text);
    });});
    it('should specify location', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/textarea.html'));
      (yield page.evaluate(() => {
        window.addEventListener('keydown', event => window.keyLocation = event.location, true);
      }));
      const textarea = (yield page.$('textarea'));

      (yield textarea.press('Digit5'));
      expect((yield page.evaluate('keyLocation'))).toBe(0);

      (yield textarea.press('ControlLeft'));
      expect((yield page.evaluate('keyLocation'))).toBe(1);

      (yield textarea.press('ControlRight'));
      expect((yield page.evaluate('keyLocation'))).toBe(2);

      (yield textarea.press('NumpadSubtract'));
      expect((yield page.evaluate('keyLocation'))).toBe(3);
    });});
    it('should throw on unknown keys', /* async */({page, server}) => {return (fn => {
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
      let error = (yield page.keyboard.press('NotARealKey').catch(e => e));
      expect(error.message).toBe('Unknown key: "NotARealKey"');

      error = (yield page.keyboard.press('ё').catch(e => e));
      expect(error && error.message).toBe('Unknown key: "ё"');

      error = (yield page.keyboard.press('😊').catch(e => e));
      expect(error && error.message).toBe('Unknown key: "😊"');
    });});
    it('should type emoji', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/input/textarea.html'));
      (yield page.type('textarea', '👹 Tokyo street Japan 🇯🇵'));
      expect((yield page.$eval('textarea', textarea => textarea.value))).toBe('👹 Tokyo street Japan 🇯🇵');
    });});
    it('should type emoji into an iframe', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.EMPTY_PAGE));
      (yield utils.attachFrame(page, 'emoji-test', server.PREFIX + '/input/textarea.html'));
      const frame = page.frames()[1];
      const textarea = (yield frame.$('textarea'));
      (yield textarea.type('👹 Tokyo street Japan 🇯🇵'));
      expect((yield frame.$eval('textarea', textarea => textarea.value))).toBe('👹 Tokyo street Japan 🇯🇵');
    });});
    function dimensions() {
      const rect = document.querySelector('textarea').getBoundingClientRect();
      return {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
      };
    }
  });
};

/**
 * Copyright 2018 Google Inc. All rights reserved.
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

const utils = require('./utils');

module.exports.addTests = function({testRunner, expect}) {
  const {describe, xdescribe, fdescribe} = testRunner;
  const {it, fit, xit} = testRunner;
  const {beforeAll, beforeEach, afterAll, afterEach} = testRunner;

  describe('ElementHandle.boundingBox', function() {
    it('should work', /* async */({page, server}) => {return (fn => {
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
      (yield page.setViewport({width: 500, height: 500}));
      (yield page.goto(server.PREFIX + '/grid.html'));
      const elementHandle = (yield page.$('.box:nth-of-type(13)'));
      const box = (yield elementHandle.boundingBox());
      expect(box).toEqual({ x: 100, y: 50, width: 50, height: 50 });
    });});
    it('should handle nested frames', /* async */({page, server}) => {return (fn => {
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
      (yield page.setViewport({width: 500, height: 500}));
      (yield page.goto(server.PREFIX + '/frames/nested-frames.html'));
      const nestedFrame = page.frames()[1].childFrames()[1];
      const elementHandle = (yield nestedFrame.$('div'));
      const box = (yield elementHandle.boundingBox());
      expect(box).toEqual({ x: 28, y: 260, width: 264, height: 18 });
    });});
    it('should return null for invisible elements', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent('<div style="display:none">hi</div>'));
      const element = (yield page.$('div'));
      expect((yield element.boundingBox())).toBe(null);
    });});
    it('should force a layout', /* async */({page, server}) => {return (fn => {
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
      (yield page.setViewport({ width: 500, height: 500 }));
      (yield page.setContent('<div style="width: 100px; height: 100px">hello</div>'));
      const elementHandle = (yield page.$('div'));
      (yield page.evaluate(element => element.style.height = '200px', elementHandle));
      const box = (yield elementHandle.boundingBox());
      expect(box).toEqual({ x: 8, y: 8, width: 100, height: 200 });
    });});
    it('should work with SVG nodes', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="500" height="500">
          <rect id="theRect" x="30" y="50" width="200" height="300"></rect>
        </svg>
      `));
      const element = (yield page.$('#therect'));
      const pptrBoundingBox = (yield element.boundingBox());
      const webBoundingBox = (yield page.evaluate(e => {
        const rect = e.getBoundingClientRect();
        return {x: rect.x, y: rect.y, width: rect.width, height: rect.height};
      }, element));
      expect(pptrBoundingBox).toEqual(webBoundingBox);
    });});
  });

  describe('ElementHandle.boxModel', function() {
    it('should work', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/resetcss.html'));

      // Step 1: Add Frame and position it absolutely.
      (yield utils.attachFrame(page, 'frame1', server.PREFIX + '/resetcss.html'));
      (yield page.evaluate(() => {
        const frame = document.querySelector('#frame1');
        frame.style = `
          position: absolute;
          left: 1px;
          top: 2px;
        `;
      }));

      // Step 2: Add div and position it absolutely inside frame.
      const frame = page.frames()[1];
      const divHandle = ((yield frame.evaluateHandle(() => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        div.style = `
          box-sizing: border-box;
          position: absolute;
          border-left: 1px solid black;
          padding-left: 2px;
          margin-left: 3px;
          left: 4px;
          top: 5px;
          width: 6px;
          height: 7px;
        `;
        return div;
      }))).asElement();

      // Step 3: query div's boxModel and assert box values.
      const box = (yield divHandle.boxModel());
      expect(box.width).toBe(6);
      expect(box.height).toBe(7);
      expect(box.margin[0]).toEqual({
        x: 1 + 4, // frame.left + div.left
        y: 2 + 5,
      });
      expect(box.border[0]).toEqual({
        x: 1 + 4 + 3, // frame.left + div.left + div.margin-left
        y: 2 + 5,
      });
      expect(box.padding[0]).toEqual({
        x: 1 + 4 + 3 + 1, // frame.left + div.left + div.marginLeft + div.borderLeft
        y: 2 + 5,
      });
      expect(box.content[0]).toEqual({
        x: 1 + 4 + 3 + 1 + 2, // frame.left + div.left + div.marginLeft + div.borderLeft + dif.paddingLeft
        y: 2 + 5,
      });
    });});

    it('should return null for invisible elements', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent('<div style="display:none">hi</div>'));
      const element = (yield page.$('div'));
      expect((yield element.boxModel())).toBe(null);
    });});
  });

  describe('ElementHandle.contentFrame', function() {
    it('should work', /* async */({page,server}) => {return (fn => {
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
      (yield utils.attachFrame(page, 'frame1', server.EMPTY_PAGE));
      const elementHandle = (yield page.$('#frame1'));
      const frame = (yield elementHandle.contentFrame());
      expect(frame).toBe(page.frames()[1]);
    });});
  });

  describe('ElementHandle.click', function() {
    it('should work', /* async */({page, server}) => {return (fn => {
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
      const button = (yield page.$('button'));
      (yield button.click());
      expect((yield page.evaluate(() => result))).toBe('Clicked');
    });});
    it('should work for Shadow DOM v1', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/shadow.html'));
      const buttonHandle = (yield page.evaluateHandle(() => button));
      (yield buttonHandle.click());
      expect((yield page.evaluate(() => clicked))).toBe(true);
    });});
    it('should work for TextNodes', /* async */({page, server}) => {return (fn => {
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
      const buttonTextNode = (yield page.evaluateHandle(() => document.querySelector('button').firstChild));
      let error = null;
      (yield buttonTextNode.click().catch(err => error = err));
      expect(error.message).toBe('Node is not of type HTMLElement');
    });});
    it('should throw for detached nodes', /* async */({page, server}) => {return (fn => {
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
      const button = (yield page.$('button'));
      (yield page.evaluate(button => button.remove(), button));
      let error = null;
      (yield button.click().catch(err => error = err));
      expect(error.message).toBe('Node is detached from document');
    });});
    it('should throw for hidden nodes', /* async */({page, server}) => {return (fn => {
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
      const button = (yield page.$('button'));
      (yield page.evaluate(button => button.style.display = 'none', button));
      const error = (yield button.click().catch(err => err));
      expect(error.message).toBe('Node is either not visible or not an HTMLElement');
    });});
    it('should throw for recursively hidden nodes', /* async */({page, server}) => {return (fn => {
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
      const button = (yield page.$('button'));
      (yield page.evaluate(button => button.parentElement.style.display = 'none', button));
      const error = (yield button.click().catch(err => err));
      expect(error.message).toBe('Node is either not visible or not an HTMLElement');
    });});
    it('should throw for <br> elements', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent('hello<br>goodbye'));
      const br = (yield page.$('br'));
      const error = (yield br.click().catch(err => err));
      expect(error.message).toBe('Node is either not visible or not an HTMLElement');
    });});
  });

  describe('ElementHandle.hover', function() {
    it('should work', /* async */({page, server}) => {return (fn => {
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
      const button = (yield page.$('#button-6'));
      (yield button.hover());
      expect((yield page.evaluate(() => document.querySelector('button:hover').id))).toBe('button-6');
    });});
  });

  describe('ElementHandle.isIntersectingViewport', function() {
    it('should work', /* async */({page, server}) => {return (fn => {
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
      for (let i = 0; i < 11; ++i) {
        const button = (yield page.$('#btn' + i));
        // All but last button are visible.
        const visible = i < 10;
        expect((yield button.isIntersectingViewport())).toBe(visible);
      }
    });});
  });

  describe('ElementHandle.screenshot', function() {
    it('should work', /* async */({page, server}) => {return (fn => {
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
      (yield page.setViewport({width: 500, height: 500}));
      (yield page.goto(server.PREFIX + '/grid.html'));
      (yield page.evaluate(() => window.scrollBy(50, 100)));
      const elementHandle = (yield page.$('.box:nth-of-type(3)'));
      const screenshot = (yield elementHandle.screenshot());
      expect(screenshot).toBeGolden('screenshot-element-bounding-box.png');
    });});
    it('should take into account padding and border', /* async */({page, server}) => {return (fn => {
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
      (yield page.setViewport({width: 500, height: 500}));
      (yield page.setContent(`
        something above
        <style>div {
          border: 2px solid blue;
          background: green;
          width: 50px;
          height: 50px;
        }
        </style>
        <div></div>
      `));
      const elementHandle = (yield page.$('div'));
      const screenshot = (yield elementHandle.screenshot());
      expect(screenshot).toBeGolden('screenshot-element-padding-border.png');
    });});
    it('should capture full element when larger than viewport', /* async */({page, server}) => {return (fn => {
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
      (yield page.setViewport({width: 500, height: 500}));

      (yield page.setContent(`
        something above
        <style>
        div.to-screenshot {
          border: 1px solid blue;
          width: 600px;
          height: 600px;
          margin-left: 50px;
        }
        ::-webkit-scrollbar{
          display: none;
        }
        </style>
        <div class="to-screenshot"></div>
      `));
      const elementHandle = (yield page.$('div.to-screenshot'));
      const screenshot = (yield elementHandle.screenshot());
      expect(screenshot).toBeGolden('screenshot-element-larger-than-viewport.png');

      expect((yield page.evaluate(() => ({ w: window.innerWidth, h: window.innerHeight })))).toEqual({ w: 500, h: 500 });
    });});
    it('should scroll element into view', /* async */({page, server}) => {return (fn => {
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
      (yield page.setViewport({width: 500, height: 500}));
      (yield page.setContent(`
        something above
        <style>div.above {
          border: 2px solid blue;
          background: red;
          height: 1500px;
        }
        div.to-screenshot {
          border: 2px solid blue;
          background: green;
          width: 50px;
          height: 50px;
        }
        </style>
        <div class="above"></div>
        <div class="to-screenshot"></div>
      `));
      const elementHandle = (yield page.$('div.to-screenshot'));
      const screenshot = (yield elementHandle.screenshot());
      expect(screenshot).toBeGolden('screenshot-element-scrolled-into-view.png');
    });});
    it('should work with a rotated element', /* async */({page, server}) => {return (fn => {
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
      (yield page.setViewport({width: 500, height: 500}));
      (yield page.setContent(`<div style="position:absolute;
                                        top: 100px;
                                        left: 100px;
                                        width: 100px;
                                        height: 100px;
                                        background: green;
                                        transform: rotateZ(200deg);">&nbsp;</div>`));
      const elementHandle = (yield page.$('div'));
      const screenshot = (yield elementHandle.screenshot());
      expect(screenshot).toBeGolden('screenshot-element-rotate.png');
    });});
    it('should fail to screenshot a detached element', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent('<h1>remove this</h1>'));
      const elementHandle = (yield page.$('h1'));
      (yield page.evaluate(element => element.remove(), elementHandle));
      const screenshotError = (yield elementHandle.screenshot().catch(error => error));
      expect(screenshotError.message).toBe('Node is either not visible or not an HTMLElement');
    });});
    xit('should not hang with zero width/height element', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent('<div style="width: 0; height: 0"></div>'));
      const div = (yield page.$('div'));
      (yield div.screenshot());
    });});
  });

  describe('ElementHandle.$', function() {
    it('should query existing element', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/playground.html'));
      (yield page.setContent('<html><body><div class="second"><div class="inner">A</div></div></body></html>'));
      const html = (yield page.$('html'));
      const second = (yield html.$('.second'));
      const inner = (yield second.$('.inner'));
      const content = (yield page.evaluate(e => e.textContent, inner));
      expect(content).toBe('A');
    });});

    it('should return null for non-existing element', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent('<html><body><div class="second"><div class="inner">B</div></div></body></html>'));
      const html = (yield page.$('html'));
      const second = (yield html.$('.third'));
      expect(second).toBe(null);
    });});
  });
  describe('ElementHandle.$eval', function() {
    it('should work', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent('<html><body><div class="tweet"><div class="like">100</div><div class="retweets">10</div></div></body></html>'));
      const tweet = (yield page.$('.tweet'));
      const content = (yield tweet.$eval('.like', node => node.innerText));
      expect(content).toBe('100');
    });});

    it('should retrieve content from subtree', /* async */({page, server}) => {return (fn => {
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
      const htmlContent = '<div class="a">not-a-child-div</div><div id="myId"><div class="a">a-child-div</div></div>';
      (yield page.setContent(htmlContent));
      const elementHandle = (yield page.$('#myId'));
      const content = (yield elementHandle.$eval('.a', node => node.innerText));
      expect(content).toBe('a-child-div');
    });});

    it('should throw in case of missing selector', /* async */({page, server}) => {return (fn => {
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
      const htmlContent = '<div class="a">not-a-child-div</div><div id="myId"></div>';
      (yield page.setContent(htmlContent));
      const elementHandle = (yield page.$('#myId'));
      const errorMessage = (yield elementHandle.$eval('.a', node => node.innerText).catch(error => error.message));
      expect(errorMessage).toBe(`Error: failed to find element matching selector ".a"`);
    });});
  });
  describe('ElementHandle.$$eval', function() {
    it('should work', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent('<html><body><div class="tweet"><div class="like">100</div><div class="like">10</div></div></body></html>'));
      const tweet = (yield page.$('.tweet'));
      const content = (yield tweet.$$eval('.like', nodes => nodes.map(n => n.innerText)));
      expect(content).toEqual(['100', '10']);
    });});

    it('should retrieve content from subtree', /* async */({page, server}) => {return (fn => {
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
      const htmlContent = '<div class="a">not-a-child-div</div><div id="myId"><div class="a">a1-child-div</div><div class="a">a2-child-div</div></div>';
      (yield page.setContent(htmlContent));
      const elementHandle = (yield page.$('#myId'));
      const content = (yield elementHandle.$$eval('.a', nodes => nodes.map(n => n.innerText)));
      expect(content).toEqual(['a1-child-div', 'a2-child-div']);
    });});

    it('should not throw in case of missing selector', /* async */({page, server}) => {return (fn => {
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
      const htmlContent = '<div class="a">not-a-child-div</div><div id="myId"></div>';
      (yield page.setContent(htmlContent));
      const elementHandle = (yield page.$('#myId'));
      const nodesLength = (yield elementHandle.$$eval('.a', nodes => nodes.length));
      expect(nodesLength).toBe(0);
    });});

  });

  describe('ElementHandle.$$', function() {
    it('should query existing elements', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent('<html><body><div>A</div><br/><div>B</div></body></html>'));
      const html = (yield page.$('html'));
      const elements = (yield html.$$('div'));
      expect(elements.length).toBe(2);
      const promises = elements.map(element => page.evaluate(e => e.textContent, element));
      expect((yield Promise.all(promises))).toEqual(['A', 'B']);
    });});

    it('should return empty array for non-existing elements', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent('<html><body><span>A</span><br/><span>B</span></body></html>'));
      const html = (yield page.$('html'));
      const elements = (yield html.$$('div'));
      expect(elements.length).toBe(0);
    });});
  });


  describe('ElementHandle.$x', function() {
    it('should query existing element', /* async */({page, server}) => {return (fn => {
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
      (yield page.goto(server.PREFIX + '/playground.html'));
      (yield page.setContent('<html><body><div class="second"><div class="inner">A</div></div></body></html>'));
      const html = (yield page.$('html'));
      const second = (yield html.$x(`./body/div[contains(@class, 'second')]`));
      const inner = (yield second[0].$x(`./div[contains(@class, 'inner')]`));
      const content = (yield page.evaluate(e => e.textContent, inner[0]));
      expect(content).toBe('A');
    });});

    it('should return null for non-existing element', /* async */({page, server}) => {return (fn => {
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
      (yield page.setContent('<html><body><div class="second"><div class="inner">B</div></div></body></html>'));
      const html = (yield page.$('html'));
      const second = (yield html.$x(`/div[contains(@class, 'third')]`));
      expect(second).toEqual([]);
    });});
  });
};

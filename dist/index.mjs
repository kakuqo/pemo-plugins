var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../node_modules/.pnpm/traverse@0.3.9/node_modules/traverse/index.js
var require_traverse = __commonJS({
  "../node_modules/.pnpm/traverse@0.3.9/node_modules/traverse/index.js"(exports, module) {
    "use strict";
    module.exports = Traverse;
    function Traverse(obj) {
      if (!(this instanceof Traverse)) return new Traverse(obj);
      this.value = obj;
    }
    Traverse.prototype.get = function(ps) {
      var node = this.value;
      for (var i = 0; i < ps.length; i++) {
        var key = ps[i];
        if (!Object.hasOwnProperty.call(node, key)) {
          node = void 0;
          break;
        }
        node = node[key];
      }
      return node;
    };
    Traverse.prototype.set = function(ps, value) {
      var node = this.value;
      for (var i = 0; i < ps.length - 1; i++) {
        var key = ps[i];
        if (!Object.hasOwnProperty.call(node, key)) node[key] = {};
        node = node[key];
      }
      node[ps[i]] = value;
      return value;
    };
    Traverse.prototype.map = function(cb) {
      return walk(this.value, cb, true);
    };
    Traverse.prototype.forEach = function(cb) {
      this.value = walk(this.value, cb, false);
      return this.value;
    };
    Traverse.prototype.reduce = function(cb, init) {
      var skip = arguments.length === 1;
      var acc = skip ? this.value : init;
      this.forEach(function(x) {
        if (!this.isRoot || !skip) {
          acc = cb.call(this, acc, x);
        }
      });
      return acc;
    };
    Traverse.prototype.deepEqual = function(obj) {
      if (arguments.length !== 1) {
        throw new Error(
          "deepEqual requires exactly one object to compare against"
        );
      }
      var equal = true;
      var node = obj;
      this.forEach(function(y) {
        var notEqual = function() {
          equal = false;
          return void 0;
        }.bind(this);
        if (!this.isRoot) {
          if (typeof node !== "object") return notEqual();
          node = node[this.key];
        }
        var x = node;
        this.post(function() {
          node = x;
        });
        var toS = function(o) {
          return Object.prototype.toString.call(o);
        };
        if (this.circular) {
          if (Traverse(obj).get(this.circular.path) !== x) notEqual();
        } else if (typeof x !== typeof y) {
          notEqual();
        } else if (x === null || y === null || x === void 0 || y === void 0) {
          if (x !== y) notEqual();
        } else if (x.__proto__ !== y.__proto__) {
          notEqual();
        } else if (x === y) {
        } else if (typeof x === "function") {
          if (x instanceof RegExp) {
            if (x.toString() != y.toString()) notEqual();
          } else if (x !== y) notEqual();
        } else if (typeof x === "object") {
          if (toS(y) === "[object Arguments]" || toS(x) === "[object Arguments]") {
            if (toS(x) !== toS(y)) {
              notEqual();
            }
          } else if (x instanceof Date || y instanceof Date) {
            if (!(x instanceof Date) || !(y instanceof Date) || x.getTime() !== y.getTime()) {
              notEqual();
            }
          } else {
            var kx = Object.keys(x);
            var ky = Object.keys(y);
            if (kx.length !== ky.length) return notEqual();
            for (var i = 0; i < kx.length; i++) {
              var k = kx[i];
              if (!Object.hasOwnProperty.call(y, k)) {
                notEqual();
              }
            }
          }
        }
      });
      return equal;
    };
    Traverse.prototype.paths = function() {
      var acc = [];
      this.forEach(function(x) {
        acc.push(this.path);
      });
      return acc;
    };
    Traverse.prototype.nodes = function() {
      var acc = [];
      this.forEach(function(x) {
        acc.push(this.node);
      });
      return acc;
    };
    Traverse.prototype.clone = function() {
      var parents = [], nodes = [];
      return function clone(src) {
        for (var i = 0; i < parents.length; i++) {
          if (parents[i] === src) {
            return nodes[i];
          }
        }
        if (typeof src === "object" && src !== null) {
          var dst = copy2(src);
          parents.push(src);
          nodes.push(dst);
          Object.keys(src).forEach(function(key) {
            dst[key] = clone(src[key]);
          });
          parents.pop();
          nodes.pop();
          return dst;
        } else {
          return src;
        }
      }(this.value);
    };
    function walk(root, cb, immutable) {
      var path3 = [];
      var parents = [];
      var alive = true;
      return function walker(node_) {
        var node = immutable ? copy2(node_) : node_;
        var modifiers = {};
        var state = {
          node,
          node_,
          path: [].concat(path3),
          parent: parents.slice(-1)[0],
          key: path3.slice(-1)[0],
          isRoot: path3.length === 0,
          level: path3.length,
          circular: null,
          update: function(x) {
            if (!state.isRoot) {
              state.parent.node[state.key] = x;
            }
            state.node = x;
          },
          "delete": function() {
            delete state.parent.node[state.key];
          },
          remove: function() {
            if (Array.isArray(state.parent.node)) {
              state.parent.node.splice(state.key, 1);
            } else {
              delete state.parent.node[state.key];
            }
          },
          before: function(f) {
            modifiers.before = f;
          },
          after: function(f) {
            modifiers.after = f;
          },
          pre: function(f) {
            modifiers.pre = f;
          },
          post: function(f) {
            modifiers.post = f;
          },
          stop: function() {
            alive = false;
          }
        };
        if (!alive) return state;
        if (typeof node === "object" && node !== null) {
          state.isLeaf = Object.keys(node).length == 0;
          for (var i = 0; i < parents.length; i++) {
            if (parents[i].node_ === node_) {
              state.circular = parents[i];
              break;
            }
          }
        } else {
          state.isLeaf = true;
        }
        state.notLeaf = !state.isLeaf;
        state.notRoot = !state.isRoot;
        var ret = cb.call(state, state.node);
        if (ret !== void 0 && state.update) state.update(ret);
        if (modifiers.before) modifiers.before.call(state, state.node);
        if (typeof state.node == "object" && state.node !== null && !state.circular) {
          parents.push(state);
          var keys = Object.keys(state.node);
          keys.forEach(function(key, i2) {
            path3.push(key);
            if (modifiers.pre) modifiers.pre.call(state, state.node[key], key);
            var child = walker(state.node[key]);
            if (immutable && Object.hasOwnProperty.call(state.node, key)) {
              state.node[key] = child.node;
            }
            child.isLast = i2 == keys.length - 1;
            child.isFirst = i2 == 0;
            if (modifiers.post) modifiers.post.call(state, child);
            path3.pop();
          });
          parents.pop();
        }
        if (modifiers.after) modifiers.after.call(state, state.node);
        return state;
      }(root).node;
    }
    Object.keys(Traverse.prototype).forEach(function(key) {
      Traverse[key] = function(obj) {
        var args = [].slice.call(arguments, 1);
        var t = Traverse(obj);
        return t[key].apply(t, args);
      };
    });
    function copy2(src) {
      if (typeof src === "object" && src !== null) {
        var dst;
        if (Array.isArray(src)) {
          dst = [];
        } else if (src instanceof Date) {
          dst = new Date(src);
        } else if (src instanceof Boolean) {
          dst = new Boolean(src);
        } else if (src instanceof Number) {
          dst = new Number(src);
        } else if (src instanceof String) {
          dst = new String(src);
        } else {
          dst = Object.create(Object.getPrototypeOf(src));
        }
        Object.keys(src).forEach(function(key) {
          dst[key] = src[key];
        });
        return dst;
      } else return src;
    }
  }
});

// ../node_modules/.pnpm/chainsaw@0.1.0/node_modules/chainsaw/index.js
var require_chainsaw = __commonJS({
  "../node_modules/.pnpm/chainsaw@0.1.0/node_modules/chainsaw/index.js"(exports, module) {
    "use strict";
    var Traverse = require_traverse();
    var EventEmitter = __require("events").EventEmitter;
    module.exports = Chainsaw;
    function Chainsaw(builder) {
      var saw = Chainsaw.saw(builder, {});
      var r = builder.call(saw.handlers, saw);
      if (r !== void 0) saw.handlers = r;
      saw.record();
      return saw.chain();
    }
    Chainsaw.light = function ChainsawLight(builder) {
      var saw = Chainsaw.saw(builder, {});
      var r = builder.call(saw.handlers, saw);
      if (r !== void 0) saw.handlers = r;
      return saw.chain();
    };
    Chainsaw.saw = function(builder, handlers) {
      var saw = new EventEmitter();
      saw.handlers = handlers;
      saw.actions = [];
      saw.chain = function() {
        var ch = Traverse(saw.handlers).map(function(node) {
          if (this.isRoot) return node;
          var ps = this.path;
          if (typeof node === "function") {
            this.update(function() {
              saw.actions.push({
                path: ps,
                args: [].slice.call(arguments)
              });
              return ch;
            });
          }
        });
        process.nextTick(function() {
          saw.emit("begin");
          saw.next();
        });
        return ch;
      };
      saw.pop = function() {
        return saw.actions.shift();
      };
      saw.next = function() {
        var action = saw.pop();
        if (!action) {
          saw.emit("end");
        } else if (!action.trap) {
          var node = saw.handlers;
          action.path.forEach(function(key) {
            node = node[key];
          });
          node.apply(saw.handlers, action.args);
        }
      };
      saw.nest = function(cb) {
        var args = [].slice.call(arguments, 1);
        var autonext = true;
        if (typeof cb === "boolean") {
          var autonext = cb;
          cb = args.shift();
        }
        var s = Chainsaw.saw(builder, {});
        var r = builder.call(s.handlers, s);
        if (r !== void 0) s.handlers = r;
        if ("undefined" !== typeof saw.step) {
          s.record();
        }
        cb.apply(s.chain(), args);
        if (autonext !== false) s.on("end", saw.next);
      };
      saw.record = function() {
        upgradeChainsaw(saw);
      };
      ["trap", "down", "jump"].forEach(function(method) {
        saw[method] = function() {
          throw new Error("To use the trap, down and jump features, please call record() first to start recording actions.");
        };
      });
      return saw;
    };
    function upgradeChainsaw(saw) {
      saw.step = 0;
      saw.pop = function() {
        return saw.actions[saw.step++];
      };
      saw.trap = function(name, cb) {
        var ps = Array.isArray(name) ? name : [name];
        saw.actions.push({
          path: ps,
          step: saw.step,
          cb,
          trap: true
        });
      };
      saw.down = function(name) {
        var ps = (Array.isArray(name) ? name : [name]).join("/");
        var i = saw.actions.slice(saw.step).map(function(x) {
          if (x.trap && x.step <= saw.step) return false;
          return x.path.join("/") == ps;
        }).indexOf(true);
        if (i >= 0) saw.step += i;
        else saw.step = saw.actions.length;
        var act = saw.actions[saw.step - 1];
        if (act && act.trap) {
          saw.step = act.step;
          act.cb();
        } else saw.next();
      };
      saw.jump = function(step) {
        saw.step = step;
        saw.next();
      };
    }
  }
});

// ../node_modules/.pnpm/buffers@0.1.1/node_modules/buffers/index.js
var require_buffers = __commonJS({
  "../node_modules/.pnpm/buffers@0.1.1/node_modules/buffers/index.js"(exports, module) {
    "use strict";
    module.exports = Buffers;
    function Buffers(bufs) {
      if (!(this instanceof Buffers)) return new Buffers(bufs);
      this.buffers = bufs || [];
      this.length = this.buffers.reduce(function(size, buf) {
        return size + buf.length;
      }, 0);
    }
    Buffers.prototype.push = function() {
      for (var i = 0; i < arguments.length; i++) {
        if (!Buffer.isBuffer(arguments[i])) {
          throw new TypeError("Tried to push a non-buffer");
        }
      }
      for (var i = 0; i < arguments.length; i++) {
        var buf = arguments[i];
        this.buffers.push(buf);
        this.length += buf.length;
      }
      return this.length;
    };
    Buffers.prototype.unshift = function() {
      for (var i = 0; i < arguments.length; i++) {
        if (!Buffer.isBuffer(arguments[i])) {
          throw new TypeError("Tried to unshift a non-buffer");
        }
      }
      for (var i = 0; i < arguments.length; i++) {
        var buf = arguments[i];
        this.buffers.unshift(buf);
        this.length += buf.length;
      }
      return this.length;
    };
    Buffers.prototype.copy = function(dst, dStart, start, end) {
      return this.slice(start, end).copy(dst, dStart, 0, end - start);
    };
    Buffers.prototype.splice = function(i, howMany) {
      var buffers = this.buffers;
      var index = i >= 0 ? i : this.length - i;
      var reps = [].slice.call(arguments, 2);
      if (howMany === void 0) {
        howMany = this.length - index;
      } else if (howMany > this.length - index) {
        howMany = this.length - index;
      }
      for (var i = 0; i < reps.length; i++) {
        this.length += reps[i].length;
      }
      var removed = new Buffers();
      var bytes = 0;
      var startBytes = 0;
      for (var ii = 0; ii < buffers.length && startBytes + buffers[ii].length < index; ii++) {
        startBytes += buffers[ii].length;
      }
      if (index - startBytes > 0) {
        var start = index - startBytes;
        if (start + howMany < buffers[ii].length) {
          removed.push(buffers[ii].slice(start, start + howMany));
          var orig = buffers[ii];
          var buf0 = new Buffer(start);
          for (var i = 0; i < start; i++) {
            buf0[i] = orig[i];
          }
          var buf1 = new Buffer(orig.length - start - howMany);
          for (var i = start + howMany; i < orig.length; i++) {
            buf1[i - howMany - start] = orig[i];
          }
          if (reps.length > 0) {
            var reps_ = reps.slice();
            reps_.unshift(buf0);
            reps_.push(buf1);
            buffers.splice.apply(buffers, [ii, 1].concat(reps_));
            ii += reps_.length;
            reps = [];
          } else {
            buffers.splice(ii, 1, buf0, buf1);
            ii += 2;
          }
        } else {
          removed.push(buffers[ii].slice(start));
          buffers[ii] = buffers[ii].slice(0, start);
          ii++;
        }
      }
      if (reps.length > 0) {
        buffers.splice.apply(buffers, [ii, 0].concat(reps));
        ii += reps.length;
      }
      while (removed.length < howMany) {
        var buf = buffers[ii];
        var len = buf.length;
        var take = Math.min(len, howMany - removed.length);
        if (take === len) {
          removed.push(buf);
          buffers.splice(ii, 1);
        } else {
          removed.push(buf.slice(0, take));
          buffers[ii] = buffers[ii].slice(take);
        }
      }
      this.length -= removed.length;
      return removed;
    };
    Buffers.prototype.slice = function(i, j) {
      var buffers = this.buffers;
      if (j === void 0) j = this.length;
      if (i === void 0) i = 0;
      if (j > this.length) j = this.length;
      var startBytes = 0;
      for (var si = 0; si < buffers.length && startBytes + buffers[si].length <= i; si++) {
        startBytes += buffers[si].length;
      }
      var target = new Buffer(j - i);
      var ti = 0;
      for (var ii = si; ti < j - i && ii < buffers.length; ii++) {
        var len = buffers[ii].length;
        var start = ti === 0 ? i - startBytes : 0;
        var end = ti + len >= j - i ? Math.min(start + (j - i) - ti, len) : len;
        buffers[ii].copy(target, ti, start, end);
        ti += end - start;
      }
      return target;
    };
    Buffers.prototype.pos = function(i) {
      if (i < 0 || i >= this.length) throw new Error("oob");
      var l = i, bi = 0, bu = null;
      for (; ; ) {
        bu = this.buffers[bi];
        if (l < bu.length) {
          return { buf: bi, offset: l };
        } else {
          l -= bu.length;
        }
        bi++;
      }
    };
    Buffers.prototype.get = function get(i) {
      var pos = this.pos(i);
      return this.buffers[pos.buf].get(pos.offset);
    };
    Buffers.prototype.set = function set(i, b) {
      var pos = this.pos(i);
      return this.buffers[pos.buf].set(pos.offset, b);
    };
    Buffers.prototype.indexOf = function(needle, offset) {
      if ("string" === typeof needle) {
        needle = new Buffer(needle);
      } else if (needle instanceof Buffer) {
      } else {
        throw new Error("Invalid type for a search string");
      }
      if (!needle.length) {
        return 0;
      }
      if (!this.length) {
        return -1;
      }
      var i = 0, j = 0, match = 0, mstart, pos = 0;
      if (offset) {
        var p = this.pos(offset);
        i = p.buf;
        j = p.offset;
        pos = offset;
      }
      for (; ; ) {
        while (j >= this.buffers[i].length) {
          j = 0;
          i++;
          if (i >= this.buffers.length) {
            return -1;
          }
        }
        var char = this.buffers[i][j];
        if (char == needle[match]) {
          if (match == 0) {
            mstart = {
              i,
              j,
              pos
            };
          }
          match++;
          if (match == needle.length) {
            return mstart.pos;
          }
        } else if (match != 0) {
          i = mstart.i;
          j = mstart.j;
          pos = mstart.pos;
          match = 0;
        }
        j++;
        pos++;
      }
    };
    Buffers.prototype.toBuffer = function() {
      return this.slice();
    };
    Buffers.prototype.toString = function(encoding, start, end) {
      return this.slice(start, end).toString(encoding);
    };
  }
});

// ../node_modules/.pnpm/binary@0.3.0/node_modules/binary/lib/vars.js
var require_vars = __commonJS({
  "../node_modules/.pnpm/binary@0.3.0/node_modules/binary/lib/vars.js"(exports, module) {
    "use strict";
    module.exports = function(store) {
      function getset(name, value) {
        var node = vars.store;
        var keys = name.split(".");
        keys.slice(0, -1).forEach(function(k) {
          if (node[k] === void 0) node[k] = {};
          node = node[k];
        });
        var key = keys[keys.length - 1];
        if (arguments.length == 1) {
          return node[key];
        } else {
          return node[key] = value;
        }
      }
      var vars = {
        get: function(name) {
          return getset(name);
        },
        set: function(name, value) {
          return getset(name, value);
        },
        store: store || {}
      };
      return vars;
    };
  }
});

// ../node_modules/.pnpm/binary@0.3.0/node_modules/binary/index.js
var require_binary = __commonJS({
  "../node_modules/.pnpm/binary@0.3.0/node_modules/binary/index.js"(exports, module) {
    "use strict";
    var Chainsaw = require_chainsaw();
    var EventEmitter = __require("events").EventEmitter;
    var Buffers = require_buffers();
    var Vars = require_vars();
    var Stream = __require("stream").Stream;
    exports = module.exports = function(bufOrEm, eventName) {
      if (Buffer.isBuffer(bufOrEm)) {
        return exports.parse(bufOrEm);
      }
      var s = exports.stream();
      if (bufOrEm && bufOrEm.pipe) {
        bufOrEm.pipe(s);
      } else if (bufOrEm) {
        bufOrEm.on(eventName || "data", function(buf) {
          s.write(buf);
        });
        bufOrEm.on("end", function() {
          s.end();
        });
      }
      return s;
    };
    exports.stream = function(input) {
      if (input) return exports.apply(null, arguments);
      var pending = null;
      function getBytes(bytes, cb, skip) {
        pending = {
          bytes,
          skip,
          cb: function(buf) {
            pending = null;
            cb(buf);
          }
        };
        dispatch();
      }
      var offset = null;
      function dispatch() {
        if (!pending) {
          if (caughtEnd) done = true;
          return;
        }
        if (typeof pending === "function") {
          pending();
        } else {
          var bytes = offset + pending.bytes;
          if (buffers.length >= bytes) {
            var buf;
            if (offset == null) {
              buf = buffers.splice(0, bytes);
              if (!pending.skip) {
                buf = buf.slice();
              }
            } else {
              if (!pending.skip) {
                buf = buffers.slice(offset, bytes);
              }
              offset = bytes;
            }
            if (pending.skip) {
              pending.cb();
            } else {
              pending.cb(buf);
            }
          }
        }
      }
      function builder(saw) {
        function next() {
          if (!done) saw.next();
        }
        var self = words(function(bytes, cb) {
          return function(name) {
            getBytes(bytes, function(buf) {
              vars.set(name, cb(buf));
              next();
            });
          };
        });
        self.tap = function(cb) {
          saw.nest(cb, vars.store);
        };
        self.into = function(key, cb) {
          if (!vars.get(key)) vars.set(key, {});
          var parent = vars;
          vars = Vars(parent.get(key));
          saw.nest(function() {
            cb.apply(this, arguments);
            this.tap(function() {
              vars = parent;
            });
          }, vars.store);
        };
        self.flush = function() {
          vars.store = {};
          next();
        };
        self.loop = function(cb) {
          var end = false;
          saw.nest(false, function loop() {
            this.vars = vars.store;
            cb.call(this, function() {
              end = true;
              next();
            }, vars.store);
            this.tap(function() {
              if (end) saw.next();
              else loop.call(this);
            }.bind(this));
          }, vars.store);
        };
        self.buffer = function(name, bytes) {
          if (typeof bytes === "string") {
            bytes = vars.get(bytes);
          }
          getBytes(bytes, function(buf) {
            vars.set(name, buf);
            next();
          });
        };
        self.skip = function(bytes) {
          if (typeof bytes === "string") {
            bytes = vars.get(bytes);
          }
          getBytes(bytes, function() {
            next();
          });
        };
        self.scan = function find(name, search) {
          if (typeof search === "string") {
            search = new Buffer(search);
          } else if (!Buffer.isBuffer(search)) {
            throw new Error("search must be a Buffer or a string");
          }
          var taken = 0;
          pending = function() {
            var pos = buffers.indexOf(search, offset + taken);
            var i = pos - offset - taken;
            if (pos !== -1) {
              pending = null;
              if (offset != null) {
                vars.set(
                  name,
                  buffers.slice(offset, offset + taken + i)
                );
                offset += taken + i + search.length;
              } else {
                vars.set(
                  name,
                  buffers.slice(0, taken + i)
                );
                buffers.splice(0, taken + i + search.length);
              }
              next();
              dispatch();
            } else {
              i = Math.max(buffers.length - search.length - offset - taken, 0);
            }
            taken += i;
          };
          dispatch();
        };
        self.peek = function(cb) {
          offset = 0;
          saw.nest(function() {
            cb.call(this, vars.store);
            this.tap(function() {
              offset = null;
            });
          });
        };
        return self;
      }
      ;
      var stream = Chainsaw.light(builder);
      stream.writable = true;
      var buffers = Buffers();
      stream.write = function(buf) {
        buffers.push(buf);
        dispatch();
      };
      var vars = Vars();
      var done = false, caughtEnd = false;
      stream.end = function() {
        caughtEnd = true;
      };
      stream.pipe = Stream.prototype.pipe;
      Object.getOwnPropertyNames(EventEmitter.prototype).forEach(function(name) {
        stream[name] = EventEmitter.prototype[name];
      });
      return stream;
    };
    exports.parse = function parse2(buffer) {
      var self = words(function(bytes, cb) {
        return function(name) {
          if (offset + bytes <= buffer.length) {
            var buf = buffer.slice(offset, offset + bytes);
            offset += bytes;
            vars.set(name, cb(buf));
          } else {
            vars.set(name, null);
          }
          return self;
        };
      });
      var offset = 0;
      var vars = Vars();
      self.vars = vars.store;
      self.tap = function(cb) {
        cb.call(self, vars.store);
        return self;
      };
      self.into = function(key, cb) {
        if (!vars.get(key)) {
          vars.set(key, {});
        }
        var parent = vars;
        vars = Vars(parent.get(key));
        cb.call(self, vars.store);
        vars = parent;
        return self;
      };
      self.loop = function(cb) {
        var end = false;
        var ender = function() {
          end = true;
        };
        while (end === false) {
          cb.call(self, ender, vars.store);
        }
        return self;
      };
      self.buffer = function(name, size) {
        if (typeof size === "string") {
          size = vars.get(size);
        }
        var buf = buffer.slice(offset, Math.min(buffer.length, offset + size));
        offset += size;
        vars.set(name, buf);
        return self;
      };
      self.skip = function(bytes) {
        if (typeof bytes === "string") {
          bytes = vars.get(bytes);
        }
        offset += bytes;
        return self;
      };
      self.scan = function(name, search) {
        if (typeof search === "string") {
          search = new Buffer(search);
        } else if (!Buffer.isBuffer(search)) {
          throw new Error("search must be a Buffer or a string");
        }
        vars.set(name, null);
        for (var i = 0; i + offset <= buffer.length - search.length + 1; i++) {
          for (var j = 0; j < search.length && buffer[offset + i + j] === search[j]; j++) ;
          if (j === search.length) break;
        }
        vars.set(name, buffer.slice(offset, offset + i));
        offset += i + search.length;
        return self;
      };
      self.peek = function(cb) {
        var was = offset;
        cb.call(self, vars.store);
        offset = was;
        return self;
      };
      self.flush = function() {
        vars.store = {};
        return self;
      };
      self.eof = function() {
        return offset >= buffer.length;
      };
      return self;
    };
    function decodeLEu(bytes) {
      var acc = 0;
      for (var i = 0; i < bytes.length; i++) {
        acc += Math.pow(256, i) * bytes[i];
      }
      return acc;
    }
    function decodeBEu(bytes) {
      var acc = 0;
      for (var i = 0; i < bytes.length; i++) {
        acc += Math.pow(256, bytes.length - i - 1) * bytes[i];
      }
      return acc;
    }
    function decodeBEs(bytes) {
      var val = decodeBEu(bytes);
      if ((bytes[0] & 128) == 128) {
        val -= Math.pow(256, bytes.length);
      }
      return val;
    }
    function decodeLEs(bytes) {
      var val = decodeLEu(bytes);
      if ((bytes[bytes.length - 1] & 128) == 128) {
        val -= Math.pow(256, bytes.length);
      }
      return val;
    }
    function words(decode) {
      var self = {};
      [1, 2, 4, 8].forEach(function(bytes) {
        var bits = bytes * 8;
        self["word" + bits + "le"] = self["word" + bits + "lu"] = decode(bytes, decodeLEu);
        self["word" + bits + "ls"] = decode(bytes, decodeLEs);
        self["word" + bits + "be"] = self["word" + bits + "bu"] = decode(bytes, decodeBEu);
        self["word" + bits + "bs"] = decode(bytes, decodeBEs);
      });
      self.word8 = self.word8u = self.word8be;
      self.word8s = self.word8bs;
      return self;
    }
  }
});

// ../node_modules/.pnpm/unzip-stream@0.3.4/node_modules/unzip-stream/lib/matcher-stream.js
var require_matcher_stream = __commonJS({
  "../node_modules/.pnpm/unzip-stream@0.3.4/node_modules/unzip-stream/lib/matcher-stream.js"(exports, module) {
    "use strict";
    var Transform = __require("stream").Transform;
    var util = __require("util");
    function MatcherStream(patternDesc, matchFn) {
      if (!(this instanceof MatcherStream)) {
        return new MatcherStream();
      }
      Transform.call(this);
      var p = typeof patternDesc === "object" ? patternDesc.pattern : patternDesc;
      this.pattern = Buffer.isBuffer(p) ? p : Buffer.from(p);
      this.requiredLength = this.pattern.length;
      if (patternDesc.requiredExtraSize) this.requiredLength += patternDesc.requiredExtraSize;
      this.data = new Buffer("");
      this.bytesSoFar = 0;
      this.matchFn = matchFn;
    }
    util.inherits(MatcherStream, Transform);
    MatcherStream.prototype.checkDataChunk = function(ignoreMatchZero) {
      var enoughData = this.data.length >= this.requiredLength;
      if (!enoughData) {
        return;
      }
      var matchIndex = this.data.indexOf(this.pattern, ignoreMatchZero ? 1 : 0);
      if (matchIndex >= 0 && matchIndex + this.requiredLength > this.data.length) {
        if (matchIndex > 0) {
          var packet = this.data.slice(0, matchIndex);
          this.push(packet);
          this.bytesSoFar += matchIndex;
          this.data = this.data.slice(matchIndex);
        }
        return;
      }
      if (matchIndex === -1) {
        var packetLen = this.data.length - this.requiredLength + 1;
        var packet = this.data.slice(0, packetLen);
        this.push(packet);
        this.bytesSoFar += packetLen;
        this.data = this.data.slice(packetLen);
        return;
      }
      if (matchIndex > 0) {
        var packet = this.data.slice(0, matchIndex);
        this.data = this.data.slice(matchIndex);
        this.push(packet);
        this.bytesSoFar += matchIndex;
      }
      var finished = this.matchFn ? this.matchFn(this.data, this.bytesSoFar) : true;
      if (finished) {
        this.data = new Buffer("");
        return;
      }
      return true;
    };
    MatcherStream.prototype._transform = function(chunk, encoding, cb) {
      this.data = Buffer.concat([this.data, chunk]);
      var firstIteration = true;
      while (this.checkDataChunk(!firstIteration)) {
        firstIteration = false;
      }
      cb();
    };
    MatcherStream.prototype._flush = function(cb) {
      if (this.data.length > 0) {
        var firstIteration = true;
        while (this.checkDataChunk(!firstIteration)) {
          firstIteration = false;
        }
      }
      if (this.data.length > 0) {
        this.push(this.data);
        this.data = null;
      }
      cb();
    };
    module.exports = MatcherStream;
  }
});

// ../node_modules/.pnpm/unzip-stream@0.3.4/node_modules/unzip-stream/lib/entry.js
var require_entry = __commonJS({
  "../node_modules/.pnpm/unzip-stream@0.3.4/node_modules/unzip-stream/lib/entry.js"(exports, module) {
    "use strict";
    var stream = __require("stream");
    var inherits = __require("util").inherits;
    function Entry() {
      if (!(this instanceof Entry)) {
        return new Entry();
      }
      stream.PassThrough.call(this);
      this.path = null;
      this.type = null;
      this.isDirectory = false;
    }
    inherits(Entry, stream.PassThrough);
    Entry.prototype.autodrain = function() {
      return this.pipe(new stream.Transform({ transform: function(d, e, cb) {
        cb();
      } }));
    };
    module.exports = Entry;
  }
});

// ../node_modules/.pnpm/unzip-stream@0.3.4/node_modules/unzip-stream/lib/unzip-stream.js
var require_unzip_stream = __commonJS({
  "../node_modules/.pnpm/unzip-stream@0.3.4/node_modules/unzip-stream/lib/unzip-stream.js"(exports, module) {
    "use strict";
    var binary = require_binary();
    var stream = __require("stream");
    var util = __require("util");
    var zlib = __require("zlib");
    var MatcherStream = require_matcher_stream();
    var Entry = require_entry();
    var states = {
      STREAM_START: 0,
      START: 1,
      LOCAL_FILE_HEADER: 2,
      LOCAL_FILE_HEADER_SUFFIX: 3,
      FILE_DATA: 4,
      FILE_DATA_END: 5,
      DATA_DESCRIPTOR: 6,
      CENTRAL_DIRECTORY_FILE_HEADER: 7,
      CENTRAL_DIRECTORY_FILE_HEADER_SUFFIX: 8,
      CDIR64_END: 9,
      CDIR64_END_DATA_SECTOR: 10,
      CDIR64_LOCATOR: 11,
      CENTRAL_DIRECTORY_END: 12,
      CENTRAL_DIRECTORY_END_COMMENT: 13,
      TRAILING_JUNK: 14,
      ERROR: 99
    };
    var FOUR_GIGS = 4294967296;
    var SIG_LOCAL_FILE_HEADER = 67324752;
    var SIG_DATA_DESCRIPTOR = 134695760;
    var SIG_CDIR_RECORD = 33639248;
    var SIG_CDIR64_RECORD_END = 101075792;
    var SIG_CDIR64_LOCATOR_END = 117853008;
    var SIG_CDIR_RECORD_END = 101010256;
    function UnzipStream(options) {
      if (!(this instanceof UnzipStream)) {
        return new UnzipStream(options);
      }
      stream.Transform.call(this);
      this.options = options || {};
      this.data = new Buffer("");
      this.state = states.STREAM_START;
      this.skippedBytes = 0;
      this.parsedEntity = null;
      this.outStreamInfo = {};
    }
    util.inherits(UnzipStream, stream.Transform);
    UnzipStream.prototype.processDataChunk = function(chunk) {
      var requiredLength;
      switch (this.state) {
        case states.STREAM_START:
        case states.START:
          requiredLength = 4;
          break;
        case states.LOCAL_FILE_HEADER:
          requiredLength = 26;
          break;
        case states.LOCAL_FILE_HEADER_SUFFIX:
          requiredLength = this.parsedEntity.fileNameLength + this.parsedEntity.extraFieldLength;
          break;
        case states.DATA_DESCRIPTOR:
          requiredLength = 12;
          break;
        case states.CENTRAL_DIRECTORY_FILE_HEADER:
          requiredLength = 42;
          break;
        case states.CENTRAL_DIRECTORY_FILE_HEADER_SUFFIX:
          requiredLength = this.parsedEntity.fileNameLength + this.parsedEntity.extraFieldLength + this.parsedEntity.fileCommentLength;
          break;
        case states.CDIR64_END:
          requiredLength = 52;
          break;
        case states.CDIR64_END_DATA_SECTOR:
          requiredLength = this.parsedEntity.centralDirectoryRecordSize - 44;
          break;
        case states.CDIR64_LOCATOR:
          requiredLength = 16;
          break;
        case states.CENTRAL_DIRECTORY_END:
          requiredLength = 18;
          break;
        case states.CENTRAL_DIRECTORY_END_COMMENT:
          requiredLength = this.parsedEntity.commentLength;
          break;
        case states.FILE_DATA:
          return 0;
        case states.FILE_DATA_END:
          return 0;
        case states.TRAILING_JUNK:
          if (this.options.debug) console.log("found", chunk.length, "bytes of TRAILING_JUNK");
          return chunk.length;
        default:
          return chunk.length;
      }
      var chunkLength = chunk.length;
      if (chunkLength < requiredLength) {
        return 0;
      }
      switch (this.state) {
        case states.STREAM_START:
        case states.START:
          var signature = chunk.readUInt32LE(0);
          switch (signature) {
            case SIG_LOCAL_FILE_HEADER:
              this.state = states.LOCAL_FILE_HEADER;
              break;
            case SIG_CDIR_RECORD:
              this.state = states.CENTRAL_DIRECTORY_FILE_HEADER;
              break;
            case SIG_CDIR64_RECORD_END:
              this.state = states.CDIR64_END;
              break;
            case SIG_CDIR64_LOCATOR_END:
              this.state = states.CDIR64_LOCATOR;
              break;
            case SIG_CDIR_RECORD_END:
              this.state = states.CENTRAL_DIRECTORY_END;
              break;
            default:
              var isStreamStart = this.state === states.STREAM_START;
              if (!isStreamStart && (signature & 65535) !== 19280 && this.skippedBytes < 26) {
                var remaining = signature;
                var toSkip = 4;
                for (var i = 1; i < 4 && remaining !== 0; i++) {
                  remaining = remaining >>> 8;
                  if ((remaining & 255) === 80) {
                    toSkip = i;
                    break;
                  }
                }
                this.skippedBytes += toSkip;
                if (this.options.debug) console.log("Skipped", this.skippedBytes, "bytes");
                return toSkip;
              }
              this.state = states.ERROR;
              var errMsg = isStreamStart ? "Not a valid zip file" : "Invalid signature in zip file";
              if (this.options.debug) {
                var sig = chunk.readUInt32LE(0);
                var asString;
                try {
                  asString = chunk.slice(0, 4).toString();
                } catch (e) {
                }
                console.log("Unexpected signature in zip file: 0x" + sig.toString(16), '"' + asString + '", skipped', this.skippedBytes, "bytes");
              }
              this.emit("error", new Error(errMsg));
              return chunk.length;
          }
          this.skippedBytes = 0;
          return requiredLength;
        case states.LOCAL_FILE_HEADER:
          this.parsedEntity = this._readFile(chunk);
          this.state = states.LOCAL_FILE_HEADER_SUFFIX;
          return requiredLength;
        case states.LOCAL_FILE_HEADER_SUFFIX:
          var entry = new Entry();
          var isUtf8 = (this.parsedEntity.flags & 2048) !== 0;
          entry.path = this._decodeString(chunk.slice(0, this.parsedEntity.fileNameLength), isUtf8);
          var extraDataBuffer = chunk.slice(this.parsedEntity.fileNameLength, this.parsedEntity.fileNameLength + this.parsedEntity.extraFieldLength);
          var extra = this._readExtraFields(extraDataBuffer);
          if (extra && extra.parsed) {
            if (extra.parsed.path && !isUtf8) {
              entry.path = extra.parsed.path;
            }
            if (Number.isFinite(extra.parsed.uncompressedSize) && this.parsedEntity.uncompressedSize === FOUR_GIGS - 1) {
              this.parsedEntity.uncompressedSize = extra.parsed.uncompressedSize;
            }
            if (Number.isFinite(extra.parsed.compressedSize) && this.parsedEntity.compressedSize === FOUR_GIGS - 1) {
              this.parsedEntity.compressedSize = extra.parsed.compressedSize;
            }
          }
          this.parsedEntity.extra = extra.parsed || {};
          if (this.options.debug) {
            const debugObj = Object.assign({}, this.parsedEntity, {
              path: entry.path,
              flags: "0x" + this.parsedEntity.flags.toString(16),
              extraFields: extra && extra.debug
            });
            console.log("decoded LOCAL_FILE_HEADER:", JSON.stringify(debugObj, null, 2));
          }
          this._prepareOutStream(this.parsedEntity, entry);
          this.emit("entry", entry);
          this.state = states.FILE_DATA;
          return requiredLength;
        case states.CENTRAL_DIRECTORY_FILE_HEADER:
          this.parsedEntity = this._readCentralDirectoryEntry(chunk);
          this.state = states.CENTRAL_DIRECTORY_FILE_HEADER_SUFFIX;
          return requiredLength;
        case states.CENTRAL_DIRECTORY_FILE_HEADER_SUFFIX:
          var isUtf8 = (this.parsedEntity.flags & 2048) !== 0;
          var path3 = this._decodeString(chunk.slice(0, this.parsedEntity.fileNameLength), isUtf8);
          var extraDataBuffer = chunk.slice(this.parsedEntity.fileNameLength, this.parsedEntity.fileNameLength + this.parsedEntity.extraFieldLength);
          var extra = this._readExtraFields(extraDataBuffer);
          if (extra && extra.parsed && extra.parsed.path && !isUtf8) {
            path3 = extra.parsed.path;
          }
          this.parsedEntity.extra = extra.parsed;
          var isUnix = (this.parsedEntity.versionMadeBy & 65280) >> 8 === 3;
          var unixAttrs, isSymlink;
          if (isUnix) {
            unixAttrs = this.parsedEntity.externalFileAttributes >>> 16;
            var fileType = unixAttrs >>> 12;
            isSymlink = (fileType & 10) === 10;
          }
          if (this.options.debug) {
            const debugObj = Object.assign({}, this.parsedEntity, {
              path: path3,
              flags: "0x" + this.parsedEntity.flags.toString(16),
              unixAttrs: unixAttrs && "0" + unixAttrs.toString(8),
              isSymlink,
              extraFields: extra.debug
            });
            console.log("decoded CENTRAL_DIRECTORY_FILE_HEADER:", JSON.stringify(debugObj, null, 2));
          }
          this.state = states.START;
          return requiredLength;
        case states.CDIR64_END:
          this.parsedEntity = this._readEndOfCentralDirectory64(chunk);
          if (this.options.debug) {
            console.log("decoded CDIR64_END_RECORD:", this.parsedEntity);
          }
          this.state = states.CDIR64_END_DATA_SECTOR;
          return requiredLength;
        case states.CDIR64_END_DATA_SECTOR:
          this.state = states.START;
          return requiredLength;
        case states.CDIR64_LOCATOR:
          this.state = states.START;
          return requiredLength;
        case states.CENTRAL_DIRECTORY_END:
          this.parsedEntity = this._readEndOfCentralDirectory(chunk);
          if (this.options.debug) {
            console.log("decoded CENTRAL_DIRECTORY_END:", this.parsedEntity);
          }
          this.state = states.CENTRAL_DIRECTORY_END_COMMENT;
          return requiredLength;
        case states.CENTRAL_DIRECTORY_END_COMMENT:
          if (this.options.debug) {
            console.log("decoded CENTRAL_DIRECTORY_END_COMMENT:", chunk.slice(0, requiredLength).toString());
          }
          this.state = states.TRAILING_JUNK;
          return requiredLength;
        case states.ERROR:
          return chunk.length;
        // discard
        default:
          console.log("didn't handle state #", this.state, "discarding");
          return chunk.length;
      }
    };
    UnzipStream.prototype._prepareOutStream = function(vars, entry) {
      var self = this;
      var isDirectory = vars.uncompressedSize === 0 && /[\/\\]$/.test(entry.path);
      entry.path = entry.path.replace(/(?<=^|[/\\]+)[.][.]+(?=[/\\]+|$)/g, ".");
      entry.type = isDirectory ? "Directory" : "File";
      entry.isDirectory = isDirectory;
      var fileSizeKnown = !(vars.flags & 8);
      if (fileSizeKnown) {
        entry.size = vars.uncompressedSize;
      }
      var isVersionSupported = vars.versionsNeededToExtract <= 45;
      this.outStreamInfo = {
        stream: null,
        limit: fileSizeKnown ? vars.compressedSize : -1,
        written: 0
      };
      if (!fileSizeKnown) {
        var pattern = new Buffer(4);
        pattern.writeUInt32LE(SIG_DATA_DESCRIPTOR, 0);
        var zip64Mode = vars.extra.zip64Mode;
        var extraSize = zip64Mode ? 20 : 12;
        var searchPattern = {
          pattern,
          requiredExtraSize: extraSize
        };
        var matcherStream = new MatcherStream(searchPattern, function(matchedChunk, sizeSoFar) {
          var vars2 = self._readDataDescriptor(matchedChunk, zip64Mode);
          var compressedSizeMatches = vars2.compressedSize === sizeSoFar;
          if (!zip64Mode && !compressedSizeMatches && sizeSoFar >= FOUR_GIGS) {
            var overflown = sizeSoFar - FOUR_GIGS;
            while (overflown >= 0) {
              compressedSizeMatches = vars2.compressedSize === overflown;
              if (compressedSizeMatches) break;
              overflown -= FOUR_GIGS;
            }
          }
          if (!compressedSizeMatches) {
            return;
          }
          self.state = states.FILE_DATA_END;
          var sliceOffset = zip64Mode ? 24 : 16;
          if (self.data.length > 0) {
            self.data = Buffer.concat([matchedChunk.slice(sliceOffset), self.data]);
          } else {
            self.data = matchedChunk.slice(sliceOffset);
          }
          return true;
        });
        this.outStreamInfo.stream = matcherStream;
      } else {
        this.outStreamInfo.stream = new stream.PassThrough();
      }
      var isEncrypted = vars.flags & 1 || vars.flags & 64;
      if (isEncrypted || !isVersionSupported) {
        var message = isEncrypted ? "Encrypted files are not supported!" : "Zip version " + Math.floor(vars.versionsNeededToExtract / 10) + "." + vars.versionsNeededToExtract % 10 + " is not supported";
        entry.skip = true;
        setImmediate(() => {
          self.emit("error", new Error(message));
        });
        this.outStreamInfo.stream.pipe(new Entry().autodrain());
        return;
      }
      var isCompressed = vars.compressionMethod > 0;
      if (isCompressed) {
        var inflater = zlib.createInflateRaw();
        inflater.on("error", function(err) {
          self.state = states.ERROR;
          self.emit("error", err);
        });
        this.outStreamInfo.stream.pipe(inflater).pipe(entry);
      } else {
        this.outStreamInfo.stream.pipe(entry);
      }
      if (this._drainAllEntries) {
        entry.autodrain();
      }
    };
    UnzipStream.prototype._readFile = function(data) {
      var vars = binary.parse(data).word16lu("versionsNeededToExtract").word16lu("flags").word16lu("compressionMethod").word16lu("lastModifiedTime").word16lu("lastModifiedDate").word32lu("crc32").word32lu("compressedSize").word32lu("uncompressedSize").word16lu("fileNameLength").word16lu("extraFieldLength").vars;
      return vars;
    };
    UnzipStream.prototype._readExtraFields = function(data) {
      var extra = {};
      var result = { parsed: extra };
      if (this.options.debug) {
        result.debug = [];
      }
      var index = 0;
      while (index < data.length) {
        var vars = binary.parse(data).skip(index).word16lu("extraId").word16lu("extraSize").vars;
        index += 4;
        var fieldType = void 0;
        switch (vars.extraId) {
          case 1:
            fieldType = "Zip64 extended information extra field";
            var z64vars = binary.parse(data.slice(index, index + vars.extraSize)).word64lu("uncompressedSize").word64lu("compressedSize").word64lu("offsetToLocalHeader").word32lu("diskStartNumber").vars;
            if (z64vars.uncompressedSize !== null) {
              extra.uncompressedSize = z64vars.uncompressedSize;
            }
            if (z64vars.compressedSize !== null) {
              extra.compressedSize = z64vars.compressedSize;
            }
            extra.zip64Mode = true;
            break;
          case 10:
            fieldType = "NTFS extra field";
            break;
          case 21589:
            fieldType = "extended timestamp";
            var timestampFields = data.readUInt8(index);
            var offset = 1;
            if (vars.extraSize >= offset + 4 && timestampFields & 1) {
              extra.mtime = new Date(data.readUInt32LE(index + offset) * 1e3);
              offset += 4;
            }
            if (vars.extraSize >= offset + 4 && timestampFields & 2) {
              extra.atime = new Date(data.readUInt32LE(index + offset) * 1e3);
              offset += 4;
            }
            if (vars.extraSize >= offset + 4 && timestampFields & 4) {
              extra.ctime = new Date(data.readUInt32LE(index + offset) * 1e3);
            }
            break;
          case 28789:
            fieldType = "Info-ZIP Unicode Path Extra Field";
            var fieldVer = data.readUInt8(index);
            if (fieldVer === 1) {
              var offset = 1;
              var nameCrc32 = data.readUInt32LE(index + offset);
              offset += 4;
              var pathBuffer = data.slice(index + offset);
              extra.path = pathBuffer.toString();
            }
            break;
          case 13:
          case 22613:
            fieldType = vars.extraId === 13 ? "PKWARE Unix" : "Info-ZIP UNIX (type 1)";
            var offset = 0;
            if (vars.extraSize >= 8) {
              var atime = new Date(data.readUInt32LE(index + offset) * 1e3);
              offset += 4;
              var mtime = new Date(data.readUInt32LE(index + offset) * 1e3);
              offset += 4;
              extra.atime = atime;
              extra.mtime = mtime;
              if (vars.extraSize >= 12) {
                var uid = data.readUInt16LE(index + offset);
                offset += 2;
                var gid = data.readUInt16LE(index + offset);
                offset += 2;
                extra.uid = uid;
                extra.gid = gid;
              }
            }
            break;
          case 30805:
            fieldType = "Info-ZIP UNIX (type 2)";
            var offset = 0;
            if (vars.extraSize >= 4) {
              var uid = data.readUInt16LE(index + offset);
              offset += 2;
              var gid = data.readUInt16LE(index + offset);
              offset += 2;
              extra.uid = uid;
              extra.gid = gid;
            }
            break;
          case 30837:
            fieldType = "Info-ZIP New Unix";
            var offset = 0;
            var extraVer = data.readUInt8(index);
            offset += 1;
            if (extraVer === 1) {
              var uidSize = data.readUInt8(index + offset);
              offset += 1;
              if (uidSize <= 6) {
                extra.uid = data.readUIntLE(index + offset, uidSize);
              }
              offset += uidSize;
              var gidSize = data.readUInt8(index + offset);
              offset += 1;
              if (gidSize <= 6) {
                extra.gid = data.readUIntLE(index + offset, gidSize);
              }
            }
            break;
          case 30062:
            fieldType = "ASi Unix";
            var offset = 0;
            if (vars.extraSize >= 14) {
              var crc = data.readUInt32LE(index + offset);
              offset += 4;
              var mode = data.readUInt16LE(index + offset);
              offset += 2;
              var sizdev = data.readUInt32LE(index + offset);
              offset += 4;
              var uid = data.readUInt16LE(index + offset);
              offset += 2;
              var gid = data.readUInt16LE(index + offset);
              offset += 2;
              extra.mode = mode;
              extra.uid = uid;
              extra.gid = gid;
              if (vars.extraSize > 14) {
                var start = index + offset;
                var end = index + vars.extraSize - 14;
                var symlinkName = this._decodeString(data.slice(start, end));
                extra.symlink = symlinkName;
              }
            }
            break;
        }
        if (this.options.debug) {
          result.debug.push({
            extraId: "0x" + vars.extraId.toString(16),
            description: fieldType,
            data: data.slice(index, index + vars.extraSize).inspect()
          });
        }
        index += vars.extraSize;
      }
      return result;
    };
    UnzipStream.prototype._readDataDescriptor = function(data, zip64Mode) {
      if (zip64Mode) {
        var vars = binary.parse(data).word32lu("dataDescriptorSignature").word32lu("crc32").word64lu("compressedSize").word64lu("uncompressedSize").vars;
        return vars;
      }
      var vars = binary.parse(data).word32lu("dataDescriptorSignature").word32lu("crc32").word32lu("compressedSize").word32lu("uncompressedSize").vars;
      return vars;
    };
    UnzipStream.prototype._readCentralDirectoryEntry = function(data) {
      var vars = binary.parse(data).word16lu("versionMadeBy").word16lu("versionsNeededToExtract").word16lu("flags").word16lu("compressionMethod").word16lu("lastModifiedTime").word16lu("lastModifiedDate").word32lu("crc32").word32lu("compressedSize").word32lu("uncompressedSize").word16lu("fileNameLength").word16lu("extraFieldLength").word16lu("fileCommentLength").word16lu("diskNumber").word16lu("internalFileAttributes").word32lu("externalFileAttributes").word32lu("offsetToLocalFileHeader").vars;
      return vars;
    };
    UnzipStream.prototype._readEndOfCentralDirectory64 = function(data) {
      var vars = binary.parse(data).word64lu("centralDirectoryRecordSize").word16lu("versionMadeBy").word16lu("versionsNeededToExtract").word32lu("diskNumber").word32lu("diskNumberWithCentralDirectoryStart").word64lu("centralDirectoryEntries").word64lu("totalCentralDirectoryEntries").word64lu("sizeOfCentralDirectory").word64lu("offsetToStartOfCentralDirectory").vars;
      return vars;
    };
    UnzipStream.prototype._readEndOfCentralDirectory = function(data) {
      var vars = binary.parse(data).word16lu("diskNumber").word16lu("diskStart").word16lu("centralDirectoryEntries").word16lu("totalCentralDirectoryEntries").word32lu("sizeOfCentralDirectory").word32lu("offsetToStartOfCentralDirectory").word16lu("commentLength").vars;
      return vars;
    };
    var cp437 = "\0\u263A\u263B\u2665\u2666\u2663\u2660\u2022\u25D8\u25CB\u25D9\u2642\u2640\u266A\u266B\u263C\u25BA\u25C4\u2195\u203C\xB6\xA7\u25AC\u21A8\u2191\u2193\u2192\u2190\u221F\u2194\u25B2\u25BC !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\u2302\xC7\xFC\xE9\xE2\xE4\xE0\xE5\xE7\xEA\xEB\xE8\xEF\xEE\xEC\xC4\xC5\xC9\xE6\xC6\xF4\xF6\xF2\xFB\xF9\xFF\xD6\xDC\xA2\xA3\xA5\u20A7\u0192\xE1\xED\xF3\xFA\xF1\xD1\xAA\xBA\xBF\u2310\xAC\xBD\xBC\xA1\xAB\xBB\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580\u03B1\xDF\u0393\u03C0\u03A3\u03C3\xB5\u03C4\u03A6\u0398\u03A9\u03B4\u221E\u03C6\u03B5\u2229\u2261\xB1\u2265\u2264\u2320\u2321\xF7\u2248\xB0\u2219\xB7\u221A\u207F\xB2\u25A0 ";
    UnzipStream.prototype._decodeString = function(buffer, isUtf8) {
      if (isUtf8) {
        return buffer.toString("utf8");
      }
      if (this.options.decodeString) {
        return this.options.decodeString(buffer);
      }
      let result = "";
      for (var i = 0; i < buffer.length; i++) {
        result += cp437[buffer[i]];
      }
      return result;
    };
    UnzipStream.prototype._parseOrOutput = function(encoding, cb) {
      var consume;
      while ((consume = this.processDataChunk(this.data)) > 0) {
        this.data = this.data.slice(consume);
        if (this.data.length === 0) break;
      }
      if (this.state === states.FILE_DATA) {
        if (this.outStreamInfo.limit >= 0) {
          var remaining = this.outStreamInfo.limit - this.outStreamInfo.written;
          var packet;
          if (remaining < this.data.length) {
            packet = this.data.slice(0, remaining);
            this.data = this.data.slice(remaining);
          } else {
            packet = this.data;
            this.data = new Buffer("");
          }
          this.outStreamInfo.written += packet.length;
          if (this.outStreamInfo.limit === this.outStreamInfo.written) {
            this.state = states.START;
            this.outStreamInfo.stream.end(packet, encoding, cb);
          } else {
            this.outStreamInfo.stream.write(packet, encoding, cb);
          }
        } else {
          var packet = this.data;
          this.data = new Buffer("");
          this.outStreamInfo.written += packet.length;
          var outputStream = this.outStreamInfo.stream;
          outputStream.write(packet, encoding, () => {
            if (this.state === states.FILE_DATA_END) {
              this.state = states.START;
              return outputStream.end(cb);
            }
            cb();
          });
        }
        return;
      }
      cb();
    };
    UnzipStream.prototype.drainAll = function() {
      this._drainAllEntries = true;
    };
    UnzipStream.prototype._transform = function(chunk, encoding, cb) {
      var self = this;
      if (self.data.length > 0) {
        self.data = Buffer.concat([self.data, chunk]);
      } else {
        self.data = chunk;
      }
      var startDataLength = self.data.length;
      var done = function() {
        if (self.data.length > 0 && self.data.length < startDataLength) {
          startDataLength = self.data.length;
          self._parseOrOutput(encoding, done);
          return;
        }
        cb();
      };
      self._parseOrOutput(encoding, done);
    };
    UnzipStream.prototype._flush = function(cb) {
      var self = this;
      if (self.data.length > 0) {
        self._parseOrOutput("buffer", function() {
          if (self.data.length > 0) return setImmediate(function() {
            self._flush(cb);
          });
          cb();
        });
        return;
      }
      if (self.state === states.FILE_DATA) {
        return cb(new Error("Stream finished in an invalid state, uncompression failed"));
      }
      setImmediate(cb);
    };
    module.exports = UnzipStream;
  }
});

// ../node_modules/.pnpm/unzip-stream@0.3.4/node_modules/unzip-stream/lib/parser-stream.js
var require_parser_stream = __commonJS({
  "../node_modules/.pnpm/unzip-stream@0.3.4/node_modules/unzip-stream/lib/parser-stream.js"(exports, module) {
    "use strict";
    var Transform = __require("stream").Transform;
    var util = __require("util");
    var UnzipStream = require_unzip_stream();
    function ParserStream(opts) {
      if (!(this instanceof ParserStream)) {
        return new ParserStream(opts);
      }
      var transformOpts = opts || {};
      Transform.call(this, { readableObjectMode: true });
      this.opts = opts || {};
      this.unzipStream = new UnzipStream(this.opts);
      var self = this;
      this.unzipStream.on("entry", function(entry) {
        self.push(entry);
      });
      this.unzipStream.on("error", function(error) {
        self.emit("error", error);
      });
    }
    util.inherits(ParserStream, Transform);
    ParserStream.prototype._transform = function(chunk, encoding, cb) {
      this.unzipStream.write(chunk, encoding, cb);
    };
    ParserStream.prototype._flush = function(cb) {
      var self = this;
      this.unzipStream.end(function() {
        process.nextTick(function() {
          self.emit("close");
        });
        cb();
      });
    };
    ParserStream.prototype.on = function(eventName, fn) {
      if (eventName === "entry") {
        return Transform.prototype.on.call(this, "data", fn);
      }
      return Transform.prototype.on.call(this, eventName, fn);
    };
    ParserStream.prototype.drainAll = function() {
      this.unzipStream.drainAll();
      return this.pipe(new Transform({ objectMode: true, transform: function(d, e, cb) {
        cb();
      } }));
    };
    module.exports = ParserStream;
  }
});

// ../node_modules/.pnpm/mkdirp@0.5.6/node_modules/mkdirp/index.js
var require_mkdirp = __commonJS({
  "../node_modules/.pnpm/mkdirp@0.5.6/node_modules/mkdirp/index.js"(exports, module) {
    "use strict";
    var path3 = __require("path");
    var fs3 = __require("fs");
    var _0777 = parseInt("0777", 8);
    module.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;
    function mkdirP(p, opts, f, made) {
      if (typeof opts === "function") {
        f = opts;
        opts = {};
      } else if (!opts || typeof opts !== "object") {
        opts = { mode: opts };
      }
      var mode = opts.mode;
      var xfs = opts.fs || fs3;
      if (mode === void 0) {
        mode = _0777;
      }
      if (!made) made = null;
      var cb = f || /* istanbul ignore next */
      function() {
      };
      p = path3.resolve(p);
      xfs.mkdir(p, mode, function(er) {
        if (!er) {
          made = made || p;
          return cb(null, made);
        }
        switch (er.code) {
          case "ENOENT":
            if (path3.dirname(p) === p) return cb(er);
            mkdirP(path3.dirname(p), opts, function(er2, made2) {
              if (er2) cb(er2, made2);
              else mkdirP(p, opts, cb, made2);
            });
            break;
          // In the case of any other error, just see if there's a dir
          // there already.  If so, then hooray!  If not, then something
          // is borked.
          default:
            xfs.stat(p, function(er2, stat) {
              if (er2 || !stat.isDirectory()) cb(er, made);
              else cb(null, made);
            });
            break;
        }
      });
    }
    mkdirP.sync = function sync(p, opts, made) {
      if (!opts || typeof opts !== "object") {
        opts = { mode: opts };
      }
      var mode = opts.mode;
      var xfs = opts.fs || fs3;
      if (mode === void 0) {
        mode = _0777;
      }
      if (!made) made = null;
      p = path3.resolve(p);
      try {
        xfs.mkdirSync(p, mode);
        made = made || p;
      } catch (err0) {
        switch (err0.code) {
          case "ENOENT":
            made = sync(path3.dirname(p), opts, made);
            sync(p, opts, made);
            break;
          // In the case of any other error, just see if there's a dir
          // there already.  If so, then hooray!  If not, then something
          // is borked.
          default:
            var stat;
            try {
              stat = xfs.statSync(p);
            } catch (err1) {
              throw err0;
            }
            if (!stat.isDirectory()) throw err0;
            break;
        }
      }
      return made;
    };
  }
});

// ../node_modules/.pnpm/unzip-stream@0.3.4/node_modules/unzip-stream/lib/extract.js
var require_extract = __commonJS({
  "../node_modules/.pnpm/unzip-stream@0.3.4/node_modules/unzip-stream/lib/extract.js"(exports, module) {
    "use strict";
    var fs3 = __require("fs");
    var path3 = __require("path");
    var util = __require("util");
    var mkdirp = require_mkdirp();
    var Transform = __require("stream").Transform;
    var UnzipStream = require_unzip_stream();
    function Extract(opts) {
      if (!(this instanceof Extract))
        return new Extract(opts);
      Transform.call(this);
      this.opts = opts || {};
      this.unzipStream = new UnzipStream(this.opts);
      this.unfinishedEntries = 0;
      this.afterFlushWait = false;
      this.createdDirectories = {};
      var self = this;
      this.unzipStream.on("entry", this._processEntry.bind(this));
      this.unzipStream.on("error", function(error) {
        self.emit("error", error);
      });
    }
    util.inherits(Extract, Transform);
    Extract.prototype._transform = function(chunk, encoding, cb) {
      this.unzipStream.write(chunk, encoding, cb);
    };
    Extract.prototype._flush = function(cb) {
      var self = this;
      var allDone = function() {
        process.nextTick(function() {
          self.emit("close");
        });
        cb();
      };
      this.unzipStream.end(function() {
        if (self.unfinishedEntries > 0) {
          self.afterFlushWait = true;
          return self.on("await-finished", allDone);
        }
        allDone();
      });
    };
    Extract.prototype._processEntry = function(entry) {
      var self = this;
      var destPath = path3.join(this.opts.path, entry.path);
      var directory = entry.isDirectory ? destPath : path3.dirname(destPath);
      this.unfinishedEntries++;
      var writeFileFn = function() {
        var pipedStream = fs3.createWriteStream(destPath);
        pipedStream.on("close", function() {
          self.unfinishedEntries--;
          self._notifyAwaiter();
        });
        pipedStream.on("error", function(error) {
          self.emit("error", error);
        });
        entry.pipe(pipedStream);
      };
      if (this.createdDirectories[directory] || directory === ".") {
        return writeFileFn();
      }
      mkdirp(directory, function(err) {
        if (err) return self.emit("error", err);
        self.createdDirectories[directory] = true;
        if (entry.isDirectory) {
          self.unfinishedEntries--;
          self._notifyAwaiter();
          return;
        }
        writeFileFn();
      });
    };
    Extract.prototype._notifyAwaiter = function() {
      if (this.afterFlushWait && this.unfinishedEntries === 0) {
        this.emit("await-finished");
        this.afterFlushWait = false;
      }
    };
    module.exports = Extract;
  }
});

// ../node_modules/.pnpm/unzip-stream@0.3.4/node_modules/unzip-stream/unzip.js
var require_unzip = __commonJS({
  "../node_modules/.pnpm/unzip-stream@0.3.4/node_modules/unzip-stream/unzip.js"(exports) {
    "use strict";
    exports.Parse = require_parser_stream();
    exports.Extract = require_extract();
  }
});

// src/types/IPluginManager.ts
var PluginError = class extends Error {
  constructor(pluginId, code, message, originalError) {
    super(message);
    this.pluginId = pluginId;
    this.code = code;
    this.originalError = originalError;
    this.name = "PluginError";
  }
};

// src/index.ts
import * as path2 from "path";
import * as fs2 from "fs-extra";
import axios2 from "axios";

// utils/index.ts
var import_unzip_stream = __toESM(require_unzip());
import { default as fsa } from "fs-extra";
import path from "path";
import fs from "node:fs";
import axios from "axios";
import * as crypto from "crypto";
async function getFilesWithExtension(directory, extension) {
  const files = await fsa.readdir(directory);
  const filteredFiles = files.filter((file) => path.extname(file) === extension);
  return filteredFiles;
}
async function getFilesIncludeName(directory, name) {
  const files = await fsa.readdir(directory, { withFileTypes: true });
  const filteredFile = files.find((item) => item.isDirectory() && item.name.includes(name));
  if (!filteredFile) {
    return "";
  }
  return path.join(directory, filteredFile.name);
}
function getFileNameWithoutExtension(filePath) {
  if (!filePath) {
    return "";
  }
  const { name } = path.parse(filePath);
  return name;
}
function unzipFile(zipFilePath, outputFolderPath) {
  return new Promise((resolve2, reject) => {
    const readStream = fs.createReadStream(zipFilePath);
    fsa.ensureDirSync(outputFolderPath);
    readStream.pipe(import_unzip_stream.default.Extract({ path: outputFolderPath })).on("error", reject).on("close", resolve2);
  });
}
async function downloadFile({ url, savePath, agent, startCallback, progressCallback, completionCallback, errorCallback }) {
  try {
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
      httpsAgent: agent,
      timeout: 5e3
      // 设置超时时间为5秒
    });
    const tempFilePath = `${savePath}.downloading`;
    const writer = fs.createWriteStream(tempFilePath);
    response.data.pipe(writer);
    if (startCallback) {
      startCallback();
    }
    let bytesDownloaded = 0;
    let totalSize = null;
    response.data.on("data", (chunk) => {
      bytesDownloaded += chunk.length;
      if (progressCallback && totalSize) {
        const progress = bytesDownloaded / totalSize * 100;
        progressCallback(progress);
      }
    });
    response.data.on("response", (res) => {
      totalSize = parseInt(res.headers["content-length"], 10);
    });
    writer.on("finish", () => {
      fs.rename(tempFilePath, savePath, (err) => {
        if (err) {
          throw err;
        } else {
          if (completionCallback) {
            completionCallback(savePath);
          }
        }
      });
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
      console.log("\u8BF7\u6C42\u8D85\u65F6\uFF1A", error);
      errorCallback == null ? void 0 : errorCallback(error);
    } else {
      console.log("\u7F51\u7EDC\u9519\u8BEF\uFF1A", error);
      errorCallback == null ? void 0 : errorCallback(error);
    }
  }
}
function calculateFileHash(filePath) {
  return new Promise((resolve2, reject) => {
    const hash = crypto.createHash("sha256");
    const input = fs.createReadStream(filePath);
    input.on("error", reject);
    hash.on("readable", () => {
      const data = hash.read();
      if (data) {
        resolve2(data.toString("hex"));
      }
    });
    input.pipe(hash);
  });
}

// src/index.ts
import { compareVersions } from "compare-versions";
var PluginManager = class {
  constructor(config) {
    this.defaultTimeout = 1e4;
    this.plugins = /* @__PURE__ */ new Map();
    this.pluginsConfig = /* @__PURE__ */ new Map();
    this.uninstallPlugins = /* @__PURE__ */ new Map();
    this.agentInfo = null;
    this.eventListeners = /* @__PURE__ */ new Map();
    this.config = {
      pluginRegistry: process.env.PLUGIN_REGISTRY || "",
      pluginDir: path2.join(process.cwd(), "plugins"),
      autoUpdate: false,
      maxConcurrent: 3,
      timeout: this.defaultTimeout,
      ...config
    };
    this.init();
  }
  async init() {
    try {
      await fs2.ensureDir(this.config.pluginDir);
      await this.getUninstallPlugins();
      if (this.config.buildInPluginDir) {
        await this._loadBuildInPlugins(this.config.buildInPluginDir, this.config.pluginDir);
      }
      await this.getPluginsConfig();
    } catch (error) {
      console.error("Failed to initialize PluginManager:", error);
      throw error;
    }
  }
  getPlugins() {
    return this.plugins;
  }
  async getPluginsConfig() {
    if (this.pluginsConfig.size === 0) {
      this.pluginsConfig = await this._loadPluginsConfig(this.config.pluginDir).catch((error) => {
        console.error("Failed to load plugins config:", error);
        return /* @__PURE__ */ new Map();
      });
    }
    return this.pluginsConfig;
  }
  async getAgentInfo() {
    if (!this.agentInfo) {
      this.agentInfo = await this._loadAgentInfo();
    }
    return this.agentInfo;
  }
  async getUninstallPlugins() {
    if (this.uninstallPlugins.size === 0) {
      const uninstallPath = path2.join(this.config.pluginDir, "uninstall.json");
      if (await fs2.pathExists(uninstallPath)) {
        this.uninstallPlugins = await fs2.readJSON(uninstallPath);
      }
    }
    return this.uninstallPlugins;
  }
  async _loadAgentInfo() {
    const pluginDir = this.config.pluginDir;
    const agentPath = path2.join(pluginDir, "Agent.json");
    if (await fs2.pathExists(agentPath)) {
      const agent = await fs2.readJSON(agentPath);
      return agent;
    }
    return null;
  }
  /**
  * 加载本地预设插件，将里面已经存在的插件复制到用户的插件安装目录
  *
  * @param {string} pluginsFolder
  */
  async _loadBuildInPlugins(buildInPluginDir, pluginDir) {
    const res = await getFilesWithExtension(buildInPluginDir, ".pemox");
    if (res.length) {
      console.log("-----------start install local plugins");
      for (const p of res) {
        const pluginPath = path2.resolve(buildInPluginDir, p);
        const pluginDest = path2.resolve(pluginDir, getFileNameWithoutExtension(p));
        console.log(pluginPath);
        if (fs2.existsSync(pluginDest)) {
          const { name } = path2.parse(pluginDest);
          const version = name.split("@")[1];
          const { name: buildInPluginName } = path2.parse(p);
          const buildInPluginVersion = buildInPluginName.split("@")[1];
          console.log(version, buildInPluginVersion, compareVersions(version, buildInPluginVersion));
          if (compareVersions(version, buildInPluginVersion) >= 0) {
            console.log(`Skipping plugin: version ${version} is newer than builtin version ${buildInPluginVersion}`);
            continue;
          }
          if (this.uninstallPlugins.has(name)) {
            console.log(`Skipping plugin: ${name} is uninstalled`);
            continue;
          }
        }
        await unzipFile(pluginPath, pluginDest);
      }
      console.log("-----------finished");
    }
  }
  /**
   * 加载插件目录下所有插件的manifest.json配置
   * @param pluginDir 插件目录
   */
  async _loadPluginsConfig(pluginDir) {
    try {
      await fs2.ensureDir(pluginDir);
      const pluginDirs = await fs2.readdir(pluginDir);
      const pluginsConfig = /* @__PURE__ */ new Map();
      for (const dir of pluginDirs) {
        try {
          const manifestPath = path2.join(pluginDir, dir, "manifest.json");
          if (await fs2.pathExists(manifestPath)) {
            const manifest = await fs2.readJSON(manifestPath);
            const icon = path2.join(pluginDir, dir, `icon.svg`);
            if (await fs2.pathExists(icon)) {
              manifest.localIcon = icon;
            }
            pluginsConfig.set(manifest.pluginId, manifest);
            console.log(`Loaded config for plugin: ${dir}`);
          }
        } catch (error) {
          console.error(`Error loading config for plugin ${dir}:`, error);
        }
      }
      return pluginsConfig;
    } catch (error) {
      console.error("Error loading plugins config:", error);
      throw error;
    }
  }
  // 获取插件实例
  async loadPlugin(pluginId) {
    if (this.plugins.has(pluginId)) {
      return this.plugins.get(pluginId);
    }
    const pluginPath = await getFilesIncludeName(this.config.pluginDir, pluginId);
    console.log("pluginPath", pluginPath);
    const plugin = await this._loadAndRegisterPlugin(pluginId, pluginPath);
    this.plugins.set(pluginId, plugin);
    return plugin;
  }
  // 插件加载和注册
  async _loadAndRegisterPlugin(pluginId, pluginPath) {
    try {
      const manifestPath = path2.resolve(pluginPath, "manifest.json");
      const manifest = await fs2.readJSON(manifestPath);
      if (!manifest) {
        throw new PluginError(pluginId, "MANIFEST_NOT_FOUND", "Manifest not found");
      }
      const fileEntry = path2.resolve(pluginPath, manifest.main);
      return __require(fileEntry).default;
    } catch (error) {
      throw new PluginError(pluginId, "LOAD_ERROR", `Failed to load plugin: ${error.message}`, error);
    }
  }
  /**
   * 获取插件仓库中的插件列表
   * @param url 插件仓库的URL
   * @param httpAgent 可选的HTTP代理
   * @returns 插件列表
   */
  async getAvailablePlugins(url, { httpAgent }) {
    try {
      const response = await axios2.get(url, {
        headers: { "Content-Type": "application/json" },
        httpsAgent: httpAgent
      });
      return response.data;
    } catch (error) {
      throw new PluginError(
        "system",
        "REGISTRY_ERROR",
        `Failed to fetch available plugins: ${error.message}`,
        error
      );
    }
  }
  /**
   * 从本地.pemox文件安装插件
   * @param pemoxPath .pemox文件的路径
   * @param options 安装选项
   */
  async installFromPemox(pemoxPath, options) {
    try {
      if (!await fs2.pathExists(pemoxPath)) {
        throw new PluginError("system", "FILE_NOT_FOUND", `Pemox file not found: ${pemoxPath}`);
      }
      if (!pemoxPath.endsWith(".pemox")) {
        throw new PluginError("system", "INVALID_FILE_TYPE", "File must be a .pemox file");
      }
      const tempDir = path2.join(this.config.pluginDir, "temp");
      await fs2.ensureDir(tempDir);
      try {
        await unzipFile(pemoxPath, tempDir);
        const manifestPath = path2.join(tempDir, "manifest.json");
        if (!await fs2.pathExists(manifestPath)) {
          throw new PluginError("system", "MANIFEST_NOT_FOUND", "Manifest not found in pemox file");
        }
        const manifest = await fs2.readJSON(manifestPath);
        if (!manifest.pluginId || !manifest.version) {
          throw new PluginError("system", "INVALID_MANIFEST", "Invalid manifest in pemox file");
        }
        const pluginId = manifest.pluginId;
        const version = manifest.version;
        const pluginPath = path2.join(this.config.pluginDir, `${pluginId}@${version}`);
        if (this.pluginsConfig.has(pluginId)) {
          const installedManifest = this.pluginsConfig.get(pluginId);
          const installedVersion = installedManifest.version;
          if (!(options == null ? void 0 : options.force) && compareVersions(version, installedVersion) <= 0) {
            console.log(`Skipping plugin: version ${version} is not newer than installed version ${installedVersion}`);
            return;
          }
        }
        await fs2.ensureDir(pluginPath);
        await fs2.copy(tempDir, pluginPath);
        const icon = path2.join(pluginPath, `icon.svg`);
        if (await fs2.pathExists(icon)) {
          manifest.localIcon = icon;
        }
        this.pluginsConfig.set(pluginId, manifest);
        await this.removeOldPlugin(pluginId);
        this.emitEvent("onInstall", pluginId);
      } finally {
        await fs2.remove(tempDir);
      }
    } catch (error) {
      throw new PluginError(
        "system",
        "PEMOX_INSTALL_ERROR",
        `Failed to install from pemox file: ${error.message}`,
        error
      );
    }
  }
  /**
   * 批量安装.pemox文件
   * @param pemoxPaths .pemox文件路径数组
   * @param options 安装选项
   */
  async installMultipleFromPemox(pemoxPaths, options) {
    const maxConcurrent = this.config.maxConcurrent || 3;
    const chunks = [];
    for (let i = 0; i < pemoxPaths.length; i += maxConcurrent) {
      const chunk = pemoxPaths.slice(i, i + maxConcurrent);
      chunks.push(chunk);
    }
    for (const chunk of chunks) {
      await Promise.all(chunk.map((pemoxPath) => this.installFromPemox(pemoxPath, options)));
    }
  }
  async installFromOnline(pluginManifest, options) {
    return new Promise(async (resolve2) => {
      try {
        const pluginId = pluginManifest.pluginId;
        const version = pluginManifest.version;
        const pluginPath = path2.join(this.config.pluginDir, `${pluginId}@${version}`);
        if (this.pluginsConfig.has(pluginId)) {
          const installedManifest = this.pluginsConfig.get(pluginId);
          const installedVersion = installedManifest.version;
          if (!(options == null ? void 0 : options.force) && compareVersions(version, installedVersion) <= 0) {
            console.log(`Skipping plugin: version ${version} is not newer than installed version ${installedVersion}`);
            return true;
          }
        }
        await fs2.ensureDir(pluginPath);
        const downloadUrl = pluginManifest.link;
        if (!downloadUrl) {
          throw new PluginError(
            pluginId,
            "DOWNLOAD_URL_NOT_FOUND",
            "Download URL not found"
          );
        }
        console.log("downloadUrl", downloadUrl);
        const savePath = path2.resolve(this.config.pluginDir, "_download");
        downloadFile({
          url: downloadUrl,
          savePath,
          startCallback: () => {
            console.log("Download started");
          },
          progressCallback: (progress) => {
            if (options == null ? void 0 : options.progressCallback) {
              options.progressCallback(progress);
            }
            console.log(`Download progress: ${progress}%`);
          },
          completionCallback: async (localPath) => {
            console.log(`Download completed. File saved at: ${localPath}`);
            const hash = await calculateFileHash(localPath);
            console.log("Check hash:", hash, pluginManifest.fileHash);
            if (hash === pluginManifest.fileHash) {
              await unzipFile(localPath, pluginPath);
              const icon = path2.join(pluginPath, `icon.svg`);
              if (await fs2.pathExists(icon)) {
                pluginManifest.localIcon = icon;
              }
              this.pluginsConfig.set(pluginId, pluginManifest);
              await this.removeOldPlugin(pluginId);
              resolve2({ success: true, pluginsConfig: this.pluginsConfig });
            } else {
              throw new PluginError(
                pluginId,
                "HASH_MISMATCH",
                `Downloaded file hash (${hash}) does not match expected hash (${pluginManifest.fileHash})`
              );
            }
          },
          errorCallback: (error) => {
            throw new PluginError(
              pluginId,
              "DOWNLOAD_ERROR",
              `Failed to download plugin: ${error.message}`,
              error
            );
          },
          agent: options == null ? void 0 : options.agent
        });
      } catch (error) {
        throw new PluginError(
          pluginManifest.pluginId,
          "INSTALL_ERROR",
          `Failed to install plugin: ${error.message}`,
          error
        );
      }
    });
  }
  async removeOldPlugin(pluginId) {
    var _a;
    const oldVersion = (_a = this.pluginsConfig.get(pluginId)) == null ? void 0 : _a.version;
    const oldPluginPath = path2.join(this.config.pluginDir, `${pluginId}@${oldVersion}`);
    console.log("remove old plugin", oldPluginPath);
    await fs2.remove(oldPluginPath);
  }
  /**
   * 卸载插件
   * @param pluginId 插件ID
   */
  async uninstallPlugin(pluginId) {
    try {
      const manifest = this.pluginsConfig.get(pluginId);
      if (!manifest) {
        throw new PluginError(pluginId, "NOT_INSTALLED", "Plugin not installed");
      }
      const plugin = this.plugins.get(pluginId);
      if (plugin) {
        if (typeof plugin.cancelAllRequests === "function") {
          await plugin.cancelAllRequests();
        }
        this.plugins.delete(pluginId);
      }
      const pluginPath = path2.join(this.config.pluginDir, `${pluginId}@${manifest.version}`);
      await fs2.remove(pluginPath);
      this.pluginsConfig.delete(pluginId);
      this.uninstallPlugins.set(pluginId, manifest.version);
      await fs2.writeJSON(path2.join(this.config.pluginDir, "uninstall.json"), this.uninstallPlugins, { spaces: 2 });
      this.emitEvent("onUninstall", pluginId);
    } catch (error) {
      throw new PluginError(
        pluginId,
        "UNINSTALL_ERROR",
        `Failed to uninstall plugin: ${error.message}`,
        error
      );
    }
  }
  /**
   * 获取插件配置
   * @param pluginId 插件ID
   */
  async getPluginConfig(pluginId) {
    const manifest = this.pluginsConfig.get(pluginId);
    if (!manifest) {
      throw new PluginError(pluginId, "NOT_INSTALLED", "Plugin not installed");
    }
    const configPath = path2.join(this.config.pluginDir, `${pluginId}@${manifest.version}`, "config.json");
    try {
      return await fs2.readJSON(configPath);
    } catch {
      return {};
    }
  }
  /**
   * 设置插件配置
   * @param pluginId 插件ID
   * @param config 配置对象
   */
  async setPluginConfig(pluginId, config) {
    const manifest = this.pluginsConfig.get(pluginId);
    if (!manifest) {
      throw new PluginError(pluginId, "NOT_INSTALLED", "Plugin not installed");
    }
    const configPath = path2.join(this.config.pluginDir, `${pluginId}@${manifest.version}`, "manifest.json");
    await fs2.writeJSON(configPath, config, { spaces: 2 });
    this.pluginsConfig.set(pluginId, config);
  }
  /**
   * 设置agent配置
   * @param data agent配置
   */
  async setAgentConfig(config) {
    const agentPath = path2.join(this.config.pluginDir, "Agent.json");
    this.agentInfo = config;
    await fs2.writeJSON(agentPath, this.agentInfo, { spaces: 2 });
    return this.agentInfo;
  }
  emitEvent(type, pluginName) {
    const listeners = this.eventListeners.get(type);
    if (listeners) {
      listeners.forEach((listener) => {
        var _a;
        try {
          listener(pluginName);
        } catch (error) {
          (_a = this.config.logger) == null ? void 0 : _a.error(`Error in ${type} listener: ${error}`);
        }
      });
    }
  }
  /**
   * 添加事件监听器
   * @param type 事件类型
   * @param listener 监听器函数
   */
  addEventListener(type, listener) {
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, /* @__PURE__ */ new Set());
    }
    this.eventListeners.get(type).add(listener);
  }
  /**
   * 移除事件监听器
   * @param type 事件类型
   * @param listener 监听器函数
   */
  removeEventListener(type, listener) {
    const listeners = this.eventListeners.get(type);
    if (listeners) {
      listeners.delete(listener);
    }
  }
};
export {
  PluginError,
  PluginManager as default
};
//# sourceMappingURL=index.mjs.map
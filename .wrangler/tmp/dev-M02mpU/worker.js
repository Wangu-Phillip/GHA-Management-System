var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
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

// node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name2) {
  return new Error(`[unenv] ${name2} is not implemented yet!`);
}
// @__NO_SIDE_EFFECTS__
function notImplemented(name2) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name2);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name2) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name2} is not implemented yet!`);
    }
  };
}
var init_utils = __esm({
  "node_modules/unenv/dist/runtime/_internal/utils.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(createNotImplementedError, "createNotImplementedError");
    __name(notImplemented, "notImplemented");
    __name(notImplementedClass, "notImplementedClass");
  }
});

// node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin, _performanceNow, nodeTiming, PerformanceEntry, PerformanceMark, PerformanceMeasure, PerformanceResourceTiming, PerformanceObserverEntryList, Performance, PerformanceObserver, performance;
var init_performance = __esm({
  "node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
    _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
    nodeTiming = {
      name: "node",
      entryType: "node",
      startTime: 0,
      duration: 0,
      nodeStart: 0,
      v8Start: 0,
      bootstrapComplete: 0,
      environment: 0,
      loopStart: 0,
      loopExit: 0,
      idleTime: 0,
      uvMetricsInfo: {
        loopCount: 0,
        events: 0,
        eventsWaiting: 0
      },
      detail: void 0,
      toJSON() {
        return this;
      }
    };
    PerformanceEntry = class {
      static {
        __name(this, "PerformanceEntry");
      }
      __unenv__ = true;
      detail;
      entryType = "event";
      name;
      startTime;
      constructor(name2, options) {
        this.name = name2;
        this.startTime = options?.startTime || _performanceNow();
        this.detail = options?.detail;
      }
      get duration() {
        return _performanceNow() - this.startTime;
      }
      toJSON() {
        return {
          name: this.name,
          entryType: this.entryType,
          startTime: this.startTime,
          duration: this.duration,
          detail: this.detail
        };
      }
    };
    PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
      static {
        __name(this, "PerformanceMark");
      }
      entryType = "mark";
      constructor() {
        super(...arguments);
      }
      get duration() {
        return 0;
      }
    };
    PerformanceMeasure = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceMeasure");
      }
      entryType = "measure";
    };
    PerformanceResourceTiming = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceResourceTiming");
      }
      entryType = "resource";
      serverTiming = [];
      connectEnd = 0;
      connectStart = 0;
      decodedBodySize = 0;
      domainLookupEnd = 0;
      domainLookupStart = 0;
      encodedBodySize = 0;
      fetchStart = 0;
      initiatorType = "";
      name = "";
      nextHopProtocol = "";
      redirectEnd = 0;
      redirectStart = 0;
      requestStart = 0;
      responseEnd = 0;
      responseStart = 0;
      secureConnectionStart = 0;
      startTime = 0;
      transferSize = 0;
      workerStart = 0;
      responseStatus = 0;
    };
    PerformanceObserverEntryList = class {
      static {
        __name(this, "PerformanceObserverEntryList");
      }
      __unenv__ = true;
      getEntries() {
        return [];
      }
      getEntriesByName(_name, _type) {
        return [];
      }
      getEntriesByType(type) {
        return [];
      }
    };
    Performance = class {
      static {
        __name(this, "Performance");
      }
      __unenv__ = true;
      timeOrigin = _timeOrigin;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = void 0;
      timing = void 0;
      timerify(_fn, _options) {
        throw createNotImplementedError("Performance.timerify");
      }
      get nodeTiming() {
        return nodeTiming;
      }
      eventLoopUtilization() {
        return {};
      }
      markResourceTiming() {
        return new PerformanceResourceTiming("");
      }
      onresourcetimingbufferfull = null;
      now() {
        if (this.timeOrigin === _timeOrigin) {
          return _performanceNow();
        }
        return Date.now() - this.timeOrigin;
      }
      clearMarks(markName) {
        this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
      }
      clearMeasures(measureName) {
        this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
      }
      clearResourceTimings() {
        this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
      }
      getEntries() {
        return this._entries;
      }
      getEntriesByName(name2, type) {
        return this._entries.filter((e) => e.name === name2 && (!type || e.entryType === type));
      }
      getEntriesByType(type) {
        return this._entries.filter((e) => e.entryType === type);
      }
      mark(name2, options) {
        const entry = new PerformanceMark(name2, options);
        this._entries.push(entry);
        return entry;
      }
      measure(measureName, startOrMeasureOptions, endMark) {
        let start;
        let end;
        if (typeof startOrMeasureOptions === "string") {
          start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
          end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
        } else {
          start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
        }
        const entry = new PerformanceMeasure(measureName, {
          startTime: start,
          detail: {
            start,
            end
          }
        });
        this._entries.push(entry);
        return entry;
      }
      setResourceTimingBufferSize(maxSize) {
        this._resourceTimingBufferSize = maxSize;
      }
      addEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.addEventListener");
      }
      removeEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw createNotImplementedError("Performance.dispatchEvent");
      }
      toJSON() {
        return this;
      }
    };
    PerformanceObserver = class {
      static {
        __name(this, "PerformanceObserver");
      }
      __unenv__ = true;
      static supportedEntryTypes = [];
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw createNotImplementedError("PerformanceObserver.disconnect");
      }
      observe(options) {
        throw createNotImplementedError("PerformanceObserver.observe");
      }
      bind(fn) {
        return fn;
      }
      runInAsyncScope(fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      asyncId() {
        return 0;
      }
      triggerAsyncId() {
        return 0;
      }
      emitDestroy() {
        return this;
      }
    };
    performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();
  }
});

// node_modules/unenv/dist/runtime/node/perf_hooks.mjs
var init_perf_hooks = __esm({
  "node_modules/unenv/dist/runtime/node/perf_hooks.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_performance();
  }
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
var init_performance2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs"() {
    init_perf_hooks();
    if (!("__unenv__" in performance)) {
      const proto = Performance.prototype;
      for (const key of Object.getOwnPropertyNames(proto)) {
        if (key !== "constructor" && !(key in performance)) {
          const desc = Object.getOwnPropertyDescriptor(proto, key);
          if (desc) {
            Object.defineProperty(performance, key, desc);
          }
        }
      }
    }
    globalThis.performance = performance;
    globalThis.Performance = Performance;
    globalThis.PerformanceEntry = PerformanceEntry;
    globalThis.PerformanceMark = PerformanceMark;
    globalThis.PerformanceMeasure = PerformanceMeasure;
    globalThis.PerformanceObserver = PerformanceObserver;
    globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
    globalThis.PerformanceResourceTiming = PerformanceResourceTiming;
  }
});

// node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default;
var init_noop = __esm({
  "node_modules/unenv/dist/runtime/mock/noop.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    noop_default = Object.assign(() => {
    }, { __unenv__: true });
  }
});

// node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";
var _console, _ignoreErrors, _stderr, _stdout, log, info, trace, debug, table, error, warn, createTask, clear, count, countReset, dir, dirxml, group, groupEnd, groupCollapsed, profile, profileEnd, time, timeEnd, timeLog, timeStamp, Console, _times, _stdoutErrorHandler, _stderrErrorHandler;
var init_console = __esm({
  "node_modules/unenv/dist/runtime/node/console.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_noop();
    init_utils();
    _console = globalThis.console;
    _ignoreErrors = true;
    _stderr = new Writable();
    _stdout = new Writable();
    log = _console?.log ?? noop_default;
    info = _console?.info ?? log;
    trace = _console?.trace ?? info;
    debug = _console?.debug ?? log;
    table = _console?.table ?? log;
    error = _console?.error ?? log;
    warn = _console?.warn ?? error;
    createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
    clear = _console?.clear ?? noop_default;
    count = _console?.count ?? noop_default;
    countReset = _console?.countReset ?? noop_default;
    dir = _console?.dir ?? noop_default;
    dirxml = _console?.dirxml ?? noop_default;
    group = _console?.group ?? noop_default;
    groupEnd = _console?.groupEnd ?? noop_default;
    groupCollapsed = _console?.groupCollapsed ?? noop_default;
    profile = _console?.profile ?? noop_default;
    profileEnd = _console?.profileEnd ?? noop_default;
    time = _console?.time ?? noop_default;
    timeEnd = _console?.timeEnd ?? noop_default;
    timeLog = _console?.timeLog ?? noop_default;
    timeStamp = _console?.timeStamp ?? noop_default;
    Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
    _times = /* @__PURE__ */ new Map();
    _stdoutErrorHandler = noop_default;
    _stderrErrorHandler = noop_default;
  }
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole, assert, clear2, context, count2, countReset2, createTask2, debug2, dir2, dirxml2, error2, group2, groupCollapsed2, groupEnd2, info2, log2, profile2, profileEnd2, table2, time2, timeEnd2, timeLog2, timeStamp2, trace2, warn2, console_default;
var init_console2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_console();
    workerdConsole = globalThis["console"];
    ({
      assert,
      clear: clear2,
      context: (
        // @ts-expect-error undocumented public API
        context
      ),
      count: count2,
      countReset: countReset2,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask2
      ),
      debug: debug2,
      dir: dir2,
      dirxml: dirxml2,
      error: error2,
      group: group2,
      groupCollapsed: groupCollapsed2,
      groupEnd: groupEnd2,
      info: info2,
      log: log2,
      profile: profile2,
      profileEnd: profileEnd2,
      table: table2,
      time: time2,
      timeEnd: timeEnd2,
      timeLog: timeLog2,
      timeStamp: timeStamp2,
      trace: trace2,
      warn: warn2
    } = workerdConsole);
    Object.assign(workerdConsole, {
      Console,
      _ignoreErrors,
      _stderr,
      _stderrErrorHandler,
      _stdout,
      _stdoutErrorHandler,
      _times
    });
    console_default = workerdConsole;
  }
});

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console = __esm({
  "node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console"() {
    init_console2();
    globalThis.console = console_default;
  }
});

// node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime;
var init_hrtime = __esm({
  "node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
      const now = Date.now();
      const seconds = Math.trunc(now / 1e3);
      const nanos = now % 1e3 * 1e6;
      if (startTime) {
        let diffSeconds = seconds - startTime[0];
        let diffNanos = nanos - startTime[0];
        if (diffNanos < 0) {
          diffSeconds = diffSeconds - 1;
          diffNanos = 1e9 + diffNanos;
        }
        return [diffSeconds, diffNanos];
      }
      return [seconds, nanos];
    }, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
      return BigInt(Date.now() * 1e6);
    }, "bigint") });
  }
});

// node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream;
var init_read_stream = __esm({
  "node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ReadStream = class {
      static {
        __name(this, "ReadStream");
      }
      fd;
      isRaw = false;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      setRawMode(mode) {
        this.isRaw = mode;
        return this;
      }
    };
  }
});

// node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream;
var init_write_stream = __esm({
  "node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WriteStream = class {
      static {
        __name(this, "WriteStream");
      }
      fd;
      columns = 80;
      rows = 24;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      clearLine(dir3, callback) {
        callback && callback();
        return false;
      }
      clearScreenDown(callback) {
        callback && callback();
        return false;
      }
      cursorTo(x, y, callback) {
        callback && typeof callback === "function" && callback();
        return false;
      }
      moveCursor(dx, dy, callback) {
        callback && callback();
        return false;
      }
      getColorDepth(env2) {
        return 1;
      }
      hasColors(count3, env2) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      write(str, encoding, cb) {
        if (str instanceof Uint8Array) {
          str = new TextDecoder().decode(str);
        }
        try {
          console.log(str);
        } catch {
        }
        cb && typeof cb === "function" && cb();
        return false;
      }
    };
  }
});

// node_modules/unenv/dist/runtime/node/tty.mjs
var init_tty = __esm({
  "node_modules/unenv/dist/runtime/node/tty.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_read_stream();
    init_write_stream();
  }
});

// node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION;
var init_node_version = __esm({
  "node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    NODE_VERSION = "22.14.0";
  }
});

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";
var Process;
var init_process = __esm({
  "node_modules/unenv/dist/runtime/node/internal/process/process.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    init_utils();
    init_node_version();
    Process = class _Process extends EventEmitter {
      static {
        __name(this, "Process");
      }
      env;
      hrtime;
      nextTick;
      constructor(impl) {
        super();
        this.env = impl.env;
        this.hrtime = impl.hrtime;
        this.nextTick = impl.nextTick;
        for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
          const value = this[prop];
          if (typeof value === "function") {
            this[prop] = value.bind(this);
          }
        }
      }
      // --- event emitter ---
      emitWarning(warning, type, code) {
        console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
      }
      emit(...args) {
        return super.emit(...args);
      }
      listeners(eventName) {
        return super.listeners(eventName);
      }
      // --- stdio (lazy initializers) ---
      #stdin;
      #stdout;
      #stderr;
      get stdin() {
        return this.#stdin ??= new ReadStream(0);
      }
      get stdout() {
        return this.#stdout ??= new WriteStream(1);
      }
      get stderr() {
        return this.#stderr ??= new WriteStream(2);
      }
      // --- cwd ---
      #cwd = "/";
      chdir(cwd2) {
        this.#cwd = cwd2;
      }
      cwd() {
        return this.#cwd;
      }
      // --- dummy props and getters ---
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return `v${NODE_VERSION}`;
      }
      get versions() {
        return { node: NODE_VERSION };
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      // --- noop methods ---
      ref() {
      }
      unref() {
      }
      // --- unimplemented methods ---
      umask() {
        throw createNotImplementedError("process.umask");
      }
      getBuiltinModule() {
        return void 0;
      }
      getActiveResourcesInfo() {
        throw createNotImplementedError("process.getActiveResourcesInfo");
      }
      exit() {
        throw createNotImplementedError("process.exit");
      }
      reallyExit() {
        throw createNotImplementedError("process.reallyExit");
      }
      kill() {
        throw createNotImplementedError("process.kill");
      }
      abort() {
        throw createNotImplementedError("process.abort");
      }
      dlopen() {
        throw createNotImplementedError("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw createNotImplementedError("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw createNotImplementedError("process.loadEnvFile");
      }
      disconnect() {
        throw createNotImplementedError("process.disconnect");
      }
      cpuUsage() {
        throw createNotImplementedError("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw createNotImplementedError("process.initgroups");
      }
      openStdin() {
        throw createNotImplementedError("process.openStdin");
      }
      assert() {
        throw createNotImplementedError("process.assert");
      }
      binding() {
        throw createNotImplementedError("process.binding");
      }
      // --- attached interfaces ---
      permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
      report = {
        directory: "",
        filename: "",
        signal: "SIGUSR2",
        compact: false,
        reportOnFatalError: false,
        reportOnSignal: false,
        reportOnUncaughtException: false,
        getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
        writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
      };
      finalization = {
        register: /* @__PURE__ */ notImplemented("process.finalization.register"),
        unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
        registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
      };
      memoryUsage = Object.assign(() => ({
        arrayBuffers: 0,
        rss: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0
      }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
      // --- undefined props ---
      mainModule = void 0;
      domain = void 0;
      // optional
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      // internals
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    };
  }
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess, getBuiltinModule, workerdProcess, unenvProcess, exit, features, platform, _channel, _debugEnd, _debugProcess, _disconnect, _events, _eventsCount, _exiting, _fatalException, _getActiveHandles, _getActiveRequests, _handleQueue, _kill, _linkedBinding, _maxListeners, _pendingMessage, _preload_modules, _rawDebug, _send, _startProfilerIdleNotifier, _stopProfilerIdleNotifier, _tickCallback, abort, addListener, allowedNodeEnvironmentFlags, arch, argv, argv0, assert2, availableMemory, binding, channel, chdir, config, connected, constrainedMemory, cpuUsage, cwd, debugPort, disconnect, dlopen, domain, emit, emitWarning, env, eventNames, execArgv, execPath, exitCode, finalization, getActiveResourcesInfo, getegid, geteuid, getgid, getgroups, getMaxListeners, getuid, hasUncaughtExceptionCaptureCallback, hrtime3, initgroups, kill, listenerCount, listeners, loadEnvFile, mainModule, memoryUsage, moduleLoadList, nextTick, off, on, once, openStdin, permission, pid, ppid, prependListener, prependOnceListener, rawListeners, reallyExit, ref, release, removeAllListeners, removeListener, report, resourceUsage, send, setegid, seteuid, setgid, setgroups, setMaxListeners, setSourceMapsEnabled, setuid, setUncaughtExceptionCaptureCallback, sourceMapsEnabled, stderr, stdin, stdout, throwDeprecation, title, traceDeprecation, umask, unref, uptime, version, versions, _process, process_default;
var init_process2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_hrtime();
    init_process();
    globalProcess = globalThis["process"];
    getBuiltinModule = globalProcess.getBuiltinModule;
    workerdProcess = getBuiltinModule("node:process");
    unenvProcess = new Process({
      env: globalProcess.env,
      hrtime,
      // `nextTick` is available from workerd process v1
      nextTick: workerdProcess.nextTick
    });
    ({ exit, features, platform } = workerdProcess);
    ({
      _channel,
      _debugEnd,
      _debugProcess,
      _disconnect,
      _events,
      _eventsCount,
      _exiting,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _handleQueue,
      _kill,
      _linkedBinding,
      _maxListeners,
      _pendingMessage,
      _preload_modules,
      _rawDebug,
      _send,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      arch,
      argv,
      argv0,
      assert: assert2,
      availableMemory,
      binding,
      channel,
      chdir,
      config,
      connected,
      constrainedMemory,
      cpuUsage,
      cwd,
      debugPort,
      disconnect,
      dlopen,
      domain,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exitCode,
      finalization,
      getActiveResourcesInfo,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getMaxListeners,
      getuid,
      hasUncaughtExceptionCaptureCallback,
      hrtime: hrtime3,
      initgroups,
      kill,
      listenerCount,
      listeners,
      loadEnvFile,
      mainModule,
      memoryUsage,
      moduleLoadList,
      nextTick,
      off,
      on,
      once,
      openStdin,
      permission,
      pid,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      reallyExit,
      ref,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      send,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setMaxListeners,
      setSourceMapsEnabled,
      setuid,
      setUncaughtExceptionCaptureCallback,
      sourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      throwDeprecation,
      title,
      traceDeprecation,
      umask,
      unref,
      uptime,
      version,
      versions
    } = unenvProcess);
    _process = {
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exit,
      finalization,
      features,
      getBuiltinModule,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      nextTick,
      on,
      off,
      once,
      pid,
      platform,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      // @ts-expect-error old API
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    };
    process_default = _process;
  }
});

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process = __esm({
  "node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process"() {
    init_process2();
    globalThis.process = process_default;
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
  }
});

// node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// node_modules/.prisma/client/runtime/wasm-engine-edge.js
var require_wasm_engine_edge = __commonJS({
  "node_modules/.prisma/client/runtime/wasm-engine-edge.js"(exports, module) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Vs = Object.create;
    var nr = Object.defineProperty;
    var Bs = Object.getOwnPropertyDescriptor;
    var $s = Object.getOwnPropertyNames;
    var js = Object.getPrototypeOf;
    var Qs = Object.prototype.hasOwnProperty;
    var ae = /* @__PURE__ */ __name((t, e) => () => (t && (e = t(t = 0)), e), "ae");
    var yt = /* @__PURE__ */ __name((t, e) => () => (e || t((e = { exports: {} }).exports, e), e.exports), "yt");
    var ht = /* @__PURE__ */ __name((t, e) => {
      for (var r in e) nr(t, r, { get: e[r], enumerable: true });
    }, "ht");
    var Hn = /* @__PURE__ */ __name((t, e, r, n) => {
      if (e && typeof e == "object" || typeof e == "function") for (let i of $s(e)) !Qs.call(t, i) && i !== r && nr(t, i, { get: /* @__PURE__ */ __name(() => e[i], "get"), enumerable: !(n = Bs(e, i)) || n.enumerable });
      return t;
    }, "Hn");
    var bt = /* @__PURE__ */ __name((t, e, r) => (r = t != null ? Vs(js(t)) : {}, Hn(e || !t || !t.__esModule ? nr(r, "default", { value: t, enumerable: true }) : r, t)), "bt");
    var Gs = /* @__PURE__ */ __name((t) => Hn(nr({}, "__esModule", { value: true }), t), "Gs");
    function Kr(t, e) {
      if (e = e.toLowerCase(), e === "utf8" || e === "utf-8") return new y(Hs.encode(t));
      if (e === "base64" || e === "base64url") return t = t.replace(/-/g, "+").replace(/_/g, "/"), t = t.replace(/[^A-Za-z0-9+/]/g, ""), new y([...atob(t)].map((r) => r.charCodeAt(0)));
      if (e === "binary" || e === "ascii" || e === "latin1" || e === "latin-1") return new y([...t].map((r) => r.charCodeAt(0)));
      if (e === "ucs2" || e === "ucs-2" || e === "utf16le" || e === "utf-16le") {
        let r = new y(t.length * 2), n = new DataView(r.buffer);
        for (let i = 0; i < t.length; i++) n.setUint16(i * 2, t.charCodeAt(i), true);
        return r;
      }
      if (e === "hex") {
        let r = new y(t.length / 2);
        for (let n = 0, i = 0; i < t.length; i += 2, n++) r[n] = parseInt(t.slice(i, i + 2), 16);
        return r;
      }
      Yn(`encoding "${e}"`);
    }
    __name(Kr, "Kr");
    function Js(t) {
      let r = Object.getOwnPropertyNames(DataView.prototype).filter((a) => a.startsWith("get") || a.startsWith("set")), n = r.map((a) => a.replace("get", "read").replace("set", "write")), i = /* @__PURE__ */ __name((a, f) => function(v = 0) {
        return J(v, "offset"), re(v, "offset"), K(v, "offset", this.length - 1), new DataView(this.buffer)[r[a]](v, f);
      }, "i"), o = /* @__PURE__ */ __name((a, f) => function(v, R = 0) {
        let A = r[a].match(/set(\w+\d+)/)[1].toLowerCase(), I = Ks[A];
        return J(R, "offset"), re(R, "offset"), K(R, "offset", this.length - 1), Ws(v, "value", I[0], I[1]), new DataView(this.buffer)[r[a]](R, v, f), R + parseInt(r[a].match(/\d+/)[0]) / 8;
      }, "o"), s = /* @__PURE__ */ __name((a) => {
        a.forEach((f) => {
          f.includes("Uint") && (t[f.replace("Uint", "UInt")] = t[f]), f.includes("Float64") && (t[f.replace("Float64", "Double")] = t[f]), f.includes("Float32") && (t[f.replace("Float32", "Float")] = t[f]);
        });
      }, "s");
      n.forEach((a, f) => {
        a.startsWith("read") && (t[a] = i(f, false), t[a + "LE"] = i(f, true), t[a + "BE"] = i(f, false)), a.startsWith("write") && (t[a] = o(f, false), t[a + "LE"] = o(f, true), t[a + "BE"] = o(f, false)), s([a, a + "LE", a + "BE"]);
      });
    }
    __name(Js, "Js");
    function Yn(t) {
      throw new Error(`Buffer polyfill does not implement "${t}"`);
    }
    __name(Yn, "Yn");
    function ir(t, e) {
      if (!(t instanceof Uint8Array)) throw new TypeError(`The "${e}" argument must be an instance of Buffer or Uint8Array`);
    }
    __name(ir, "ir");
    function K(t, e, r = Xs + 1) {
      if (t < 0 || t > r) {
        let n = new RangeError(`The value of "${e}" is out of range. It must be >= 0 && <= ${r}. Received ${t}`);
        throw n.code = "ERR_OUT_OF_RANGE", n;
      }
    }
    __name(K, "K");
    function J(t, e) {
      if (typeof t != "number") {
        let r = new TypeError(`The "${e}" argument must be of type number. Received type ${typeof t}.`);
        throw r.code = "ERR_INVALID_ARG_TYPE", r;
      }
    }
    __name(J, "J");
    function re(t, e) {
      if (!Number.isInteger(t) || Number.isNaN(t)) {
        let r = new RangeError(`The value of "${e}" is out of range. It must be an integer. Received ${t}`);
        throw r.code = "ERR_OUT_OF_RANGE", r;
      }
    }
    __name(re, "re");
    function Ws(t, e, r, n) {
      if (t < r || t > n) {
        let i = new RangeError(`The value of "${e}" is out of range. It must be >= ${r} and <= ${n}. Received ${t}`);
        throw i.code = "ERR_OUT_OF_RANGE", i;
      }
    }
    __name(Ws, "Ws");
    function zn(t, e) {
      if (typeof t != "string") {
        let r = new TypeError(`The "${e}" argument must be of type string. Received type ${typeof t}`);
        throw r.code = "ERR_INVALID_ARG_TYPE", r;
      }
    }
    __name(zn, "zn");
    function Zs(t, e = "utf8") {
      return y.from(t, e);
    }
    __name(Zs, "Zs");
    var y;
    var Ks;
    var Hs;
    var zs;
    var Ys;
    var Xs;
    var h;
    var Hr;
    var u = ae(() => {
      "use strict";
      y = class t extends Uint8Array {
        static {
          __name(this, "t");
        }
        _isBuffer = true;
        get offset() {
          return this.byteOffset;
        }
        static alloc(e, r = 0, n = "utf8") {
          return zn(n, "encoding"), t.allocUnsafe(e).fill(r, n);
        }
        static allocUnsafe(e) {
          return t.from(e);
        }
        static allocUnsafeSlow(e) {
          return t.from(e);
        }
        static isBuffer(e) {
          return e && !!e._isBuffer;
        }
        static byteLength(e, r = "utf8") {
          if (typeof e == "string") return Kr(e, r).byteLength;
          if (e && e.byteLength) return e.byteLength;
          let n = new TypeError('The "string" argument must be of type string or an instance of Buffer or ArrayBuffer.');
          throw n.code = "ERR_INVALID_ARG_TYPE", n;
        }
        static isEncoding(e) {
          return Ys.includes(e);
        }
        static compare(e, r) {
          ir(e, "buff1"), ir(r, "buff2");
          for (let n = 0; n < e.length; n++) {
            if (e[n] < r[n]) return -1;
            if (e[n] > r[n]) return 1;
          }
          return e.length === r.length ? 0 : e.length > r.length ? 1 : -1;
        }
        static from(e, r = "utf8") {
          if (e && typeof e == "object" && e.type === "Buffer") return new t(e.data);
          if (typeof e == "number") return new t(new Uint8Array(e));
          if (typeof e == "string") return Kr(e, r);
          if (ArrayBuffer.isView(e)) {
            let { byteOffset: n, byteLength: i, buffer: o } = e;
            return "map" in e && typeof e.map == "function" ? new t(e.map((s) => s % 256), n, i) : new t(o, n, i);
          }
          if (e && typeof e == "object" && ("length" in e || "byteLength" in e || "buffer" in e)) return new t(e);
          throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
        }
        static concat(e, r) {
          if (e.length === 0) return t.alloc(0);
          let n = [].concat(...e.map((o) => [...o])), i = t.alloc(r !== void 0 ? r : n.length);
          return i.set(r !== void 0 ? n.slice(0, r) : n), i;
        }
        slice(e = 0, r = this.length) {
          return this.subarray(e, r);
        }
        subarray(e = 0, r = this.length) {
          return Object.setPrototypeOf(super.subarray(e, r), t.prototype);
        }
        reverse() {
          return super.reverse(), this;
        }
        readIntBE(e, r) {
          J(e, "offset"), re(e, "offset"), K(e, "offset", this.length - 1), J(r, "byteLength"), re(r, "byteLength");
          let n = new DataView(this.buffer, e, r), i = 0;
          for (let o = 0; o < r; o++) i = i * 256 + n.getUint8(o);
          return n.getUint8(0) & 128 && (i -= Math.pow(256, r)), i;
        }
        readIntLE(e, r) {
          J(e, "offset"), re(e, "offset"), K(e, "offset", this.length - 1), J(r, "byteLength"), re(r, "byteLength");
          let n = new DataView(this.buffer, e, r), i = 0;
          for (let o = 0; o < r; o++) i += n.getUint8(o) * Math.pow(256, o);
          return n.getUint8(r - 1) & 128 && (i -= Math.pow(256, r)), i;
        }
        readUIntBE(e, r) {
          J(e, "offset"), re(e, "offset"), K(e, "offset", this.length - 1), J(r, "byteLength"), re(r, "byteLength");
          let n = new DataView(this.buffer, e, r), i = 0;
          for (let o = 0; o < r; o++) i = i * 256 + n.getUint8(o);
          return i;
        }
        readUintBE(e, r) {
          return this.readUIntBE(e, r);
        }
        readUIntLE(e, r) {
          J(e, "offset"), re(e, "offset"), K(e, "offset", this.length - 1), J(r, "byteLength"), re(r, "byteLength");
          let n = new DataView(this.buffer, e, r), i = 0;
          for (let o = 0; o < r; o++) i += n.getUint8(o) * Math.pow(256, o);
          return i;
        }
        readUintLE(e, r) {
          return this.readUIntLE(e, r);
        }
        writeIntBE(e, r, n) {
          return e = e < 0 ? e + Math.pow(256, n) : e, this.writeUIntBE(e, r, n);
        }
        writeIntLE(e, r, n) {
          return e = e < 0 ? e + Math.pow(256, n) : e, this.writeUIntLE(e, r, n);
        }
        writeUIntBE(e, r, n) {
          J(r, "offset"), re(r, "offset"), K(r, "offset", this.length - 1), J(n, "byteLength"), re(n, "byteLength");
          let i = new DataView(this.buffer, r, n);
          for (let o = n - 1; o >= 0; o--) i.setUint8(o, e & 255), e = e / 256;
          return r + n;
        }
        writeUintBE(e, r, n) {
          return this.writeUIntBE(e, r, n);
        }
        writeUIntLE(e, r, n) {
          J(r, "offset"), re(r, "offset"), K(r, "offset", this.length - 1), J(n, "byteLength"), re(n, "byteLength");
          let i = new DataView(this.buffer, r, n);
          for (let o = 0; o < n; o++) i.setUint8(o, e & 255), e = e / 256;
          return r + n;
        }
        writeUintLE(e, r, n) {
          return this.writeUIntLE(e, r, n);
        }
        toJSON() {
          return { type: "Buffer", data: Array.from(this) };
        }
        swap16() {
          let e = new DataView(this.buffer, this.byteOffset, this.byteLength);
          for (let r = 0; r < this.length; r += 2) e.setUint16(r, e.getUint16(r, true), false);
          return this;
        }
        swap32() {
          let e = new DataView(this.buffer, this.byteOffset, this.byteLength);
          for (let r = 0; r < this.length; r += 4) e.setUint32(r, e.getUint32(r, true), false);
          return this;
        }
        swap64() {
          let e = new DataView(this.buffer, this.byteOffset, this.byteLength);
          for (let r = 0; r < this.length; r += 8) e.setBigUint64(r, e.getBigUint64(r, true), false);
          return this;
        }
        compare(e, r = 0, n = e.length, i = 0, o = this.length) {
          return ir(e, "target"), J(r, "targetStart"), J(n, "targetEnd"), J(i, "sourceStart"), J(o, "sourceEnd"), K(r, "targetStart"), K(n, "targetEnd", e.length), K(i, "sourceStart"), K(o, "sourceEnd", this.length), t.compare(this.slice(i, o), e.slice(r, n));
        }
        equals(e) {
          return ir(e, "otherBuffer"), this.length === e.length && this.every((r, n) => r === e[n]);
        }
        copy(e, r = 0, n = 0, i = this.length) {
          K(r, "targetStart"), K(n, "sourceStart", this.length), K(i, "sourceEnd"), r >>>= 0, n >>>= 0, i >>>= 0;
          let o = 0;
          for (; n < i && !(this[n] === void 0 || e[r] === void 0); ) e[r] = this[n], o++, n++, r++;
          return o;
        }
        write(e, r, n, i = "utf8") {
          let o = typeof r == "string" ? 0 : r ?? 0, s = typeof n == "string" ? this.length - o : n ?? this.length - o;
          return i = typeof r == "string" ? r : typeof n == "string" ? n : i, J(o, "offset"), J(s, "length"), K(o, "offset", this.length), K(s, "length", this.length), (i === "ucs2" || i === "ucs-2" || i === "utf16le" || i === "utf-16le") && (s = s - s % 2), Kr(e, i).copy(this, o, 0, s);
        }
        fill(e = 0, r = 0, n = this.length, i = "utf-8") {
          let o = typeof r == "string" ? 0 : r, s = typeof n == "string" ? this.length : n;
          if (i = typeof r == "string" ? r : typeof n == "string" ? n : i, e = t.from(typeof e == "number" ? [e] : e ?? [], i), zn(i, "encoding"), K(o, "offset", this.length), K(s, "end", this.length), e.length !== 0) for (let a = o; a < s; a += e.length) super.set(e.slice(0, e.length + a >= this.length ? this.length - a : e.length), a);
          return this;
        }
        includes(e, r = null, n = "utf-8") {
          return this.indexOf(e, r, n) !== -1;
        }
        lastIndexOf(e, r = null, n = "utf-8") {
          return this.indexOf(e, r, n, true);
        }
        indexOf(e, r = null, n = "utf-8", i = false) {
          let o = i ? this.findLastIndex.bind(this) : this.findIndex.bind(this);
          n = typeof r == "string" ? r : n;
          let s = t.from(typeof e == "number" ? [e] : e, n), a = typeof r == "string" ? 0 : r;
          return a = typeof r == "number" ? a : null, a = Number.isNaN(a) ? null : a, a ??= i ? this.length : 0, a = a < 0 ? this.length + a : a, s.length === 0 && i === false ? a >= this.length ? this.length : a : s.length === 0 && i === true ? (a >= this.length ? this.length : a) || this.length : o((f, v) => (i ? v <= a : v >= a) && this[v] === s[0] && s.every((A, I) => this[v + I] === A));
        }
        toString(e = "utf8", r = 0, n = this.length) {
          if (r = r < 0 ? 0 : r, e = e.toString().toLowerCase(), n <= 0) return "";
          if (e === "utf8" || e === "utf-8") return zs.decode(this.slice(r, n));
          if (e === "base64" || e === "base64url") {
            let i = btoa(this.reduce((o, s) => o + Hr(s), ""));
            return e === "base64url" ? i.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : i;
          }
          if (e === "binary" || e === "ascii" || e === "latin1" || e === "latin-1") return this.slice(r, n).reduce((i, o) => i + Hr(o & (e === "ascii" ? 127 : 255)), "");
          if (e === "ucs2" || e === "ucs-2" || e === "utf16le" || e === "utf-16le") {
            let i = new DataView(this.buffer.slice(r, n));
            return Array.from({ length: i.byteLength / 2 }, (o, s) => s * 2 + 1 < i.byteLength ? Hr(i.getUint16(s * 2, true)) : "").join("");
          }
          if (e === "hex") return this.slice(r, n).reduce((i, o) => i + o.toString(16).padStart(2, "0"), "");
          Yn(`encoding "${e}"`);
        }
        toLocaleString() {
          return this.toString();
        }
        inspect() {
          return `<Buffer ${this.toString("hex").match(/.{1,2}/g).join(" ")}>`;
        }
      };
      Ks = { int8: [-128, 127], int16: [-32768, 32767], int32: [-2147483648, 2147483647], uint8: [0, 255], uint16: [0, 65535], uint32: [0, 4294967295], float32: [-1 / 0, 1 / 0], float64: [-1 / 0, 1 / 0], bigint64: [-0x8000000000000000n, 0x7fffffffffffffffn], biguint64: [0n, 0xffffffffffffffffn] }, Hs = new TextEncoder(), zs = new TextDecoder(), Ys = ["utf8", "utf-8", "hex", "base64", "ascii", "binary", "base64url", "ucs2", "ucs-2", "utf16le", "utf-16le", "latin1", "latin-1"], Xs = 4294967295;
      Js(y.prototype);
      h = new Proxy(Zs, { construct(t, [e, r]) {
        return y.from(e, r);
      }, get(t, e) {
        return y[e];
      } }), Hr = String.fromCodePoint;
    });
    var g;
    var w;
    var c = ae(() => {
      "use strict";
      g = { nextTick: /* @__PURE__ */ __name((t, ...e) => {
        setTimeout(() => {
          t(...e);
        }, 0);
      }, "nextTick"), env: {}, version: "", cwd: /* @__PURE__ */ __name(() => "/", "cwd"), stderr: {}, argv: ["/bin/node"], pid: 1e4 }, { cwd: w } = g;
    });
    var x;
    var p = ae(() => {
      "use strict";
      x = globalThis.performance ?? (() => {
        let t = Date.now();
        return { now: /* @__PURE__ */ __name(() => Date.now() - t, "now") };
      })();
    });
    var E;
    var m = ae(() => {
      "use strict";
      E = /* @__PURE__ */ __name(() => {
      }, "E");
      E.prototype = E;
    });
    var b;
    var d = ae(() => {
      "use strict";
      b = class {
        static {
          __name(this, "b");
        }
        value;
        constructor(e) {
          this.value = e;
        }
        deref() {
          return this.value;
        }
      };
    });
    function ti(t, e) {
      var r, n, i, o, s, a, f, v, R = t.constructor, A = R.precision;
      if (!t.s || !e.s) return e.s || (e = new R(t)), $3 ? N(e, A) : e;
      if (f = t.d, v = e.d, s = t.e, i = e.e, f = f.slice(), o = s - i, o) {
        for (o < 0 ? (n = f, o = -o, a = v.length) : (n = v, i = s, a = f.length), s = Math.ceil(A / B), a = s > a ? s + 1 : a + 1, o > a && (o = a, n.length = 1), n.reverse(); o--; ) n.push(0);
        n.reverse();
      }
      for (a = f.length, o = v.length, a - o < 0 && (o = a, n = v, v = f, f = n), r = 0; o; ) r = (f[--o] = f[o] + v[o] + r) / H | 0, f[o] %= H;
      for (r && (f.unshift(r), ++i), a = f.length; f[--a] == 0; ) f.pop();
      return e.d = f, e.e = i, $3 ? N(e, A) : e;
    }
    __name(ti, "ti");
    function de(t, e, r) {
      if (t !== ~~t || t < e || t > r) throw Error(_e + t);
    }
    __name(de, "de");
    function me(t) {
      var e, r, n, i = t.length - 1, o = "", s = t[0];
      if (i > 0) {
        for (o += s, e = 1; e < i; e++) n = t[e] + "", r = B - n.length, r && (o += Ae(r)), o += n;
        s = t[e], n = s + "", r = B - n.length, r && (o += Ae(r));
      } else if (s === 0) return "0";
      for (; s % 10 === 0; ) s /= 10;
      return o + s;
    }
    __name(me, "me");
    function ri(t, e) {
      var r, n, i, o, s, a, f = 0, v = 0, R = t.constructor, A = R.precision;
      if (W(t) > 16) throw Error(Yr + W(t));
      if (!t.s) return new R(oe);
      for (e == null ? ($3 = false, a = A) : a = e, s = new R(0.03125); t.abs().gte(0.1); ) t = t.times(s), v += 5;
      for (n = Math.log(ke(2, v)) / Math.LN10 * 2 + 5 | 0, a += n, r = i = o = new R(oe), R.precision = a; ; ) {
        if (i = N(i.times(t), a), r = r.times(++f), s = o.plus(we(i, r, a)), me(s.d).slice(0, a) === me(o.d).slice(0, a)) {
          for (; v--; ) o = N(o.times(o), a);
          return R.precision = A, e == null ? ($3 = true, N(o, A)) : o;
        }
        o = s;
      }
    }
    __name(ri, "ri");
    function W(t) {
      for (var e = t.e * B, r = t.d[0]; r >= 10; r /= 10) e++;
      return e;
    }
    __name(W, "W");
    function zr(t, e, r) {
      if (e > t.LN10.sd()) throw $3 = true, r && (t.precision = r), Error(le + "LN10 precision limit exceeded");
      return N(new t(t.LN10), e);
    }
    __name(zr, "zr");
    function Ae(t) {
      for (var e = ""; t--; ) e += "0";
      return e;
    }
    __name(Ae, "Ae");
    function Et(t, e) {
      var r, n, i, o, s, a, f, v, R, A = 1, I = 10, C = t, L = C.d, D = C.constructor, k = D.precision;
      if (C.s < 1) throw Error(le + (C.s ? "NaN" : "-Infinity"));
      if (C.eq(oe)) return new D(0);
      if (e == null ? ($3 = false, v = k) : v = e, C.eq(10)) return e == null && ($3 = true), zr(D, v);
      if (v += I, D.precision = v, r = me(L), n = r.charAt(0), o = W(C), Math.abs(o) < 15e14) {
        for (; n < 7 && n != 1 || n == 1 && r.charAt(1) > 3; ) C = C.times(t), r = me(C.d), n = r.charAt(0), A++;
        o = W(C), n > 1 ? (C = new D("0." + r), o++) : C = new D(n + "." + r.slice(1));
      } else return f = zr(D, v + 2, k).times(o + ""), C = Et(new D(n + "." + r.slice(1)), v - I).plus(f), D.precision = k, e == null ? ($3 = true, N(C, k)) : C;
      for (a = s = C = we(C.minus(oe), C.plus(oe), v), R = N(C.times(C), v), i = 3; ; ) {
        if (s = N(s.times(R), v), f = a.plus(we(s, new D(i), v)), me(f.d).slice(0, v) === me(a.d).slice(0, v)) return a = a.times(2), o !== 0 && (a = a.plus(zr(D, v + 2, k).times(o + ""))), a = we(a, new D(A), v), D.precision = k, e == null ? ($3 = true, N(a, k)) : a;
        a = f, i += 2;
      }
    }
    __name(Et, "Et");
    function Xn(t, e) {
      var r, n, i;
      for ((r = e.indexOf(".")) > -1 && (e = e.replace(".", "")), (n = e.search(/e/i)) > 0 ? (r < 0 && (r = n), r += +e.slice(n + 1), e = e.substring(0, n)) : r < 0 && (r = e.length), n = 0; e.charCodeAt(n) === 48; ) ++n;
      for (i = e.length; e.charCodeAt(i - 1) === 48; ) --i;
      if (e = e.slice(n, i), e) {
        if (i -= n, r = r - n - 1, t.e = Qe(r / B), t.d = [], n = (r + 1) % B, r < 0 && (n += B), n < i) {
          for (n && t.d.push(+e.slice(0, n)), i -= B; n < i; ) t.d.push(+e.slice(n, n += B));
          e = e.slice(n), n = B - e.length;
        } else n -= i;
        for (; n--; ) e += "0";
        if (t.d.push(+e), $3 && (t.e > or || t.e < -or)) throw Error(Yr + r);
      } else t.s = 0, t.e = 0, t.d = [0];
      return t;
    }
    __name(Xn, "Xn");
    function N(t, e, r) {
      var n, i, o, s, a, f, v, R, A = t.d;
      for (s = 1, o = A[0]; o >= 10; o /= 10) s++;
      if (n = e - s, n < 0) n += B, i = e, v = A[R = 0];
      else {
        if (R = Math.ceil((n + 1) / B), o = A.length, R >= o) return t;
        for (v = o = A[R], s = 1; o >= 10; o /= 10) s++;
        n %= B, i = n - B + s;
      }
      if (r !== void 0 && (o = ke(10, s - i - 1), a = v / o % 10 | 0, f = e < 0 || A[R + 1] !== void 0 || v % o, f = r < 4 ? (a || f) && (r == 0 || r == (t.s < 0 ? 3 : 2)) : a > 5 || a == 5 && (r == 4 || f || r == 6 && (n > 0 ? i > 0 ? v / ke(10, s - i) : 0 : A[R - 1]) % 10 & 1 || r == (t.s < 0 ? 8 : 7))), e < 1 || !A[0]) return f ? (o = W(t), A.length = 1, e = e - o - 1, A[0] = ke(10, (B - e % B) % B), t.e = Qe(-e / B) || 0) : (A.length = 1, A[0] = t.e = t.s = 0), t;
      if (n == 0 ? (A.length = R, o = 1, R--) : (A.length = R + 1, o = ke(10, B - n), A[R] = i > 0 ? (v / ke(10, s - i) % ke(10, i) | 0) * o : 0), f) for (; ; ) if (R == 0) {
        (A[0] += o) == H && (A[0] = 1, ++t.e);
        break;
      } else {
        if (A[R] += o, A[R] != H) break;
        A[R--] = 0, o = 1;
      }
      for (n = A.length; A[--n] === 0; ) A.pop();
      if ($3 && (t.e > or || t.e < -or)) throw Error(Yr + W(t));
      return t;
    }
    __name(N, "N");
    function ni(t, e) {
      var r, n, i, o, s, a, f, v, R, A, I = t.constructor, C = I.precision;
      if (!t.s || !e.s) return e.s ? e.s = -e.s : e = new I(t), $3 ? N(e, C) : e;
      if (f = t.d, A = e.d, n = e.e, v = t.e, f = f.slice(), s = v - n, s) {
        for (R = s < 0, R ? (r = f, s = -s, a = A.length) : (r = A, n = v, a = f.length), i = Math.max(Math.ceil(C / B), a) + 2, s > i && (s = i, r.length = 1), r.reverse(), i = s; i--; ) r.push(0);
        r.reverse();
      } else {
        for (i = f.length, a = A.length, R = i < a, R && (a = i), i = 0; i < a; i++) if (f[i] != A[i]) {
          R = f[i] < A[i];
          break;
        }
        s = 0;
      }
      for (R && (r = f, f = A, A = r, e.s = -e.s), a = f.length, i = A.length - a; i > 0; --i) f[a++] = 0;
      for (i = A.length; i > s; ) {
        if (f[--i] < A[i]) {
          for (o = i; o && f[--o] === 0; ) f[o] = H - 1;
          --f[o], f[i] += H;
        }
        f[i] -= A[i];
      }
      for (; f[--a] === 0; ) f.pop();
      for (; f[0] === 0; f.shift()) --n;
      return f[0] ? (e.d = f, e.e = n, $3 ? N(e, C) : e) : new I(0);
    }
    __name(ni, "ni");
    function Me(t, e, r) {
      var n, i = W(t), o = me(t.d), s = o.length;
      return e ? (r && (n = r - s) > 0 ? o = o.charAt(0) + "." + o.slice(1) + Ae(n) : s > 1 && (o = o.charAt(0) + "." + o.slice(1)), o = o + (i < 0 ? "e" : "e+") + i) : i < 0 ? (o = "0." + Ae(-i - 1) + o, r && (n = r - s) > 0 && (o += Ae(n))) : i >= s ? (o += Ae(i + 1 - s), r && (n = r - i - 1) > 0 && (o = o + "." + Ae(n))) : ((n = i + 1) < s && (o = o.slice(0, n) + "." + o.slice(n)), r && (n = r - s) > 0 && (i + 1 === s && (o += "."), o += Ae(n))), t.s < 0 ? "-" + o : o;
    }
    __name(Me, "Me");
    function Zn(t, e) {
      if (t.length > e) return t.length = e, true;
    }
    __name(Zn, "Zn");
    function ii(t) {
      var e, r, n;
      function i(o) {
        var s = this;
        if (!(s instanceof i)) return new i(o);
        if (s.constructor = i, o instanceof i) {
          s.s = o.s, s.e = o.e, s.d = (o = o.d) ? o.slice() : o;
          return;
        }
        if (typeof o == "number") {
          if (o * 0 !== 0) throw Error(_e + o);
          if (o > 0) s.s = 1;
          else if (o < 0) o = -o, s.s = -1;
          else {
            s.s = 0, s.e = 0, s.d = [0];
            return;
          }
          if (o === ~~o && o < 1e7) {
            s.e = 0, s.d = [o];
            return;
          }
          return Xn(s, o.toString());
        } else if (typeof o != "string") throw Error(_e + o);
        if (o.charCodeAt(0) === 45 ? (o = o.slice(1), s.s = -1) : s.s = 1, ta.test(o)) Xn(s, o);
        else throw Error(_e + o);
      }
      __name(i, "i");
      if (i.prototype = S, i.ROUND_UP = 0, i.ROUND_DOWN = 1, i.ROUND_CEIL = 2, i.ROUND_FLOOR = 3, i.ROUND_HALF_UP = 4, i.ROUND_HALF_DOWN = 5, i.ROUND_HALF_EVEN = 6, i.ROUND_HALF_CEIL = 7, i.ROUND_HALF_FLOOR = 8, i.clone = ii, i.config = i.set = ra, t === void 0 && (t = {}), t) for (n = ["precision", "rounding", "toExpNeg", "toExpPos", "LN10"], e = 0; e < n.length; ) t.hasOwnProperty(r = n[e++]) || (t[r] = this[r]);
      return i.config(t), i;
    }
    __name(ii, "ii");
    function ra(t) {
      if (!t || typeof t != "object") throw Error(le + "Object expected");
      var e, r, n, i = ["precision", 1, je, "rounding", 0, 8, "toExpNeg", -1 / 0, 0, "toExpPos", 0, 1 / 0];
      for (e = 0; e < i.length; e += 3) if ((n = t[r = i[e]]) !== void 0) if (Qe(n) === n && n >= i[e + 1] && n <= i[e + 2]) this[r] = n;
      else throw Error(_e + r + ": " + n);
      if ((n = t[r = "LN10"]) !== void 0) if (n == Math.LN10) this[r] = new this(n);
      else throw Error(_e + r + ": " + n);
      return this;
    }
    __name(ra, "ra");
    var je;
    var ea;
    var Xr;
    var $3;
    var le;
    var _e;
    var Yr;
    var Qe;
    var ke;
    var ta;
    var oe;
    var H;
    var B;
    var ei;
    var or;
    var S;
    var we;
    var Xr;
    var sr;
    var oi = ae(() => {
      "use strict";
      u();
      c();
      p();
      m();
      d();
      l();
      je = 1e9, ea = { precision: 20, rounding: 4, toExpNeg: -7, toExpPos: 21, LN10: "2.302585092994045684017991454684364207601101488628772976033327900967572609677352480235997205089598298341967784042286" }, $3 = true, le = "[DecimalError] ", _e = le + "Invalid argument: ", Yr = le + "Exponent out of range: ", Qe = Math.floor, ke = Math.pow, ta = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, H = 1e7, B = 7, ei = 9007199254740991, or = Qe(ei / B), S = {};
      S.absoluteValue = S.abs = function() {
        var t = new this.constructor(this);
        return t.s && (t.s = 1), t;
      };
      S.comparedTo = S.cmp = function(t) {
        var e, r, n, i, o = this;
        if (t = new o.constructor(t), o.s !== t.s) return o.s || -t.s;
        if (o.e !== t.e) return o.e > t.e ^ o.s < 0 ? 1 : -1;
        for (n = o.d.length, i = t.d.length, e = 0, r = n < i ? n : i; e < r; ++e) if (o.d[e] !== t.d[e]) return o.d[e] > t.d[e] ^ o.s < 0 ? 1 : -1;
        return n === i ? 0 : n > i ^ o.s < 0 ? 1 : -1;
      };
      S.decimalPlaces = S.dp = function() {
        var t = this, e = t.d.length - 1, r = (e - t.e) * B;
        if (e = t.d[e], e) for (; e % 10 == 0; e /= 10) r--;
        return r < 0 ? 0 : r;
      };
      S.dividedBy = S.div = function(t) {
        return we(this, new this.constructor(t));
      };
      S.dividedToIntegerBy = S.idiv = function(t) {
        var e = this, r = e.constructor;
        return N(we(e, new r(t), 0, 1), r.precision);
      };
      S.equals = S.eq = function(t) {
        return !this.cmp(t);
      };
      S.exponent = function() {
        return W(this);
      };
      S.greaterThan = S.gt = function(t) {
        return this.cmp(t) > 0;
      };
      S.greaterThanOrEqualTo = S.gte = function(t) {
        return this.cmp(t) >= 0;
      };
      S.isInteger = S.isint = function() {
        return this.e > this.d.length - 2;
      };
      S.isNegative = S.isneg = function() {
        return this.s < 0;
      };
      S.isPositive = S.ispos = function() {
        return this.s > 0;
      };
      S.isZero = function() {
        return this.s === 0;
      };
      S.lessThan = S.lt = function(t) {
        return this.cmp(t) < 0;
      };
      S.lessThanOrEqualTo = S.lte = function(t) {
        return this.cmp(t) < 1;
      };
      S.logarithm = S.log = function(t) {
        var e, r = this, n = r.constructor, i = n.precision, o = i + 5;
        if (t === void 0) t = new n(10);
        else if (t = new n(t), t.s < 1 || t.eq(oe)) throw Error(le + "NaN");
        if (r.s < 1) throw Error(le + (r.s ? "NaN" : "-Infinity"));
        return r.eq(oe) ? new n(0) : ($3 = false, e = we(Et(r, o), Et(t, o), o), $3 = true, N(e, i));
      };
      S.minus = S.sub = function(t) {
        var e = this;
        return t = new e.constructor(t), e.s == t.s ? ni(e, t) : ti(e, (t.s = -t.s, t));
      };
      S.modulo = S.mod = function(t) {
        var e, r = this, n = r.constructor, i = n.precision;
        if (t = new n(t), !t.s) throw Error(le + "NaN");
        return r.s ? ($3 = false, e = we(r, t, 0, 1).times(t), $3 = true, r.minus(e)) : N(new n(r), i);
      };
      S.naturalExponential = S.exp = function() {
        return ri(this);
      };
      S.naturalLogarithm = S.ln = function() {
        return Et(this);
      };
      S.negated = S.neg = function() {
        var t = new this.constructor(this);
        return t.s = -t.s || 0, t;
      };
      S.plus = S.add = function(t) {
        var e = this;
        return t = new e.constructor(t), e.s == t.s ? ti(e, t) : ni(e, (t.s = -t.s, t));
      };
      S.precision = S.sd = function(t) {
        var e, r, n, i = this;
        if (t !== void 0 && t !== !!t && t !== 1 && t !== 0) throw Error(_e + t);
        if (e = W(i) + 1, n = i.d.length - 1, r = n * B + 1, n = i.d[n], n) {
          for (; n % 10 == 0; n /= 10) r--;
          for (n = i.d[0]; n >= 10; n /= 10) r++;
        }
        return t && e > r ? e : r;
      };
      S.squareRoot = S.sqrt = function() {
        var t, e, r, n, i, o, s, a = this, f = a.constructor;
        if (a.s < 1) {
          if (!a.s) return new f(0);
          throw Error(le + "NaN");
        }
        for (t = W(a), $3 = false, i = Math.sqrt(+a), i == 0 || i == 1 / 0 ? (e = me(a.d), (e.length + t) % 2 == 0 && (e += "0"), i = Math.sqrt(e), t = Qe((t + 1) / 2) - (t < 0 || t % 2), i == 1 / 0 ? e = "5e" + t : (e = i.toExponential(), e = e.slice(0, e.indexOf("e") + 1) + t), n = new f(e)) : n = new f(i.toString()), r = f.precision, i = s = r + 3; ; ) if (o = n, n = o.plus(we(a, o, s + 2)).times(0.5), me(o.d).slice(0, s) === (e = me(n.d)).slice(0, s)) {
          if (e = e.slice(s - 3, s + 1), i == s && e == "4999") {
            if (N(o, r + 1, 0), o.times(o).eq(a)) {
              n = o;
              break;
            }
          } else if (e != "9999") break;
          s += 4;
        }
        return $3 = true, N(n, r);
      };
      S.times = S.mul = function(t) {
        var e, r, n, i, o, s, a, f, v, R = this, A = R.constructor, I = R.d, C = (t = new A(t)).d;
        if (!R.s || !t.s) return new A(0);
        for (t.s *= R.s, r = R.e + t.e, f = I.length, v = C.length, f < v && (o = I, I = C, C = o, s = f, f = v, v = s), o = [], s = f + v, n = s; n--; ) o.push(0);
        for (n = v; --n >= 0; ) {
          for (e = 0, i = f + n; i > n; ) a = o[i] + C[n] * I[i - n - 1] + e, o[i--] = a % H | 0, e = a / H | 0;
          o[i] = (o[i] + e) % H | 0;
        }
        for (; !o[--s]; ) o.pop();
        return e ? ++r : o.shift(), t.d = o, t.e = r, $3 ? N(t, A.precision) : t;
      };
      S.toDecimalPlaces = S.todp = function(t, e) {
        var r = this, n = r.constructor;
        return r = new n(r), t === void 0 ? r : (de(t, 0, je), e === void 0 ? e = n.rounding : de(e, 0, 8), N(r, t + W(r) + 1, e));
      };
      S.toExponential = function(t, e) {
        var r, n = this, i = n.constructor;
        return t === void 0 ? r = Me(n, true) : (de(t, 0, je), e === void 0 ? e = i.rounding : de(e, 0, 8), n = N(new i(n), t + 1, e), r = Me(n, true, t + 1)), r;
      };
      S.toFixed = function(t, e) {
        var r, n, i = this, o = i.constructor;
        return t === void 0 ? Me(i) : (de(t, 0, je), e === void 0 ? e = o.rounding : de(e, 0, 8), n = N(new o(i), t + W(i) + 1, e), r = Me(n.abs(), false, t + W(n) + 1), i.isneg() && !i.isZero() ? "-" + r : r);
      };
      S.toInteger = S.toint = function() {
        var t = this, e = t.constructor;
        return N(new e(t), W(t) + 1, e.rounding);
      };
      S.toNumber = function() {
        return +this;
      };
      S.toPower = S.pow = function(t) {
        var e, r, n, i, o, s, a = this, f = a.constructor, v = 12, R = +(t = new f(t));
        if (!t.s) return new f(oe);
        if (a = new f(a), !a.s) {
          if (t.s < 1) throw Error(le + "Infinity");
          return a;
        }
        if (a.eq(oe)) return a;
        if (n = f.precision, t.eq(oe)) return N(a, n);
        if (e = t.e, r = t.d.length - 1, s = e >= r, o = a.s, s) {
          if ((r = R < 0 ? -R : R) <= ei) {
            for (i = new f(oe), e = Math.ceil(n / B + 4), $3 = false; r % 2 && (i = i.times(a), Zn(i.d, e)), r = Qe(r / 2), r !== 0; ) a = a.times(a), Zn(a.d, e);
            return $3 = true, t.s < 0 ? new f(oe).div(i) : N(i, n);
          }
        } else if (o < 0) throw Error(le + "NaN");
        return o = o < 0 && t.d[Math.max(e, r)] & 1 ? -1 : 1, a.s = 1, $3 = false, i = t.times(Et(a, n + v)), $3 = true, i = ri(i), i.s = o, i;
      };
      S.toPrecision = function(t, e) {
        var r, n, i = this, o = i.constructor;
        return t === void 0 ? (r = W(i), n = Me(i, r <= o.toExpNeg || r >= o.toExpPos)) : (de(t, 1, je), e === void 0 ? e = o.rounding : de(e, 0, 8), i = N(new o(i), t, e), r = W(i), n = Me(i, t <= r || r <= o.toExpNeg, t)), n;
      };
      S.toSignificantDigits = S.tosd = function(t, e) {
        var r = this, n = r.constructor;
        return t === void 0 ? (t = n.precision, e = n.rounding) : (de(t, 1, je), e === void 0 ? e = n.rounding : de(e, 0, 8)), N(new n(r), t, e);
      };
      S.toString = S.valueOf = S.val = S.toJSON = S[/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")] = function() {
        var t = this, e = W(t), r = t.constructor;
        return Me(t, e <= r.toExpNeg || e >= r.toExpPos);
      };
      we = /* @__PURE__ */ (function() {
        function t(n, i) {
          var o, s = 0, a = n.length;
          for (n = n.slice(); a--; ) o = n[a] * i + s, n[a] = o % H | 0, s = o / H | 0;
          return s && n.unshift(s), n;
        }
        __name(t, "t");
        function e(n, i, o, s) {
          var a, f;
          if (o != s) f = o > s ? 1 : -1;
          else for (a = f = 0; a < o; a++) if (n[a] != i[a]) {
            f = n[a] > i[a] ? 1 : -1;
            break;
          }
          return f;
        }
        __name(e, "e");
        function r(n, i, o) {
          for (var s = 0; o--; ) n[o] -= s, s = n[o] < i[o] ? 1 : 0, n[o] = s * H + n[o] - i[o];
          for (; !n[0] && n.length > 1; ) n.shift();
        }
        __name(r, "r");
        return function(n, i, o, s) {
          var a, f, v, R, A, I, C, L, D, k, Ee, ee, U, te, Oe, Wr, ue, tr, rr = n.constructor, qs = n.s == i.s ? 1 : -1, pe = n.d, G = i.d;
          if (!n.s) return new rr(n);
          if (!i.s) throw Error(le + "Division by zero");
          for (f = n.e - i.e, ue = G.length, Oe = pe.length, C = new rr(qs), L = C.d = [], v = 0; G[v] == (pe[v] || 0); ) ++v;
          if (G[v] > (pe[v] || 0) && --f, o == null ? ee = o = rr.precision : s ? ee = o + (W(n) - W(i)) + 1 : ee = o, ee < 0) return new rr(0);
          if (ee = ee / B + 2 | 0, v = 0, ue == 1) for (R = 0, G = G[0], ee++; (v < Oe || R) && ee--; v++) U = R * H + (pe[v] || 0), L[v] = U / G | 0, R = U % G | 0;
          else {
            for (R = H / (G[0] + 1) | 0, R > 1 && (G = t(G, R), pe = t(pe, R), ue = G.length, Oe = pe.length), te = ue, D = pe.slice(0, ue), k = D.length; k < ue; ) D[k++] = 0;
            tr = G.slice(), tr.unshift(0), Wr = G[0], G[1] >= H / 2 && ++Wr;
            do
              R = 0, a = e(G, D, ue, k), a < 0 ? (Ee = D[0], ue != k && (Ee = Ee * H + (D[1] || 0)), R = Ee / Wr | 0, R > 1 ? (R >= H && (R = H - 1), A = t(G, R), I = A.length, k = D.length, a = e(A, D, I, k), a == 1 && (R--, r(A, ue < I ? tr : G, I))) : (R == 0 && (a = R = 1), A = G.slice()), I = A.length, I < k && A.unshift(0), r(D, A, k), a == -1 && (k = D.length, a = e(G, D, ue, k), a < 1 && (R++, r(D, ue < k ? tr : G, k))), k = D.length) : a === 0 && (R++, D = [0]), L[v++] = R, a && D[0] ? D[k++] = pe[te] || 0 : (D = [pe[te]], k = 1);
            while ((te++ < Oe || D[0] !== void 0) && ee--);
          }
          return L[0] || L.shift(), C.e = f, N(C, s ? o + W(C) + 1 : o);
        };
      })();
      Xr = ii(ea);
      oe = new Xr(1);
      sr = Xr;
    });
    var P;
    var xe;
    var l = ae(() => {
      "use strict";
      oi();
      P = class extends sr {
        static {
          __name(this, "P");
        }
        static isDecimal(e) {
          return e instanceof sr;
        }
        static random(e = 20) {
          {
            let n = globalThis.crypto.getRandomValues(new Uint8Array(e)).reduce((i, o) => i + o, "");
            return new sr(`0.${n.slice(0, e)}`);
          }
        }
      }, xe = P;
    });
    function la() {
      return false;
    }
    __name(la, "la");
    function nn() {
      return { dev: 0, ino: 0, mode: 0, nlink: 0, uid: 0, gid: 0, rdev: 0, size: 0, blksize: 0, blocks: 0, atimeMs: 0, mtimeMs: 0, ctimeMs: 0, birthtimeMs: 0, atime: /* @__PURE__ */ new Date(), mtime: /* @__PURE__ */ new Date(), ctime: /* @__PURE__ */ new Date(), birthtime: /* @__PURE__ */ new Date() };
    }
    __name(nn, "nn");
    function ua() {
      return nn();
    }
    __name(ua, "ua");
    function ca() {
      return [];
    }
    __name(ca, "ca");
    function pa(t) {
      t(null, []);
    }
    __name(pa, "pa");
    function ma() {
      return "";
    }
    __name(ma, "ma");
    function da() {
      return "";
    }
    __name(da, "da");
    function fa() {
    }
    __name(fa, "fa");
    function ga() {
    }
    __name(ga, "ga");
    function ya() {
    }
    __name(ya, "ya");
    function ha() {
    }
    __name(ha, "ha");
    function ba() {
    }
    __name(ba, "ba");
    function Ea() {
    }
    __name(Ea, "Ea");
    function wa() {
    }
    __name(wa, "wa");
    function xa() {
    }
    __name(xa, "xa");
    function Pa() {
      return { close: /* @__PURE__ */ __name(() => {
      }, "close"), on: /* @__PURE__ */ __name(() => {
      }, "on"), removeAllListeners: /* @__PURE__ */ __name(() => {
      }, "removeAllListeners") };
    }
    __name(Pa, "Pa");
    function Ta(t, e) {
      e(null, nn());
    }
    __name(Ta, "Ta");
    var va;
    var Ra;
    var Pi;
    var Ti = ae(() => {
      "use strict";
      u();
      c();
      p();
      m();
      d();
      l();
      va = {}, Ra = { existsSync: la, lstatSync: nn, stat: Ta, statSync: ua, readdirSync: ca, readdir: pa, readlinkSync: ma, realpathSync: da, chmodSync: fa, renameSync: ga, mkdirSync: ya, rmdirSync: ha, rmSync: ba, unlinkSync: Ea, watchFile: wa, unwatchFile: xa, watch: Pa, promises: va }, Pi = Ra;
    });
    var vi = yt((Yp, Aa) => {
      Aa.exports = { name: "@prisma/internals", version: "6.19.3", description: "This package is intended for Prisma's internal use", main: "dist/index.js", types: "dist/index.d.ts", repository: { type: "git", url: "https://github.com/prisma/prisma.git", directory: "packages/internals" }, homepage: "https://www.prisma.io", author: "Tim Suchanek <suchanek@prisma.io>", bugs: "https://github.com/prisma/prisma/issues", license: "Apache-2.0", scripts: { dev: "DEV=true tsx helpers/build.ts", build: "tsx helpers/build.ts", test: "dotenv -e ../../.db.env -- jest --silent", prepublishOnly: "pnpm run build" }, files: ["README.md", "dist", "!**/libquery_engine*", "!dist/get-generators/engines/*", "scripts"], devDependencies: { "@babel/helper-validator-identifier": "7.25.9", "@opentelemetry/api": "1.9.0", "@swc/core": "1.11.5", "@swc/jest": "0.2.37", "@types/babel__helper-validator-identifier": "7.15.2", "@types/jest": "29.5.14", "@types/node": "18.19.76", "@types/resolve": "1.20.6", archiver: "6.0.2", "checkpoint-client": "1.1.33", "cli-truncate": "4.0.0", dotenv: "16.5.0", empathic: "2.0.0", "escape-string-regexp": "5.0.0", execa: "8.0.1", "fast-glob": "3.3.3", "find-up": "7.0.0", "fp-ts": "2.16.9", "fs-extra": "11.3.0", "global-directory": "4.0.0", globby: "11.1.0", "identifier-regex": "1.0.0", "indent-string": "4.0.0", "is-windows": "1.0.2", "is-wsl": "3.1.0", jest: "29.7.0", "jest-junit": "16.0.0", kleur: "4.1.5", "mock-stdin": "1.0.0", "new-github-issue-url": "0.2.1", "node-fetch": "3.3.2", "npm-packlist": "5.1.3", open: "7.4.2", "p-map": "4.0.0", resolve: "1.22.10", "string-width": "7.2.0", "strip-indent": "4.0.0", "temp-dir": "2.0.0", tempy: "1.0.1", "terminal-link": "4.0.0", tmp: "0.2.3", "ts-pattern": "5.6.2", "ts-toolbelt": "9.6.0", typescript: "5.4.5", yarn: "1.22.22" }, dependencies: { "@prisma/config": "workspace:*", "@prisma/debug": "workspace:*", "@prisma/dmmf": "workspace:*", "@prisma/driver-adapter-utils": "workspace:*", "@prisma/engines": "workspace:*", "@prisma/fetch-engine": "workspace:*", "@prisma/generator": "workspace:*", "@prisma/generator-helper": "workspace:*", "@prisma/get-platform": "workspace:*", "@prisma/prisma-schema-wasm": "7.1.1-3.c2990dca591cba766e3b7ef5d9e8a84796e47ab7", "@prisma/schema-engine-wasm": "7.1.1-3.c2990dca591cba766e3b7ef5d9e8a84796e47ab7", "@prisma/schema-files-loader": "workspace:*", arg: "5.0.2", prompts: "2.4.2" }, peerDependencies: { typescript: ">=5.1.0" }, peerDependenciesMeta: { typescript: { optional: true } }, sideEffects: false };
    });
    function Sa(...t) {
      return t.join("/");
    }
    __name(Sa, "Sa");
    function Ia(...t) {
      return t.join("/");
    }
    __name(Ia, "Ia");
    function Da(t) {
      let e = Ri(t), r = Ai(t), [n, i] = e.split(".");
      return { root: "/", dir: r, base: e, ext: i, name: n };
    }
    __name(Da, "Da");
    function Ri(t) {
      let e = t.split("/");
      return e[e.length - 1];
    }
    __name(Ri, "Ri");
    function Ai(t) {
      return t.split("/").slice(0, -1).join("/");
    }
    __name(Ai, "Ai");
    function ka(t) {
      let e = t.split("/").filter((i) => i !== "" && i !== "."), r = [];
      for (let i of e) i === ".." ? r.pop() : r.push(i);
      let n = r.join("/");
      return t.startsWith("/") ? "/" + n : n;
    }
    __name(ka, "ka");
    var Ci;
    var Oa;
    var _a;
    var Ma;
    var cr;
    var Si = ae(() => {
      "use strict";
      u();
      c();
      p();
      m();
      d();
      l();
      Ci = "/", Oa = ":";
      _a = { sep: Ci }, Ma = { basename: Ri, delimiter: Oa, dirname: Ai, join: Ia, normalize: ka, parse: Da, posix: _a, resolve: Sa, sep: Ci }, cr = Ma;
    });
    var un = yt((ud, qa) => {
      qa.exports = { name: "@prisma/engines-version", version: "7.1.1-3.c2990dca591cba766e3b7ef5d9e8a84796e47ab7", main: "index.js", types: "index.d.ts", license: "Apache-2.0", author: "Tim Suchanek <suchanek@prisma.io>", prisma: { enginesVersion: "c2990dca591cba766e3b7ef5d9e8a84796e47ab7" }, repository: { type: "git", url: "https://github.com/prisma/engines-wrapper.git", directory: "packages/engines-version" }, devDependencies: { "@types/node": "18.19.76", typescript: "4.9.5" }, files: ["index.js", "index.d.ts"], scripts: { build: "tsc -d" } };
    });
    var Di = yt((dr) => {
      "use strict";
      u();
      c();
      p();
      m();
      d();
      l();
      Object.defineProperty(dr, "__esModule", { value: true });
      dr.enginesVersion = void 0;
      dr.enginesVersion = un().prisma.enginesVersion;
    });
    var _i = yt((vd, ki) => {
      "use strict";
      u();
      c();
      p();
      m();
      d();
      l();
      ki.exports = (t, e = 1, r) => {
        if (r = { indent: " ", includeEmptyLines: false, ...r }, typeof t != "string") throw new TypeError(`Expected \`input\` to be a \`string\`, got \`${typeof t}\``);
        if (typeof e != "number") throw new TypeError(`Expected \`count\` to be a \`number\`, got \`${typeof e}\``);
        if (typeof r.indent != "string") throw new TypeError(`Expected \`options.indent\` to be a \`string\`, got \`${typeof r.indent}\``);
        if (e === 0) return t;
        let n = r.includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;
        return t.replace(n, r.indent.repeat(e));
      };
    });
    var hn = yt((eb, qi) => {
      "use strict";
      u();
      c();
      p();
      m();
      d();
      l();
      qi.exports = /* @__PURE__ */ (function() {
        function t(e, r, n, i, o) {
          return e < r || n < r ? e > n ? n + 1 : e + 1 : i === o ? r : r + 1;
        }
        __name(t, "t");
        return function(e, r) {
          if (e === r) return 0;
          if (e.length > r.length) {
            var n = e;
            e = r, r = n;
          }
          for (var i = e.length, o = r.length; i > 0 && e.charCodeAt(i - 1) === r.charCodeAt(o - 1); ) i--, o--;
          for (var s = 0; s < i && e.charCodeAt(s) === r.charCodeAt(s); ) s++;
          if (i -= s, o -= s, i === 0 || o < 3) return o;
          var a = 0, f, v, R, A, I, C, L, D, k, Ee, ee, U, te = [];
          for (f = 0; f < i; f++) te.push(f + 1), te.push(e.charCodeAt(s + f));
          for (var Oe = te.length - 1; a < o - 3; ) for (k = r.charCodeAt(s + (v = a)), Ee = r.charCodeAt(s + (R = a + 1)), ee = r.charCodeAt(s + (A = a + 2)), U = r.charCodeAt(s + (I = a + 3)), C = a += 4, f = 0; f < Oe; f += 2) L = te[f], D = te[f + 1], v = t(L, v, R, k, D), R = t(v, R, A, Ee, D), A = t(R, A, I, ee, D), C = t(A, I, C, U, D), te[f] = C, I = A, A = R, R = v, v = L;
          for (; a < o; ) for (k = r.charCodeAt(s + (v = a)), C = ++a, f = 0; f < Oe; f += 2) L = te[f], te[f] = C = t(L, v, C, k, te[f + 1]), v = L;
          return C;
        };
      })();
    });
    var Qi = ae(() => {
      "use strict";
      u();
      c();
      p();
      m();
      d();
      l();
    });
    var Gi = ae(() => {
      "use strict";
      u();
      c();
      p();
      m();
      d();
      l();
    });
    var Fr;
    var yo = ae(() => {
      "use strict";
      u();
      c();
      p();
      m();
      d();
      l();
      Fr = class {
        static {
          __name(this, "Fr");
        }
        events = {};
        on(e, r) {
          return this.events[e] || (this.events[e] = []), this.events[e].push(r), this;
        }
        emit(e, ...r) {
          return this.events[e] ? (this.events[e].forEach((n) => {
            n(...r);
          }), true) : false;
        }
      };
    });
    var zu = {};
    ht(zu, { DMMF: /* @__PURE__ */ __name(() => At, "DMMF"), Debug: /* @__PURE__ */ __name(() => j, "Debug"), Decimal: /* @__PURE__ */ __name(() => xe, "Decimal"), Extensions: /* @__PURE__ */ __name(() => Zr, "Extensions"), MetricsClient: /* @__PURE__ */ __name(() => nt, "MetricsClient"), PrismaClientInitializationError: /* @__PURE__ */ __name(() => M, "PrismaClientInitializationError"), PrismaClientKnownRequestError: /* @__PURE__ */ __name(() => X, "PrismaClientKnownRequestError"), PrismaClientRustPanicError: /* @__PURE__ */ __name(() => Te, "PrismaClientRustPanicError"), PrismaClientUnknownRequestError: /* @__PURE__ */ __name(() => Q, "PrismaClientUnknownRequestError"), PrismaClientValidationError: /* @__PURE__ */ __name(() => Y, "PrismaClientValidationError"), Public: /* @__PURE__ */ __name(() => en, "Public"), Sql: /* @__PURE__ */ __name(() => ne, "Sql"), createParam: /* @__PURE__ */ __name(() => ao, "createParam"), defineDmmfProperty: /* @__PURE__ */ __name(() => fo, "defineDmmfProperty"), deserializeJsonResponse: /* @__PURE__ */ __name(() => lt, "deserializeJsonResponse"), deserializeRawResult: /* @__PURE__ */ __name(() => Gr, "deserializeRawResult"), dmmfToRuntimeDataModel: /* @__PURE__ */ __name(() => Ui, "dmmfToRuntimeDataModel"), empty: /* @__PURE__ */ __name(() => bo, "empty"), getPrismaClient: /* @__PURE__ */ __name(() => Fs, "getPrismaClient"), getRuntime: /* @__PURE__ */ __name(() => ut, "getRuntime"), join: /* @__PURE__ */ __name(() => ho, "join"), makeStrictEnum: /* @__PURE__ */ __name(() => Ns, "makeStrictEnum"), makeTypedQueryFactory: /* @__PURE__ */ __name(() => go, "makeTypedQueryFactory"), objectEnumValues: /* @__PURE__ */ __name(() => Ar, "objectEnumValues"), raw: /* @__PURE__ */ __name(() => An, "raw"), serializeJsonQuery: /* @__PURE__ */ __name(() => _r, "serializeJsonQuery"), skip: /* @__PURE__ */ __name(() => kr, "skip"), sqltag: /* @__PURE__ */ __name(() => Cn, "sqltag"), warnEnvConflicts: /* @__PURE__ */ __name(() => void 0, "warnEnvConflicts"), warnOnce: /* @__PURE__ */ __name(() => Tt, "warnOnce") });
    module.exports = Gs(zu);
    u();
    c();
    p();
    m();
    d();
    l();
    var Zr = {};
    ht(Zr, { defineExtension: /* @__PURE__ */ __name(() => si, "defineExtension"), getExtensionContext: /* @__PURE__ */ __name(() => ai, "getExtensionContext") });
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    function si(t) {
      return typeof t == "function" ? t : (e) => e.$extends(t);
    }
    __name(si, "si");
    u();
    c();
    p();
    m();
    d();
    l();
    function ai(t) {
      return t;
    }
    __name(ai, "ai");
    var en = {};
    ht(en, { validator: /* @__PURE__ */ __name(() => li, "validator") });
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    function li(...t) {
      return (e) => e;
    }
    __name(li, "li");
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    var tn;
    var ui;
    var ci;
    var pi;
    var mi = true;
    typeof g < "u" && ({ FORCE_COLOR: tn, NODE_DISABLE_COLORS: ui, NO_COLOR: ci, TERM: pi } = g.env || {}, mi = g.stdout && g.stdout.isTTY);
    var na = { enabled: !ui && ci == null && pi !== "dumb" && (tn != null && tn !== "0" || mi) };
    function q(t, e) {
      let r = new RegExp(`\\x1b\\[${e}m`, "g"), n = `\x1B[${t}m`, i = `\x1B[${e}m`;
      return function(o) {
        return !na.enabled || o == null ? o : n + (~("" + o).indexOf(i) ? o.replace(r, i + n) : o) + i;
      };
    }
    __name(q, "q");
    var Kc = q(0, 0);
    var ar = q(1, 22);
    var lr = q(2, 22);
    var Hc = q(3, 23);
    var di = q(4, 24);
    var zc = q(7, 27);
    var Yc = q(8, 28);
    var Xc = q(9, 29);
    var Zc = q(30, 39);
    var Ge = q(31, 39);
    var fi = q(32, 39);
    var gi = q(33, 39);
    var yi = q(34, 39);
    var ep = q(35, 39);
    var hi = q(36, 39);
    var tp = q(37, 39);
    var bi = q(90, 39);
    var rp = q(90, 39);
    var np = q(40, 49);
    var ip = q(41, 49);
    var op = q(42, 49);
    var sp = q(43, 49);
    var ap = q(44, 49);
    var lp = q(45, 49);
    var up = q(46, 49);
    var cp = q(47, 49);
    u();
    c();
    p();
    m();
    d();
    l();
    var ia = 100;
    var Ei = ["green", "yellow", "blue", "magenta", "cyan", "red"];
    var ur = [];
    var wi = Date.now();
    var oa = 0;
    var rn = typeof g < "u" ? g.env : {};
    globalThis.DEBUG ??= rn.DEBUG ?? "";
    globalThis.DEBUG_COLORS ??= rn.DEBUG_COLORS ? rn.DEBUG_COLORS === "true" : true;
    var wt = { enable(t) {
      typeof t == "string" && (globalThis.DEBUG = t);
    }, disable() {
      let t = globalThis.DEBUG;
      return globalThis.DEBUG = "", t;
    }, enabled(t) {
      let e = globalThis.DEBUG.split(",").map((i) => i.replace(/[.+?^${}()|[\]\\]/g, "\\$&")), r = e.some((i) => i === "" || i[0] === "-" ? false : t.match(RegExp(i.split("*").join(".*") + "$"))), n = e.some((i) => i === "" || i[0] !== "-" ? false : t.match(RegExp(i.slice(1).split("*").join(".*") + "$")));
      return r && !n;
    }, log: /* @__PURE__ */ __name((...t) => {
      let [e, r, ...n] = t;
      (console.warn ?? console.log)(`${e} ${r}`, ...n);
    }, "log"), formatters: {} };
    function sa(t) {
      let e = { color: Ei[oa++ % Ei.length], enabled: wt.enabled(t), namespace: t, log: wt.log, extend: /* @__PURE__ */ __name(() => {
      }, "extend") }, r = /* @__PURE__ */ __name((...n) => {
        let { enabled: i, namespace: o, color: s, log: a } = e;
        if (n.length !== 0 && ur.push([o, ...n]), ur.length > ia && ur.shift(), wt.enabled(o) || i) {
          let f = n.map((R) => typeof R == "string" ? R : aa(R)), v = `+${Date.now() - wi}ms`;
          wi = Date.now(), a(o, ...f, v);
        }
      }, "r");
      return new Proxy(r, { get: /* @__PURE__ */ __name((n, i) => e[i], "get"), set: /* @__PURE__ */ __name((n, i, o) => e[i] = o, "set") });
    }
    __name(sa, "sa");
    var j = new Proxy(sa, { get: /* @__PURE__ */ __name((t, e) => wt[e], "get"), set: /* @__PURE__ */ __name((t, e, r) => wt[e] = r, "set") });
    function aa(t, e = 2) {
      let r = /* @__PURE__ */ new Set();
      return JSON.stringify(t, (n, i) => {
        if (typeof i == "object" && i !== null) {
          if (r.has(i)) return "[Circular *]";
          r.add(i);
        } else if (typeof i == "bigint") return i.toString();
        return i;
      }, e);
    }
    __name(aa, "aa");
    function xi() {
      ur.length = 0;
    }
    __name(xi, "xi");
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    var on2 = ["darwin", "darwin-arm64", "debian-openssl-1.0.x", "debian-openssl-1.1.x", "debian-openssl-3.0.x", "rhel-openssl-1.0.x", "rhel-openssl-1.1.x", "rhel-openssl-3.0.x", "linux-arm64-openssl-1.1.x", "linux-arm64-openssl-1.0.x", "linux-arm64-openssl-3.0.x", "linux-arm-openssl-1.1.x", "linux-arm-openssl-1.0.x", "linux-arm-openssl-3.0.x", "linux-musl", "linux-musl-openssl-3.0.x", "linux-musl-arm64-openssl-1.1.x", "linux-musl-arm64-openssl-3.0.x", "linux-nixos", "linux-static-x64", "linux-static-arm64", "windows", "freebsd11", "freebsd12", "freebsd13", "freebsd14", "freebsd15", "openbsd", "netbsd", "arm"];
    u();
    c();
    p();
    m();
    d();
    l();
    var Ca = vi();
    var sn = Ca.version;
    u();
    c();
    p();
    m();
    d();
    l();
    function Je(t) {
      let e = La();
      return e || (t?.config.engineType === "library" ? "library" : t?.config.engineType === "binary" ? "binary" : t?.config.engineType === "client" ? "client" : Fa());
    }
    __name(Je, "Je");
    function La() {
      let t = g.env.PRISMA_CLIENT_ENGINE_TYPE;
      return t === "library" ? "library" : t === "binary" ? "binary" : t === "client" ? "client" : void 0;
    }
    __name(La, "La");
    function Fa() {
      return "library";
    }
    __name(Fa, "Fa");
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    function an(t) {
      return t.name === "DriverAdapterError" && typeof t.cause == "object";
    }
    __name(an, "an");
    u();
    c();
    p();
    m();
    d();
    l();
    function pr(t) {
      return { ok: true, value: t, map(e) {
        return pr(e(t));
      }, flatMap(e) {
        return e(t);
      } };
    }
    __name(pr, "pr");
    function Le(t) {
      return { ok: false, error: t, map() {
        return Le(t);
      }, flatMap() {
        return Le(t);
      } };
    }
    __name(Le, "Le");
    var Ii = j("driver-adapter-utils");
    var ln = class {
      static {
        __name(this, "ln");
      }
      registeredErrors = [];
      consumeError(e) {
        return this.registeredErrors[e];
      }
      registerNewError(e) {
        let r = 0;
        for (; this.registeredErrors[r] !== void 0; ) r++;
        return this.registeredErrors[r] = { error: e }, r;
      }
    };
    var mr = /* @__PURE__ */ __name((t, e = new ln()) => {
      let r = { adapterName: t.adapterName, errorRegistry: e, queryRaw: Pe(e, t.queryRaw.bind(t)), executeRaw: Pe(e, t.executeRaw.bind(t)), executeScript: Pe(e, t.executeScript.bind(t)), dispose: Pe(e, t.dispose.bind(t)), provider: t.provider, startTransaction: /* @__PURE__ */ __name(async (...n) => (await Pe(e, t.startTransaction.bind(t))(...n)).map((o) => Na(e, o)), "startTransaction") };
      return t.getConnectionInfo && (r.getConnectionInfo = Ua(e, t.getConnectionInfo.bind(t))), r;
    }, "mr");
    var Na = /* @__PURE__ */ __name((t, e) => ({ adapterName: e.adapterName, provider: e.provider, options: e.options, queryRaw: Pe(t, e.queryRaw.bind(e)), executeRaw: Pe(t, e.executeRaw.bind(e)), commit: Pe(t, e.commit.bind(e)), rollback: Pe(t, e.rollback.bind(e)) }), "Na");
    function Pe(t, e) {
      return async (...r) => {
        try {
          return pr(await e(...r));
        } catch (n) {
          if (Ii("[error@wrapAsync]", n), an(n)) return Le(n.cause);
          let i = t.registerNewError(n);
          return Le({ kind: "GenericJs", id: i });
        }
      };
    }
    __name(Pe, "Pe");
    function Ua(t, e) {
      return (...r) => {
        try {
          return pr(e(...r));
        } catch (n) {
          if (Ii("[error@wrapSync]", n), an(n)) return Le(n.cause);
          let i = t.registerNewError(n);
          return Le({ kind: "GenericJs", id: i });
        }
      };
    }
    __name(Ua, "Ua");
    u();
    c();
    p();
    m();
    d();
    l();
    var Oi = "prisma+postgres";
    var fr = `${Oi}:`;
    function gr(t) {
      return t?.toString().startsWith(`${fr}//`) ?? false;
    }
    __name(gr, "gr");
    function cn(t) {
      if (!gr(t)) return false;
      let { host: e } = new URL(t);
      return e.includes("localhost") || e.includes("127.0.0.1") || e.includes("[::1]");
    }
    __name(cn, "cn");
    var Pt = {};
    ht(Pt, { error: /* @__PURE__ */ __name(() => $a, "error"), info: /* @__PURE__ */ __name(() => Ba, "info"), log: /* @__PURE__ */ __name(() => Va, "log"), query: /* @__PURE__ */ __name(() => ja, "query"), should: /* @__PURE__ */ __name(() => Mi, "should"), tags: /* @__PURE__ */ __name(() => xt, "tags"), warn: /* @__PURE__ */ __name(() => pn, "warn") });
    u();
    c();
    p();
    m();
    d();
    l();
    var xt = { error: Ge("prisma:error"), warn: gi("prisma:warn"), info: hi("prisma:info"), query: yi("prisma:query") };
    var Mi = { warn: /* @__PURE__ */ __name(() => !g.env.PRISMA_DISABLE_WARNINGS, "warn") };
    function Va(...t) {
      console.log(...t);
    }
    __name(Va, "Va");
    function pn(t, ...e) {
      Mi.warn() && console.warn(`${xt.warn} ${t}`, ...e);
    }
    __name(pn, "pn");
    function Ba(t, ...e) {
      console.info(`${xt.info} ${t}`, ...e);
    }
    __name(Ba, "Ba");
    function $a(t, ...e) {
      console.error(`${xt.error} ${t}`, ...e);
    }
    __name($a, "$a");
    function ja(t, ...e) {
      console.log(`${xt.query} ${t}`, ...e);
    }
    __name(ja, "ja");
    u();
    c();
    p();
    m();
    d();
    l();
    function yr(t, e) {
      if (!t) throw new Error(`${e}. This should never happen. If you see this error, please, open an issue at https://pris.ly/prisma-prisma-bug-report`);
    }
    __name(yr, "yr");
    u();
    c();
    p();
    m();
    d();
    l();
    function Fe(t, e) {
      throw new Error(e);
    }
    __name(Fe, "Fe");
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    function mn({ onlyFirst: t = false } = {}) {
      let r = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?(?:\\u0007|\\u001B\\u005C|\\u009C))", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"].join("|");
      return new RegExp(r, t ? void 0 : "g");
    }
    __name(mn, "mn");
    var Qa = mn();
    function dn(t) {
      if (typeof t != "string") throw new TypeError(`Expected a \`string\`, got \`${typeof t}\``);
      return t.replace(Qa, "");
    }
    __name(dn, "dn");
    u();
    c();
    p();
    m();
    d();
    l();
    function fn(t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }
    __name(fn, "fn");
    u();
    c();
    p();
    m();
    d();
    l();
    function hr(t, e) {
      let r = {};
      for (let n of Object.keys(t)) r[n] = e(t[n], n);
      return r;
    }
    __name(hr, "hr");
    u();
    c();
    p();
    m();
    d();
    l();
    function gn(t, e) {
      if (t.length === 0) return;
      let r = t[0];
      for (let n = 1; n < t.length; n++) e(r, t[n]) < 0 && (r = t[n]);
      return r;
    }
    __name(gn, "gn");
    u();
    c();
    p();
    m();
    d();
    l();
    function O(t, e) {
      Object.defineProperty(t, "name", { value: e, configurable: true });
    }
    __name(O, "O");
    u();
    c();
    p();
    m();
    d();
    l();
    var Li = /* @__PURE__ */ new Set();
    var Tt = /* @__PURE__ */ __name((t, e, ...r) => {
      Li.has(t) || (Li.add(t), pn(e, ...r));
    }, "Tt");
    var M = class t extends Error {
      static {
        __name(this, "t");
      }
      clientVersion;
      errorCode;
      retryable;
      constructor(e, r, n) {
        super(e), this.name = "PrismaClientInitializationError", this.clientVersion = r, this.errorCode = n, Error.captureStackTrace(t);
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientInitializationError";
      }
    };
    O(M, "PrismaClientInitializationError");
    u();
    c();
    p();
    m();
    d();
    l();
    var X = class extends Error {
      static {
        __name(this, "X");
      }
      code;
      meta;
      clientVersion;
      batchRequestIdx;
      constructor(e, { code: r, clientVersion: n, meta: i, batchRequestIdx: o }) {
        super(e), this.name = "PrismaClientKnownRequestError", this.code = r, this.clientVersion = n, this.meta = i, Object.defineProperty(this, "batchRequestIdx", { value: o, enumerable: false, writable: true });
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientKnownRequestError";
      }
    };
    O(X, "PrismaClientKnownRequestError");
    u();
    c();
    p();
    m();
    d();
    l();
    var Te = class extends Error {
      static {
        __name(this, "Te");
      }
      clientVersion;
      constructor(e, r) {
        super(e), this.name = "PrismaClientRustPanicError", this.clientVersion = r;
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientRustPanicError";
      }
    };
    O(Te, "PrismaClientRustPanicError");
    u();
    c();
    p();
    m();
    d();
    l();
    var Q = class extends Error {
      static {
        __name(this, "Q");
      }
      clientVersion;
      batchRequestIdx;
      constructor(e, { clientVersion: r, batchRequestIdx: n }) {
        super(e), this.name = "PrismaClientUnknownRequestError", this.clientVersion = r, Object.defineProperty(this, "batchRequestIdx", { value: n, writable: true, enumerable: false });
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientUnknownRequestError";
      }
    };
    O(Q, "PrismaClientUnknownRequestError");
    u();
    c();
    p();
    m();
    d();
    l();
    var Y = class extends Error {
      static {
        __name(this, "Y");
      }
      name = "PrismaClientValidationError";
      clientVersion;
      constructor(e, { clientVersion: r }) {
        super(e), this.clientVersion = r;
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientValidationError";
      }
    };
    O(Y, "PrismaClientValidationError");
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    var fe = class {
      static {
        __name(this, "fe");
      }
      _map = /* @__PURE__ */ new Map();
      get(e) {
        return this._map.get(e)?.value;
      }
      set(e, r) {
        this._map.set(e, { value: r });
      }
      getOrCreate(e, r) {
        let n = this._map.get(e);
        if (n) return n.value;
        let i = r();
        return this.set(e, i), i;
      }
    };
    u();
    c();
    p();
    m();
    d();
    l();
    function Ce(t) {
      return t.substring(0, 1).toLowerCase() + t.substring(1);
    }
    __name(Ce, "Ce");
    u();
    c();
    p();
    m();
    d();
    l();
    function Ni(t, e) {
      let r = {};
      for (let n of t) {
        let i = n[e];
        r[i] = n;
      }
      return r;
    }
    __name(Ni, "Ni");
    u();
    c();
    p();
    m();
    d();
    l();
    function vt(t) {
      let e;
      return { get() {
        return e || (e = { value: t() }), e.value;
      } };
    }
    __name(vt, "vt");
    u();
    c();
    p();
    m();
    d();
    l();
    function Ui(t) {
      return { models: yn(t.models), enums: yn(t.enums), types: yn(t.types) };
    }
    __name(Ui, "Ui");
    function yn(t) {
      let e = {};
      for (let { name: r, ...n } of t) e[r] = n;
      return e;
    }
    __name(yn, "yn");
    u();
    c();
    p();
    m();
    d();
    l();
    function We(t) {
      return t instanceof Date || Object.prototype.toString.call(t) === "[object Date]";
    }
    __name(We, "We");
    function br(t) {
      return t.toString() !== "Invalid Date";
    }
    __name(br, "br");
    u();
    c();
    p();
    m();
    d();
    l();
    l();
    function Ke(t) {
      return P.isDecimal(t) ? true : t !== null && typeof t == "object" && typeof t.s == "number" && typeof t.e == "number" && typeof t.toFixed == "function" && Array.isArray(t.d);
    }
    __name(Ke, "Ke");
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    var At = {};
    ht(At, { ModelAction: /* @__PURE__ */ __name(() => Rt, "ModelAction"), datamodelEnumToSchemaEnum: /* @__PURE__ */ __name(() => Ga, "datamodelEnumToSchemaEnum") });
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    function Ga(t) {
      return { name: t.name, values: t.values.map((e) => e.name) };
    }
    __name(Ga, "Ga");
    u();
    c();
    p();
    m();
    d();
    l();
    var Rt = ((U) => (U.findUnique = "findUnique", U.findUniqueOrThrow = "findUniqueOrThrow", U.findFirst = "findFirst", U.findFirstOrThrow = "findFirstOrThrow", U.findMany = "findMany", U.create = "create", U.createMany = "createMany", U.createManyAndReturn = "createManyAndReturn", U.update = "update", U.updateMany = "updateMany", U.updateManyAndReturn = "updateManyAndReturn", U.upsert = "upsert", U.delete = "delete", U.deleteMany = "deleteMany", U.groupBy = "groupBy", U.count = "count", U.aggregate = "aggregate", U.findRaw = "findRaw", U.aggregateRaw = "aggregateRaw", U))(Rt || {});
    var Ja = bt(_i());
    var Wa = { red: Ge, gray: bi, dim: lr, bold: ar, underline: di, highlightSource: /* @__PURE__ */ __name((t) => t.highlight(), "highlightSource") };
    var Ka = { red: /* @__PURE__ */ __name((t) => t, "red"), gray: /* @__PURE__ */ __name((t) => t, "gray"), dim: /* @__PURE__ */ __name((t) => t, "dim"), bold: /* @__PURE__ */ __name((t) => t, "bold"), underline: /* @__PURE__ */ __name((t) => t, "underline"), highlightSource: /* @__PURE__ */ __name((t) => t, "highlightSource") };
    function Ha({ message: t, originalMethod: e, isPanic: r, callArguments: n }) {
      return { functionName: `prisma.${e}()`, message: t, isPanic: r ?? false, callArguments: n };
    }
    __name(Ha, "Ha");
    function za({ functionName: t, location: e, message: r, isPanic: n, contextLines: i, callArguments: o }, s) {
      let a = [""], f = e ? " in" : ":";
      if (n ? (a.push(s.red(`Oops, an unknown error occurred! This is ${s.bold("on us")}, you did nothing wrong.`)), a.push(s.red(`It occurred in the ${s.bold(`\`${t}\``)} invocation${f}`))) : a.push(s.red(`Invalid ${s.bold(`\`${t}\``)} invocation${f}`)), e && a.push(s.underline(Ya(e))), i) {
        a.push("");
        let v = [i.toString()];
        o && (v.push(o), v.push(s.dim(")"))), a.push(v.join("")), o && a.push("");
      } else a.push(""), o && a.push(o), a.push("");
      return a.push(r), a.join(`
`);
    }
    __name(za, "za");
    function Ya(t) {
      let e = [t.fileName];
      return t.lineNumber && e.push(String(t.lineNumber)), t.columnNumber && e.push(String(t.columnNumber)), e.join(":");
    }
    __name(Ya, "Ya");
    function Er(t) {
      let e = t.showColors ? Wa : Ka, r;
      return typeof $getTemplateParameters < "u" ? r = $getTemplateParameters(t, e) : r = Ha(t), za(r, e);
    }
    __name(Er, "Er");
    u();
    c();
    p();
    m();
    d();
    l();
    var Wi = bt(hn());
    u();
    c();
    p();
    m();
    d();
    l();
    function $i(t, e, r) {
      let n = ji(t), i = Xa(n), o = el(i);
      o ? wr(o, e, r) : e.addErrorMessage(() => "Unknown error");
    }
    __name($i, "$i");
    function ji(t) {
      return t.errors.flatMap((e) => e.kind === "Union" ? ji(e) : [e]);
    }
    __name(ji, "ji");
    function Xa(t) {
      let e = /* @__PURE__ */ new Map(), r = [];
      for (let n of t) {
        if (n.kind !== "InvalidArgumentType") {
          r.push(n);
          continue;
        }
        let i = `${n.selectionPath.join(".")}:${n.argumentPath.join(".")}`, o = e.get(i);
        o ? e.set(i, { ...n, argument: { ...n.argument, typeNames: Za(o.argument.typeNames, n.argument.typeNames) } }) : e.set(i, n);
      }
      return r.push(...e.values()), r;
    }
    __name(Xa, "Xa");
    function Za(t, e) {
      return [...new Set(t.concat(e))];
    }
    __name(Za, "Za");
    function el(t) {
      return gn(t, (e, r) => {
        let n = Vi(e), i = Vi(r);
        return n !== i ? n - i : Bi(e) - Bi(r);
      });
    }
    __name(el, "el");
    function Vi(t) {
      let e = 0;
      return Array.isArray(t.selectionPath) && (e += t.selectionPath.length), Array.isArray(t.argumentPath) && (e += t.argumentPath.length), e;
    }
    __name(Vi, "Vi");
    function Bi(t) {
      switch (t.kind) {
        case "InvalidArgumentValue":
        case "ValueTooLarge":
          return 20;
        case "InvalidArgumentType":
          return 10;
        case "RequiredArgumentMissing":
          return -10;
        default:
          return 0;
      }
    }
    __name(Bi, "Bi");
    u();
    c();
    p();
    m();
    d();
    l();
    var se = class {
      static {
        __name(this, "se");
      }
      constructor(e, r) {
        this.name = e;
        this.value = r;
      }
      isRequired = false;
      makeRequired() {
        return this.isRequired = true, this;
      }
      write(e) {
        let { colors: { green: r } } = e.context;
        e.addMarginSymbol(r(this.isRequired ? "+" : "?")), e.write(r(this.name)), this.isRequired || e.write(r("?")), e.write(r(": ")), typeof this.value == "string" ? e.write(r(this.value)) : e.write(this.value);
      }
    };
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    Gi();
    u();
    c();
    p();
    m();
    d();
    l();
    var He = class {
      static {
        __name(this, "He");
      }
      constructor(e = 0, r) {
        this.context = r;
        this.currentIndent = e;
      }
      lines = [];
      currentLine = "";
      currentIndent = 0;
      marginSymbol;
      afterNextNewLineCallback;
      write(e) {
        return typeof e == "string" ? this.currentLine += e : e.write(this), this;
      }
      writeJoined(e, r, n = (i, o) => o.write(i)) {
        let i = r.length - 1;
        for (let o = 0; o < r.length; o++) n(r[o], this), o !== i && this.write(e);
        return this;
      }
      writeLine(e) {
        return this.write(e).newLine();
      }
      newLine() {
        this.lines.push(this.indentedCurrentLine()), this.currentLine = "", this.marginSymbol = void 0;
        let e = this.afterNextNewLineCallback;
        return this.afterNextNewLineCallback = void 0, e?.(), this;
      }
      withIndent(e) {
        return this.indent(), e(this), this.unindent(), this;
      }
      afterNextNewline(e) {
        return this.afterNextNewLineCallback = e, this;
      }
      indent() {
        return this.currentIndent++, this;
      }
      unindent() {
        return this.currentIndent > 0 && this.currentIndent--, this;
      }
      addMarginSymbol(e) {
        return this.marginSymbol = e, this;
      }
      toString() {
        return this.lines.concat(this.indentedCurrentLine()).join(`
`);
      }
      getCurrentLineLength() {
        return this.currentLine.length;
      }
      indentedCurrentLine() {
        let e = this.currentLine.padStart(this.currentLine.length + 2 * this.currentIndent);
        return this.marginSymbol ? this.marginSymbol + e.slice(1) : e;
      }
    };
    Qi();
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    var xr = class {
      static {
        __name(this, "xr");
      }
      constructor(e) {
        this.value = e;
      }
      write(e) {
        e.write(this.value);
      }
      markAsError() {
        this.value.markAsError();
      }
    };
    u();
    c();
    p();
    m();
    d();
    l();
    var Pr = /* @__PURE__ */ __name((t) => t, "Pr");
    var Tr = { bold: Pr, red: Pr, green: Pr, dim: Pr, enabled: false };
    var Ji = { bold: ar, red: Ge, green: fi, dim: lr, enabled: true };
    var ze = { write(t) {
      t.writeLine(",");
    } };
    u();
    c();
    p();
    m();
    d();
    l();
    var ge = class {
      static {
        __name(this, "ge");
      }
      constructor(e) {
        this.contents = e;
      }
      isUnderlined = false;
      color = /* @__PURE__ */ __name((e) => e, "color");
      underline() {
        return this.isUnderlined = true, this;
      }
      setColor(e) {
        return this.color = e, this;
      }
      write(e) {
        let r = e.getCurrentLineLength();
        e.write(this.color(this.contents)), this.isUnderlined && e.afterNextNewline(() => {
          e.write(" ".repeat(r)).writeLine(this.color("~".repeat(this.contents.length)));
        });
      }
    };
    u();
    c();
    p();
    m();
    d();
    l();
    var Se = class {
      static {
        __name(this, "Se");
      }
      hasError = false;
      markAsError() {
        return this.hasError = true, this;
      }
    };
    var Ye = class extends Se {
      static {
        __name(this, "Ye");
      }
      items = [];
      addItem(e) {
        return this.items.push(new xr(e)), this;
      }
      getField(e) {
        return this.items[e];
      }
      getPrintWidth() {
        return this.items.length === 0 ? 2 : Math.max(...this.items.map((r) => r.value.getPrintWidth())) + 2;
      }
      write(e) {
        if (this.items.length === 0) {
          this.writeEmpty(e);
          return;
        }
        this.writeWithItems(e);
      }
      writeEmpty(e) {
        let r = new ge("[]");
        this.hasError && r.setColor(e.context.colors.red).underline(), e.write(r);
      }
      writeWithItems(e) {
        let { colors: r } = e.context;
        e.writeLine("[").withIndent(() => e.writeJoined(ze, this.items).newLine()).write("]"), this.hasError && e.afterNextNewline(() => {
          e.writeLine(r.red("~".repeat(this.getPrintWidth())));
        });
      }
      asObject() {
      }
    };
    var Xe = class t extends Se {
      static {
        __name(this, "t");
      }
      fields = {};
      suggestions = [];
      addField(e) {
        this.fields[e.name] = e;
      }
      addSuggestion(e) {
        this.suggestions.push(e);
      }
      getField(e) {
        return this.fields[e];
      }
      getDeepField(e) {
        let [r, ...n] = e, i = this.getField(r);
        if (!i) return;
        let o = i;
        for (let s of n) {
          let a;
          if (o.value instanceof t ? a = o.value.getField(s) : o.value instanceof Ye && (a = o.value.getField(Number(s))), !a) return;
          o = a;
        }
        return o;
      }
      getDeepFieldValue(e) {
        return e.length === 0 ? this : this.getDeepField(e)?.value;
      }
      hasField(e) {
        return !!this.getField(e);
      }
      removeAllFields() {
        this.fields = {};
      }
      removeField(e) {
        delete this.fields[e];
      }
      getFields() {
        return this.fields;
      }
      isEmpty() {
        return Object.keys(this.fields).length === 0;
      }
      getFieldValue(e) {
        return this.getField(e)?.value;
      }
      getDeepSubSelectionValue(e) {
        let r = this;
        for (let n of e) {
          if (!(r instanceof t)) return;
          let i = r.getSubSelectionValue(n);
          if (!i) return;
          r = i;
        }
        return r;
      }
      getDeepSelectionParent(e) {
        let r = this.getSelectionParent();
        if (!r) return;
        let n = r;
        for (let i of e) {
          let o = n.value.getFieldValue(i);
          if (!o || !(o instanceof t)) return;
          let s = o.getSelectionParent();
          if (!s) return;
          n = s;
        }
        return n;
      }
      getSelectionParent() {
        let e = this.getField("select")?.value.asObject();
        if (e) return { kind: "select", value: e };
        let r = this.getField("include")?.value.asObject();
        if (r) return { kind: "include", value: r };
      }
      getSubSelectionValue(e) {
        return this.getSelectionParent()?.value.fields[e].value;
      }
      getPrintWidth() {
        let e = Object.values(this.fields);
        return e.length == 0 ? 2 : Math.max(...e.map((n) => n.getPrintWidth())) + 2;
      }
      write(e) {
        let r = Object.values(this.fields);
        if (r.length === 0 && this.suggestions.length === 0) {
          this.writeEmpty(e);
          return;
        }
        this.writeWithContents(e, r);
      }
      asObject() {
        return this;
      }
      writeEmpty(e) {
        let r = new ge("{}");
        this.hasError && r.setColor(e.context.colors.red).underline(), e.write(r);
      }
      writeWithContents(e, r) {
        e.writeLine("{").withIndent(() => {
          e.writeJoined(ze, [...r, ...this.suggestions]).newLine();
        }), e.write("}"), this.hasError && e.afterNextNewline(() => {
          e.writeLine(e.context.colors.red("~".repeat(this.getPrintWidth())));
        });
      }
    };
    u();
    c();
    p();
    m();
    d();
    l();
    var z = class extends Se {
      static {
        __name(this, "z");
      }
      constructor(r) {
        super();
        this.text = r;
      }
      getPrintWidth() {
        return this.text.length;
      }
      write(r) {
        let n = new ge(this.text);
        this.hasError && n.underline().setColor(r.context.colors.red), r.write(n);
      }
      asObject() {
      }
    };
    u();
    c();
    p();
    m();
    d();
    l();
    var Ct = class {
      static {
        __name(this, "Ct");
      }
      fields = [];
      addField(e, r) {
        return this.fields.push({ write(n) {
          let { green: i, dim: o } = n.context.colors;
          n.write(i(o(`${e}: ${r}`))).addMarginSymbol(i(o("+")));
        } }), this;
      }
      write(e) {
        let { colors: { green: r } } = e.context;
        e.writeLine(r("{")).withIndent(() => {
          e.writeJoined(ze, this.fields).newLine();
        }).write(r("}")).addMarginSymbol(r("+"));
      }
    };
    function wr(t, e, r) {
      switch (t.kind) {
        case "MutuallyExclusiveFields":
          tl(t, e);
          break;
        case "IncludeOnScalar":
          rl(t, e);
          break;
        case "EmptySelection":
          nl(t, e, r);
          break;
        case "UnknownSelectionField":
          al(t, e);
          break;
        case "InvalidSelectionValue":
          ll(t, e);
          break;
        case "UnknownArgument":
          ul(t, e);
          break;
        case "UnknownInputField":
          cl(t, e);
          break;
        case "RequiredArgumentMissing":
          pl(t, e);
          break;
        case "InvalidArgumentType":
          ml(t, e);
          break;
        case "InvalidArgumentValue":
          dl(t, e);
          break;
        case "ValueTooLarge":
          fl(t, e);
          break;
        case "SomeFieldsMissing":
          gl(t, e);
          break;
        case "TooManyFieldsGiven":
          yl(t, e);
          break;
        case "Union":
          $i(t, e, r);
          break;
        default:
          throw new Error("not implemented: " + t.kind);
      }
    }
    __name(wr, "wr");
    function tl(t, e) {
      let r = e.arguments.getDeepSubSelectionValue(t.selectionPath)?.asObject();
      r && (r.getField(t.firstField)?.markAsError(), r.getField(t.secondField)?.markAsError()), e.addErrorMessage((n) => `Please ${n.bold("either")} use ${n.green(`\`${t.firstField}\``)} or ${n.green(`\`${t.secondField}\``)}, but ${n.red("not both")} at the same time.`);
    }
    __name(tl, "tl");
    function rl(t, e) {
      let [r, n] = Ze(t.selectionPath), i = t.outputType, o = e.arguments.getDeepSelectionParent(r)?.value;
      if (o && (o.getField(n)?.markAsError(), i)) for (let s of i.fields) s.isRelation && o.addSuggestion(new se(s.name, "true"));
      e.addErrorMessage((s) => {
        let a = `Invalid scalar field ${s.red(`\`${n}\``)} for ${s.bold("include")} statement`;
        return i ? a += ` on model ${s.bold(i.name)}. ${St(s)}` : a += ".", a += `
Note that ${s.bold("include")} statements only accept relation fields.`, a;
      });
    }
    __name(rl, "rl");
    function nl(t, e, r) {
      let n = e.arguments.getDeepSubSelectionValue(t.selectionPath)?.asObject();
      if (n) {
        let i = n.getField("omit")?.value.asObject();
        if (i) {
          il(t, e, i);
          return;
        }
        if (n.hasField("select")) {
          ol(t, e);
          return;
        }
      }
      if (r?.[Ce(t.outputType.name)]) {
        sl(t, e);
        return;
      }
      e.addErrorMessage(() => `Unknown field at "${t.selectionPath.join(".")} selection"`);
    }
    __name(nl, "nl");
    function il(t, e, r) {
      r.removeAllFields();
      for (let n of t.outputType.fields) r.addSuggestion(new se(n.name, "false"));
      e.addErrorMessage((n) => `The ${n.red("omit")} statement includes every field of the model ${n.bold(t.outputType.name)}. At least one field must be included in the result`);
    }
    __name(il, "il");
    function ol(t, e) {
      let r = t.outputType, n = e.arguments.getDeepSelectionParent(t.selectionPath)?.value, i = n?.isEmpty() ?? false;
      n && (n.removeAllFields(), zi(n, r)), e.addErrorMessage((o) => i ? `The ${o.red("`select`")} statement for type ${o.bold(r.name)} must not be empty. ${St(o)}` : `The ${o.red("`select`")} statement for type ${o.bold(r.name)} needs ${o.bold("at least one truthy value")}.`);
    }
    __name(ol, "ol");
    function sl(t, e) {
      let r = new Ct();
      for (let i of t.outputType.fields) i.isRelation || r.addField(i.name, "false");
      let n = new se("omit", r).makeRequired();
      if (t.selectionPath.length === 0) e.arguments.addSuggestion(n);
      else {
        let [i, o] = Ze(t.selectionPath), a = e.arguments.getDeepSelectionParent(i)?.value.asObject()?.getField(o);
        if (a) {
          let f = a?.value.asObject() ?? new Xe();
          f.addSuggestion(n), a.value = f;
        }
      }
      e.addErrorMessage((i) => `The global ${i.red("omit")} configuration excludes every field of the model ${i.bold(t.outputType.name)}. At least one field must be included in the result`);
    }
    __name(sl, "sl");
    function al(t, e) {
      let r = Yi(t.selectionPath, e);
      if (r.parentKind !== "unknown") {
        r.field.markAsError();
        let n = r.parent;
        switch (r.parentKind) {
          case "select":
            zi(n, t.outputType);
            break;
          case "include":
            hl(n, t.outputType);
            break;
          case "omit":
            bl(n, t.outputType);
            break;
        }
      }
      e.addErrorMessage((n) => {
        let i = [`Unknown field ${n.red(`\`${r.fieldName}\``)}`];
        return r.parentKind !== "unknown" && i.push(`for ${n.bold(r.parentKind)} statement`), i.push(`on model ${n.bold(`\`${t.outputType.name}\``)}.`), i.push(St(n)), i.join(" ");
      });
    }
    __name(al, "al");
    function ll(t, e) {
      let r = Yi(t.selectionPath, e);
      r.parentKind !== "unknown" && r.field.value.markAsError(), e.addErrorMessage((n) => `Invalid value for selection field \`${n.red(r.fieldName)}\`: ${t.underlyingError}`);
    }
    __name(ll, "ll");
    function ul(t, e) {
      let r = t.argumentPath[0], n = e.arguments.getDeepSubSelectionValue(t.selectionPath)?.asObject();
      n && (n.getField(r)?.markAsError(), El(n, t.arguments)), e.addErrorMessage((i) => Ki(i, r, t.arguments.map((o) => o.name)));
    }
    __name(ul, "ul");
    function cl(t, e) {
      let [r, n] = Ze(t.argumentPath), i = e.arguments.getDeepSubSelectionValue(t.selectionPath)?.asObject();
      if (i) {
        i.getDeepField(t.argumentPath)?.markAsError();
        let o = i.getDeepFieldValue(r)?.asObject();
        o && Xi(o, t.inputType);
      }
      e.addErrorMessage((o) => Ki(o, n, t.inputType.fields.map((s) => s.name)));
    }
    __name(cl, "cl");
    function Ki(t, e, r) {
      let n = [`Unknown argument \`${t.red(e)}\`.`], i = xl(e, r);
      return i && n.push(`Did you mean \`${t.green(i)}\`?`), r.length > 0 && n.push(St(t)), n.join(" ");
    }
    __name(Ki, "Ki");
    function pl(t, e) {
      let r;
      e.addErrorMessage((f) => r?.value instanceof z && r.value.text === "null" ? `Argument \`${f.green(o)}\` must not be ${f.red("null")}.` : `Argument \`${f.green(o)}\` is missing.`);
      let n = e.arguments.getDeepSubSelectionValue(t.selectionPath)?.asObject();
      if (!n) return;
      let [i, o] = Ze(t.argumentPath), s = new Ct(), a = n.getDeepFieldValue(i)?.asObject();
      if (a) {
        if (r = a.getField(o), r && a.removeField(o), t.inputTypes.length === 1 && t.inputTypes[0].kind === "object") {
          for (let f of t.inputTypes[0].fields) s.addField(f.name, f.typeNames.join(" | "));
          a.addSuggestion(new se(o, s).makeRequired());
        } else {
          let f = t.inputTypes.map(Hi).join(" | ");
          a.addSuggestion(new se(o, f).makeRequired());
        }
        if (t.dependentArgumentPath) {
          n.getDeepField(t.dependentArgumentPath)?.markAsError();
          let [, f] = Ze(t.dependentArgumentPath);
          e.addErrorMessage((v) => `Argument \`${v.green(o)}\` is required because argument \`${v.green(f)}\` was provided.`);
        }
      }
    }
    __name(pl, "pl");
    function Hi(t) {
      return t.kind === "list" ? `${Hi(t.elementType)}[]` : t.name;
    }
    __name(Hi, "Hi");
    function ml(t, e) {
      let r = t.argument.name, n = e.arguments.getDeepSubSelectionValue(t.selectionPath)?.asObject();
      n && n.getDeepFieldValue(t.argumentPath)?.markAsError(), e.addErrorMessage((i) => {
        let o = vr("or", t.argument.typeNames.map((s) => i.green(s)));
        return `Argument \`${i.bold(r)}\`: Invalid value provided. Expected ${o}, provided ${i.red(t.inferredType)}.`;
      });
    }
    __name(ml, "ml");
    function dl(t, e) {
      let r = t.argument.name, n = e.arguments.getDeepSubSelectionValue(t.selectionPath)?.asObject();
      n && n.getDeepFieldValue(t.argumentPath)?.markAsError(), e.addErrorMessage((i) => {
        let o = [`Invalid value for argument \`${i.bold(r)}\``];
        if (t.underlyingError && o.push(`: ${t.underlyingError}`), o.push("."), t.argument.typeNames.length > 0) {
          let s = vr("or", t.argument.typeNames.map((a) => i.green(a)));
          o.push(` Expected ${s}.`);
        }
        return o.join("");
      });
    }
    __name(dl, "dl");
    function fl(t, e) {
      let r = t.argument.name, n = e.arguments.getDeepSubSelectionValue(t.selectionPath)?.asObject(), i;
      if (n) {
        let s = n.getDeepField(t.argumentPath)?.value;
        s?.markAsError(), s instanceof z && (i = s.text);
      }
      e.addErrorMessage((o) => {
        let s = ["Unable to fit value"];
        return i && s.push(o.red(i)), s.push(`into a 64-bit signed integer for field \`${o.bold(r)}\``), s.join(" ");
      });
    }
    __name(fl, "fl");
    function gl(t, e) {
      let r = t.argumentPath[t.argumentPath.length - 1], n = e.arguments.getDeepSubSelectionValue(t.selectionPath)?.asObject();
      if (n) {
        let i = n.getDeepFieldValue(t.argumentPath)?.asObject();
        i && Xi(i, t.inputType);
      }
      e.addErrorMessage((i) => {
        let o = [`Argument \`${i.bold(r)}\` of type ${i.bold(t.inputType.name)} needs`];
        return t.constraints.minFieldCount === 1 ? t.constraints.requiredFields ? o.push(`${i.green("at least one of")} ${vr("or", t.constraints.requiredFields.map((s) => `\`${i.bold(s)}\``))} arguments.`) : o.push(`${i.green("at least one")} argument.`) : o.push(`${i.green(`at least ${t.constraints.minFieldCount}`)} arguments.`), o.push(St(i)), o.join(" ");
      });
    }
    __name(gl, "gl");
    function yl(t, e) {
      let r = t.argumentPath[t.argumentPath.length - 1], n = e.arguments.getDeepSubSelectionValue(t.selectionPath)?.asObject(), i = [];
      if (n) {
        let o = n.getDeepFieldValue(t.argumentPath)?.asObject();
        o && (o.markAsError(), i = Object.keys(o.getFields()));
      }
      e.addErrorMessage((o) => {
        let s = [`Argument \`${o.bold(r)}\` of type ${o.bold(t.inputType.name)} needs`];
        return t.constraints.minFieldCount === 1 && t.constraints.maxFieldCount == 1 ? s.push(`${o.green("exactly one")} argument,`) : t.constraints.maxFieldCount == 1 ? s.push(`${o.green("at most one")} argument,`) : s.push(`${o.green(`at most ${t.constraints.maxFieldCount}`)} arguments,`), s.push(`but you provided ${vr("and", i.map((a) => o.red(a)))}. Please choose`), t.constraints.maxFieldCount === 1 ? s.push("one.") : s.push(`${t.constraints.maxFieldCount}.`), s.join(" ");
      });
    }
    __name(yl, "yl");
    function zi(t, e) {
      for (let r of e.fields) t.hasField(r.name) || t.addSuggestion(new se(r.name, "true"));
    }
    __name(zi, "zi");
    function hl(t, e) {
      for (let r of e.fields) r.isRelation && !t.hasField(r.name) && t.addSuggestion(new se(r.name, "true"));
    }
    __name(hl, "hl");
    function bl(t, e) {
      for (let r of e.fields) !t.hasField(r.name) && !r.isRelation && t.addSuggestion(new se(r.name, "true"));
    }
    __name(bl, "bl");
    function El(t, e) {
      for (let r of e) t.hasField(r.name) || t.addSuggestion(new se(r.name, r.typeNames.join(" | ")));
    }
    __name(El, "El");
    function Yi(t, e) {
      let [r, n] = Ze(t), i = e.arguments.getDeepSubSelectionValue(r)?.asObject();
      if (!i) return { parentKind: "unknown", fieldName: n };
      let o = i.getFieldValue("select")?.asObject(), s = i.getFieldValue("include")?.asObject(), a = i.getFieldValue("omit")?.asObject(), f = o?.getField(n);
      return o && f ? { parentKind: "select", parent: o, field: f, fieldName: n } : (f = s?.getField(n), s && f ? { parentKind: "include", field: f, parent: s, fieldName: n } : (f = a?.getField(n), a && f ? { parentKind: "omit", field: f, parent: a, fieldName: n } : { parentKind: "unknown", fieldName: n }));
    }
    __name(Yi, "Yi");
    function Xi(t, e) {
      if (e.kind === "object") for (let r of e.fields) t.hasField(r.name) || t.addSuggestion(new se(r.name, r.typeNames.join(" | ")));
    }
    __name(Xi, "Xi");
    function Ze(t) {
      let e = [...t], r = e.pop();
      if (!r) throw new Error("unexpected empty path");
      return [e, r];
    }
    __name(Ze, "Ze");
    function St({ green: t, enabled: e }) {
      return "Available options are " + (e ? `listed in ${t("green")}` : "marked with ?") + ".";
    }
    __name(St, "St");
    function vr(t, e) {
      if (e.length === 1) return e[0];
      let r = [...e], n = r.pop();
      return `${r.join(", ")} ${t} ${n}`;
    }
    __name(vr, "vr");
    var wl = 3;
    function xl(t, e) {
      let r = 1 / 0, n;
      for (let i of e) {
        let o = (0, Wi.default)(t, i);
        o > wl || o < r && (r = o, n = i);
      }
      return n;
    }
    __name(xl, "xl");
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    var It = class {
      static {
        __name(this, "It");
      }
      modelName;
      name;
      typeName;
      isList;
      isEnum;
      constructor(e, r, n, i, o) {
        this.modelName = e, this.name = r, this.typeName = n, this.isList = i, this.isEnum = o;
      }
      _toGraphQLInputType() {
        let e = this.isList ? "List" : "", r = this.isEnum ? "Enum" : "";
        return `${e}${r}${this.typeName}FieldRefInput<${this.modelName}>`;
      }
    };
    function et(t) {
      return t instanceof It;
    }
    __name(et, "et");
    u();
    c();
    p();
    m();
    d();
    l();
    var Rr = /* @__PURE__ */ Symbol();
    var En = /* @__PURE__ */ new WeakMap();
    var ve = class {
      static {
        __name(this, "ve");
      }
      constructor(e) {
        e === Rr ? En.set(this, `Prisma.${this._getName()}`) : En.set(this, `new Prisma.${this._getNamespace()}.${this._getName()}()`);
      }
      _getName() {
        return this.constructor.name;
      }
      toString() {
        return En.get(this);
      }
    };
    var Dt = class extends ve {
      static {
        __name(this, "Dt");
      }
      _getNamespace() {
        return "NullTypes";
      }
    };
    var Ot = class extends Dt {
      static {
        __name(this, "Ot");
      }
      #e;
    };
    wn(Ot, "DbNull");
    var kt = class extends Dt {
      static {
        __name(this, "kt");
      }
      #e;
    };
    wn(kt, "JsonNull");
    var _t = class extends Dt {
      static {
        __name(this, "_t");
      }
      #e;
    };
    wn(_t, "AnyNull");
    var Ar = { classes: { DbNull: Ot, JsonNull: kt, AnyNull: _t }, instances: { DbNull: new Ot(Rr), JsonNull: new kt(Rr), AnyNull: new _t(Rr) } };
    function wn(t, e) {
      Object.defineProperty(t, "name", { value: e, configurable: true });
    }
    __name(wn, "wn");
    u();
    c();
    p();
    m();
    d();
    l();
    var Zi = ": ";
    var Cr = class {
      static {
        __name(this, "Cr");
      }
      constructor(e, r) {
        this.name = e;
        this.value = r;
      }
      hasError = false;
      markAsError() {
        this.hasError = true;
      }
      getPrintWidth() {
        return this.name.length + this.value.getPrintWidth() + Zi.length;
      }
      write(e) {
        let r = new ge(this.name);
        this.hasError && r.underline().setColor(e.context.colors.red), e.write(r).write(Zi).write(this.value);
      }
    };
    var xn = class {
      static {
        __name(this, "xn");
      }
      arguments;
      errorMessages = [];
      constructor(e) {
        this.arguments = e;
      }
      write(e) {
        e.write(this.arguments);
      }
      addErrorMessage(e) {
        this.errorMessages.push(e);
      }
      renderAllMessages(e) {
        return this.errorMessages.map((r) => r(e)).join(`
`);
      }
    };
    function tt(t) {
      return new xn(eo(t));
    }
    __name(tt, "tt");
    function eo(t) {
      let e = new Xe();
      for (let [r, n] of Object.entries(t)) {
        let i = new Cr(r, to(n));
        e.addField(i);
      }
      return e;
    }
    __name(eo, "eo");
    function to(t) {
      if (typeof t == "string") return new z(JSON.stringify(t));
      if (typeof t == "number" || typeof t == "boolean") return new z(String(t));
      if (typeof t == "bigint") return new z(`${t}n`);
      if (t === null) return new z("null");
      if (t === void 0) return new z("undefined");
      if (Ke(t)) return new z(`new Prisma.Decimal("${t.toFixed()}")`);
      if (t instanceof Uint8Array) return h.isBuffer(t) ? new z(`Buffer.alloc(${t.byteLength})`) : new z(`new Uint8Array(${t.byteLength})`);
      if (t instanceof Date) {
        let e = br(t) ? t.toISOString() : "Invalid Date";
        return new z(`new Date("${e}")`);
      }
      return t instanceof ve ? new z(`Prisma.${t._getName()}`) : et(t) ? new z(`prisma.${Ce(t.modelName)}.$fields.${t.name}`) : Array.isArray(t) ? Pl(t) : typeof t == "object" ? eo(t) : new z(Object.prototype.toString.call(t));
    }
    __name(to, "to");
    function Pl(t) {
      let e = new Ye();
      for (let r of t) e.addItem(to(r));
      return e;
    }
    __name(Pl, "Pl");
    function Sr(t, e) {
      let r = e === "pretty" ? Ji : Tr, n = t.renderAllMessages(r), i = new He(0, { colors: r }).write(t).toString();
      return { message: n, args: i };
    }
    __name(Sr, "Sr");
    function Ir({ args: t, errors: e, errorFormat: r, callsite: n, originalMethod: i, clientVersion: o, globalOmit: s }) {
      let a = tt(t);
      for (let A of e) wr(A, a, s);
      let { message: f, args: v } = Sr(a, r), R = Er({ message: f, callsite: n, originalMethod: i, showColors: r === "pretty", callArguments: v });
      throw new Y(R, { clientVersion: o });
    }
    __name(Ir, "Ir");
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    function ye(t) {
      return t.replace(/^./, (e) => e.toLowerCase());
    }
    __name(ye, "ye");
    u();
    c();
    p();
    m();
    d();
    l();
    function no(t, e, r) {
      let n = ye(r);
      return !e.result || !(e.result.$allModels || e.result[n]) ? t : Tl({ ...t, ...ro(e.name, t, e.result.$allModels), ...ro(e.name, t, e.result[n]) });
    }
    __name(no, "no");
    function Tl(t) {
      let e = new fe(), r = /* @__PURE__ */ __name((n, i) => e.getOrCreate(n, () => i.has(n) ? [n] : (i.add(n), t[n] ? t[n].needs.flatMap((o) => r(o, i)) : [n])), "r");
      return hr(t, (n) => ({ ...n, needs: r(n.name, /* @__PURE__ */ new Set()) }));
    }
    __name(Tl, "Tl");
    function ro(t, e, r) {
      return r ? hr(r, ({ needs: n, compute: i }, o) => ({ name: o, needs: n ? Object.keys(n).filter((s) => n[s]) : [], compute: vl(e, o, i) })) : {};
    }
    __name(ro, "ro");
    function vl(t, e, r) {
      let n = t?.[e]?.compute;
      return n ? (i) => r({ ...i, [e]: n(i) }) : r;
    }
    __name(vl, "vl");
    function io(t, e) {
      if (!e) return t;
      let r = { ...t };
      for (let n of Object.values(e)) if (t[n.name]) for (let i of n.needs) r[i] = true;
      return r;
    }
    __name(io, "io");
    function oo(t, e) {
      if (!e) return t;
      let r = { ...t };
      for (let n of Object.values(e)) if (!t[n.name]) for (let i of n.needs) delete r[i];
      return r;
    }
    __name(oo, "oo");
    var Dr = class {
      static {
        __name(this, "Dr");
      }
      constructor(e, r) {
        this.extension = e;
        this.previous = r;
      }
      computedFieldsCache = new fe();
      modelExtensionsCache = new fe();
      queryCallbacksCache = new fe();
      clientExtensions = vt(() => this.extension.client ? { ...this.previous?.getAllClientExtensions(), ...this.extension.client } : this.previous?.getAllClientExtensions());
      batchCallbacks = vt(() => {
        let e = this.previous?.getAllBatchQueryCallbacks() ?? [], r = this.extension.query?.$__internalBatch;
        return r ? e.concat(r) : e;
      });
      getAllComputedFields(e) {
        return this.computedFieldsCache.getOrCreate(e, () => no(this.previous?.getAllComputedFields(e), this.extension, e));
      }
      getAllClientExtensions() {
        return this.clientExtensions.get();
      }
      getAllModelExtensions(e) {
        return this.modelExtensionsCache.getOrCreate(e, () => {
          let r = ye(e);
          return !this.extension.model || !(this.extension.model[r] || this.extension.model.$allModels) ? this.previous?.getAllModelExtensions(e) : { ...this.previous?.getAllModelExtensions(e), ...this.extension.model.$allModels, ...this.extension.model[r] };
        });
      }
      getAllQueryCallbacks(e, r) {
        return this.queryCallbacksCache.getOrCreate(`${e}:${r}`, () => {
          let n = this.previous?.getAllQueryCallbacks(e, r) ?? [], i = [], o = this.extension.query;
          return !o || !(o[e] || o.$allModels || o[r] || o.$allOperations) ? n : (o[e] !== void 0 && (o[e][r] !== void 0 && i.push(o[e][r]), o[e].$allOperations !== void 0 && i.push(o[e].$allOperations)), e !== "$none" && o.$allModels !== void 0 && (o.$allModels[r] !== void 0 && i.push(o.$allModels[r]), o.$allModels.$allOperations !== void 0 && i.push(o.$allModels.$allOperations)), o[r] !== void 0 && i.push(o[r]), o.$allOperations !== void 0 && i.push(o.$allOperations), n.concat(i));
        });
      }
      getAllBatchQueryCallbacks() {
        return this.batchCallbacks.get();
      }
    };
    var rt = class t {
      static {
        __name(this, "t");
      }
      constructor(e) {
        this.head = e;
      }
      static empty() {
        return new t();
      }
      static single(e) {
        return new t(new Dr(e));
      }
      isEmpty() {
        return this.head === void 0;
      }
      append(e) {
        return new t(new Dr(e, this.head));
      }
      getAllComputedFields(e) {
        return this.head?.getAllComputedFields(e);
      }
      getAllClientExtensions() {
        return this.head?.getAllClientExtensions();
      }
      getAllModelExtensions(e) {
        return this.head?.getAllModelExtensions(e);
      }
      getAllQueryCallbacks(e, r) {
        return this.head?.getAllQueryCallbacks(e, r) ?? [];
      }
      getAllBatchQueryCallbacks() {
        return this.head?.getAllBatchQueryCallbacks() ?? [];
      }
    };
    u();
    c();
    p();
    m();
    d();
    l();
    var Or = class {
      static {
        __name(this, "Or");
      }
      constructor(e) {
        this.name = e;
      }
    };
    function so(t) {
      return t instanceof Or;
    }
    __name(so, "so");
    function ao(t) {
      return new Or(t);
    }
    __name(ao, "ao");
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    var lo = /* @__PURE__ */ Symbol();
    var Mt = class {
      static {
        __name(this, "Mt");
      }
      constructor(e) {
        if (e !== lo) throw new Error("Skip instance can not be constructed directly");
      }
      ifUndefined(e) {
        return e === void 0 ? kr : e;
      }
    };
    var kr = new Mt(lo);
    function he(t) {
      return t instanceof Mt;
    }
    __name(he, "he");
    var Rl = { findUnique: "findUnique", findUniqueOrThrow: "findUniqueOrThrow", findFirst: "findFirst", findFirstOrThrow: "findFirstOrThrow", findMany: "findMany", count: "aggregate", create: "createOne", createMany: "createMany", createManyAndReturn: "createManyAndReturn", update: "updateOne", updateMany: "updateMany", updateManyAndReturn: "updateManyAndReturn", upsert: "upsertOne", delete: "deleteOne", deleteMany: "deleteMany", executeRaw: "executeRaw", queryRaw: "queryRaw", aggregate: "aggregate", groupBy: "groupBy", runCommandRaw: "runCommandRaw", findRaw: "findRaw", aggregateRaw: "aggregateRaw" };
    var uo = "explicitly `undefined` values are not allowed";
    function _r({ modelName: t, action: e, args: r, runtimeDataModel: n, extensions: i = rt.empty(), callsite: o, clientMethod: s, errorFormat: a, clientVersion: f, previewFeatures: v, globalOmit: R }) {
      let A = new Pn({ runtimeDataModel: n, modelName: t, action: e, rootArgs: r, callsite: o, extensions: i, selectionPath: [], argumentPath: [], originalMethod: s, errorFormat: a, clientVersion: f, previewFeatures: v, globalOmit: R });
      return { modelName: t, action: Rl[e], query: Lt(r, A) };
    }
    __name(_r, "_r");
    function Lt({ select: t, include: e, ...r } = {}, n) {
      let i = r.omit;
      return delete r.omit, { arguments: po(r, n), selection: Al(t, e, i, n) };
    }
    __name(Lt, "Lt");
    function Al(t, e, r, n) {
      return t ? (e ? n.throwValidationError({ kind: "MutuallyExclusiveFields", firstField: "include", secondField: "select", selectionPath: n.getSelectionPath() }) : r && n.throwValidationError({ kind: "MutuallyExclusiveFields", firstField: "omit", secondField: "select", selectionPath: n.getSelectionPath() }), Dl(t, n)) : Cl(n, e, r);
    }
    __name(Al, "Al");
    function Cl(t, e, r) {
      let n = {};
      return t.modelOrType && !t.isRawAction() && (n.$composites = true, n.$scalars = true), e && Sl(n, e, t), Il(n, r, t), n;
    }
    __name(Cl, "Cl");
    function Sl(t, e, r) {
      for (let [n, i] of Object.entries(e)) {
        if (he(i)) continue;
        let o = r.nestSelection(n);
        if (Tn(i, o), i === false || i === void 0) {
          t[n] = false;
          continue;
        }
        let s = r.findField(n);
        if (s && s.kind !== "object" && r.throwValidationError({ kind: "IncludeOnScalar", selectionPath: r.getSelectionPath().concat(n), outputType: r.getOutputTypeDescription() }), s) {
          t[n] = Lt(i === true ? {} : i, o);
          continue;
        }
        if (i === true) {
          t[n] = true;
          continue;
        }
        t[n] = Lt(i, o);
      }
    }
    __name(Sl, "Sl");
    function Il(t, e, r) {
      let n = r.getComputedFields(), i = { ...r.getGlobalOmit(), ...e }, o = oo(i, n);
      for (let [s, a] of Object.entries(o)) {
        if (he(a)) continue;
        Tn(a, r.nestSelection(s));
        let f = r.findField(s);
        n?.[s] && !f || (t[s] = !a);
      }
    }
    __name(Il, "Il");
    function Dl(t, e) {
      let r = {}, n = e.getComputedFields(), i = io(t, n);
      for (let [o, s] of Object.entries(i)) {
        if (he(s)) continue;
        let a = e.nestSelection(o);
        Tn(s, a);
        let f = e.findField(o);
        if (!(n?.[o] && !f)) {
          if (s === false || s === void 0 || he(s)) {
            r[o] = false;
            continue;
          }
          if (s === true) {
            f?.kind === "object" ? r[o] = Lt({}, a) : r[o] = true;
            continue;
          }
          r[o] = Lt(s, a);
        }
      }
      return r;
    }
    __name(Dl, "Dl");
    function co(t, e) {
      if (t === null) return null;
      if (typeof t == "string" || typeof t == "number" || typeof t == "boolean") return t;
      if (typeof t == "bigint") return { $type: "BigInt", value: String(t) };
      if (We(t)) {
        if (br(t)) return { $type: "DateTime", value: t.toISOString() };
        e.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: e.getSelectionPath(), argumentPath: e.getArgumentPath(), argument: { name: e.getArgumentName(), typeNames: ["Date"] }, underlyingError: "Provided Date object is invalid" });
      }
      if (so(t)) return { $type: "Param", value: t.name };
      if (et(t)) return { $type: "FieldRef", value: { _ref: t.name, _container: t.modelName } };
      if (Array.isArray(t)) return Ol(t, e);
      if (ArrayBuffer.isView(t)) {
        let { buffer: r, byteOffset: n, byteLength: i } = t;
        return { $type: "Bytes", value: h.from(r, n, i).toString("base64") };
      }
      if (kl(t)) return t.values;
      if (Ke(t)) return { $type: "Decimal", value: t.toFixed() };
      if (t instanceof ve) {
        if (t !== Ar.instances[t._getName()]) throw new Error("Invalid ObjectEnumValue");
        return { $type: "Enum", value: t._getName() };
      }
      if (_l(t)) return t.toJSON();
      if (typeof t == "object") return po(t, e);
      e.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: e.getSelectionPath(), argumentPath: e.getArgumentPath(), argument: { name: e.getArgumentName(), typeNames: [] }, underlyingError: `We could not serialize ${Object.prototype.toString.call(t)} value. Serialize the object to JSON or implement a ".toJSON()" method on it` });
    }
    __name(co, "co");
    function po(t, e) {
      if (t.$type) return { $type: "Raw", value: t };
      let r = {};
      for (let n in t) {
        let i = t[n], o = e.nestArgument(n);
        he(i) || (i !== void 0 ? r[n] = co(i, o) : e.isPreviewFeatureOn("strictUndefinedChecks") && e.throwValidationError({ kind: "InvalidArgumentValue", argumentPath: o.getArgumentPath(), selectionPath: e.getSelectionPath(), argument: { name: e.getArgumentName(), typeNames: [] }, underlyingError: uo }));
      }
      return r;
    }
    __name(po, "po");
    function Ol(t, e) {
      let r = [];
      for (let n = 0; n < t.length; n++) {
        let i = e.nestArgument(String(n)), o = t[n];
        if (o === void 0 || he(o)) {
          let s = o === void 0 ? "undefined" : "Prisma.skip";
          e.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: i.getSelectionPath(), argumentPath: i.getArgumentPath(), argument: { name: `${e.getArgumentName()}[${n}]`, typeNames: [] }, underlyingError: `Can not use \`${s}\` value within array. Use \`null\` or filter out \`${s}\` values` });
        }
        r.push(co(o, i));
      }
      return r;
    }
    __name(Ol, "Ol");
    function kl(t) {
      return typeof t == "object" && t !== null && t.__prismaRawParameters__ === true;
    }
    __name(kl, "kl");
    function _l(t) {
      return typeof t == "object" && t !== null && typeof t.toJSON == "function";
    }
    __name(_l, "_l");
    function Tn(t, e) {
      t === void 0 && e.isPreviewFeatureOn("strictUndefinedChecks") && e.throwValidationError({ kind: "InvalidSelectionValue", selectionPath: e.getSelectionPath(), underlyingError: uo });
    }
    __name(Tn, "Tn");
    var Pn = class t {
      static {
        __name(this, "t");
      }
      constructor(e) {
        this.params = e;
        this.params.modelName && (this.modelOrType = this.params.runtimeDataModel.models[this.params.modelName] ?? this.params.runtimeDataModel.types[this.params.modelName]);
      }
      modelOrType;
      throwValidationError(e) {
        Ir({ errors: [e], originalMethod: this.params.originalMethod, args: this.params.rootArgs ?? {}, callsite: this.params.callsite, errorFormat: this.params.errorFormat, clientVersion: this.params.clientVersion, globalOmit: this.params.globalOmit });
      }
      getSelectionPath() {
        return this.params.selectionPath;
      }
      getArgumentPath() {
        return this.params.argumentPath;
      }
      getArgumentName() {
        return this.params.argumentPath[this.params.argumentPath.length - 1];
      }
      getOutputTypeDescription() {
        if (!(!this.params.modelName || !this.modelOrType)) return { name: this.params.modelName, fields: this.modelOrType.fields.map((e) => ({ name: e.name, typeName: "boolean", isRelation: e.kind === "object" })) };
      }
      isRawAction() {
        return ["executeRaw", "queryRaw", "runCommandRaw", "findRaw", "aggregateRaw"].includes(this.params.action);
      }
      isPreviewFeatureOn(e) {
        return this.params.previewFeatures.includes(e);
      }
      getComputedFields() {
        if (this.params.modelName) return this.params.extensions.getAllComputedFields(this.params.modelName);
      }
      findField(e) {
        return this.modelOrType?.fields.find((r) => r.name === e);
      }
      nestSelection(e) {
        let r = this.findField(e), n = r?.kind === "object" ? r.type : void 0;
        return new t({ ...this.params, modelName: n, selectionPath: this.params.selectionPath.concat(e) });
      }
      getGlobalOmit() {
        return this.params.modelName && this.shouldApplyGlobalOmit() ? this.params.globalOmit?.[Ce(this.params.modelName)] ?? {} : {};
      }
      shouldApplyGlobalOmit() {
        switch (this.params.action) {
          case "findFirst":
          case "findFirstOrThrow":
          case "findUniqueOrThrow":
          case "findMany":
          case "upsert":
          case "findUnique":
          case "createManyAndReturn":
          case "create":
          case "update":
          case "updateManyAndReturn":
          case "delete":
            return true;
          case "executeRaw":
          case "aggregateRaw":
          case "runCommandRaw":
          case "findRaw":
          case "createMany":
          case "deleteMany":
          case "groupBy":
          case "updateMany":
          case "count":
          case "aggregate":
          case "queryRaw":
            return false;
          default:
            Fe(this.params.action, "Unknown action");
        }
      }
      nestArgument(e) {
        return new t({ ...this.params, argumentPath: this.params.argumentPath.concat(e) });
      }
    };
    u();
    c();
    p();
    m();
    d();
    l();
    function mo(t) {
      if (!t._hasPreviewFlag("metrics")) throw new Y("`metrics` preview feature must be enabled in order to access metrics API", { clientVersion: t._clientVersion });
    }
    __name(mo, "mo");
    var nt = class {
      static {
        __name(this, "nt");
      }
      _client;
      constructor(e) {
        this._client = e;
      }
      prometheus(e) {
        return mo(this._client), this._client._engine.metrics({ format: "prometheus", ...e });
      }
      json(e) {
        return mo(this._client), this._client._engine.metrics({ format: "json", ...e });
      }
    };
    u();
    c();
    p();
    m();
    d();
    l();
    function fo(t, e) {
      let r = vt(() => Ml(e));
      Object.defineProperty(t, "dmmf", { get: /* @__PURE__ */ __name(() => r.get(), "get") });
    }
    __name(fo, "fo");
    function Ml(t) {
      throw new Error("Prisma.dmmf is not available when running in edge runtimes.");
    }
    __name(Ml, "Ml");
    u();
    c();
    p();
    m();
    d();
    l();
    var Rn = /* @__PURE__ */ new WeakMap();
    var Mr = "$$PrismaTypedSql";
    var Ft = class {
      static {
        __name(this, "Ft");
      }
      constructor(e, r) {
        Rn.set(this, { sql: e, values: r }), Object.defineProperty(this, Mr, { value: Mr });
      }
      get sql() {
        return Rn.get(this).sql;
      }
      get values() {
        return Rn.get(this).values;
      }
    };
    function go(t) {
      return (...e) => new Ft(t, e);
    }
    __name(go, "go");
    function Lr(t) {
      return t != null && t[Mr] === Mr;
    }
    __name(Lr, "Lr");
    u();
    c();
    p();
    m();
    d();
    l();
    var Ls = bt(un());
    u();
    c();
    p();
    m();
    d();
    l();
    yo();
    Ti();
    Si();
    u();
    c();
    p();
    m();
    d();
    l();
    var ne = class t {
      static {
        __name(this, "t");
      }
      constructor(e, r) {
        if (e.length - 1 !== r.length) throw e.length === 0 ? new TypeError("Expected at least 1 string") : new TypeError(`Expected ${e.length} strings to have ${e.length - 1} values`);
        let n = r.reduce((s, a) => s + (a instanceof t ? a.values.length : 1), 0);
        this.values = new Array(n), this.strings = new Array(n + 1), this.strings[0] = e[0];
        let i = 0, o = 0;
        for (; i < r.length; ) {
          let s = r[i++], a = e[i];
          if (s instanceof t) {
            this.strings[o] += s.strings[0];
            let f = 0;
            for (; f < s.values.length; ) this.values[o++] = s.values[f++], this.strings[o] = s.strings[f];
            this.strings[o] += a;
          } else this.values[o++] = s, this.strings[o] = a;
        }
      }
      get sql() {
        let e = this.strings.length, r = 1, n = this.strings[0];
        for (; r < e; ) n += `?${this.strings[r++]}`;
        return n;
      }
      get statement() {
        let e = this.strings.length, r = 1, n = this.strings[0];
        for (; r < e; ) n += `:${r}${this.strings[r++]}`;
        return n;
      }
      get text() {
        let e = this.strings.length, r = 1, n = this.strings[0];
        for (; r < e; ) n += `$${r}${this.strings[r++]}`;
        return n;
      }
      inspect() {
        return { sql: this.sql, statement: this.statement, text: this.text, values: this.values };
      }
    };
    function ho(t, e = ",", r = "", n = "") {
      if (t.length === 0) throw new TypeError("Expected `join([])` to be called with an array of multiple elements, but got an empty array");
      return new ne([r, ...Array(t.length - 1).fill(e), n], t);
    }
    __name(ho, "ho");
    function An(t) {
      return new ne([t], []);
    }
    __name(An, "An");
    var bo = An("");
    function Cn(t, ...e) {
      return new ne(t, e);
    }
    __name(Cn, "Cn");
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    function Nt(t) {
      return { getKeys() {
        return Object.keys(t);
      }, getPropertyValue(e) {
        return t[e];
      } };
    }
    __name(Nt, "Nt");
    u();
    c();
    p();
    m();
    d();
    l();
    function Z(t, e) {
      return { getKeys() {
        return [t];
      }, getPropertyValue() {
        return e();
      } };
    }
    __name(Z, "Z");
    u();
    c();
    p();
    m();
    d();
    l();
    function Ne(t) {
      let e = new fe();
      return { getKeys() {
        return t.getKeys();
      }, getPropertyValue(r) {
        return e.getOrCreate(r, () => t.getPropertyValue(r));
      }, getPropertyDescriptor(r) {
        return t.getPropertyDescriptor?.(r);
      } };
    }
    __name(Ne, "Ne");
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    var Nr = { enumerable: true, configurable: true, writable: true };
    function Ur(t) {
      let e = new Set(t);
      return { getPrototypeOf: /* @__PURE__ */ __name(() => Object.prototype, "getPrototypeOf"), getOwnPropertyDescriptor: /* @__PURE__ */ __name(() => Nr, "getOwnPropertyDescriptor"), has: /* @__PURE__ */ __name((r, n) => e.has(n), "has"), set: /* @__PURE__ */ __name((r, n, i) => e.add(n) && Reflect.set(r, n, i), "set"), ownKeys: /* @__PURE__ */ __name(() => [...e], "ownKeys") };
    }
    __name(Ur, "Ur");
    var Eo = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom");
    function ce(t, e) {
      let r = Ll(e), n = /* @__PURE__ */ new Set(), i = new Proxy(t, { get(o, s) {
        if (n.has(s)) return o[s];
        let a = r.get(s);
        return a ? a.getPropertyValue(s) : o[s];
      }, has(o, s) {
        if (n.has(s)) return true;
        let a = r.get(s);
        return a ? a.has?.(s) ?? true : Reflect.has(o, s);
      }, ownKeys(o) {
        let s = wo(Reflect.ownKeys(o), r), a = wo(Array.from(r.keys()), r);
        return [.../* @__PURE__ */ new Set([...s, ...a, ...n])];
      }, set(o, s, a) {
        return r.get(s)?.getPropertyDescriptor?.(s)?.writable === false ? false : (n.add(s), Reflect.set(o, s, a));
      }, getOwnPropertyDescriptor(o, s) {
        let a = Reflect.getOwnPropertyDescriptor(o, s);
        if (a && !a.configurable) return a;
        let f = r.get(s);
        return f ? f.getPropertyDescriptor ? { ...Nr, ...f?.getPropertyDescriptor(s) } : Nr : a;
      }, defineProperty(o, s, a) {
        return n.add(s), Reflect.defineProperty(o, s, a);
      }, getPrototypeOf: /* @__PURE__ */ __name(() => Object.prototype, "getPrototypeOf") });
      return i[Eo] = function() {
        let o = { ...this };
        return delete o[Eo], o;
      }, i;
    }
    __name(ce, "ce");
    function Ll(t) {
      let e = /* @__PURE__ */ new Map();
      for (let r of t) {
        let n = r.getKeys();
        for (let i of n) e.set(i, r);
      }
      return e;
    }
    __name(Ll, "Ll");
    function wo(t, e) {
      return t.filter((r) => e.get(r)?.has?.(r) ?? true);
    }
    __name(wo, "wo");
    u();
    c();
    p();
    m();
    d();
    l();
    function it(t) {
      return { getKeys() {
        return t;
      }, has() {
        return false;
      }, getPropertyValue() {
      } };
    }
    __name(it, "it");
    u();
    c();
    p();
    m();
    d();
    l();
    function ot(t, e) {
      return { batch: t, transaction: e?.kind === "batch" ? { isolationLevel: e.options.isolationLevel } : void 0 };
    }
    __name(ot, "ot");
    u();
    c();
    p();
    m();
    d();
    l();
    function xo(t) {
      if (t === void 0) return "";
      let e = tt(t);
      return new He(0, { colors: Tr }).write(e).toString();
    }
    __name(xo, "xo");
    u();
    c();
    p();
    m();
    d();
    l();
    var Fl = "P2037";
    function st({ error: t, user_facing_error: e }, r, n) {
      return e.error_code ? new X(Nl(e, n), { code: e.error_code, clientVersion: r, meta: e.meta, batchRequestIdx: e.batch_request_idx }) : new Q(t, { clientVersion: r, batchRequestIdx: e.batch_request_idx });
    }
    __name(st, "st");
    function Nl(t, e) {
      let r = t.message;
      return (e === "postgresql" || e === "postgres" || e === "mysql") && t.error_code === Fl && (r += `
Prisma Accelerate has built-in connection pooling to prevent such errors: https://pris.ly/client/error-accelerate`), r;
    }
    __name(Nl, "Nl");
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    var Sn = class {
      static {
        __name(this, "Sn");
      }
      getLocation() {
        return null;
      }
    };
    function Ie(t) {
      return typeof $EnabledCallSite == "function" && t !== "minimal" ? new $EnabledCallSite() : new Sn();
    }
    __name(Ie, "Ie");
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    var Po = { _avg: true, _count: true, _sum: true, _min: true, _max: true };
    function at(t = {}) {
      let e = ql(t);
      return Object.entries(e).reduce((n, [i, o]) => (Po[i] !== void 0 ? n.select[i] = { select: o } : n[i] = o, n), { select: {} });
    }
    __name(at, "at");
    function ql(t = {}) {
      return typeof t._count == "boolean" ? { ...t, _count: { _all: t._count } } : t;
    }
    __name(ql, "ql");
    function qr(t = {}) {
      return (e) => (typeof t._count == "boolean" && (e._count = e._count._all), e);
    }
    __name(qr, "qr");
    function To(t, e) {
      let r = qr(t);
      return e({ action: "aggregate", unpacker: r, argsMapper: at })(t);
    }
    __name(To, "To");
    u();
    c();
    p();
    m();
    d();
    l();
    function Vl(t = {}) {
      let { select: e, ...r } = t;
      return typeof e == "object" ? at({ ...r, _count: e }) : at({ ...r, _count: { _all: true } });
    }
    __name(Vl, "Vl");
    function Bl(t = {}) {
      return typeof t.select == "object" ? (e) => qr(t)(e)._count : (e) => qr(t)(e)._count._all;
    }
    __name(Bl, "Bl");
    function vo(t, e) {
      return e({ action: "count", unpacker: Bl(t), argsMapper: Vl })(t);
    }
    __name(vo, "vo");
    u();
    c();
    p();
    m();
    d();
    l();
    function $l(t = {}) {
      let e = at(t);
      if (Array.isArray(e.by)) for (let r of e.by) typeof r == "string" && (e.select[r] = true);
      else typeof e.by == "string" && (e.select[e.by] = true);
      return e;
    }
    __name($l, "$l");
    function jl(t = {}) {
      return (e) => (typeof t?._count == "boolean" && e.forEach((r) => {
        r._count = r._count._all;
      }), e);
    }
    __name(jl, "jl");
    function Ro(t, e) {
      return e({ action: "groupBy", unpacker: jl(t), argsMapper: $l })(t);
    }
    __name(Ro, "Ro");
    function Ao(t, e, r) {
      if (e === "aggregate") return (n) => To(n, r);
      if (e === "count") return (n) => vo(n, r);
      if (e === "groupBy") return (n) => Ro(n, r);
    }
    __name(Ao, "Ao");
    u();
    c();
    p();
    m();
    d();
    l();
    function Co(t, e) {
      let r = e.fields.filter((i) => !i.relationName), n = Ni(r, "name");
      return new Proxy({}, { get(i, o) {
        if (o in i || typeof o == "symbol") return i[o];
        let s = n[o];
        if (s) return new It(t, o, s.type, s.isList, s.kind === "enum");
      }, ...Ur(Object.keys(n)) });
    }
    __name(Co, "Co");
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    var So = /* @__PURE__ */ __name((t) => Array.isArray(t) ? t : t.split("."), "So");
    var In = /* @__PURE__ */ __name((t, e) => So(e).reduce((r, n) => r && r[n], t), "In");
    var Io = /* @__PURE__ */ __name((t, e, r) => So(e).reduceRight((n, i, o, s) => Object.assign({}, In(t, s.slice(0, o)), { [i]: n }), r), "Io");
    function Ql(t, e) {
      return t === void 0 || e === void 0 ? [] : [...e, "select", t];
    }
    __name(Ql, "Ql");
    function Gl(t, e, r) {
      return e === void 0 ? t ?? {} : Io(e, r, t || true);
    }
    __name(Gl, "Gl");
    function Dn(t, e, r, n, i, o) {
      let a = t._runtimeDataModel.models[e].fields.reduce((f, v) => ({ ...f, [v.name]: v }), {});
      return (f) => {
        let v = Ie(t._errorFormat), R = Ql(n, i), A = Gl(f, o, R), I = r({ dataPath: R, callsite: v })(A), C = Jl(t, e);
        return new Proxy(I, { get(L, D) {
          if (!C.includes(D)) return L[D];
          let Ee = [a[D].type, r, D], ee = [R, A];
          return Dn(t, ...Ee, ...ee);
        }, ...Ur([...C, ...Object.getOwnPropertyNames(I)]) });
      };
    }
    __name(Dn, "Dn");
    function Jl(t, e) {
      return t._runtimeDataModel.models[e].fields.filter((r) => r.kind === "object").map((r) => r.name);
    }
    __name(Jl, "Jl");
    var Wl = ["findUnique", "findUniqueOrThrow", "findFirst", "findFirstOrThrow", "create", "update", "upsert", "delete"];
    var Kl = ["aggregate", "count", "groupBy"];
    function On(t, e) {
      let r = t._extensions.getAllModelExtensions(e) ?? {}, n = [Hl(t, e), Yl(t, e), Nt(r), Z("name", () => e), Z("$name", () => e), Z("$parent", () => t._appliedParent)];
      return ce({}, n);
    }
    __name(On, "On");
    function Hl(t, e) {
      let r = ye(e), n = Object.keys(Rt).concat("count");
      return { getKeys() {
        return n;
      }, getPropertyValue(i) {
        let o = i, s = /* @__PURE__ */ __name((a) => (f) => {
          let v = Ie(t._errorFormat);
          return t._createPrismaPromise((R) => {
            let A = { args: f, dataPath: [], action: o, model: e, clientMethod: `${r}.${i}`, jsModelName: r, transaction: R, callsite: v };
            return t._request({ ...A, ...a });
          }, { action: o, args: f, model: e });
        }, "s");
        return Wl.includes(o) ? Dn(t, e, s) : zl(i) ? Ao(t, i, s) : s({});
      } };
    }
    __name(Hl, "Hl");
    function zl(t) {
      return Kl.includes(t);
    }
    __name(zl, "zl");
    function Yl(t, e) {
      return Ne(Z("fields", () => {
        let r = t._runtimeDataModel.models[e];
        return Co(e, r);
      }));
    }
    __name(Yl, "Yl");
    u();
    c();
    p();
    m();
    d();
    l();
    function Do(t) {
      return t.replace(/^./, (e) => e.toUpperCase());
    }
    __name(Do, "Do");
    var kn = /* @__PURE__ */ Symbol();
    function Ut(t) {
      let e = [Xl(t), Zl(t), Z(kn, () => t), Z("$parent", () => t._appliedParent)], r = t._extensions.getAllClientExtensions();
      return r && e.push(Nt(r)), ce(t, e);
    }
    __name(Ut, "Ut");
    function Xl(t) {
      let e = Object.getPrototypeOf(t._originalClient), r = [...new Set(Object.getOwnPropertyNames(e))];
      return { getKeys() {
        return r;
      }, getPropertyValue(n) {
        return t[n];
      } };
    }
    __name(Xl, "Xl");
    function Zl(t) {
      let e = Object.keys(t._runtimeDataModel.models), r = e.map(ye), n = [...new Set(e.concat(r))];
      return Ne({ getKeys() {
        return n;
      }, getPropertyValue(i) {
        let o = Do(i);
        if (t._runtimeDataModel.models[o] !== void 0) return On(t, o);
        if (t._runtimeDataModel.models[i] !== void 0) return On(t, i);
      }, getPropertyDescriptor(i) {
        if (!r.includes(i)) return { enumerable: false };
      } });
    }
    __name(Zl, "Zl");
    function Oo(t) {
      return t[kn] ? t[kn] : t;
    }
    __name(Oo, "Oo");
    function ko(t) {
      if (typeof t == "function") return t(this);
      if (t.client?.__AccelerateEngine) {
        let r = t.client.__AccelerateEngine;
        this._originalClient._engine = new r(this._originalClient._accelerateEngineConfig);
      }
      let e = Object.create(this._originalClient, { _extensions: { value: this._extensions.append(t) }, _appliedParent: { value: this, configurable: true }, $on: { value: void 0 } });
      return Ut(e);
    }
    __name(ko, "ko");
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    function _o({ result: t, modelName: e, select: r, omit: n, extensions: i }) {
      let o = i.getAllComputedFields(e);
      if (!o) return t;
      let s = [], a = [];
      for (let f of Object.values(o)) {
        if (n) {
          if (n[f.name]) continue;
          let v = f.needs.filter((R) => n[R]);
          v.length > 0 && a.push(it(v));
        } else if (r) {
          if (!r[f.name]) continue;
          let v = f.needs.filter((R) => !r[R]);
          v.length > 0 && a.push(it(v));
        }
        eu(t, f.needs) && s.push(tu(f, ce(t, s)));
      }
      return s.length > 0 || a.length > 0 ? ce(t, [...s, ...a]) : t;
    }
    __name(_o, "_o");
    function eu(t, e) {
      return e.every((r) => fn(t, r));
    }
    __name(eu, "eu");
    function tu(t, e) {
      return Ne(Z(t.name, () => t.compute(e)));
    }
    __name(tu, "tu");
    u();
    c();
    p();
    m();
    d();
    l();
    function Vr({ visitor: t, result: e, args: r, runtimeDataModel: n, modelName: i }) {
      if (Array.isArray(e)) {
        for (let s = 0; s < e.length; s++) e[s] = Vr({ result: e[s], args: r, modelName: i, runtimeDataModel: n, visitor: t });
        return e;
      }
      let o = t(e, i, r) ?? e;
      return r.include && Mo({ includeOrSelect: r.include, result: o, parentModelName: i, runtimeDataModel: n, visitor: t }), r.select && Mo({ includeOrSelect: r.select, result: o, parentModelName: i, runtimeDataModel: n, visitor: t }), o;
    }
    __name(Vr, "Vr");
    function Mo({ includeOrSelect: t, result: e, parentModelName: r, runtimeDataModel: n, visitor: i }) {
      for (let [o, s] of Object.entries(t)) {
        if (!s || e[o] == null || he(s)) continue;
        let f = n.models[r].fields.find((R) => R.name === o);
        if (!f || f.kind !== "object" || !f.relationName) continue;
        let v = typeof s == "object" ? s : {};
        e[o] = Vr({ visitor: i, result: e[o], args: v, modelName: f.type, runtimeDataModel: n });
      }
    }
    __name(Mo, "Mo");
    function Lo({ result: t, modelName: e, args: r, extensions: n, runtimeDataModel: i, globalOmit: o }) {
      return n.isEmpty() || t == null || typeof t != "object" || !i.models[e] ? t : Vr({ result: t, args: r ?? {}, modelName: e, runtimeDataModel: i, visitor: /* @__PURE__ */ __name((a, f, v) => {
        let R = ye(f);
        return _o({ result: a, modelName: R, select: v.select, omit: v.select ? void 0 : { ...o?.[R], ...v.omit }, extensions: n });
      }, "visitor") });
    }
    __name(Lo, "Lo");
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    var ru = ["$connect", "$disconnect", "$on", "$transaction", "$extends"];
    var Fo = ru;
    function No(t) {
      if (t instanceof ne) return nu(t);
      if (Lr(t)) return iu(t);
      if (Array.isArray(t)) {
        let r = [t[0]];
        for (let n = 1; n < t.length; n++) r[n] = qt(t[n]);
        return r;
      }
      let e = {};
      for (let r in t) e[r] = qt(t[r]);
      return e;
    }
    __name(No, "No");
    function nu(t) {
      return new ne(t.strings, t.values);
    }
    __name(nu, "nu");
    function iu(t) {
      return new Ft(t.sql, t.values);
    }
    __name(iu, "iu");
    function qt(t) {
      if (typeof t != "object" || t == null || t instanceof ve || et(t)) return t;
      if (Ke(t)) return new xe(t.toFixed());
      if (We(t)) return /* @__PURE__ */ new Date(+t);
      if (ArrayBuffer.isView(t)) return t.slice(0);
      if (Array.isArray(t)) {
        let e = t.length, r;
        for (r = Array(e); e--; ) r[e] = qt(t[e]);
        return r;
      }
      if (typeof t == "object") {
        let e = {};
        for (let r in t) r === "__proto__" ? Object.defineProperty(e, r, { value: qt(t[r]), configurable: true, enumerable: true, writable: true }) : e[r] = qt(t[r]);
        return e;
      }
      Fe(t, "Unknown value");
    }
    __name(qt, "qt");
    function qo(t, e, r, n = 0) {
      return t._createPrismaPromise((i) => {
        let o = e.customDataProxyFetch;
        return "transaction" in e && i !== void 0 && (e.transaction?.kind === "batch" && e.transaction.lock.then(), e.transaction = i), n === r.length ? t._executeRequest(e) : r[n]({ model: e.model, operation: e.model ? e.action : e.clientMethod, args: No(e.args ?? {}), __internalParams: e, query: /* @__PURE__ */ __name((s, a = e) => {
          let f = a.customDataProxyFetch;
          return a.customDataProxyFetch = jo(o, f), a.args = s, qo(t, a, r, n + 1);
        }, "query") });
      });
    }
    __name(qo, "qo");
    function Vo(t, e) {
      let { jsModelName: r, action: n, clientMethod: i } = e, o = r ? n : i;
      if (t._extensions.isEmpty()) return t._executeRequest(e);
      let s = t._extensions.getAllQueryCallbacks(r ?? "$none", o);
      return qo(t, e, s);
    }
    __name(Vo, "Vo");
    function Bo(t) {
      return (e) => {
        let r = { requests: e }, n = e[0].extensions.getAllBatchQueryCallbacks();
        return n.length ? $o(r, n, 0, t) : t(r);
      };
    }
    __name(Bo, "Bo");
    function $o(t, e, r, n) {
      if (r === e.length) return n(t);
      let i = t.customDataProxyFetch, o = t.requests[0].transaction;
      return e[r]({ args: { queries: t.requests.map((s) => ({ model: s.modelName, operation: s.action, args: s.args })), transaction: o ? { isolationLevel: o.kind === "batch" ? o.isolationLevel : void 0 } : void 0 }, __internalParams: t, query(s, a = t) {
        let f = a.customDataProxyFetch;
        return a.customDataProxyFetch = jo(i, f), $o(a, e, r + 1, n);
      } });
    }
    __name($o, "$o");
    var Uo = /* @__PURE__ */ __name((t) => t, "Uo");
    function jo(t = Uo, e = Uo) {
      return (r) => t(e(r));
    }
    __name(jo, "jo");
    u();
    c();
    p();
    m();
    d();
    l();
    var Qo = j("prisma:client");
    var Go = { Vercel: "vercel", "Netlify CI": "netlify" };
    function Jo({ postinstall: t, ciName: e, clientVersion: r, generator: n }) {
      if (Qo("checkPlatformCaching:postinstall", t), Qo("checkPlatformCaching:ciName", e), t === true && !(n?.output && typeof (n.output.fromEnvVar ?? n.output.value) == "string") && e && e in Go) {
        let i = `Prisma has detected that this project was built on ${e}, which caches dependencies. This leads to an outdated Prisma Client because Prisma's auto-generation isn't triggered. To fix this, make sure to run the \`prisma generate\` command during the build process.

Learn how: https://pris.ly/d/${Go[e]}-build`;
        throw console.error(i), new M(i, r);
      }
    }
    __name(Jo, "Jo");
    u();
    c();
    p();
    m();
    d();
    l();
    function Wo(t, e) {
      return t ? t.datasources ? t.datasources : t.datasourceUrl ? { [e[0]]: { url: t.datasourceUrl } } : {} : {};
    }
    __name(Wo, "Wo");
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    l();
    function Ko(t, e) {
      throw new Error(e);
    }
    __name(Ko, "Ko");
    function ou(t) {
      return t !== null && typeof t == "object" && typeof t.$type == "string";
    }
    __name(ou, "ou");
    function su(t, e) {
      let r = {};
      for (let n of Object.keys(t)) r[n] = e(t[n], n);
      return r;
    }
    __name(su, "su");
    function lt(t) {
      return t === null ? t : Array.isArray(t) ? t.map(lt) : typeof t == "object" ? ou(t) ? au(t) : t.constructor !== null && t.constructor.name !== "Object" ? t : su(t, lt) : t;
    }
    __name(lt, "lt");
    function au({ $type: t, value: e }) {
      switch (t) {
        case "BigInt":
          return BigInt(e);
        case "Bytes": {
          let { buffer: r, byteOffset: n, byteLength: i } = h.from(e, "base64");
          return new Uint8Array(r, n, i);
        }
        case "DateTime":
          return new Date(e);
        case "Decimal":
          return new P(e);
        case "Json":
          return JSON.parse(e);
        default:
          Ko(e, "Unknown tagged value");
      }
    }
    __name(au, "au");
    var Ho = "6.19.3";
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    var uu = /* @__PURE__ */ __name(() => globalThis.process?.release?.name === "node", "uu");
    var cu = /* @__PURE__ */ __name(() => !!globalThis.Bun || !!globalThis.process?.versions?.bun, "cu");
    var pu = /* @__PURE__ */ __name(() => !!globalThis.Deno, "pu");
    var mu = /* @__PURE__ */ __name(() => typeof globalThis.Netlify == "object", "mu");
    var du = /* @__PURE__ */ __name(() => typeof globalThis.EdgeRuntime == "object", "du");
    var fu = /* @__PURE__ */ __name(() => globalThis.navigator?.userAgent === "Cloudflare-Workers", "fu");
    function gu() {
      return [[mu, "netlify"], [du, "edge-light"], [fu, "workerd"], [pu, "deno"], [cu, "bun"], [uu, "node"]].flatMap((r) => r[0]() ? [r[1]] : []).at(0) ?? "";
    }
    __name(gu, "gu");
    var yu = { node: "Node.js", workerd: "Cloudflare Workers", deno: "Deno and Deno Deploy", netlify: "Netlify Edge Functions", "edge-light": "Edge Runtime (Vercel Edge Functions, Vercel Edge Middleware, Next.js (Pages Router) Edge API Routes, Next.js (App Router) Edge Route Handlers or Next.js Middleware)" };
    function ut() {
      let t = gu();
      return { id: t, prettyName: yu[t] || t, isEdge: ["workerd", "deno", "netlify", "edge-light"].includes(t) };
    }
    __name(ut, "ut");
    function ct({ inlineDatasources: t, overrideDatasources: e, env: r, clientVersion: n }) {
      let i, o = Object.keys(t)[0], s = t[o]?.url, a = e[o]?.url;
      if (o === void 0 ? i = void 0 : a ? i = a : s?.value ? i = s.value : s?.fromEnvVar && (i = r[s.fromEnvVar]), s?.fromEnvVar !== void 0 && i === void 0) throw ut().id === "workerd" ? new M(`error: Environment variable not found: ${s.fromEnvVar}.

In Cloudflare module Workers, environment variables are available only in the Worker's \`env\` parameter of \`fetch\`.
To solve this, provide the connection string directly: https://pris.ly/d/cloudflare-datasource-url`, n) : new M(`error: Environment variable not found: ${s.fromEnvVar}.`, n);
      if (i === void 0) throw new M("error: Missing URL environment variable, value, or override.", n);
      return i;
    }
    __name(ct, "ct");
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    var Br = class extends Error {
      static {
        __name(this, "Br");
      }
      clientVersion;
      cause;
      constructor(e, r) {
        super(e), this.clientVersion = r.clientVersion, this.cause = r.cause;
      }
      get [Symbol.toStringTag]() {
        return this.name;
      }
    };
    var ie = class extends Br {
      static {
        __name(this, "ie");
      }
      isRetryable;
      constructor(e, r) {
        super(e, r), this.isRetryable = r.isRetryable ?? true;
      }
    };
    u();
    c();
    p();
    m();
    d();
    l();
    function _(t, e) {
      return { ...t, isRetryable: e };
    }
    __name(_, "_");
    var Ue = class extends ie {
      static {
        __name(this, "Ue");
      }
      name = "InvalidDatasourceError";
      code = "P6001";
      constructor(e, r) {
        super(e, _(r, false));
      }
    };
    O(Ue, "InvalidDatasourceError");
    function zo(t) {
      let e = { clientVersion: t.clientVersion }, r = Object.keys(t.inlineDatasources)[0], n = ct({ inlineDatasources: t.inlineDatasources, overrideDatasources: t.overrideDatasources, clientVersion: t.clientVersion, env: { ...t.env, ...typeof g < "u" ? g.env : {} } }), i;
      try {
        i = new URL(n);
      } catch {
        throw new Ue(`Error validating datasource \`${r}\`: the URL must start with the protocol \`prisma://\``, e);
      }
      let { protocol: o, searchParams: s } = i;
      if (o !== "prisma:" && o !== fr) throw new Ue(`Error validating datasource \`${r}\`: the URL must start with the protocol \`prisma://\` or \`prisma+postgres://\``, e);
      let a = s.get("api_key");
      if (a === null || a.length < 1) throw new Ue(`Error validating datasource \`${r}\`: the URL must contain a valid API key`, e);
      let f = cn(i) ? "http:" : "https:";
      g.env.TEST_CLIENT_ENGINE_REMOTE_EXECUTOR && i.searchParams.has("use_http") && (f = "http:");
      let v = new URL(i.href.replace(o, f));
      return { apiKey: a, url: v };
    }
    __name(zo, "zo");
    u();
    c();
    p();
    m();
    d();
    l();
    var Yo = bt(Di());
    var $r = class {
      static {
        __name(this, "$r");
      }
      apiKey;
      tracingHelper;
      logLevel;
      logQueries;
      engineHash;
      constructor({ apiKey: e, tracingHelper: r, logLevel: n, logQueries: i, engineHash: o }) {
        this.apiKey = e, this.tracingHelper = r, this.logLevel = n, this.logQueries = i, this.engineHash = o;
      }
      build({ traceparent: e, transactionId: r } = {}) {
        let n = { Accept: "application/json", Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json", "Prisma-Engine-Hash": this.engineHash, "Prisma-Engine-Version": Yo.enginesVersion };
        this.tracingHelper.isEnabled() && (n.traceparent = e ?? this.tracingHelper.getTraceParent()), r && (n["X-Transaction-Id"] = r);
        let i = this.#e();
        return i.length > 0 && (n["X-Capture-Telemetry"] = i.join(", ")), n;
      }
      #e() {
        let e = [];
        return this.tracingHelper.isEnabled() && e.push("tracing"), this.logLevel && e.push(this.logLevel), this.logQueries && e.push("query"), e;
      }
    };
    u();
    c();
    p();
    m();
    d();
    l();
    function hu(t) {
      return t[0] * 1e3 + t[1] / 1e6;
    }
    __name(hu, "hu");
    function _n(t) {
      return new Date(hu(t));
    }
    __name(_n, "_n");
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    var pt = class extends ie {
      static {
        __name(this, "pt");
      }
      name = "ForcedRetryError";
      code = "P5001";
      constructor(e) {
        super("This request must be retried", _(e, true));
      }
    };
    O(pt, "ForcedRetryError");
    u();
    c();
    p();
    m();
    d();
    l();
    var qe = class extends ie {
      static {
        __name(this, "qe");
      }
      name = "NotImplementedYetError";
      code = "P5004";
      constructor(e, r) {
        super(e, _(r, false));
      }
    };
    O(qe, "NotImplementedYetError");
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    var V = class extends ie {
      static {
        __name(this, "V");
      }
      response;
      constructor(e, r) {
        super(e, r), this.response = r.response;
        let n = this.response.headers.get("prisma-request-id");
        if (n) {
          let i = `(The request id was: ${n})`;
          this.message = this.message + " " + i;
        }
      }
    };
    var Ve = class extends V {
      static {
        __name(this, "Ve");
      }
      name = "SchemaMissingError";
      code = "P5005";
      constructor(e) {
        super("Schema needs to be uploaded", _(e, true));
      }
    };
    O(Ve, "SchemaMissingError");
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    var Mn = "This request could not be understood by the server";
    var Vt = class extends V {
      static {
        __name(this, "Vt");
      }
      name = "BadRequestError";
      code = "P5000";
      constructor(e, r, n) {
        super(r || Mn, _(e, false)), n && (this.code = n);
      }
    };
    O(Vt, "BadRequestError");
    u();
    c();
    p();
    m();
    d();
    l();
    var Bt = class extends V {
      static {
        __name(this, "Bt");
      }
      name = "HealthcheckTimeoutError";
      code = "P5013";
      logs;
      constructor(e, r) {
        super("Engine not started: healthcheck timeout", _(e, true)), this.logs = r;
      }
    };
    O(Bt, "HealthcheckTimeoutError");
    u();
    c();
    p();
    m();
    d();
    l();
    var $t = class extends V {
      static {
        __name(this, "$t");
      }
      name = "EngineStartupError";
      code = "P5014";
      logs;
      constructor(e, r, n) {
        super(r, _(e, true)), this.logs = n;
      }
    };
    O($t, "EngineStartupError");
    u();
    c();
    p();
    m();
    d();
    l();
    var jt = class extends V {
      static {
        __name(this, "jt");
      }
      name = "EngineVersionNotSupportedError";
      code = "P5012";
      constructor(e) {
        super("Engine version is not supported", _(e, false));
      }
    };
    O(jt, "EngineVersionNotSupportedError");
    u();
    c();
    p();
    m();
    d();
    l();
    var Ln = "Request timed out";
    var Qt = class extends V {
      static {
        __name(this, "Qt");
      }
      name = "GatewayTimeoutError";
      code = "P5009";
      constructor(e, r = Ln) {
        super(r, _(e, false));
      }
    };
    O(Qt, "GatewayTimeoutError");
    u();
    c();
    p();
    m();
    d();
    l();
    var bu = "Interactive transaction error";
    var Gt = class extends V {
      static {
        __name(this, "Gt");
      }
      name = "InteractiveTransactionError";
      code = "P5015";
      constructor(e, r = bu) {
        super(r, _(e, false));
      }
    };
    O(Gt, "InteractiveTransactionError");
    u();
    c();
    p();
    m();
    d();
    l();
    var Eu = "Request parameters are invalid";
    var Jt = class extends V {
      static {
        __name(this, "Jt");
      }
      name = "InvalidRequestError";
      code = "P5011";
      constructor(e, r = Eu) {
        super(r, _(e, false));
      }
    };
    O(Jt, "InvalidRequestError");
    u();
    c();
    p();
    m();
    d();
    l();
    var Fn = "Requested resource does not exist";
    var Wt = class extends V {
      static {
        __name(this, "Wt");
      }
      name = "NotFoundError";
      code = "P5003";
      constructor(e, r = Fn) {
        super(r, _(e, false));
      }
    };
    O(Wt, "NotFoundError");
    u();
    c();
    p();
    m();
    d();
    l();
    var Nn = "Unknown server error";
    var mt = class extends V {
      static {
        __name(this, "mt");
      }
      name = "ServerError";
      code = "P5006";
      logs;
      constructor(e, r, n) {
        super(r || Nn, _(e, true)), this.logs = n;
      }
    };
    O(mt, "ServerError");
    u();
    c();
    p();
    m();
    d();
    l();
    var Un = "Unauthorized, check your connection string";
    var Kt = class extends V {
      static {
        __name(this, "Kt");
      }
      name = "UnauthorizedError";
      code = "P5007";
      constructor(e, r = Un) {
        super(r, _(e, false));
      }
    };
    O(Kt, "UnauthorizedError");
    u();
    c();
    p();
    m();
    d();
    l();
    var qn = "Usage exceeded, retry again later";
    var Ht = class extends V {
      static {
        __name(this, "Ht");
      }
      name = "UsageExceededError";
      code = "P5008";
      constructor(e, r = qn) {
        super(r, _(e, true));
      }
    };
    O(Ht, "UsageExceededError");
    async function wu(t) {
      let e;
      try {
        e = await t.text();
      } catch {
        return { type: "EmptyError" };
      }
      try {
        let r = JSON.parse(e);
        if (typeof r == "string") switch (r) {
          case "InternalDataProxyError":
            return { type: "DataProxyError", body: r };
          default:
            return { type: "UnknownTextError", body: r };
        }
        if (typeof r == "object" && r !== null) {
          if ("is_panic" in r && "message" in r && "error_code" in r) return { type: "QueryEngineError", body: r };
          if ("EngineNotStarted" in r || "InteractiveTransactionMisrouted" in r || "InvalidRequestError" in r) {
            let n = Object.values(r)[0].reason;
            return typeof n == "string" && !["SchemaMissing", "EngineVersionNotSupported"].includes(n) ? { type: "UnknownJsonError", body: r } : { type: "DataProxyError", body: r };
          }
        }
        return { type: "UnknownJsonError", body: r };
      } catch {
        return e === "" ? { type: "EmptyError" } : { type: "UnknownTextError", body: e };
      }
    }
    __name(wu, "wu");
    async function zt(t, e) {
      if (t.ok) return;
      let r = { clientVersion: e, response: t }, n = await wu(t);
      if (n.type === "QueryEngineError") throw new X(n.body.message, { code: n.body.error_code, clientVersion: e });
      if (n.type === "DataProxyError") {
        if (n.body === "InternalDataProxyError") throw new mt(r, "Internal Data Proxy error");
        if ("EngineNotStarted" in n.body) {
          if (n.body.EngineNotStarted.reason === "SchemaMissing") return new Ve(r);
          if (n.body.EngineNotStarted.reason === "EngineVersionNotSupported") throw new jt(r);
          if ("EngineStartupError" in n.body.EngineNotStarted.reason) {
            let { msg: i, logs: o } = n.body.EngineNotStarted.reason.EngineStartupError;
            throw new $t(r, i, o);
          }
          if ("KnownEngineStartupError" in n.body.EngineNotStarted.reason) {
            let { msg: i, error_code: o } = n.body.EngineNotStarted.reason.KnownEngineStartupError;
            throw new M(i, e, o);
          }
          if ("HealthcheckTimeout" in n.body.EngineNotStarted.reason) {
            let { logs: i } = n.body.EngineNotStarted.reason.HealthcheckTimeout;
            throw new Bt(r, i);
          }
        }
        if ("InteractiveTransactionMisrouted" in n.body) {
          let i = { IDParseError: "Could not parse interactive transaction ID", NoQueryEngineFoundError: "Could not find Query Engine for the specified host and transaction ID", TransactionStartError: "Could not start interactive transaction" };
          throw new Gt(r, i[n.body.InteractiveTransactionMisrouted.reason]);
        }
        if ("InvalidRequestError" in n.body) throw new Jt(r, n.body.InvalidRequestError.reason);
      }
      if (t.status === 401 || t.status === 403) throw new Kt(r, dt(Un, n));
      if (t.status === 404) return new Wt(r, dt(Fn, n));
      if (t.status === 429) throw new Ht(r, dt(qn, n));
      if (t.status === 504) throw new Qt(r, dt(Ln, n));
      if (t.status >= 500) throw new mt(r, dt(Nn, n));
      if (t.status >= 400) throw new Vt(r, dt(Mn, n));
    }
    __name(zt, "zt");
    function dt(t, e) {
      return e.type === "EmptyError" ? t : `${t}: ${JSON.stringify(e)}`;
    }
    __name(dt, "dt");
    u();
    c();
    p();
    m();
    d();
    l();
    function Xo(t) {
      let e = Math.pow(2, t) * 50, r = Math.ceil(Math.random() * e) - Math.ceil(e / 2), n = e + r;
      return new Promise((i) => setTimeout(() => i(n), n));
    }
    __name(Xo, "Xo");
    u();
    c();
    p();
    m();
    d();
    l();
    var Re = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    function Zo(t) {
      let e = new TextEncoder().encode(t), r = "", n = e.byteLength, i = n % 3, o = n - i, s, a, f, v, R;
      for (let A = 0; A < o; A = A + 3) R = e[A] << 16 | e[A + 1] << 8 | e[A + 2], s = (R & 16515072) >> 18, a = (R & 258048) >> 12, f = (R & 4032) >> 6, v = R & 63, r += Re[s] + Re[a] + Re[f] + Re[v];
      return i == 1 ? (R = e[o], s = (R & 252) >> 2, a = (R & 3) << 4, r += Re[s] + Re[a] + "==") : i == 2 && (R = e[o] << 8 | e[o + 1], s = (R & 64512) >> 10, a = (R & 1008) >> 4, f = (R & 15) << 2, r += Re[s] + Re[a] + Re[f] + "="), r;
    }
    __name(Zo, "Zo");
    u();
    c();
    p();
    m();
    d();
    l();
    function es(t) {
      if (!!t.generator?.previewFeatures.some((r) => r.toLowerCase().includes("metrics"))) throw new M("The `metrics` preview feature is not yet available with Accelerate.\nPlease remove `metrics` from the `previewFeatures` in your schema.\n\nMore information about Accelerate: https://pris.ly/d/accelerate", t.clientVersion);
    }
    __name(es, "es");
    u();
    c();
    p();
    m();
    d();
    l();
    var ts = { "@prisma/debug": "workspace:*", "@prisma/engines-version": "7.1.1-3.c2990dca591cba766e3b7ef5d9e8a84796e47ab7", "@prisma/fetch-engine": "workspace:*", "@prisma/get-platform": "workspace:*" };
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    var Yt = class extends ie {
      static {
        __name(this, "Yt");
      }
      name = "RequestError";
      code = "P5010";
      constructor(e, r) {
        super(`Cannot fetch data from service:
${e}`, _(r, true));
      }
    };
    O(Yt, "RequestError");
    async function Be(t, e, r = (n) => n) {
      let { clientVersion: n, ...i } = e, o = r(fetch);
      try {
        return await o(t, i);
      } catch (s) {
        let a = s.message ?? "Unknown error";
        throw new Yt(a, { clientVersion: n, cause: s });
      }
    }
    __name(Be, "Be");
    var Pu = /^[1-9][0-9]*\.[0-9]+\.[0-9]+$/;
    var rs = j("prisma:client:dataproxyEngine");
    async function Tu(t, e) {
      let r = ts["@prisma/engines-version"], n = e.clientVersion ?? "unknown";
      if (g.env.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION || globalThis.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION) return g.env.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION || globalThis.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION;
      if (t.includes("accelerate") && n !== "0.0.0" && n !== "in-memory") return n;
      let [i, o] = n?.split("-") ?? [];
      if (o === void 0 && Pu.test(i)) return i;
      if (o !== void 0 || n === "0.0.0" || n === "in-memory") {
        let [s] = r.split("-") ?? [], [a, f, v] = s.split("."), R = vu(`<=${a}.${f}.${v}`), A = await Be(R, { clientVersion: n });
        if (!A.ok) throw new Error(`Failed to fetch stable Prisma version, unpkg.com status ${A.status} ${A.statusText}, response body: ${await A.text() || "<empty body>"}`);
        let I = await A.text();
        rs("length of body fetched from unpkg.com", I.length);
        let C;
        try {
          C = JSON.parse(I);
        } catch (L) {
          throw console.error("JSON.parse error: body fetched from unpkg.com: ", I), L;
        }
        return C.version;
      }
      throw new qe("Only `major.minor.patch` versions are supported by Accelerate.", { clientVersion: n });
    }
    __name(Tu, "Tu");
    async function ns(t, e) {
      let r = await Tu(t, e);
      return rs("version", r), r;
    }
    __name(ns, "ns");
    function vu(t) {
      return encodeURI(`https://unpkg.com/prisma@${t}/package.json`);
    }
    __name(vu, "vu");
    var is = 3;
    var Xt = j("prisma:client:dataproxyEngine");
    var Zt = class {
      static {
        __name(this, "Zt");
      }
      name = "DataProxyEngine";
      inlineSchema;
      inlineSchemaHash;
      inlineDatasources;
      config;
      logEmitter;
      env;
      clientVersion;
      engineHash;
      tracingHelper;
      remoteClientVersion;
      host;
      headerBuilder;
      startPromise;
      protocol;
      constructor(e) {
        es(e), this.config = e, this.env = e.env, this.inlineSchema = Zo(e.inlineSchema), this.inlineDatasources = e.inlineDatasources, this.inlineSchemaHash = e.inlineSchemaHash, this.clientVersion = e.clientVersion, this.engineHash = e.engineVersion, this.logEmitter = e.logEmitter, this.tracingHelper = e.tracingHelper;
      }
      apiKey() {
        return this.headerBuilder.apiKey;
      }
      version() {
        return this.engineHash;
      }
      async start() {
        this.startPromise !== void 0 && await this.startPromise, this.startPromise = (async () => {
          let { apiKey: e, url: r } = this.getURLAndAPIKey();
          this.host = r.host, this.protocol = r.protocol, this.headerBuilder = new $r({ apiKey: e, tracingHelper: this.tracingHelper, logLevel: this.config.logLevel ?? "error", logQueries: this.config.logQueries, engineHash: this.engineHash }), this.remoteClientVersion = await ns(this.host, this.config), Xt("host", this.host), Xt("protocol", this.protocol);
        })(), await this.startPromise;
      }
      async stop() {
      }
      propagateResponseExtensions(e) {
        e?.logs?.length && e.logs.forEach((r) => {
          switch (r.level) {
            case "debug":
            case "trace":
              Xt(r);
              break;
            case "error":
            case "warn":
            case "info": {
              this.logEmitter.emit(r.level, { timestamp: _n(r.timestamp), message: r.attributes.message ?? "", target: r.target ?? "BinaryEngine" });
              break;
            }
            case "query": {
              this.logEmitter.emit("query", { query: r.attributes.query ?? "", timestamp: _n(r.timestamp), duration: r.attributes.duration_ms ?? 0, params: r.attributes.params ?? "", target: r.target ?? "BinaryEngine" });
              break;
            }
            default:
              r.level;
          }
        }), e?.traces?.length && this.tracingHelper.dispatchEngineSpans(e.traces);
      }
      onBeforeExit() {
        throw new Error('"beforeExit" hook is not applicable to the remote query engine');
      }
      async url(e) {
        return await this.start(), `${this.protocol}//${this.host}/${this.remoteClientVersion}/${this.inlineSchemaHash}/${e}`;
      }
      async uploadSchema() {
        let e = { name: "schemaUpload", internal: true };
        return this.tracingHelper.runInChildSpan(e, async () => {
          let r = await Be(await this.url("schema"), { method: "PUT", headers: this.headerBuilder.build(), body: this.inlineSchema, clientVersion: this.clientVersion });
          r.ok || Xt("schema response status", r.status);
          let n = await zt(r, this.clientVersion);
          if (n) throw this.logEmitter.emit("warn", { message: `Error while uploading schema: ${n.message}`, timestamp: /* @__PURE__ */ new Date(), target: "" }), n;
          this.logEmitter.emit("info", { message: `Schema (re)uploaded (hash: ${this.inlineSchemaHash})`, timestamp: /* @__PURE__ */ new Date(), target: "" });
        });
      }
      request(e, { traceparent: r, interactiveTransaction: n, customDataProxyFetch: i }) {
        return this.requestInternal({ body: e, traceparent: r, interactiveTransaction: n, customDataProxyFetch: i });
      }
      async requestBatch(e, { traceparent: r, transaction: n, customDataProxyFetch: i }) {
        let o = n?.kind === "itx" ? n.options : void 0, s = ot(e, n);
        return (await this.requestInternal({ body: s, customDataProxyFetch: i, interactiveTransaction: o, traceparent: r })).map((f) => (f.extensions && this.propagateResponseExtensions(f.extensions), "errors" in f ? this.convertProtocolErrorsToClientError(f.errors) : f));
      }
      requestInternal({ body: e, traceparent: r, customDataProxyFetch: n, interactiveTransaction: i }) {
        return this.withRetry({ actionGerund: "querying", callback: /* @__PURE__ */ __name(async ({ logHttpCall: o }) => {
          let s = i ? `${i.payload.endpoint}/graphql` : await this.url("graphql");
          o(s);
          let a = await Be(s, { method: "POST", headers: this.headerBuilder.build({ traceparent: r, transactionId: i?.id }), body: JSON.stringify(e), clientVersion: this.clientVersion }, n);
          a.ok || Xt("graphql response status", a.status), await this.handleError(await zt(a, this.clientVersion));
          let f = await a.json();
          if (f.extensions && this.propagateResponseExtensions(f.extensions), "errors" in f) throw this.convertProtocolErrorsToClientError(f.errors);
          return "batchResult" in f ? f.batchResult : f;
        }, "callback") });
      }
      async transaction(e, r, n) {
        let i = { start: "starting", commit: "committing", rollback: "rolling back" };
        return this.withRetry({ actionGerund: `${i[e]} transaction`, callback: /* @__PURE__ */ __name(async ({ logHttpCall: o }) => {
          if (e === "start") {
            let s = JSON.stringify({ max_wait: n.maxWait, timeout: n.timeout, isolation_level: n.isolationLevel }), a = await this.url("transaction/start");
            o(a);
            let f = await Be(a, { method: "POST", headers: this.headerBuilder.build({ traceparent: r.traceparent }), body: s, clientVersion: this.clientVersion });
            await this.handleError(await zt(f, this.clientVersion));
            let v = await f.json(), { extensions: R } = v;
            R && this.propagateResponseExtensions(R);
            let A = v.id, I = v["data-proxy"].endpoint;
            return { id: A, payload: { endpoint: I } };
          } else {
            let s = `${n.payload.endpoint}/${e}`;
            o(s);
            let a = await Be(s, { method: "POST", headers: this.headerBuilder.build({ traceparent: r.traceparent }), clientVersion: this.clientVersion });
            await this.handleError(await zt(a, this.clientVersion));
            let f = await a.json(), { extensions: v } = f;
            v && this.propagateResponseExtensions(v);
            return;
          }
        }, "callback") });
      }
      getURLAndAPIKey() {
        return zo({ clientVersion: this.clientVersion, env: this.env, inlineDatasources: this.inlineDatasources, overrideDatasources: this.config.overrideDatasources });
      }
      metrics() {
        throw new qe("Metrics are not yet supported for Accelerate", { clientVersion: this.clientVersion });
      }
      async withRetry(e) {
        for (let r = 0; ; r++) {
          let n = /* @__PURE__ */ __name((i) => {
            this.logEmitter.emit("info", { message: `Calling ${i} (n=${r})`, timestamp: /* @__PURE__ */ new Date(), target: "" });
          }, "n");
          try {
            return await e.callback({ logHttpCall: n });
          } catch (i) {
            if (!(i instanceof ie) || !i.isRetryable) throw i;
            if (r >= is) throw i instanceof pt ? i.cause : i;
            this.logEmitter.emit("warn", { message: `Attempt ${r + 1}/${is} failed for ${e.actionGerund}: ${i.message ?? "(unknown)"}`, timestamp: /* @__PURE__ */ new Date(), target: "" });
            let o = await Xo(r);
            this.logEmitter.emit("warn", { message: `Retrying after ${o}ms`, timestamp: /* @__PURE__ */ new Date(), target: "" });
          }
        }
      }
      async handleError(e) {
        if (e instanceof Ve) throw await this.uploadSchema(), new pt({ clientVersion: this.clientVersion, cause: e });
        if (e) throw e;
      }
      convertProtocolErrorsToClientError(e) {
        return e.length === 1 ? st(e[0], this.config.clientVersion, this.config.activeProvider) : new Q(JSON.stringify(e), { clientVersion: this.config.clientVersion });
      }
      applyPendingMigrations() {
        throw new Error("Method not implemented.");
      }
    };
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    function os(t) {
      if (t?.kind === "itx") return t.options.id;
    }
    __name(os, "os");
    u();
    c();
    p();
    m();
    d();
    l();
    var Vn;
    var ss = { async loadLibrary(t) {
      let { clientVersion: e, adapter: r, engineWasm: n } = t;
      if (r === void 0) throw new M(`The \`adapter\` option for \`PrismaClient\` is required in this context (${ut().prettyName})`, e);
      if (n === void 0) throw new M("WASM engine was unexpectedly `undefined`", e);
      Vn === void 0 && (Vn = (async () => {
        let o = await n.getRuntime(), s = await n.getQueryEngineWasmModule();
        if (s == null) throw new M("The loaded wasm module was unexpectedly `undefined` or `null` once loaded", e);
        let a = { "./query_engine_bg.js": o }, f = new WebAssembly.Instance(s, a), v = f.exports.__wbindgen_start;
        return o.__wbg_set_wasm(f.exports), v(), o.QueryEngine;
      })());
      let i = await Vn;
      return { debugPanic() {
        return Promise.reject("{}");
      }, dmmf() {
        return Promise.resolve("{}");
      }, version() {
        return { commit: "unknown", version: "unknown" };
      }, QueryEngine: i };
    } };
    var Ru = "P2036";
    var be = j("prisma:client:libraryEngine");
    function Au(t) {
      return t.item_type === "query" && "query" in t;
    }
    __name(Au, "Au");
    function Cu(t) {
      return "level" in t ? t.level === "error" && t.message === "PANIC" : false;
    }
    __name(Cu, "Cu");
    var VL = [...on2, "native"];
    var Su = 0xffffffffffffffffn;
    var Bn = 1n;
    function Iu() {
      let t = Bn++;
      return Bn > Su && (Bn = 1n), t;
    }
    __name(Iu, "Iu");
    var er = class {
      static {
        __name(this, "er");
      }
      name = "LibraryEngine";
      engine;
      libraryInstantiationPromise;
      libraryStartingPromise;
      libraryStoppingPromise;
      libraryStarted;
      executingQueryPromise;
      config;
      QueryEngineConstructor;
      libraryLoader;
      library;
      logEmitter;
      libQueryEnginePath;
      binaryTarget;
      datasourceOverrides;
      datamodel;
      logQueries;
      logLevel;
      lastQuery;
      loggerRustPanic;
      tracingHelper;
      adapterPromise;
      versionInfo;
      constructor(e, r) {
        this.libraryLoader = r ?? ss, this.config = e, this.libraryStarted = false, this.logQueries = e.logQueries ?? false, this.logLevel = e.logLevel ?? "error", this.logEmitter = e.logEmitter, this.datamodel = e.inlineSchema, this.tracingHelper = e.tracingHelper, e.enableDebugLogs && (this.logLevel = "debug");
        let n = Object.keys(e.overrideDatasources)[0], i = e.overrideDatasources[n]?.url;
        n !== void 0 && i !== void 0 && (this.datasourceOverrides = { [n]: i }), this.libraryInstantiationPromise = this.instantiateLibrary();
      }
      wrapEngine(e) {
        return { applyPendingMigrations: e.applyPendingMigrations?.bind(e), commitTransaction: this.withRequestId(e.commitTransaction.bind(e)), connect: this.withRequestId(e.connect.bind(e)), disconnect: this.withRequestId(e.disconnect.bind(e)), metrics: e.metrics?.bind(e), query: this.withRequestId(e.query.bind(e)), rollbackTransaction: this.withRequestId(e.rollbackTransaction.bind(e)), sdlSchema: e.sdlSchema?.bind(e), startTransaction: this.withRequestId(e.startTransaction.bind(e)), trace: e.trace.bind(e), free: e.free?.bind(e) };
      }
      withRequestId(e) {
        return async (...r) => {
          let n = Iu().toString();
          try {
            return await e(...r, n);
          } finally {
            if (this.tracingHelper.isEnabled()) {
              let i = await this.engine?.trace(n);
              if (i) {
                let o = JSON.parse(i);
                this.tracingHelper.dispatchEngineSpans(o.spans);
              }
            }
          }
        };
      }
      async applyPendingMigrations() {
        throw new Error("Cannot call this method from this type of engine instance");
      }
      async transaction(e, r, n) {
        await this.start();
        let i = await this.adapterPromise, o = JSON.stringify(r), s;
        if (e === "start") {
          let f = JSON.stringify({ max_wait: n.maxWait, timeout: n.timeout, isolation_level: n.isolationLevel });
          s = await this.engine?.startTransaction(f, o);
        } else e === "commit" ? s = await this.engine?.commitTransaction(n.id, o) : e === "rollback" && (s = await this.engine?.rollbackTransaction(n.id, o));
        let a = this.parseEngineResponse(s);
        if (Du(a)) {
          let f = this.getExternalAdapterError(a, i?.errorRegistry);
          throw f ? f.error : new X(a.message, { code: a.error_code, clientVersion: this.config.clientVersion, meta: a.meta });
        } else if (typeof a.message == "string") throw new Q(a.message, { clientVersion: this.config.clientVersion });
        return a;
      }
      async instantiateLibrary() {
        if (be("internalSetup"), this.libraryInstantiationPromise) return this.libraryInstantiationPromise;
        this.binaryTarget = await this.getCurrentBinaryTarget(), await this.tracingHelper.runInChildSpan("load_engine", () => this.loadEngine()), this.version();
      }
      async getCurrentBinaryTarget() {
      }
      parseEngineResponse(e) {
        if (!e) throw new Q("Response from the Engine was empty", { clientVersion: this.config.clientVersion });
        try {
          return JSON.parse(e);
        } catch {
          throw new Q("Unable to JSON.parse response from engine", { clientVersion: this.config.clientVersion });
        }
      }
      async loadEngine() {
        if (!this.engine) {
          this.QueryEngineConstructor || (this.library = await this.libraryLoader.loadLibrary(this.config), this.QueryEngineConstructor = this.library.QueryEngine);
          try {
            let e = new b(this);
            this.adapterPromise || (this.adapterPromise = this.config.adapter?.connect()?.then(mr));
            let r = await this.adapterPromise;
            r && be("Using driver adapter: %O", r), this.engine = this.wrapEngine(new this.QueryEngineConstructor({ datamodel: this.datamodel, env: g.env, logQueries: this.config.logQueries ?? false, ignoreEnvVarErrors: true, datasourceOverrides: this.datasourceOverrides ?? {}, logLevel: this.logLevel, configDir: this.config.cwd, engineProtocol: "json", enableTracing: this.tracingHelper.isEnabled() }, (n) => {
              e.deref()?.logger(n);
            }, r));
          } catch (e) {
            let r = e, n = this.parseInitError(r.message);
            throw typeof n == "string" ? r : new M(n.message, this.config.clientVersion, n.error_code);
          }
        }
      }
      logger(e) {
        let r = this.parseEngineResponse(e);
        r && (r.level = r?.level.toLowerCase() ?? "unknown", Au(r) ? this.logEmitter.emit("query", { timestamp: /* @__PURE__ */ new Date(), query: r.query, params: r.params, duration: Number(r.duration_ms), target: r.module_path }) : (Cu(r), this.logEmitter.emit(r.level, { timestamp: /* @__PURE__ */ new Date(), message: r.message, target: r.module_path })));
      }
      parseInitError(e) {
        try {
          return JSON.parse(e);
        } catch {
        }
        return e;
      }
      parseRequestError(e) {
        try {
          return JSON.parse(e);
        } catch {
        }
        return e;
      }
      onBeforeExit() {
        throw new Error('"beforeExit" hook is not applicable to the library engine since Prisma 5.0.0, it is only relevant and implemented for the binary engine. Please add your event listener to the `process` object directly instead.');
      }
      async start() {
        if (this.libraryInstantiationPromise || (this.libraryInstantiationPromise = this.instantiateLibrary()), await this.libraryInstantiationPromise, await this.libraryStoppingPromise, this.libraryStartingPromise) return be(`library already starting, this.libraryStarted: ${this.libraryStarted}`), this.libraryStartingPromise;
        if (this.libraryStarted) return;
        let e = /* @__PURE__ */ __name(async () => {
          be("library starting");
          try {
            let r = { traceparent: this.tracingHelper.getTraceParent() };
            await this.engine?.connect(JSON.stringify(r)), this.libraryStarted = true, this.adapterPromise || (this.adapterPromise = this.config.adapter?.connect()?.then(mr)), await this.adapterPromise, be("library started");
          } catch (r) {
            let n = this.parseInitError(r.message);
            throw typeof n == "string" ? r : new M(n.message, this.config.clientVersion, n.error_code);
          } finally {
            this.libraryStartingPromise = void 0;
          }
        }, "e");
        return this.libraryStartingPromise = this.tracingHelper.runInChildSpan("connect", e), this.libraryStartingPromise;
      }
      async stop() {
        if (await this.libraryInstantiationPromise, await this.libraryStartingPromise, await this.executingQueryPromise, this.libraryStoppingPromise) return be("library is already stopping"), this.libraryStoppingPromise;
        if (!this.libraryStarted) {
          await (await this.adapterPromise)?.dispose(), this.adapterPromise = void 0;
          return;
        }
        let e = /* @__PURE__ */ __name(async () => {
          await new Promise((n) => setImmediate(n)), be("library stopping");
          let r = { traceparent: this.tracingHelper.getTraceParent() };
          await this.engine?.disconnect(JSON.stringify(r)), this.engine?.free && this.engine.free(), this.engine = void 0, this.libraryStarted = false, this.libraryStoppingPromise = void 0, this.libraryInstantiationPromise = void 0, await (await this.adapterPromise)?.dispose(), this.adapterPromise = void 0, be("library stopped");
        }, "e");
        return this.libraryStoppingPromise = this.tracingHelper.runInChildSpan("disconnect", e), this.libraryStoppingPromise;
      }
      version() {
        return this.versionInfo = this.library?.version(), this.versionInfo?.version ?? "unknown";
      }
      debugPanic(e) {
        return this.library?.debugPanic(e);
      }
      async request(e, { traceparent: r, interactiveTransaction: n }) {
        be(`sending request, this.libraryStarted: ${this.libraryStarted}`);
        let i = JSON.stringify({ traceparent: r }), o = JSON.stringify(e);
        try {
          await this.start();
          let s = await this.adapterPromise;
          this.executingQueryPromise = this.engine?.query(o, i, n?.id), this.lastQuery = o;
          let a = this.parseEngineResponse(await this.executingQueryPromise);
          if (a.errors) throw a.errors.length === 1 ? this.buildQueryError(a.errors[0], s?.errorRegistry) : new Q(JSON.stringify(a.errors), { clientVersion: this.config.clientVersion });
          if (this.loggerRustPanic) throw this.loggerRustPanic;
          return { data: a };
        } catch (s) {
          if (s instanceof M) throw s;
          s.code === "GenericFailure" && s.message?.startsWith("PANIC:");
          let a = this.parseRequestError(s.message);
          throw typeof a == "string" ? s : new Q(`${a.message}
${a.backtrace}`, { clientVersion: this.config.clientVersion });
        }
      }
      async requestBatch(e, { transaction: r, traceparent: n }) {
        be("requestBatch");
        let i = ot(e, r);
        await this.start();
        let o = await this.adapterPromise;
        this.lastQuery = JSON.stringify(i), this.executingQueryPromise = this.engine?.query(this.lastQuery, JSON.stringify({ traceparent: n }), os(r));
        let s = await this.executingQueryPromise, a = this.parseEngineResponse(s);
        if (a.errors) throw a.errors.length === 1 ? this.buildQueryError(a.errors[0], o?.errorRegistry) : new Q(JSON.stringify(a.errors), { clientVersion: this.config.clientVersion });
        let { batchResult: f, errors: v } = a;
        if (Array.isArray(f)) return f.map((R) => R.errors && R.errors.length > 0 ? this.loggerRustPanic ?? this.buildQueryError(R.errors[0], o?.errorRegistry) : { data: R });
        throw v && v.length === 1 ? new Error(v[0].error) : new Error(JSON.stringify(a));
      }
      buildQueryError(e, r) {
        e.user_facing_error.is_panic;
        let n = this.getExternalAdapterError(e.user_facing_error, r);
        return n ? n.error : st(e, this.config.clientVersion, this.config.activeProvider);
      }
      getExternalAdapterError(e, r) {
        if (e.error_code === Ru && r) {
          let n = e.meta?.id;
          yr(typeof n == "number", "Malformed external JS error received from the engine");
          let i = r.consumeError(n);
          return yr(i, "External error with reported id was not registered"), i;
        }
      }
      async metrics(e) {
        await this.start();
        let r = await this.engine.metrics(JSON.stringify(e));
        return e.format === "prometheus" ? r : this.parseEngineResponse(r);
      }
    };
    function Du(t) {
      return typeof t == "object" && t !== null && t.error_code !== void 0;
    }
    __name(Du, "Du");
    u();
    c();
    p();
    m();
    d();
    l();
    function as({ url: t, adapter: e, copyEngine: r, targetBuildType: n }) {
      let i = [], o = [], s = /* @__PURE__ */ __name((D) => {
        i.push({ _tag: "warning", value: D });
      }, "s"), a = /* @__PURE__ */ __name((D) => {
        let k = D.join(`
`);
        o.push({ _tag: "error", value: k });
      }, "a"), f = !!t?.startsWith("prisma://"), v = gr(t), R = !!e, A = f || v;
      !R && r && A && n !== "client" && n !== "wasm-compiler-edge" && s(["recommend--no-engine", "In production, we recommend using `prisma generate --no-engine` (See: `prisma generate --help`)"]);
      let I = A || !r;
      R && (I || n === "edge") && (n === "edge" ? a(["Prisma Client was configured to use the `adapter` option but it was imported via its `/edge` endpoint.", "Please either remove the `/edge` endpoint or remove the `adapter` from the Prisma Client constructor."]) : A ? a(["You've provided both a driver adapter and an Accelerate database URL. Driver adapters currently cannot connect to Accelerate.", "Please provide either a driver adapter with a direct database URL or an Accelerate URL and no driver adapter."]) : r || a(["Prisma Client was configured to use the `adapter` option but `prisma generate` was run with `--no-engine`.", "Please run `prisma generate` without `--no-engine` to be able to use Prisma Client with the adapter."]));
      let C = { accelerate: I, ppg: v, driverAdapters: R };
      function L(D) {
        return D.length > 0;
      }
      __name(L, "L");
      return L(o) ? { ok: false, diagnostics: { warnings: i, errors: o }, isUsing: C } : { ok: true, diagnostics: { warnings: i }, isUsing: C };
    }
    __name(as, "as");
    function ls({ copyEngine: t = true }, e) {
      let r;
      try {
        r = ct({ inlineDatasources: e.inlineDatasources, overrideDatasources: e.overrideDatasources, env: { ...e.env, ...g.env }, clientVersion: e.clientVersion });
      } catch {
      }
      let { ok: n, isUsing: i, diagnostics: o } = as({ url: r, adapter: e.adapter, copyEngine: t, targetBuildType: "wasm-engine-edge" });
      for (let A of o.warnings) Tt(...A.value);
      if (!n) {
        let A = o.errors[0];
        throw new Y(A.value, { clientVersion: e.clientVersion });
      }
      let s = Je(e.generator), a = s === "library", f = s === "binary", v = s === "client", R = (i.accelerate || i.ppg) && !i.driverAdapters;
      return i.accelerate ? new Zt(e) : i.driverAdapters ? new er(e) : new $n({ clientVersion: e.clientVersion });
    }
    __name(ls, "ls");
    var $n = class {
      static {
        __name(this, "$n");
      }
      constructor(e) {
        return new Proxy(this, { get(r, n) {
          let i = `In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters`;
          throw new Y(i, e);
        } });
      }
    };
    u();
    c();
    p();
    m();
    d();
    l();
    function us({ generator: t }) {
      return t?.previewFeatures ?? [];
    }
    __name(us, "us");
    u();
    c();
    p();
    m();
    d();
    l();
    var cs = /* @__PURE__ */ __name((t) => ({ command: t }), "cs");
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    var ps = /* @__PURE__ */ __name((t) => t.strings.reduce((e, r, n) => `${e}@P${n}${r}`), "ps");
    u();
    c();
    p();
    m();
    d();
    l();
    l();
    function ft(t) {
      try {
        return ms(t, "fast");
      } catch {
        return ms(t, "slow");
      }
    }
    __name(ft, "ft");
    function ms(t, e) {
      return JSON.stringify(t.map((r) => fs(r, e)));
    }
    __name(ms, "ms");
    function fs(t, e) {
      if (Array.isArray(t)) return t.map((r) => fs(r, e));
      if (typeof t == "bigint") return { prisma__type: "bigint", prisma__value: t.toString() };
      if (We(t)) return { prisma__type: "date", prisma__value: t.toJSON() };
      if (xe.isDecimal(t)) return { prisma__type: "decimal", prisma__value: t.toJSON() };
      if (h.isBuffer(t)) return { prisma__type: "bytes", prisma__value: t.toString("base64") };
      if (Ou(t)) return { prisma__type: "bytes", prisma__value: h.from(t).toString("base64") };
      if (ArrayBuffer.isView(t)) {
        let { buffer: r, byteOffset: n, byteLength: i } = t;
        return { prisma__type: "bytes", prisma__value: h.from(r, n, i).toString("base64") };
      }
      return typeof t == "object" && e === "slow" ? gs(t) : t;
    }
    __name(fs, "fs");
    function Ou(t) {
      return t instanceof ArrayBuffer || t instanceof SharedArrayBuffer ? true : typeof t == "object" && t !== null ? t[Symbol.toStringTag] === "ArrayBuffer" || t[Symbol.toStringTag] === "SharedArrayBuffer" : false;
    }
    __name(Ou, "Ou");
    function gs(t) {
      if (typeof t != "object" || t === null) return t;
      if (typeof t.toJSON == "function") return t.toJSON();
      if (Array.isArray(t)) return t.map(ds);
      let e = {};
      for (let r of Object.keys(t)) e[r] = ds(t[r]);
      return e;
    }
    __name(gs, "gs");
    function ds(t) {
      return typeof t == "bigint" ? t.toString() : gs(t);
    }
    __name(ds, "ds");
    var ku = /^(\s*alter\s)/i;
    var ys = j("prisma:client");
    function jn(t, e, r, n) {
      if (!(t !== "postgresql" && t !== "cockroachdb") && r.length > 0 && ku.exec(e)) throw new Error(`Running ALTER using ${n} is not supported
Using the example below you can still execute your query with Prisma, but please note that it is vulnerable to SQL injection attacks and requires you to take care of input sanitization.

Example:
  await prisma.$executeRawUnsafe(\`ALTER USER prisma WITH PASSWORD '\${password}'\`)

More Information: https://pris.ly/d/execute-raw
`);
    }
    __name(jn, "jn");
    var Qn = /* @__PURE__ */ __name(({ clientMethod: t, activeProvider: e }) => (r) => {
      let n = "", i;
      if (Lr(r)) n = r.sql, i = { values: ft(r.values), __prismaRawParameters__: true };
      else if (Array.isArray(r)) {
        let [o, ...s] = r;
        n = o, i = { values: ft(s || []), __prismaRawParameters__: true };
      } else switch (e) {
        case "sqlite":
        case "mysql": {
          n = r.sql, i = { values: ft(r.values), __prismaRawParameters__: true };
          break;
        }
        case "cockroachdb":
        case "postgresql":
        case "postgres": {
          n = r.text, i = { values: ft(r.values), __prismaRawParameters__: true };
          break;
        }
        case "sqlserver": {
          n = ps(r), i = { values: ft(r.values), __prismaRawParameters__: true };
          break;
        }
        default:
          throw new Error(`The ${e} provider does not support ${t}`);
      }
      return i?.values ? ys(`prisma.${t}(${n}, ${i.values})`) : ys(`prisma.${t}(${n})`), { query: n, parameters: i };
    }, "Qn");
    var hs = { requestArgsToMiddlewareArgs(t) {
      return [t.strings, ...t.values];
    }, middlewareArgsToRequestArgs(t) {
      let [e, ...r] = t;
      return new ne(e, r);
    } };
    var bs = { requestArgsToMiddlewareArgs(t) {
      return [t];
    }, middlewareArgsToRequestArgs(t) {
      return t[0];
    } };
    u();
    c();
    p();
    m();
    d();
    l();
    function Gn(t) {
      return function(r, n) {
        let i, o = /* @__PURE__ */ __name((s = t) => {
          try {
            return s === void 0 || s?.kind === "itx" ? i ??= Es(r(s)) : Es(r(s));
          } catch (a) {
            return Promise.reject(a);
          }
        }, "o");
        return { get spec() {
          return n;
        }, then(s, a) {
          return o().then(s, a);
        }, catch(s) {
          return o().catch(s);
        }, finally(s) {
          return o().finally(s);
        }, requestTransaction(s) {
          let a = o(s);
          return a.requestTransaction ? a.requestTransaction(s) : a;
        }, [Symbol.toStringTag]: "PrismaPromise" };
      };
    }
    __name(Gn, "Gn");
    function Es(t) {
      return typeof t.then == "function" ? t : Promise.resolve(t);
    }
    __name(Es, "Es");
    u();
    c();
    p();
    m();
    d();
    l();
    var _u = sn.split(".")[0];
    var Mu = { isEnabled() {
      return false;
    }, getTraceParent() {
      return "00-10-10-00";
    }, dispatchEngineSpans() {
    }, getActiveContext() {
    }, runInChildSpan(t, e) {
      return e();
    } };
    var Jn = class {
      static {
        __name(this, "Jn");
      }
      isEnabled() {
        return this.getGlobalTracingHelper().isEnabled();
      }
      getTraceParent(e) {
        return this.getGlobalTracingHelper().getTraceParent(e);
      }
      dispatchEngineSpans(e) {
        return this.getGlobalTracingHelper().dispatchEngineSpans(e);
      }
      getActiveContext() {
        return this.getGlobalTracingHelper().getActiveContext();
      }
      runInChildSpan(e, r) {
        return this.getGlobalTracingHelper().runInChildSpan(e, r);
      }
      getGlobalTracingHelper() {
        let e = globalThis[`V${_u}_PRISMA_INSTRUMENTATION`], r = globalThis.PRISMA_INSTRUMENTATION;
        return e?.helper ?? r?.helper ?? Mu;
      }
    };
    function ws() {
      return new Jn();
    }
    __name(ws, "ws");
    u();
    c();
    p();
    m();
    d();
    l();
    function xs(t, e = () => {
    }) {
      let r, n = new Promise((i) => r = i);
      return { then(i) {
        return --t === 0 && r(e()), i?.(n);
      } };
    }
    __name(xs, "xs");
    u();
    c();
    p();
    m();
    d();
    l();
    function Ps(t) {
      return typeof t == "string" ? t : t.reduce((e, r) => {
        let n = typeof r == "string" ? r : r.level;
        return n === "query" ? e : e && (r === "info" || e === "info") ? "info" : n;
      }, void 0);
    }
    __name(Ps, "Ps");
    u();
    c();
    p();
    m();
    d();
    l();
    u();
    c();
    p();
    m();
    d();
    l();
    function jr(t) {
      return typeof t.batchRequestIdx == "number";
    }
    __name(jr, "jr");
    u();
    c();
    p();
    m();
    d();
    l();
    function Ts(t) {
      if (t.action !== "findUnique" && t.action !== "findUniqueOrThrow") return;
      let e = [];
      return t.modelName && e.push(t.modelName), t.query.arguments && e.push(Wn(t.query.arguments)), e.push(Wn(t.query.selection)), e.join("");
    }
    __name(Ts, "Ts");
    function Wn(t) {
      return `(${Object.keys(t).sort().map((r) => {
        let n = t[r];
        return typeof n == "object" && n !== null ? `(${r} ${Wn(n)})` : r;
      }).join(" ")})`;
    }
    __name(Wn, "Wn");
    u();
    c();
    p();
    m();
    d();
    l();
    var Lu = { aggregate: false, aggregateRaw: false, createMany: true, createManyAndReturn: true, createOne: true, deleteMany: true, deleteOne: true, executeRaw: true, findFirst: false, findFirstOrThrow: false, findMany: false, findRaw: false, findUnique: false, findUniqueOrThrow: false, groupBy: false, queryRaw: false, runCommandRaw: true, updateMany: true, updateManyAndReturn: true, updateOne: true, upsertOne: true };
    function Kn(t) {
      return Lu[t];
    }
    __name(Kn, "Kn");
    u();
    c();
    p();
    m();
    d();
    l();
    var Qr = class {
      static {
        __name(this, "Qr");
      }
      constructor(e) {
        this.options = e;
        this.batches = {};
      }
      batches;
      tickActive = false;
      request(e) {
        let r = this.options.batchBy(e);
        return r ? (this.batches[r] || (this.batches[r] = [], this.tickActive || (this.tickActive = true, g.nextTick(() => {
          this.dispatchBatches(), this.tickActive = false;
        }))), new Promise((n, i) => {
          this.batches[r].push({ request: e, resolve: n, reject: i });
        })) : this.options.singleLoader(e);
      }
      dispatchBatches() {
        for (let e in this.batches) {
          let r = this.batches[e];
          delete this.batches[e], r.length === 1 ? this.options.singleLoader(r[0].request).then((n) => {
            n instanceof Error ? r[0].reject(n) : r[0].resolve(n);
          }).catch((n) => {
            r[0].reject(n);
          }) : (r.sort((n, i) => this.options.batchOrder(n.request, i.request)), this.options.batchLoader(r.map((n) => n.request)).then((n) => {
            if (n instanceof Error) for (let i = 0; i < r.length; i++) r[i].reject(n);
            else for (let i = 0; i < r.length; i++) {
              let o = n[i];
              o instanceof Error ? r[i].reject(o) : r[i].resolve(o);
            }
          }).catch((n) => {
            for (let i = 0; i < r.length; i++) r[i].reject(n);
          }));
        }
      }
      get [Symbol.toStringTag]() {
        return "DataLoader";
      }
    };
    u();
    c();
    p();
    m();
    d();
    l();
    l();
    function $e(t, e) {
      if (e === null) return e;
      switch (t) {
        case "bigint":
          return BigInt(e);
        case "bytes": {
          let { buffer: r, byteOffset: n, byteLength: i } = h.from(e, "base64");
          return new Uint8Array(r, n, i);
        }
        case "decimal":
          return new xe(e);
        case "datetime":
        case "date":
          return new Date(e);
        case "time":
          return /* @__PURE__ */ new Date(`1970-01-01T${e}Z`);
        case "bigint-array":
          return e.map((r) => $e("bigint", r));
        case "bytes-array":
          return e.map((r) => $e("bytes", r));
        case "decimal-array":
          return e.map((r) => $e("decimal", r));
        case "datetime-array":
          return e.map((r) => $e("datetime", r));
        case "date-array":
          return e.map((r) => $e("date", r));
        case "time-array":
          return e.map((r) => $e("time", r));
        default:
          return e;
      }
    }
    __name($e, "$e");
    function Gr(t) {
      let e = [], r = Fu(t);
      for (let n = 0; n < t.rows.length; n++) {
        let i = t.rows[n], o = { ...r };
        for (let s = 0; s < i.length; s++) o[t.columns[s]] = $e(t.types[s], i[s]);
        e.push(o);
      }
      return e;
    }
    __name(Gr, "Gr");
    function Fu(t) {
      let e = {};
      for (let r = 0; r < t.columns.length; r++) e[t.columns[r]] = null;
      return e;
    }
    __name(Fu, "Fu");
    var Nu = j("prisma:client:request_handler");
    var Jr = class {
      static {
        __name(this, "Jr");
      }
      client;
      dataloader;
      logEmitter;
      constructor(e, r) {
        this.logEmitter = r, this.client = e, this.dataloader = new Qr({ batchLoader: Bo(async ({ requests: n, customDataProxyFetch: i }) => {
          let { transaction: o, otelParentCtx: s } = n[0], a = n.map((A) => A.protocolQuery), f = this.client._tracingHelper.getTraceParent(s), v = n.some((A) => Kn(A.protocolQuery.action));
          return (await this.client._engine.requestBatch(a, { traceparent: f, transaction: Uu(o), containsWrite: v, customDataProxyFetch: i })).map((A, I) => {
            if (A instanceof Error) return A;
            try {
              return this.mapQueryEngineResult(n[I], A);
            } catch (C) {
              return C;
            }
          });
        }), singleLoader: /* @__PURE__ */ __name(async (n) => {
          let i = n.transaction?.kind === "itx" ? vs(n.transaction) : void 0, o = await this.client._engine.request(n.protocolQuery, { traceparent: this.client._tracingHelper.getTraceParent(), interactiveTransaction: i, isWrite: Kn(n.protocolQuery.action), customDataProxyFetch: n.customDataProxyFetch });
          return this.mapQueryEngineResult(n, o);
        }, "singleLoader"), batchBy: /* @__PURE__ */ __name((n) => n.transaction?.id ? `transaction-${n.transaction.id}` : Ts(n.protocolQuery), "batchBy"), batchOrder(n, i) {
          return n.transaction?.kind === "batch" && i.transaction?.kind === "batch" ? n.transaction.index - i.transaction.index : 0;
        } });
      }
      async request(e) {
        try {
          return await this.dataloader.request(e);
        } catch (r) {
          let { clientMethod: n, callsite: i, transaction: o, args: s, modelName: a } = e;
          this.handleAndLogRequestError({ error: r, clientMethod: n, callsite: i, transaction: o, args: s, modelName: a, globalOmit: e.globalOmit });
        }
      }
      mapQueryEngineResult({ dataPath: e, unpacker: r }, n) {
        let i = n?.data, o = this.unpack(i, e, r);
        return g.env.PRISMA_CLIENT_GET_TIME ? { data: o } : o;
      }
      handleAndLogRequestError(e) {
        try {
          this.handleRequestError(e);
        } catch (r) {
          throw this.logEmitter && this.logEmitter.emit("error", { message: r.message, target: e.clientMethod, timestamp: /* @__PURE__ */ new Date() }), r;
        }
      }
      handleRequestError({ error: e, clientMethod: r, callsite: n, transaction: i, args: o, modelName: s, globalOmit: a }) {
        if (Nu(e), qu(e, i)) throw e;
        if (e instanceof X && Vu(e)) {
          let v = Rs(e.meta);
          Ir({ args: o, errors: [v], callsite: n, errorFormat: this.client._errorFormat, originalMethod: r, clientVersion: this.client._clientVersion, globalOmit: a });
        }
        let f = e.message;
        if (n && (f = Er({ callsite: n, originalMethod: r, isPanic: e.isPanic, showColors: this.client._errorFormat === "pretty", message: f })), f = this.sanitizeMessage(f), e.code) {
          let v = s ? { modelName: s, ...e.meta } : e.meta;
          throw new X(f, { code: e.code, clientVersion: this.client._clientVersion, meta: v, batchRequestIdx: e.batchRequestIdx });
        } else {
          if (e.isPanic) throw new Te(f, this.client._clientVersion);
          if (e instanceof Q) throw new Q(f, { clientVersion: this.client._clientVersion, batchRequestIdx: e.batchRequestIdx });
          if (e instanceof M) throw new M(f, this.client._clientVersion);
          if (e instanceof Te) throw new Te(f, this.client._clientVersion);
        }
        throw e.clientVersion = this.client._clientVersion, e;
      }
      sanitizeMessage(e) {
        return this.client._errorFormat && this.client._errorFormat !== "pretty" ? dn(e) : e;
      }
      unpack(e, r, n) {
        if (!e || (e.data && (e = e.data), !e)) return e;
        let i = Object.keys(e)[0], o = Object.values(e)[0], s = r.filter((v) => v !== "select" && v !== "include"), a = In(o, s), f = i === "queryRaw" ? Gr(a) : lt(a);
        return n ? n(f) : f;
      }
      get [Symbol.toStringTag]() {
        return "RequestHandler";
      }
    };
    function Uu(t) {
      if (t) {
        if (t.kind === "batch") return { kind: "batch", options: { isolationLevel: t.isolationLevel } };
        if (t.kind === "itx") return { kind: "itx", options: vs(t) };
        Fe(t, "Unknown transaction kind");
      }
    }
    __name(Uu, "Uu");
    function vs(t) {
      return { id: t.id, payload: t.payload };
    }
    __name(vs, "vs");
    function qu(t, e) {
      return jr(t) && e?.kind === "batch" && t.batchRequestIdx !== e.index;
    }
    __name(qu, "qu");
    function Vu(t) {
      return t.code === "P2009" || t.code === "P2012";
    }
    __name(Vu, "Vu");
    function Rs(t) {
      if (t.kind === "Union") return { kind: "Union", errors: t.errors.map(Rs) };
      if (Array.isArray(t.selectionPath)) {
        let [, ...e] = t.selectionPath;
        return { ...t, selectionPath: e };
      }
      return t;
    }
    __name(Rs, "Rs");
    u();
    c();
    p();
    m();
    d();
    l();
    var As = Ho;
    u();
    c();
    p();
    m();
    d();
    l();
    var Os = bt(hn());
    u();
    c();
    p();
    m();
    d();
    l();
    var F = class extends Error {
      static {
        __name(this, "F");
      }
      constructor(e) {
        super(e + `
Read more at https://pris.ly/d/client-constructor`), this.name = "PrismaClientConstructorValidationError";
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientConstructorValidationError";
      }
    };
    O(F, "PrismaClientConstructorValidationError");
    var Cs = ["datasources", "datasourceUrl", "errorFormat", "adapter", "log", "transactionOptions", "omit", "__internal"];
    var Ss = ["pretty", "colorless", "minimal"];
    var Is = ["info", "query", "warn", "error"];
    var Bu = { datasources: /* @__PURE__ */ __name((t, { datasourceNames: e }) => {
      if (t) {
        if (typeof t != "object" || Array.isArray(t)) throw new F(`Invalid value ${JSON.stringify(t)} for "datasources" provided to PrismaClient constructor`);
        for (let [r, n] of Object.entries(t)) {
          if (!e.includes(r)) {
            let i = gt(r, e) || ` Available datasources: ${e.join(", ")}`;
            throw new F(`Unknown datasource ${r} provided to PrismaClient constructor.${i}`);
          }
          if (typeof n != "object" || Array.isArray(n)) throw new F(`Invalid value ${JSON.stringify(t)} for datasource "${r}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
          if (n && typeof n == "object") for (let [i, o] of Object.entries(n)) {
            if (i !== "url") throw new F(`Invalid value ${JSON.stringify(t)} for datasource "${r}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
            if (typeof o != "string") throw new F(`Invalid value ${JSON.stringify(o)} for datasource "${r}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
          }
        }
      }
    }, "datasources"), adapter: /* @__PURE__ */ __name((t, e) => {
      if (!t && Je(e.generator) === "client") throw new F('Using engine type "client" requires a driver adapter to be provided to PrismaClient constructor.');
      if (t !== null) {
        if (t === void 0) throw new F('"adapter" property must not be undefined, use null to conditionally disable driver adapters.');
        if (Je(e.generator) === "binary") throw new F('Cannot use a driver adapter with the "binary" Query Engine. Please use the "library" Query Engine.');
      }
    }, "adapter"), datasourceUrl: /* @__PURE__ */ __name((t) => {
      if (typeof t < "u" && typeof t != "string") throw new F(`Invalid value ${JSON.stringify(t)} for "datasourceUrl" provided to PrismaClient constructor.
Expected string or undefined.`);
    }, "datasourceUrl"), errorFormat: /* @__PURE__ */ __name((t) => {
      if (t) {
        if (typeof t != "string") throw new F(`Invalid value ${JSON.stringify(t)} for "errorFormat" provided to PrismaClient constructor.`);
        if (!Ss.includes(t)) {
          let e = gt(t, Ss);
          throw new F(`Invalid errorFormat ${t} provided to PrismaClient constructor.${e}`);
        }
      }
    }, "errorFormat"), log: /* @__PURE__ */ __name((t) => {
      if (!t) return;
      if (!Array.isArray(t)) throw new F(`Invalid value ${JSON.stringify(t)} for "log" provided to PrismaClient constructor.`);
      function e(r) {
        if (typeof r == "string" && !Is.includes(r)) {
          let n = gt(r, Is);
          throw new F(`Invalid log level "${r}" provided to PrismaClient constructor.${n}`);
        }
      }
      __name(e, "e");
      for (let r of t) {
        e(r);
        let n = { level: e, emit: /* @__PURE__ */ __name((i) => {
          let o = ["stdout", "event"];
          if (!o.includes(i)) {
            let s = gt(i, o);
            throw new F(`Invalid value ${JSON.stringify(i)} for "emit" in logLevel provided to PrismaClient constructor.${s}`);
          }
        }, "emit") };
        if (r && typeof r == "object") for (let [i, o] of Object.entries(r)) if (n[i]) n[i](o);
        else throw new F(`Invalid property ${i} for "log" provided to PrismaClient constructor`);
      }
    }, "log"), transactionOptions: /* @__PURE__ */ __name((t) => {
      if (!t) return;
      let e = t.maxWait;
      if (e != null && e <= 0) throw new F(`Invalid value ${e} for maxWait in "transactionOptions" provided to PrismaClient constructor. maxWait needs to be greater than 0`);
      let r = t.timeout;
      if (r != null && r <= 0) throw new F(`Invalid value ${r} for timeout in "transactionOptions" provided to PrismaClient constructor. timeout needs to be greater than 0`);
    }, "transactionOptions"), omit: /* @__PURE__ */ __name((t, e) => {
      if (typeof t != "object") throw new F('"omit" option is expected to be an object.');
      if (t === null) throw new F('"omit" option can not be `null`');
      let r = [];
      for (let [n, i] of Object.entries(t)) {
        let o = ju(n, e.runtimeDataModel);
        if (!o) {
          r.push({ kind: "UnknownModel", modelKey: n });
          continue;
        }
        for (let [s, a] of Object.entries(i)) {
          let f = o.fields.find((v) => v.name === s);
          if (!f) {
            r.push({ kind: "UnknownField", modelKey: n, fieldName: s });
            continue;
          }
          if (f.relationName) {
            r.push({ kind: "RelationInOmit", modelKey: n, fieldName: s });
            continue;
          }
          typeof a != "boolean" && r.push({ kind: "InvalidFieldValue", modelKey: n, fieldName: s });
        }
      }
      if (r.length > 0) throw new F(Qu(t, r));
    }, "omit"), __internal: /* @__PURE__ */ __name((t) => {
      if (!t) return;
      let e = ["debug", "engine", "configOverride"];
      if (typeof t != "object") throw new F(`Invalid value ${JSON.stringify(t)} for "__internal" to PrismaClient constructor`);
      for (let [r] of Object.entries(t)) if (!e.includes(r)) {
        let n = gt(r, e);
        throw new F(`Invalid property ${JSON.stringify(r)} for "__internal" provided to PrismaClient constructor.${n}`);
      }
    }, "__internal") };
    function ks(t, e) {
      for (let [r, n] of Object.entries(t)) {
        if (!Cs.includes(r)) {
          let i = gt(r, Cs);
          throw new F(`Unknown property ${r} provided to PrismaClient constructor.${i}`);
        }
        Bu[r](n, e);
      }
      if (t.datasourceUrl && t.datasources) throw new F('Can not use "datasourceUrl" and "datasources" options at the same time. Pick one of them');
    }
    __name(ks, "ks");
    function gt(t, e) {
      if (e.length === 0 || typeof t != "string") return "";
      let r = $u(t, e);
      return r ? ` Did you mean "${r}"?` : "";
    }
    __name(gt, "gt");
    function $u(t, e) {
      if (e.length === 0) return null;
      let r = e.map((i) => ({ value: i, distance: (0, Os.default)(t, i) }));
      r.sort((i, o) => i.distance < o.distance ? -1 : 1);
      let n = r[0];
      return n.distance < 3 ? n.value : null;
    }
    __name($u, "$u");
    function ju(t, e) {
      return Ds(e.models, t) ?? Ds(e.types, t);
    }
    __name(ju, "ju");
    function Ds(t, e) {
      let r = Object.keys(t).find((n) => Ce(n) === e);
      if (r) return t[r];
    }
    __name(Ds, "Ds");
    function Qu(t, e) {
      let r = tt(t);
      for (let o of e) switch (o.kind) {
        case "UnknownModel":
          r.arguments.getField(o.modelKey)?.markAsError(), r.addErrorMessage(() => `Unknown model name: ${o.modelKey}.`);
          break;
        case "UnknownField":
          r.arguments.getDeepField([o.modelKey, o.fieldName])?.markAsError(), r.addErrorMessage(() => `Model "${o.modelKey}" does not have a field named "${o.fieldName}".`);
          break;
        case "RelationInOmit":
          r.arguments.getDeepField([o.modelKey, o.fieldName])?.markAsError(), r.addErrorMessage(() => 'Relations are already excluded by default and can not be specified in "omit".');
          break;
        case "InvalidFieldValue":
          r.arguments.getDeepFieldValue([o.modelKey, o.fieldName])?.markAsError(), r.addErrorMessage(() => "Omit field option value must be a boolean.");
          break;
      }
      let { message: n, args: i } = Sr(r, "colorless");
      return `Error validating "omit" option:

${i}

${n}`;
    }
    __name(Qu, "Qu");
    u();
    c();
    p();
    m();
    d();
    l();
    function _s(t) {
      return t.length === 0 ? Promise.resolve([]) : new Promise((e, r) => {
        let n = new Array(t.length), i = null, o = false, s = 0, a = /* @__PURE__ */ __name(() => {
          o || (s++, s === t.length && (o = true, i ? r(i) : e(n)));
        }, "a"), f = /* @__PURE__ */ __name((v) => {
          o || (o = true, r(v));
        }, "f");
        for (let v = 0; v < t.length; v++) t[v].then((R) => {
          n[v] = R, a();
        }, (R) => {
          if (!jr(R)) {
            f(R);
            return;
          }
          R.batchRequestIdx === v ? f(R) : (i || (i = R), a());
        });
      });
    }
    __name(_s, "_s");
    var De = j("prisma:client");
    typeof globalThis == "object" && (globalThis.NODE_CLIENT = true);
    var Gu = { requestArgsToMiddlewareArgs: /* @__PURE__ */ __name((t) => t, "requestArgsToMiddlewareArgs"), middlewareArgsToRequestArgs: /* @__PURE__ */ __name((t) => t, "middlewareArgsToRequestArgs") };
    var Ju = /* @__PURE__ */ Symbol.for("prisma.client.transaction.id");
    var Wu = { id: 0, nextId() {
      return ++this.id;
    } };
    function Fs(t) {
      class e {
        static {
          __name(this, "e");
        }
        _originalClient = this;
        _runtimeDataModel;
        _requestHandler;
        _connectionPromise;
        _disconnectionPromise;
        _engineConfig;
        _accelerateEngineConfig;
        _clientVersion;
        _errorFormat;
        _tracingHelper;
        _previewFeatures;
        _activeProvider;
        _globalOmit;
        _extensions;
        _engine;
        _appliedParent;
        _createPrismaPromise = Gn();
        constructor(n) {
          t = n?.__internal?.configOverride?.(t) ?? t, Jo(t), n && ks(n, t);
          let i = new Fr().on("error", () => {
          });
          this._extensions = rt.empty(), this._previewFeatures = us(t), this._clientVersion = t.clientVersion ?? As, this._activeProvider = t.activeProvider, this._globalOmit = n?.omit, this._tracingHelper = ws();
          let o = t.relativeEnvPaths && { rootEnvPath: t.relativeEnvPaths.rootEnvPath && cr.resolve(t.dirname, t.relativeEnvPaths.rootEnvPath), schemaEnvPath: t.relativeEnvPaths.schemaEnvPath && cr.resolve(t.dirname, t.relativeEnvPaths.schemaEnvPath) }, s;
          if (n?.adapter) {
            s = n.adapter;
            let f = t.activeProvider === "postgresql" || t.activeProvider === "cockroachdb" ? "postgres" : t.activeProvider;
            if (s.provider !== f) throw new M(`The Driver Adapter \`${s.adapterName}\`, based on \`${s.provider}\`, is not compatible with the provider \`${f}\` specified in the Prisma schema.`, this._clientVersion);
            if (n.datasources || n.datasourceUrl !== void 0) throw new M("Custom datasource configuration is not compatible with Prisma Driver Adapters. Please define the database connection string directly in the Driver Adapter configuration.", this._clientVersion);
          }
          let a = t.injectableEdgeEnv?.();
          try {
            let f = n ?? {}, v = f.__internal ?? {}, R = v.debug === true;
            R && j.enable("prisma:client");
            let A = cr.resolve(t.dirname, t.relativePath);
            Pi.existsSync(A) || (A = t.dirname), De("dirname", t.dirname), De("relativePath", t.relativePath), De("cwd", A);
            let I = v.engine || {};
            if (f.errorFormat ? this._errorFormat = f.errorFormat : g.env.NODE_ENV === "production" ? this._errorFormat = "minimal" : g.env.NO_COLOR ? this._errorFormat = "colorless" : this._errorFormat = "colorless", this._runtimeDataModel = t.runtimeDataModel, this._engineConfig = { cwd: A, dirname: t.dirname, enableDebugLogs: R, allowTriggerPanic: I.allowTriggerPanic, prismaPath: I.binaryPath ?? void 0, engineEndpoint: I.endpoint, generator: t.generator, showColors: this._errorFormat === "pretty", logLevel: f.log && Ps(f.log), logQueries: f.log && !!(typeof f.log == "string" ? f.log === "query" : f.log.find((C) => typeof C == "string" ? C === "query" : C.level === "query")), env: a?.parsed ?? {}, flags: [], engineWasm: t.engineWasm, compilerWasm: t.compilerWasm, clientVersion: t.clientVersion, engineVersion: t.engineVersion, previewFeatures: this._previewFeatures, activeProvider: t.activeProvider, inlineSchema: t.inlineSchema, overrideDatasources: Wo(f, t.datasourceNames), inlineDatasources: t.inlineDatasources, inlineSchemaHash: t.inlineSchemaHash, tracingHelper: this._tracingHelper, transactionOptions: { maxWait: f.transactionOptions?.maxWait ?? 2e3, timeout: f.transactionOptions?.timeout ?? 5e3, isolationLevel: f.transactionOptions?.isolationLevel }, logEmitter: i, isBundled: t.isBundled, adapter: s }, this._accelerateEngineConfig = { ...this._engineConfig, accelerateUtils: { resolveDatasourceUrl: ct, getBatchRequestPayload: ot, prismaGraphQLToJSError: st, PrismaClientUnknownRequestError: Q, PrismaClientInitializationError: M, PrismaClientKnownRequestError: X, debug: j("prisma:client:accelerateEngine"), engineVersion: Ls.version, clientVersion: t.clientVersion } }, De("clientVersion", t.clientVersion), this._engine = ls(t, this._engineConfig), this._requestHandler = new Jr(this, i), f.log) for (let C of f.log) {
              let L = typeof C == "string" ? C : C.emit === "stdout" ? C.level : null;
              L && this.$on(L, (D) => {
                Pt.log(`${Pt.tags[L] ?? ""}`, D.message || D.query);
              });
            }
          } catch (f) {
            throw f.clientVersion = this._clientVersion, f;
          }
          return this._appliedParent = Ut(this);
        }
        get [Symbol.toStringTag]() {
          return "PrismaClient";
        }
        $on(n, i) {
          return n === "beforeExit" ? this._engine.onBeforeExit(i) : n && this._engineConfig.logEmitter.on(n, i), this;
        }
        $connect() {
          try {
            return this._engine.start();
          } catch (n) {
            throw n.clientVersion = this._clientVersion, n;
          }
        }
        async $disconnect() {
          try {
            await this._engine.stop();
          } catch (n) {
            throw n.clientVersion = this._clientVersion, n;
          } finally {
            xi();
          }
        }
        $executeRawInternal(n, i, o, s) {
          let a = this._activeProvider;
          return this._request({ action: "executeRaw", args: o, transaction: n, clientMethod: i, argsMapper: Qn({ clientMethod: i, activeProvider: a }), callsite: Ie(this._errorFormat), dataPath: [], middlewareArgsMapper: s });
        }
        $executeRaw(n, ...i) {
          return this._createPrismaPromise((o) => {
            if (n.raw !== void 0 || n.sql !== void 0) {
              let [s, a] = Ms(n, i);
              return jn(this._activeProvider, s.text, s.values, Array.isArray(n) ? "prisma.$executeRaw`<SQL>`" : "prisma.$executeRaw(sql`<SQL>`)"), this.$executeRawInternal(o, "$executeRaw", s, a);
            }
            throw new Y("`$executeRaw` is a tag function, please use it like the following:\n```\nconst result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`\n```\n\nOr read our docs at https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#executeraw\n", { clientVersion: this._clientVersion });
          });
        }
        $executeRawUnsafe(n, ...i) {
          return this._createPrismaPromise((o) => (jn(this._activeProvider, n, i, "prisma.$executeRawUnsafe(<SQL>, [...values])"), this.$executeRawInternal(o, "$executeRawUnsafe", [n, ...i])));
        }
        $runCommandRaw(n) {
          if (t.activeProvider !== "mongodb") throw new Y(`The ${t.activeProvider} provider does not support $runCommandRaw. Use the mongodb provider.`, { clientVersion: this._clientVersion });
          return this._createPrismaPromise((i) => this._request({ args: n, clientMethod: "$runCommandRaw", dataPath: [], action: "runCommandRaw", argsMapper: cs, callsite: Ie(this._errorFormat), transaction: i }));
        }
        async $queryRawInternal(n, i, o, s) {
          let a = this._activeProvider;
          return this._request({ action: "queryRaw", args: o, transaction: n, clientMethod: i, argsMapper: Qn({ clientMethod: i, activeProvider: a }), callsite: Ie(this._errorFormat), dataPath: [], middlewareArgsMapper: s });
        }
        $queryRaw(n, ...i) {
          return this._createPrismaPromise((o) => {
            if (n.raw !== void 0 || n.sql !== void 0) return this.$queryRawInternal(o, "$queryRaw", ...Ms(n, i));
            throw new Y("`$queryRaw` is a tag function, please use it like the following:\n```\nconst result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`\n```\n\nOr read our docs at https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#queryraw\n", { clientVersion: this._clientVersion });
          });
        }
        $queryRawTyped(n) {
          return this._createPrismaPromise((i) => {
            if (!this._hasPreviewFlag("typedSql")) throw new Y("`typedSql` preview feature must be enabled in order to access $queryRawTyped API", { clientVersion: this._clientVersion });
            return this.$queryRawInternal(i, "$queryRawTyped", n);
          });
        }
        $queryRawUnsafe(n, ...i) {
          return this._createPrismaPromise((o) => this.$queryRawInternal(o, "$queryRawUnsafe", [n, ...i]));
        }
        _transactionWithArray({ promises: n, options: i }) {
          let o = Wu.nextId(), s = xs(n.length), a = n.map((f, v) => {
            if (f?.[Symbol.toStringTag] !== "PrismaPromise") throw new Error("All elements of the array need to be Prisma Client promises. Hint: Please make sure you are not awaiting the Prisma client calls you intended to pass in the $transaction function.");
            let R = i?.isolationLevel ?? this._engineConfig.transactionOptions.isolationLevel, A = { kind: "batch", id: o, index: v, isolationLevel: R, lock: s };
            return f.requestTransaction?.(A) ?? f;
          });
          return _s(a);
        }
        async _transactionWithCallback({ callback: n, options: i }) {
          let o = { traceparent: this._tracingHelper.getTraceParent() }, s = { maxWait: i?.maxWait ?? this._engineConfig.transactionOptions.maxWait, timeout: i?.timeout ?? this._engineConfig.transactionOptions.timeout, isolationLevel: i?.isolationLevel ?? this._engineConfig.transactionOptions.isolationLevel }, a = await this._engine.transaction("start", o, s), f;
          try {
            let v = { kind: "itx", ...a };
            f = await n(this._createItxClient(v)), await this._engine.transaction("commit", o, a);
          } catch (v) {
            throw await this._engine.transaction("rollback", o, a).catch(() => {
            }), v;
          }
          return f;
        }
        _createItxClient(n) {
          return ce(Ut(ce(Oo(this), [Z("_appliedParent", () => this._appliedParent._createItxClient(n)), Z("_createPrismaPromise", () => Gn(n)), Z(Ju, () => n.id)])), [it(Fo)]);
        }
        $transaction(n, i) {
          let o;
          typeof n == "function" ? this._engineConfig.adapter?.adapterName === "@prisma/adapter-d1" ? o = /* @__PURE__ */ __name(() => {
            throw new Error("Cloudflare D1 does not support interactive transactions. We recommend you to refactor your queries with that limitation in mind, and use batch transactions with `prisma.$transactions([])` where applicable.");
          }, "o") : o = /* @__PURE__ */ __name(() => this._transactionWithCallback({ callback: n, options: i }), "o") : o = /* @__PURE__ */ __name(() => this._transactionWithArray({ promises: n, options: i }), "o");
          let s = { name: "transaction", attributes: { method: "$transaction" } };
          return this._tracingHelper.runInChildSpan(s, o);
        }
        _request(n) {
          n.otelParentCtx = this._tracingHelper.getActiveContext();
          let i = n.middlewareArgsMapper ?? Gu, o = { args: i.requestArgsToMiddlewareArgs(n.args), dataPath: n.dataPath, runInTransaction: !!n.transaction, action: n.action, model: n.model }, s = { operation: { name: "operation", attributes: { method: o.action, model: o.model, name: o.model ? `${o.model}.${o.action}` : o.action } } }, a = /* @__PURE__ */ __name(async (f) => {
            let { runInTransaction: v, args: R, ...A } = f, I = { ...n, ...A };
            R && (I.args = i.middlewareArgsToRequestArgs(R)), n.transaction !== void 0 && v === false && delete I.transaction;
            let C = await Vo(this, I);
            return I.model ? Lo({ result: C, modelName: I.model, args: I.args, extensions: this._extensions, runtimeDataModel: this._runtimeDataModel, globalOmit: this._globalOmit }) : C;
          }, "a");
          return this._tracingHelper.runInChildSpan(s.operation, () => a(o));
        }
        async _executeRequest({ args: n, clientMethod: i, dataPath: o, callsite: s, action: a, model: f, argsMapper: v, transaction: R, unpacker: A, otelParentCtx: I, customDataProxyFetch: C }) {
          try {
            n = v ? v(n) : n;
            let L = { name: "serialize" }, D = this._tracingHelper.runInChildSpan(L, () => _r({ modelName: f, runtimeDataModel: this._runtimeDataModel, action: a, args: n, clientMethod: i, callsite: s, extensions: this._extensions, errorFormat: this._errorFormat, clientVersion: this._clientVersion, previewFeatures: this._previewFeatures, globalOmit: this._globalOmit }));
            return j.enabled("prisma:client") && (De("Prisma Client call:"), De(`prisma.${i}(${xo(n)})`), De("Generated request:"), De(JSON.stringify(D, null, 2) + `
`)), R?.kind === "batch" && await R.lock, this._requestHandler.request({ protocolQuery: D, modelName: f, action: a, clientMethod: i, dataPath: o, callsite: s, args: n, extensions: this._extensions, transaction: R, unpacker: A, otelParentCtx: I, otelChildCtx: this._tracingHelper.getActiveContext(), globalOmit: this._globalOmit, customDataProxyFetch: C });
          } catch (L) {
            throw L.clientVersion = this._clientVersion, L;
          }
        }
        $metrics = new nt(this);
        _hasPreviewFlag(n) {
          return !!this._engineConfig.previewFeatures?.includes(n);
        }
        $applyPendingMigrations() {
          return this._engine.applyPendingMigrations();
        }
        $extends = ko;
      }
      return e;
    }
    __name(Fs, "Fs");
    function Ms(t, e) {
      return Ku(t) ? [new ne(t, e), hs] : [t, bs];
    }
    __name(Ms, "Ms");
    function Ku(t) {
      return Array.isArray(t) && Array.isArray(t.raw);
    }
    __name(Ku, "Ku");
    u();
    c();
    p();
    m();
    d();
    l();
    var Hu = /* @__PURE__ */ new Set(["toJSON", "$$typeof", "asymmetricMatch", Symbol.iterator, Symbol.toStringTag, Symbol.isConcatSpreadable, Symbol.toPrimitive]);
    function Ns(t) {
      return new Proxy(t, { get(e, r) {
        if (r in e) return e[r];
        if (!Hu.has(r)) throw new TypeError(`Invalid enum value: ${String(r)}`);
      } });
    }
    __name(Ns, "Ns");
    u();
    c();
    p();
    m();
    d();
    l();
    l();
  }
});

// node_modules/.prisma/client/query_engine_bg.js
var require_query_engine_bg = __commonJS({
  "node_modules/.prisma/client/query_engine_bg.js"(exports, module) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var F = Object.defineProperty;
    var B = Object.getOwnPropertyDescriptor;
    var R = Object.getOwnPropertyNames;
    var U = Object.prototype.hasOwnProperty;
    var L = /* @__PURE__ */ __name((e, t) => {
      for (var n in t) F(e, n, { get: t[n], enumerable: true });
    }, "L");
    var N = /* @__PURE__ */ __name((e, t, n, _) => {
      if (t && typeof t == "object" || typeof t == "function") for (let o of R(t)) !U.call(e, o) && o !== n && F(e, o, { get: /* @__PURE__ */ __name(() => t[o], "get"), enumerable: !(_ = B(t, o)) || _.enumerable });
      return e;
    }, "N");
    var C = /* @__PURE__ */ __name((e) => N(F({}, "__esModule", { value: true }), e), "C");
    var qt = {};
    L(qt, { QueryEngine: /* @__PURE__ */ __name(() => E, "QueryEngine"), __wbg_Error_e83987f665cf5504: /* @__PURE__ */ __name(() => J, "__wbg_Error_e83987f665cf5504"), __wbg_Number_bb48ca12f395cd08: /* @__PURE__ */ __name(() => X, "__wbg_Number_bb48ca12f395cd08"), __wbg_String_8f0eb39a4a4c2f66: /* @__PURE__ */ __name(() => Y, "__wbg_String_8f0eb39a4a4c2f66"), __wbg___wbindgen_bigint_get_as_i64_f3ebc5a755000afd: /* @__PURE__ */ __name(() => K, "__wbg___wbindgen_bigint_get_as_i64_f3ebc5a755000afd"), __wbg___wbindgen_boolean_get_6d5a1ee65bab5f68: /* @__PURE__ */ __name(() => Z, "__wbg___wbindgen_boolean_get_6d5a1ee65bab5f68"), __wbg___wbindgen_debug_string_df47ffb5e35e6763: /* @__PURE__ */ __name(() => ee, "__wbg___wbindgen_debug_string_df47ffb5e35e6763"), __wbg___wbindgen_in_bb933bd9e1b3bc0f: /* @__PURE__ */ __name(() => te, "__wbg___wbindgen_in_bb933bd9e1b3bc0f"), __wbg___wbindgen_is_bigint_cb320707dcd35f0b: /* @__PURE__ */ __name(() => ne, "__wbg___wbindgen_is_bigint_cb320707dcd35f0b"), __wbg___wbindgen_is_function_ee8a6c5833c90377: /* @__PURE__ */ __name(() => re, "__wbg___wbindgen_is_function_ee8a6c5833c90377"), __wbg___wbindgen_is_object_c818261d21f283a4: /* @__PURE__ */ __name(() => _e, "__wbg___wbindgen_is_object_c818261d21f283a4"), __wbg___wbindgen_is_string_fbb76cb2940daafd: /* @__PURE__ */ __name(() => oe, "__wbg___wbindgen_is_string_fbb76cb2940daafd"), __wbg___wbindgen_is_undefined_2d472862bd29a478: /* @__PURE__ */ __name(() => ce, "__wbg___wbindgen_is_undefined_2d472862bd29a478"), __wbg___wbindgen_jsval_eq_6b13ab83478b1c50: /* @__PURE__ */ __name(() => ie, "__wbg___wbindgen_jsval_eq_6b13ab83478b1c50"), __wbg___wbindgen_jsval_loose_eq_b664b38a2f582147: /* @__PURE__ */ __name(() => se, "__wbg___wbindgen_jsval_loose_eq_b664b38a2f582147"), __wbg___wbindgen_number_get_a20bf9b85341449d: /* @__PURE__ */ __name(() => ue, "__wbg___wbindgen_number_get_a20bf9b85341449d"), __wbg___wbindgen_string_get_e4f06c90489ad01b: /* @__PURE__ */ __name(() => be, "__wbg___wbindgen_string_get_e4f06c90489ad01b"), __wbg___wbindgen_throw_b855445ff6a94295: /* @__PURE__ */ __name(() => fe, "__wbg___wbindgen_throw_b855445ff6a94295"), __wbg__wbg_cb_unref_2454a539ea5790d9: /* @__PURE__ */ __name(() => ae, "__wbg__wbg_cb_unref_2454a539ea5790d9"), __wbg_call_525440f72fbfc0ea: /* @__PURE__ */ __name(() => ge, "__wbg_call_525440f72fbfc0ea"), __wbg_call_e762c39fa8ea36bf: /* @__PURE__ */ __name(() => le, "__wbg_call_e762c39fa8ea36bf"), __wbg_crypto_805be4ce92f1e370: /* @__PURE__ */ __name(() => de, "__wbg_crypto_805be4ce92f1e370"), __wbg_done_2042aa2670fb1db1: /* @__PURE__ */ __name(() => we, "__wbg_done_2042aa2670fb1db1"), __wbg_entries_e171b586f8f6bdbf: /* @__PURE__ */ __name(() => pe, "__wbg_entries_e171b586f8f6bdbf"), __wbg_getRandomValues_f6a868620c8bab49: /* @__PURE__ */ __name(() => xe, "__wbg_getRandomValues_f6a868620c8bab49"), __wbg_getTime_14776bfb48a1bff9: /* @__PURE__ */ __name(() => ye, "__wbg_getTime_14776bfb48a1bff9"), __wbg_get_7bed016f185add81: /* @__PURE__ */ __name(() => me, "__wbg_get_7bed016f185add81"), __wbg_get_ece95cf6585650d9: /* @__PURE__ */ __name(() => he, "__wbg_get_ece95cf6585650d9"), __wbg_get_efcb449f58ec27c2: /* @__PURE__ */ __name(() => Te, "__wbg_get_efcb449f58ec27c2"), __wbg_get_with_ref_key_1dc361bd10053bfe: /* @__PURE__ */ __name(() => Ae, "__wbg_get_with_ref_key_1dc361bd10053bfe"), __wbg_has_787fafc980c3ccdb: /* @__PURE__ */ __name(() => Se, "__wbg_has_787fafc980c3ccdb"), __wbg_instanceof_ArrayBuffer_70beb1189ca63b38: /* @__PURE__ */ __name(() => Fe, "__wbg_instanceof_ArrayBuffer_70beb1189ca63b38"), __wbg_instanceof_Map_8579b5e2ab5437c7: /* @__PURE__ */ __name(() => Ie, "__wbg_instanceof_Map_8579b5e2ab5437c7"), __wbg_instanceof_Promise_001fdd42afa1b7ef: /* @__PURE__ */ __name(() => qe, "__wbg_instanceof_Promise_001fdd42afa1b7ef"), __wbg_instanceof_Uint8Array_20c8e73002f7af98: /* @__PURE__ */ __name(() => ke, "__wbg_instanceof_Uint8Array_20c8e73002f7af98"), __wbg_isArray_96e0af9891d0945d: /* @__PURE__ */ __name(() => Ee, "__wbg_isArray_96e0af9891d0945d"), __wbg_isSafeInteger_d216eda7911dde36: /* @__PURE__ */ __name(() => Oe, "__wbg_isSafeInteger_d216eda7911dde36"), __wbg_iterator_e5822695327a3c39: /* @__PURE__ */ __name(() => Me, "__wbg_iterator_e5822695327a3c39"), __wbg_keys_b4d27b02ad14f4be: /* @__PURE__ */ __name(() => ve, "__wbg_keys_b4d27b02ad14f4be"), __wbg_length_69bca3cb64fc8748: /* @__PURE__ */ __name(() => De, "__wbg_length_69bca3cb64fc8748"), __wbg_length_cdd215e10d9dd507: /* @__PURE__ */ __name(() => je, "__wbg_length_cdd215e10d9dd507"), __wbg_msCrypto_2ac4d17c4748234a: /* @__PURE__ */ __name(() => Be, "__wbg_msCrypto_2ac4d17c4748234a"), __wbg_new_0_f9740686d739025c: /* @__PURE__ */ __name(() => Re, "__wbg_new_0_f9740686d739025c"), __wbg_new_1acc0b6eea89d040: /* @__PURE__ */ __name(() => Ue, "__wbg_new_1acc0b6eea89d040"), __wbg_new_3c3d849046688a66: /* @__PURE__ */ __name(() => Le, "__wbg_new_3c3d849046688a66"), __wbg_new_5a79be3ab53b8aa5: /* @__PURE__ */ __name(() => Ne, "__wbg_new_5a79be3ab53b8aa5"), __wbg_new_68651c719dcda04e: /* @__PURE__ */ __name(() => Ce, "__wbg_new_68651c719dcda04e"), __wbg_new_e17d9f43105b08be: /* @__PURE__ */ __name(() => $e, "__wbg_new_e17d9f43105b08be"), __wbg_new_from_slice_92f4d78ca282a2d2: /* @__PURE__ */ __name(() => Ve, "__wbg_new_from_slice_92f4d78ca282a2d2"), __wbg_new_no_args_ee98eee5275000a4: /* @__PURE__ */ __name(() => We, "__wbg_new_no_args_ee98eee5275000a4"), __wbg_new_with_length_01aa0dc35aa13543: /* @__PURE__ */ __name(() => ze, "__wbg_new_with_length_01aa0dc35aa13543"), __wbg_next_020810e0ae8ebcb0: /* @__PURE__ */ __name(() => Pe, "__wbg_next_020810e0ae8ebcb0"), __wbg_next_2c826fe5dfec6b6a: /* @__PURE__ */ __name(() => Ge, "__wbg_next_2c826fe5dfec6b6a"), __wbg_node_ecc8306b9857f33d: /* @__PURE__ */ __name(() => Qe, "__wbg_node_ecc8306b9857f33d"), __wbg_now_793306c526e2e3b6: /* @__PURE__ */ __name(() => He, "__wbg_now_793306c526e2e3b6"), __wbg_now_7fd00a794a07d388: /* @__PURE__ */ __name(() => Je, "__wbg_now_7fd00a794a07d388"), __wbg_now_b3f7572f6ef3d3a9: /* @__PURE__ */ __name(() => Xe, "__wbg_now_b3f7572f6ef3d3a9"), __wbg_process_5cff2739921be718: /* @__PURE__ */ __name(() => Ye, "__wbg_process_5cff2739921be718"), __wbg_prototypesetcall_2a6620b6922694b2: /* @__PURE__ */ __name(() => Ke, "__wbg_prototypesetcall_2a6620b6922694b2"), __wbg_push_df81a39d04db858c: /* @__PURE__ */ __name(() => Ze, "__wbg_push_df81a39d04db858c"), __wbg_queueMicrotask_5a8a9131f3f0b37b: /* @__PURE__ */ __name(() => et, "__wbg_queueMicrotask_5a8a9131f3f0b37b"), __wbg_queueMicrotask_6d79674585219521: /* @__PURE__ */ __name(() => tt, "__wbg_queueMicrotask_6d79674585219521"), __wbg_randomFillSync_d3c85af7e31cf1f8: /* @__PURE__ */ __name(() => nt, "__wbg_randomFillSync_d3c85af7e31cf1f8"), __wbg_require_0c566c6f2eef6c79: /* @__PURE__ */ __name(() => rt, "__wbg_require_0c566c6f2eef6c79"), __wbg_resolve_caf97c30b83f7053: /* @__PURE__ */ __name(() => _t, "__wbg_resolve_caf97c30b83f7053"), __wbg_setTimeout_5d6a1d4fc51ea450: /* @__PURE__ */ __name(() => ot, "__wbg_setTimeout_5d6a1d4fc51ea450"), __wbg_set_3f1d0b984ed272ed: /* @__PURE__ */ __name(() => ct, "__wbg_set_3f1d0b984ed272ed"), __wbg_set_907fb406c34a251d: /* @__PURE__ */ __name(() => it, "__wbg_set_907fb406c34a251d"), __wbg_set_c213c871859d6500: /* @__PURE__ */ __name(() => st, "__wbg_set_c213c871859d6500"), __wbg_set_c2abbebe8b9ebee1: /* @__PURE__ */ __name(() => ut, "__wbg_set_c2abbebe8b9ebee1"), __wbg_set_wasm: /* @__PURE__ */ __name(() => $3, "__wbg_set_wasm"), __wbg_static_accessor_GLOBAL_89e1d9ac6a1b250e: /* @__PURE__ */ __name(() => bt, "__wbg_static_accessor_GLOBAL_89e1d9ac6a1b250e"), __wbg_static_accessor_GLOBAL_THIS_8b530f326a9e48ac: /* @__PURE__ */ __name(() => ft, "__wbg_static_accessor_GLOBAL_THIS_8b530f326a9e48ac"), __wbg_static_accessor_SELF_6fdf4b64710cc91b: /* @__PURE__ */ __name(() => at, "__wbg_static_accessor_SELF_6fdf4b64710cc91b"), __wbg_static_accessor_WINDOW_b45bfc5a37f6cfa2: /* @__PURE__ */ __name(() => gt, "__wbg_static_accessor_WINDOW_b45bfc5a37f6cfa2"), __wbg_subarray_480600f3d6a9f26c: /* @__PURE__ */ __name(() => lt, "__wbg_subarray_480600f3d6a9f26c"), __wbg_then_4f46f6544e6b4a28: /* @__PURE__ */ __name(() => dt, "__wbg_then_4f46f6544e6b4a28"), __wbg_then_70d05cf780a18d77: /* @__PURE__ */ __name(() => wt, "__wbg_then_70d05cf780a18d77"), __wbg_valueOf_9eee4828c11458ca: /* @__PURE__ */ __name(() => pt, "__wbg_valueOf_9eee4828c11458ca"), __wbg_value_692627309814bb8c: /* @__PURE__ */ __name(() => xt, "__wbg_value_692627309814bb8c"), __wbg_versions_a8e5a362e1f16442: /* @__PURE__ */ __name(() => yt, "__wbg_versions_a8e5a362e1f16442"), __wbindgen_cast_126e48f66237b479: /* @__PURE__ */ __name(() => mt, "__wbindgen_cast_126e48f66237b479"), __wbindgen_cast_2241b6af4c4b2941: /* @__PURE__ */ __name(() => ht, "__wbindgen_cast_2241b6af4c4b2941"), __wbindgen_cast_4625c577ab2ec9ee: /* @__PURE__ */ __name(() => Tt, "__wbindgen_cast_4625c577ab2ec9ee"), __wbindgen_cast_9ae0607507abb057: /* @__PURE__ */ __name(() => At, "__wbindgen_cast_9ae0607507abb057"), __wbindgen_cast_cb9088102bce6b30: /* @__PURE__ */ __name(() => St, "__wbindgen_cast_cb9088102bce6b30"), __wbindgen_cast_d6cd19b81560fd6e: /* @__PURE__ */ __name(() => Ft, "__wbindgen_cast_d6cd19b81560fd6e"), __wbindgen_init_externref_table: /* @__PURE__ */ __name(() => It, "__wbindgen_init_externref_table"), debug_panic: /* @__PURE__ */ __name(() => P, "debug_panic"), getBuildTimeInfo: /* @__PURE__ */ __name(() => G, "getBuildTimeInfo") });
    module.exports = C(qt);
    var h = /* @__PURE__ */ __name(() => {
    }, "h");
    h.prototype = h;
    var r;
    function $3(e) {
      r = e;
    }
    __name($3, "$");
    var T = null;
    function p() {
      return (T === null || T.byteLength === 0) && (T = new Uint8Array(r.memory.buffer)), T;
    }
    __name(p, "p");
    var A = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
    A.decode();
    var V = 2146435072;
    var I = 0;
    function W(e, t) {
      return I += t, I >= V && (A = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }), A.decode(), I = t), A.decode(p().subarray(e, e + t));
    }
    __name(W, "W");
    function S(e, t) {
      return e = e >>> 0, W(e, t);
    }
    __name(S, "S");
    var u = 0;
    var x = new TextEncoder();
    "encodeInto" in x || (x.encodeInto = function(e, t) {
      const n = x.encode(e);
      return t.set(n), { read: e.length, written: n.length };
    });
    function b(e, t, n) {
      if (n === void 0) {
        const s = x.encode(e), f = t(s.length, 1) >>> 0;
        return p().subarray(f, f + s.length).set(s), u = s.length, f;
      }
      let _ = e.length, o = t(_, 1) >>> 0;
      const i = p();
      let c = 0;
      for (; c < _; c++) {
        const s = e.charCodeAt(c);
        if (s > 127) break;
        i[o + c] = s;
      }
      if (c !== _) {
        c !== 0 && (e = e.slice(c)), o = n(o, _, _ = c + e.length * 3, 1) >>> 0;
        const s = p().subarray(o + c, o + _), f = x.encodeInto(e, s);
        c += f.written, o = n(o, _, c, 1) >>> 0;
      }
      return u = c, o;
    }
    __name(b, "b");
    var w = null;
    function l() {
      return (w === null || w.buffer.detached === true || w.buffer.detached === void 0 && w.buffer !== r.memory.buffer) && (w = new DataView(r.memory.buffer)), w;
    }
    __name(l, "l");
    function a(e) {
      return e == null;
    }
    __name(a, "a");
    function q(e) {
      const t = typeof e;
      if (t == "number" || t == "boolean" || e == null) return `${e}`;
      if (t == "string") return `"${e}"`;
      if (t == "symbol") {
        const o = e.description;
        return o == null ? "Symbol" : `Symbol(${o})`;
      }
      if (t == "function") {
        const o = e.name;
        return typeof o == "string" && o.length > 0 ? `Function(${o})` : "Function";
      }
      if (Array.isArray(e)) {
        const o = e.length;
        let i = "[";
        o > 0 && (i += q(e[0]));
        for (let c = 1; c < o; c++) i += ", " + q(e[c]);
        return i += "]", i;
      }
      const n = /\[object ([^\]]+)\]/.exec(toString.call(e));
      let _;
      if (n && n.length > 1) _ = n[1];
      else return toString.call(e);
      if (_ == "Object") try {
        return "Object(" + JSON.stringify(e) + ")";
      } catch {
        return "Object";
      }
      return e instanceof Error ? `${e.name}: ${e.message}
${e.stack}` : _;
    }
    __name(q, "q");
    function y(e) {
      const t = r.__externref_table_alloc();
      return r.__wbindgen_externrefs.set(t, e), t;
    }
    __name(y, "y");
    function g(e, t) {
      try {
        return e.apply(this, t);
      } catch (n) {
        const _ = y(n);
        r.__wbindgen_exn_store(_);
      }
    }
    __name(g, "g");
    function k(e, t) {
      return e = e >>> 0, p().subarray(e / 1, e / 1 + t);
    }
    __name(k, "k");
    var O = typeof FinalizationRegistry > "u" ? { register: /* @__PURE__ */ __name(() => {
    }, "register"), unregister: /* @__PURE__ */ __name(() => {
    }, "unregister") } : new FinalizationRegistry((e) => e.dtor(e.a, e.b));
    function z(e, t, n, _) {
      const o = { a: e, b: t, cnt: 1, dtor: n }, i = /* @__PURE__ */ __name((...c) => {
        o.cnt++;
        const s = o.a;
        o.a = 0;
        try {
          return _(s, o.b, ...c);
        } finally {
          o.a = s, i._wbg_cb_unref();
        }
      }, "i");
      return i._wbg_cb_unref = () => {
        --o.cnt === 0 && (o.dtor(o.a, o.b), o.a = 0, O.unregister(o));
      }, O.register(i, o, o), i;
    }
    __name(z, "z");
    function M(e) {
      const t = r.__wbindgen_externrefs.get(e);
      return r.__externref_table_dealloc(e), t;
    }
    __name(M, "M");
    function P(e) {
      var t = a(e) ? 0 : b(e, r.__wbindgen_malloc, r.__wbindgen_realloc), n = u;
      const _ = r.debug_panic(t, n);
      if (_[1]) throw M(_[0]);
    }
    __name(P, "P");
    function G() {
      return r.getBuildTimeInfo();
    }
    __name(G, "G");
    function Q(e, t, n) {
      r.wasm_bindgen__convert__closures_____invoke__ha235f3ea55a06a09(e, t, n);
    }
    __name(Q, "Q");
    function H(e, t, n, _) {
      r.wasm_bindgen__convert__closures_____invoke__h1a2f20be69ab8911(e, t, n, _);
    }
    __name(H, "H");
    var v = typeof FinalizationRegistry > "u" ? { register: /* @__PURE__ */ __name(() => {
    }, "register"), unregister: /* @__PURE__ */ __name(() => {
    }, "unregister") } : new FinalizationRegistry((e) => r.__wbg_queryengine_free(e >>> 0, 1));
    var E = class {
      static {
        __name(this, "E");
      }
      __destroy_into_raw() {
        const t = this.__wbg_ptr;
        return this.__wbg_ptr = 0, v.unregister(this), t;
      }
      free() {
        const t = this.__destroy_into_raw();
        r.__wbg_queryengine_free(t, 0);
      }
      disconnect(t, n) {
        const _ = b(t, r.__wbindgen_malloc, r.__wbindgen_realloc), o = u, i = b(n, r.__wbindgen_malloc, r.__wbindgen_realloc), c = u;
        return r.queryengine_disconnect(this.__wbg_ptr, _, o, i, c);
      }
      startTransaction(t, n, _) {
        const o = b(t, r.__wbindgen_malloc, r.__wbindgen_realloc), i = u, c = b(n, r.__wbindgen_malloc, r.__wbindgen_realloc), s = u, f = b(_, r.__wbindgen_malloc, r.__wbindgen_realloc), d = u;
        return r.queryengine_startTransaction(this.__wbg_ptr, o, i, c, s, f, d);
      }
      commitTransaction(t, n, _) {
        const o = b(t, r.__wbindgen_malloc, r.__wbindgen_realloc), i = u, c = b(n, r.__wbindgen_malloc, r.__wbindgen_realloc), s = u, f = b(_, r.__wbindgen_malloc, r.__wbindgen_realloc), d = u;
        return r.queryengine_commitTransaction(this.__wbg_ptr, o, i, c, s, f, d);
      }
      rollbackTransaction(t, n, _) {
        const o = b(t, r.__wbindgen_malloc, r.__wbindgen_realloc), i = u, c = b(n, r.__wbindgen_malloc, r.__wbindgen_realloc), s = u, f = b(_, r.__wbindgen_malloc, r.__wbindgen_realloc), d = u;
        return r.queryengine_rollbackTransaction(this.__wbg_ptr, o, i, c, s, f, d);
      }
      constructor(t, n, _) {
        const o = r.queryengine_new(t, n, _);
        if (o[2]) throw M(o[1]);
        return this.__wbg_ptr = o[0] >>> 0, v.register(this, this.__wbg_ptr, this), this;
      }
      query(t, n, _, o) {
        const i = b(t, r.__wbindgen_malloc, r.__wbindgen_realloc), c = u, s = b(n, r.__wbindgen_malloc, r.__wbindgen_realloc), f = u;
        var d = a(_) ? 0 : b(_, r.__wbindgen_malloc, r.__wbindgen_realloc), m = u;
        const D = b(o, r.__wbindgen_malloc, r.__wbindgen_realloc), j = u;
        return r.queryengine_query(this.__wbg_ptr, i, c, s, f, d, m, D, j);
      }
      trace(t) {
        const n = b(t, r.__wbindgen_malloc, r.__wbindgen_realloc), _ = u;
        return r.queryengine_trace(this.__wbg_ptr, n, _);
      }
      connect(t, n) {
        const _ = b(t, r.__wbindgen_malloc, r.__wbindgen_realloc), o = u, i = b(n, r.__wbindgen_malloc, r.__wbindgen_realloc), c = u;
        return r.queryengine_connect(this.__wbg_ptr, _, o, i, c);
      }
      metrics(t) {
        const n = b(t, r.__wbindgen_malloc, r.__wbindgen_realloc), _ = u;
        return r.queryengine_metrics(this.__wbg_ptr, n, _);
      }
    };
    Symbol.dispose && (E.prototype[Symbol.dispose] = E.prototype.free);
    function J(e, t) {
      return Error(S(e, t));
    }
    __name(J, "J");
    function X(e) {
      return Number(e);
    }
    __name(X, "X");
    function Y(e, t) {
      const n = String(t), _ = b(n, r.__wbindgen_malloc, r.__wbindgen_realloc), o = u;
      l().setInt32(e + 4 * 1, o, true), l().setInt32(e + 4 * 0, _, true);
    }
    __name(Y, "Y");
    function K(e, t) {
      const n = t, _ = typeof n == "bigint" ? n : void 0;
      l().setBigInt64(e + 8 * 1, a(_) ? BigInt(0) : _, true), l().setInt32(e + 4 * 0, !a(_), true);
    }
    __name(K, "K");
    function Z(e) {
      const t = e, n = typeof t == "boolean" ? t : void 0;
      return a(n) ? 16777215 : n ? 1 : 0;
    }
    __name(Z, "Z");
    function ee(e, t) {
      const n = q(t), _ = b(n, r.__wbindgen_malloc, r.__wbindgen_realloc), o = u;
      l().setInt32(e + 4 * 1, o, true), l().setInt32(e + 4 * 0, _, true);
    }
    __name(ee, "ee");
    function te(e, t) {
      return e in t;
    }
    __name(te, "te");
    function ne(e) {
      return typeof e == "bigint";
    }
    __name(ne, "ne");
    function re(e) {
      return typeof e == "function";
    }
    __name(re, "re");
    function _e(e) {
      const t = e;
      return typeof t == "object" && t !== null;
    }
    __name(_e, "_e");
    function oe(e) {
      return typeof e == "string";
    }
    __name(oe, "oe");
    function ce(e) {
      return e === void 0;
    }
    __name(ce, "ce");
    function ie(e, t) {
      return e === t;
    }
    __name(ie, "ie");
    function se(e, t) {
      return e == t;
    }
    __name(se, "se");
    function ue(e, t) {
      const n = t, _ = typeof n == "number" ? n : void 0;
      l().setFloat64(e + 8 * 1, a(_) ? 0 : _, true), l().setInt32(e + 4 * 0, !a(_), true);
    }
    __name(ue, "ue");
    function be(e, t) {
      const n = t, _ = typeof n == "string" ? n : void 0;
      var o = a(_) ? 0 : b(_, r.__wbindgen_malloc, r.__wbindgen_realloc), i = u;
      l().setInt32(e + 4 * 1, i, true), l().setInt32(e + 4 * 0, o, true);
    }
    __name(be, "be");
    function fe(e, t) {
      throw new Error(S(e, t));
    }
    __name(fe, "fe");
    function ae(e) {
      e._wbg_cb_unref();
    }
    __name(ae, "ae");
    function ge() {
      return g(function(e, t, n) {
        return e.call(t, n);
      }, arguments);
    }
    __name(ge, "ge");
    function le() {
      return g(function(e, t) {
        return e.call(t);
      }, arguments);
    }
    __name(le, "le");
    function de(e) {
      return e.crypto;
    }
    __name(de, "de");
    function we(e) {
      return e.done;
    }
    __name(we, "we");
    function pe(e) {
      return Object.entries(e);
    }
    __name(pe, "pe");
    function xe() {
      return g(function(e, t) {
        e.getRandomValues(t);
      }, arguments);
    }
    __name(xe, "xe");
    function ye(e) {
      return e.getTime();
    }
    __name(ye, "ye");
    function me(e, t) {
      return e[t >>> 0];
    }
    __name(me, "me");
    function he() {
      return g(function(e, t) {
        return e[t];
      }, arguments);
    }
    __name(he, "he");
    function Te() {
      return g(function(e, t) {
        return Reflect.get(e, t);
      }, arguments);
    }
    __name(Te, "Te");
    function Ae(e, t) {
      return e[t];
    }
    __name(Ae, "Ae");
    function Se() {
      return g(function(e, t) {
        return Reflect.has(e, t);
      }, arguments);
    }
    __name(Se, "Se");
    function Fe(e) {
      let t;
      try {
        t = e instanceof ArrayBuffer;
      } catch {
        t = false;
      }
      return t;
    }
    __name(Fe, "Fe");
    function Ie(e) {
      let t;
      try {
        t = e instanceof Map;
      } catch {
        t = false;
      }
      return t;
    }
    __name(Ie, "Ie");
    function qe(e) {
      let t;
      try {
        t = e instanceof Promise;
      } catch {
        t = false;
      }
      return t;
    }
    __name(qe, "qe");
    function ke(e) {
      let t;
      try {
        t = e instanceof Uint8Array;
      } catch {
        t = false;
      }
      return t;
    }
    __name(ke, "ke");
    function Ee(e) {
      return Array.isArray(e);
    }
    __name(Ee, "Ee");
    function Oe(e) {
      return Number.isSafeInteger(e);
    }
    __name(Oe, "Oe");
    function Me() {
      return Symbol.iterator;
    }
    __name(Me, "Me");
    function ve(e) {
      return Object.keys(e);
    }
    __name(ve, "ve");
    function De(e) {
      return e.length;
    }
    __name(De, "De");
    function je(e) {
      return e.length;
    }
    __name(je, "je");
    function Be(e) {
      return e.msCrypto;
    }
    __name(Be, "Be");
    function Re() {
      return /* @__PURE__ */ new Date();
    }
    __name(Re, "Re");
    function Ue() {
      return new Object();
    }
    __name(Ue, "Ue");
    function Le(e, t) {
      try {
        var n = { a: e, b: t }, _ = /* @__PURE__ */ __name((i, c) => {
          const s = n.a;
          n.a = 0;
          try {
            return H(s, n.b, i, c);
          } finally {
            n.a = s;
          }
        }, "_");
        return new Promise(_);
      } finally {
        n.a = n.b = 0;
      }
    }
    __name(Le, "Le");
    function Ne(e) {
      return new Uint8Array(e);
    }
    __name(Ne, "Ne");
    function Ce() {
      return /* @__PURE__ */ new Map();
    }
    __name(Ce, "Ce");
    function $e() {
      return new Array();
    }
    __name($e, "$e");
    function Ve(e, t) {
      return new Uint8Array(k(e, t));
    }
    __name(Ve, "Ve");
    function We(e, t) {
      return new h(S(e, t));
    }
    __name(We, "We");
    function ze(e) {
      return new Uint8Array(e >>> 0);
    }
    __name(ze, "ze");
    function Pe() {
      return g(function(e) {
        return e.next();
      }, arguments);
    }
    __name(Pe, "Pe");
    function Ge(e) {
      return e.next;
    }
    __name(Ge, "Ge");
    function Qe(e) {
      return e.node;
    }
    __name(Qe, "Qe");
    function He() {
      return Date.now();
    }
    __name(He, "He");
    function Je(e) {
      return e.now();
    }
    __name(Je, "Je");
    function Xe() {
      return g(function() {
        return Date.now();
      }, arguments);
    }
    __name(Xe, "Xe");
    function Ye(e) {
      return e.process;
    }
    __name(Ye, "Ye");
    function Ke(e, t, n) {
      Uint8Array.prototype.set.call(k(e, t), n);
    }
    __name(Ke, "Ke");
    function Ze(e, t) {
      return e.push(t);
    }
    __name(Ze, "Ze");
    function et(e) {
      return e.queueMicrotask;
    }
    __name(et, "et");
    function tt(e) {
      queueMicrotask(e);
    }
    __name(tt, "tt");
    function nt() {
      return g(function(e, t) {
        e.randomFillSync(t);
      }, arguments);
    }
    __name(nt, "nt");
    function rt() {
      return g(function() {
        return module.require;
      }, arguments);
    }
    __name(rt, "rt");
    function _t(e) {
      return Promise.resolve(e);
    }
    __name(_t, "_t");
    function ot(e, t) {
      return setTimeout(e, t >>> 0);
    }
    __name(ot, "ot");
    function ct(e, t, n) {
      e[t] = n;
    }
    __name(ct, "ct");
    function it(e, t, n) {
      return e.set(t, n);
    }
    __name(it, "it");
    function st(e, t, n) {
      e[t >>> 0] = n;
    }
    __name(st, "st");
    function ut() {
      return g(function(e, t, n) {
        return Reflect.set(e, t, n);
      }, arguments);
    }
    __name(ut, "ut");
    function bt() {
      const e = typeof global > "u" ? null : global;
      return a(e) ? 0 : y(e);
    }
    __name(bt, "bt");
    function ft() {
      const e = typeof globalThis > "u" ? null : globalThis;
      return a(e) ? 0 : y(e);
    }
    __name(ft, "ft");
    function at() {
      const e = typeof self > "u" ? null : self;
      return a(e) ? 0 : y(e);
    }
    __name(at, "at");
    function gt() {
      const e = typeof window > "u" ? null : window;
      return a(e) ? 0 : y(e);
    }
    __name(gt, "gt");
    function lt(e, t, n) {
      return e.subarray(t >>> 0, n >>> 0);
    }
    __name(lt, "lt");
    function dt(e, t) {
      return e.then(t);
    }
    __name(dt, "dt");
    function wt(e, t, n) {
      return e.then(t, n);
    }
    __name(wt, "wt");
    function pt(e) {
      return e.valueOf();
    }
    __name(pt, "pt");
    function xt(e) {
      return e.value;
    }
    __name(xt, "xt");
    function yt(e) {
      return e.versions;
    }
    __name(yt, "yt");
    function mt(e, t) {
      return z(e, t, r.wasm_bindgen__closure__destroy__hf9ae564cf31e91c2, Q);
    }
    __name(mt, "mt");
    function ht(e, t) {
      return S(e, t);
    }
    __name(ht, "ht");
    function Tt(e) {
      return BigInt.asUintN(64, e);
    }
    __name(Tt, "Tt");
    function At(e) {
      return e;
    }
    __name(At, "At");
    function St(e, t) {
      return k(e, t);
    }
    __name(St, "St");
    function Ft(e) {
      return e;
    }
    __name(Ft, "Ft");
    function It() {
      const e = r.__wbindgen_externrefs, t = e.grow(4);
      e.set(0, void 0), e.set(t + 0, void 0), e.set(t + 1, null), e.set(t + 2, true), e.set(t + 3, false);
    }
    __name(It, "It");
  }
});

// node_modules/.prisma/client/wasm-worker-loader.mjs
var wasm_worker_loader_exports = {};
__export(wasm_worker_loader_exports, {
  default: () => wasm_worker_loader_default
});
var wasm_worker_loader_default;
var init_wasm_worker_loader = __esm({
  "node_modules/.prisma/client/wasm-worker-loader.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    wasm_worker_loader_default = import("./232a8c068638351d8b9a286185310c89c43ec967-query_engine_bg.wasm");
  }
});

// node_modules/.prisma/client/wasm.js
var require_wasm = __commonJS({
  "node_modules/.prisma/client/wasm.js"(exports) {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    var {
      PrismaClientKnownRequestError: PrismaClientKnownRequestError2,
      PrismaClientUnknownRequestError: PrismaClientUnknownRequestError2,
      PrismaClientRustPanicError: PrismaClientRustPanicError2,
      PrismaClientInitializationError: PrismaClientInitializationError2,
      PrismaClientValidationError: PrismaClientValidationError2,
      getPrismaClient: getPrismaClient2,
      sqltag: sqltag2,
      empty: empty2,
      join: join2,
      raw: raw3,
      skip: skip2,
      Decimal: Decimal2,
      Debug: Debug3,
      objectEnumValues: objectEnumValues2,
      makeStrictEnum: makeStrictEnum2,
      Extensions: Extensions2,
      warnOnce: warnOnce2,
      defineDmmfProperty: defineDmmfProperty2,
      Public: Public2,
      getRuntime: getRuntime2,
      createParam: createParam2
    } = require_wasm_engine_edge();
    var Prisma = {};
    exports.Prisma = Prisma;
    exports.$Enums = {};
    Prisma.prismaVersion = {
      client: "6.19.3",
      engine: "c2990dca591cba766e3b7ef5d9e8a84796e47ab7"
    };
    Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError2;
    Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError2;
    Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError2;
    Prisma.PrismaClientInitializationError = PrismaClientInitializationError2;
    Prisma.PrismaClientValidationError = PrismaClientValidationError2;
    Prisma.Decimal = Decimal2;
    Prisma.sql = sqltag2;
    Prisma.empty = empty2;
    Prisma.join = join2;
    Prisma.raw = raw3;
    Prisma.validator = Public2.validator;
    Prisma.getExtensionContext = Extensions2.getExtensionContext;
    Prisma.defineExtension = Extensions2.defineExtension;
    Prisma.DbNull = objectEnumValues2.instances.DbNull;
    Prisma.JsonNull = objectEnumValues2.instances.JsonNull;
    Prisma.AnyNull = objectEnumValues2.instances.AnyNull;
    Prisma.NullTypes = {
      DbNull: objectEnumValues2.classes.DbNull,
      JsonNull: objectEnumValues2.classes.JsonNull,
      AnyNull: objectEnumValues2.classes.AnyNull
    };
    exports.Prisma.TransactionIsolationLevel = makeStrictEnum2({
      Serializable: "Serializable"
    });
    exports.Prisma.GuesthouseScalarFieldEnum = {
      id: "id",
      name: "name",
      whatsappPhoneId: "whatsappPhoneId",
      whatsappToken: "whatsappToken",
      whatsappBusinessId: "whatsappBusinessId",
      subscriptionStatus: "subscriptionStatus",
      subscriptionEndsAt: "subscriptionEndsAt",
      rooms: "rooms",
      reviewTriggerTime: "reviewTriggerTime",
      logoUrl: "logoUrl",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports.Prisma.UserScalarFieldEnum = {
      id: "id",
      email: "email",
      passwordHash: "passwordHash",
      name: "name",
      role: "role",
      guesthouseId: "guesthouseId",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports.Prisma.BookingScalarFieldEnum = {
      id: "id",
      guesthouseId: "guesthouseId",
      customerName: "customerName",
      customerEmail: "customerEmail",
      customerPhone: "customerPhone",
      customerCountry: "customerCountry",
      roomName: "roomName",
      checkIn: "checkIn",
      checkOut: "checkOut",
      status: "status",
      totalAmount: "totalAmount",
      reviewCollected: "reviewCollected",
      reviewMessageStatus: "reviewMessageStatus",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports.Prisma.CustomerScalarFieldEnum = {
      id: "id",
      guesthouseId: "guesthouseId",
      name: "name",
      email: "email",
      phone: "phone",
      customerCountry: "customerCountry",
      optInPromo: "optInPromo",
      gender: "gender",
      ageGroup: "ageGroup",
      groupStyle: "groupStyle",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports.Prisma.CampaignScalarFieldEnum = {
      id: "id",
      guesthouseId: "guesthouseId",
      name: "name",
      messageTemplate: "messageTemplate",
      status: "status",
      scheduledAt: "scheduledAt",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports.Prisma.MessageLogScalarFieldEnum = {
      id: "id",
      guesthouseId: "guesthouseId",
      bookingId: "bookingId",
      campaignId: "campaignId",
      phone: "phone",
      direction: "direction",
      messageType: "messageType",
      content: "content",
      status: "status",
      createdAt: "createdAt"
    };
    exports.Prisma.FacebookAdAccountScalarFieldEnum = {
      id: "id",
      guesthouseId: "guesthouseId",
      adAccountId: "adAccountId",
      accessToken: "accessToken",
      pageId: "pageId",
      accountName: "accountName",
      currency: "currency",
      timezone: "timezone",
      connectedAt: "connectedAt",
      updatedAt: "updatedAt"
    };
    exports.Prisma.FacebookCampaignScalarFieldEnum = {
      id: "id",
      guesthouseId: "guesthouseId",
      adAccountId: "adAccountId",
      name: "name",
      status: "status",
      objective: "objective",
      dailyBudget: "dailyBudget",
      lifetimeBudget: "lifetimeBudget",
      startTime: "startTime",
      stopTime: "stopTime",
      syncedAt: "syncedAt",
      createdAt: "createdAt"
    };
    exports.Prisma.FacebookAdSetScalarFieldEnum = {
      id: "id",
      guesthouseId: "guesthouseId",
      campaignId: "campaignId",
      name: "name",
      status: "status",
      dailyBudget: "dailyBudget",
      targeting: "targeting",
      bidStrategy: "bidStrategy",
      syncedAt: "syncedAt"
    };
    exports.Prisma.FacebookAdScalarFieldEnum = {
      id: "id",
      guesthouseId: "guesthouseId",
      adSetId: "adSetId",
      name: "name",
      status: "status",
      creativeTitle: "creativeTitle",
      creativeBody: "creativeBody",
      previewUrl: "previewUrl",
      syncedAt: "syncedAt"
    };
    exports.Prisma.FacebookInsightScalarFieldEnum = {
      id: "id",
      guesthouseId: "guesthouseId",
      adAccountId: "adAccountId",
      objectId: "objectId",
      objectLevel: "objectLevel",
      objectName: "objectName",
      date: "date",
      impressions: "impressions",
      clicks: "clicks",
      spend: "spend",
      reach: "reach",
      conversions: "conversions",
      cpm: "cpm",
      ctr: "ctr",
      cpc: "cpc",
      roas: "roas",
      syncedAt: "syncedAt"
    };
    exports.Prisma.AiAdvisorCacheScalarFieldEnum = {
      id: "id",
      guesthouseId: "guesthouseId",
      windowDays: "windowDays",
      adviceJson: "adviceJson",
      generatedAt: "generatedAt"
    };
    exports.Prisma.SortOrder = {
      asc: "asc",
      desc: "desc"
    };
    exports.Prisma.NullsOrder = {
      first: "first",
      last: "last"
    };
    exports.Prisma.ModelName = {
      Guesthouse: "Guesthouse",
      User: "User",
      Booking: "Booking",
      Customer: "Customer",
      Campaign: "Campaign",
      MessageLog: "MessageLog",
      FacebookAdAccount: "FacebookAdAccount",
      FacebookCampaign: "FacebookCampaign",
      FacebookAdSet: "FacebookAdSet",
      FacebookAd: "FacebookAd",
      FacebookInsight: "FacebookInsight",
      AiAdvisorCache: "AiAdvisorCache"
    };
    var config2 = {
      "generator": {
        "name": "client",
        "provider": {
          "fromEnvVar": null,
          "value": "prisma-client-js"
        },
        "output": {
          "value": "C:\\Users\\Wangu\\Documents\\Projects\\GHA-Management-System\\node_modules\\.prisma\\client",
          "fromEnvVar": null
        },
        "config": {
          "engineType": "library"
        },
        "binaryTargets": [
          {
            "fromEnvVar": null,
            "value": "windows",
            "native": true
          }
        ],
        "previewFeatures": [],
        "sourceFilePath": "C:\\Users\\Wangu\\Documents\\Projects\\GHA-Management-System\\prisma\\schema.prisma",
        "isCustomOutput": true
      },
      "relativeEnvPaths": {
        "rootEnvPath": null
      },
      "relativePath": "../../../prisma",
      "clientVersion": "6.19.3",
      "engineVersion": "c2990dca591cba766e3b7ef5d9e8a84796e47ab7",
      "datasourceNames": [
        "db"
      ],
      "activeProvider": "sqlite",
      "postinstall": false,
      "inlineDatasources": {
        "db": {
          "url": {
            "fromEnvVar": "DATABASE_URL",
            "value": null
          }
        }
      },
      "inlineSchema": '// Prisma schema for Cloudflare D1 (SQLite) via @prisma/adapter-d1.\n\ngenerator client {\n  provider = "prisma-client-js"\n  output   = "../node_modules/.prisma/client"\n}\n\ndatasource db {\n  provider = "sqlite"\n  url      = env("DATABASE_URL")\n}\n\nmodel Guesthouse {\n  id                 String    @id @default(uuid())\n  name               String\n  whatsappPhoneId    String?\n  whatsappToken      String?\n  whatsappBusinessId String?\n  subscriptionStatus String    @default("ACTIVE")\n  subscriptionEndsAt DateTime?\n  rooms              String?\n  reviewTriggerTime  String?\n  logoUrl            String?\n  createdAt          DateTime  @default(now())\n  updatedAt          DateTime  @updatedAt\n\n  users             User[]\n  bookings          Booking[]\n  customers         Customer[]\n  campaigns         Campaign[]\n  messageLogs       MessageLog[]\n  facebookAdAccount FacebookAdAccount?\n  facebookCampaigns FacebookCampaign[]\n  facebookAdSets    FacebookAdSet[]\n  facebookAds       FacebookAd[]\n  facebookInsights  FacebookInsight[]\n  aiAdvisorCaches   AiAdvisorCache[]\n}\n\nmodel User {\n  id           String      @id @default(uuid())\n  email        String      @unique\n  passwordHash String\n  name         String\n  role         String      @default("TENANT_SALES")\n  guesthouseId String?\n  guesthouse   Guesthouse? @relation(fields: [guesthouseId], references: [id], onDelete: Cascade)\n  createdAt    DateTime    @default(now())\n  updatedAt    DateTime    @updatedAt\n}\n\nmodel Booking {\n  id                  String     @id @default(uuid())\n  guesthouseId        String\n  guesthouse          Guesthouse @relation(fields: [guesthouseId], references: [id], onDelete: Cascade)\n  customerName        String\n  customerEmail       String?\n  customerPhone       String\n  customerCountry     String?\n  roomName            String\n  checkIn             DateTime\n  checkOut            DateTime\n  status              String     @default("CONFIRMED")\n  totalAmount         Float\n  reviewCollected     Boolean    @default(false)\n  reviewMessageStatus String     @default("PENDING")\n  createdAt           DateTime   @default(now())\n  updatedAt           DateTime   @updatedAt\n\n  messageLogs MessageLog[]\n}\n\nmodel Customer {\n  id              String     @id @default(uuid())\n  guesthouseId    String\n  guesthouse      Guesthouse @relation(fields: [guesthouseId], references: [id], onDelete: Cascade)\n  name            String\n  email           String?\n  phone           String\n  customerCountry String?\n  optInPromo      Boolean    @default(false)\n  gender          String?\n  ageGroup        String?\n  groupStyle      String?\n  createdAt       DateTime   @default(now())\n  updatedAt       DateTime   @updatedAt\n\n  @@unique([guesthouseId, phone])\n}\n\nmodel Campaign {\n  id              String     @id @default(uuid())\n  guesthouseId    String\n  guesthouse      Guesthouse @relation(fields: [guesthouseId], references: [id], onDelete: Cascade)\n  name            String\n  messageTemplate String\n  status          String     @default("DRAFT")\n  scheduledAt     DateTime?\n  createdAt       DateTime   @default(now())\n  updatedAt       DateTime   @updatedAt\n\n  messageLogs MessageLog[]\n}\n\nmodel MessageLog {\n  id           String     @id @default(uuid())\n  guesthouseId String\n  guesthouse   Guesthouse @relation(fields: [guesthouseId], references: [id], onDelete: Cascade)\n  bookingId    String?\n  booking      Booking?   @relation(fields: [bookingId], references: [id], onDelete: SetNull)\n  campaignId   String?\n  campaign     Campaign?  @relation(fields: [campaignId], references: [id], onDelete: SetNull)\n  phone        String\n  direction    String\n  messageType  String\n  content      String\n  status       String     @default("PENDING")\n  createdAt    DateTime   @default(now())\n}\n\n// \u2500\u2500\u2500 Facebook Ads Integration \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel FacebookAdAccount {\n  id           String     @id @default(uuid())\n  guesthouseId String     @unique\n  guesthouse   Guesthouse @relation(fields: [guesthouseId], references: [id], onDelete: Cascade)\n  adAccountId  String // e.g. act_1234567890\n  accessToken  String\n  pageId       String?\n  accountName  String?\n  currency     String?    @default("USD")\n  timezone     String?    @default("UTC")\n  connectedAt  DateTime   @default(now())\n  updatedAt    DateTime   @updatedAt\n}\n\nmodel FacebookCampaign {\n  id             String     @id // Facebook Campaign ID\n  guesthouseId   String\n  guesthouse     Guesthouse @relation(fields: [guesthouseId], references: [id], onDelete: Cascade)\n  adAccountId    String\n  name           String\n  status         String     @default("PAUSED")\n  objective      String?\n  dailyBudget    Float?\n  lifetimeBudget Float?\n  startTime      DateTime?\n  stopTime       DateTime?\n  syncedAt       DateTime   @default(now())\n  createdAt      DateTime   @default(now())\n\n  adSets FacebookAdSet[]\n\n  @@index([guesthouseId])\n}\n\nmodel FacebookAdSet {\n  id           String           @id // Facebook AdSet ID\n  guesthouseId String\n  guesthouse   Guesthouse       @relation(fields: [guesthouseId], references: [id], onDelete: Cascade)\n  campaignId   String\n  campaign     FacebookCampaign @relation(fields: [campaignId], references: [id], onDelete: Cascade)\n  name         String\n  status       String           @default("PAUSED")\n  dailyBudget  Float?\n  targeting    String? // JSON blob\n  bidStrategy  String?\n  syncedAt     DateTime         @default(now())\n\n  ads FacebookAd[]\n\n  @@index([campaignId])\n}\n\nmodel FacebookAd {\n  id            String        @id // Facebook Ad ID\n  guesthouseId  String\n  guesthouse    Guesthouse    @relation(fields: [guesthouseId], references: [id], onDelete: Cascade)\n  adSetId       String\n  adSet         FacebookAdSet @relation(fields: [adSetId], references: [id], onDelete: Cascade)\n  name          String\n  status        String        @default("PAUSED")\n  creativeTitle String?\n  creativeBody  String?\n  previewUrl    String?\n  syncedAt      DateTime      @default(now())\n\n  @@index([adSetId])\n}\n\nmodel FacebookInsight {\n  id           String     @id @default(uuid())\n  guesthouseId String\n  guesthouse   Guesthouse @relation(fields: [guesthouseId], references: [id], onDelete: Cascade)\n  adAccountId  String\n  objectId     String // campaign/adset/ad ID\n  objectLevel  String // CAMPAIGN | ADSET | AD | ACCOUNT\n  objectName   String?\n  date         String // YYYY-MM-DD\n  impressions  Int        @default(0)\n  clicks       Int        @default(0)\n  spend        Float      @default(0)\n  reach        Int        @default(0)\n  conversions  Int        @default(0)\n  cpm          Float?     @default(0)\n  ctr          Float?     @default(0)\n  cpc          Float?     @default(0)\n  roas         Float?     @default(0)\n  syncedAt     DateTime   @default(now())\n\n  @@unique([adAccountId, objectId, objectLevel, date])\n  @@index([guesthouseId, date])\n}\n\nmodel AiAdvisorCache {\n  id           String     @id @default(uuid())\n  guesthouseId String\n  guesthouse   Guesthouse @relation(fields: [guesthouseId], references: [id], onDelete: Cascade)\n  windowDays   Int        @default(30)\n  adviceJson   String // Full serialized JSON from Gemini\n  generatedAt  DateTime   @default(now())\n\n  @@unique([guesthouseId, windowDays])\n}\n',
      "inlineSchemaHash": "41cd61db7da6ec8dec713c28c4ebe6601d4c8c374c6013c2730e733807916db3",
      "copyEngine": true
    };
    config2.dirname = "/";
    config2.runtimeDataModel = JSON.parse('{"models":{"Guesthouse":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"whatsappPhoneId","kind":"scalar","type":"String"},{"name":"whatsappToken","kind":"scalar","type":"String"},{"name":"whatsappBusinessId","kind":"scalar","type":"String"},{"name":"subscriptionStatus","kind":"scalar","type":"String"},{"name":"subscriptionEndsAt","kind":"scalar","type":"DateTime"},{"name":"rooms","kind":"scalar","type":"String"},{"name":"reviewTriggerTime","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"users","kind":"object","type":"User","relationName":"GuesthouseToUser"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToGuesthouse"},{"name":"customers","kind":"object","type":"Customer","relationName":"CustomerToGuesthouse"},{"name":"campaigns","kind":"object","type":"Campaign","relationName":"CampaignToGuesthouse"},{"name":"messageLogs","kind":"object","type":"MessageLog","relationName":"GuesthouseToMessageLog"},{"name":"facebookAdAccount","kind":"object","type":"FacebookAdAccount","relationName":"FacebookAdAccountToGuesthouse"},{"name":"facebookCampaigns","kind":"object","type":"FacebookCampaign","relationName":"FacebookCampaignToGuesthouse"},{"name":"facebookAdSets","kind":"object","type":"FacebookAdSet","relationName":"FacebookAdSetToGuesthouse"},{"name":"facebookAds","kind":"object","type":"FacebookAd","relationName":"FacebookAdToGuesthouse"},{"name":"facebookInsights","kind":"object","type":"FacebookInsight","relationName":"FacebookInsightToGuesthouse"},{"name":"aiAdvisorCaches","kind":"object","type":"AiAdvisorCache","relationName":"AiAdvisorCacheToGuesthouse"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"passwordHash","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"role","kind":"scalar","type":"String"},{"name":"guesthouseId","kind":"scalar","type":"String"},{"name":"guesthouse","kind":"object","type":"Guesthouse","relationName":"GuesthouseToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"guesthouseId","kind":"scalar","type":"String"},{"name":"guesthouse","kind":"object","type":"Guesthouse","relationName":"BookingToGuesthouse"},{"name":"customerName","kind":"scalar","type":"String"},{"name":"customerEmail","kind":"scalar","type":"String"},{"name":"customerPhone","kind":"scalar","type":"String"},{"name":"customerCountry","kind":"scalar","type":"String"},{"name":"roomName","kind":"scalar","type":"String"},{"name":"checkIn","kind":"scalar","type":"DateTime"},{"name":"checkOut","kind":"scalar","type":"DateTime"},{"name":"status","kind":"scalar","type":"String"},{"name":"totalAmount","kind":"scalar","type":"Float"},{"name":"reviewCollected","kind":"scalar","type":"Boolean"},{"name":"reviewMessageStatus","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"messageLogs","kind":"object","type":"MessageLog","relationName":"BookingToMessageLog"}],"dbName":null},"Customer":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"guesthouseId","kind":"scalar","type":"String"},{"name":"guesthouse","kind":"object","type":"Guesthouse","relationName":"CustomerToGuesthouse"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"customerCountry","kind":"scalar","type":"String"},{"name":"optInPromo","kind":"scalar","type":"Boolean"},{"name":"gender","kind":"scalar","type":"String"},{"name":"ageGroup","kind":"scalar","type":"String"},{"name":"groupStyle","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Campaign":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"guesthouseId","kind":"scalar","type":"String"},{"name":"guesthouse","kind":"object","type":"Guesthouse","relationName":"CampaignToGuesthouse"},{"name":"name","kind":"scalar","type":"String"},{"name":"messageTemplate","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"scheduledAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"messageLogs","kind":"object","type":"MessageLog","relationName":"CampaignToMessageLog"}],"dbName":null},"MessageLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"guesthouseId","kind":"scalar","type":"String"},{"name":"guesthouse","kind":"object","type":"Guesthouse","relationName":"GuesthouseToMessageLog"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToMessageLog"},{"name":"campaignId","kind":"scalar","type":"String"},{"name":"campaign","kind":"object","type":"Campaign","relationName":"CampaignToMessageLog"},{"name":"phone","kind":"scalar","type":"String"},{"name":"direction","kind":"scalar","type":"String"},{"name":"messageType","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"FacebookAdAccount":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"guesthouseId","kind":"scalar","type":"String"},{"name":"guesthouse","kind":"object","type":"Guesthouse","relationName":"FacebookAdAccountToGuesthouse"},{"name":"adAccountId","kind":"scalar","type":"String"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"pageId","kind":"scalar","type":"String"},{"name":"accountName","kind":"scalar","type":"String"},{"name":"currency","kind":"scalar","type":"String"},{"name":"timezone","kind":"scalar","type":"String"},{"name":"connectedAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"FacebookCampaign":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"guesthouseId","kind":"scalar","type":"String"},{"name":"guesthouse","kind":"object","type":"Guesthouse","relationName":"FacebookCampaignToGuesthouse"},{"name":"adAccountId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"objective","kind":"scalar","type":"String"},{"name":"dailyBudget","kind":"scalar","type":"Float"},{"name":"lifetimeBudget","kind":"scalar","type":"Float"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"stopTime","kind":"scalar","type":"DateTime"},{"name":"syncedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"adSets","kind":"object","type":"FacebookAdSet","relationName":"FacebookAdSetToFacebookCampaign"}],"dbName":null},"FacebookAdSet":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"guesthouseId","kind":"scalar","type":"String"},{"name":"guesthouse","kind":"object","type":"Guesthouse","relationName":"FacebookAdSetToGuesthouse"},{"name":"campaignId","kind":"scalar","type":"String"},{"name":"campaign","kind":"object","type":"FacebookCampaign","relationName":"FacebookAdSetToFacebookCampaign"},{"name":"name","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"dailyBudget","kind":"scalar","type":"Float"},{"name":"targeting","kind":"scalar","type":"String"},{"name":"bidStrategy","kind":"scalar","type":"String"},{"name":"syncedAt","kind":"scalar","type":"DateTime"},{"name":"ads","kind":"object","type":"FacebookAd","relationName":"FacebookAdToFacebookAdSet"}],"dbName":null},"FacebookAd":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"guesthouseId","kind":"scalar","type":"String"},{"name":"guesthouse","kind":"object","type":"Guesthouse","relationName":"FacebookAdToGuesthouse"},{"name":"adSetId","kind":"scalar","type":"String"},{"name":"adSet","kind":"object","type":"FacebookAdSet","relationName":"FacebookAdToFacebookAdSet"},{"name":"name","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"creativeTitle","kind":"scalar","type":"String"},{"name":"creativeBody","kind":"scalar","type":"String"},{"name":"previewUrl","kind":"scalar","type":"String"},{"name":"syncedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"FacebookInsight":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"guesthouseId","kind":"scalar","type":"String"},{"name":"guesthouse","kind":"object","type":"Guesthouse","relationName":"FacebookInsightToGuesthouse"},{"name":"adAccountId","kind":"scalar","type":"String"},{"name":"objectId","kind":"scalar","type":"String"},{"name":"objectLevel","kind":"scalar","type":"String"},{"name":"objectName","kind":"scalar","type":"String"},{"name":"date","kind":"scalar","type":"String"},{"name":"impressions","kind":"scalar","type":"Int"},{"name":"clicks","kind":"scalar","type":"Int"},{"name":"spend","kind":"scalar","type":"Float"},{"name":"reach","kind":"scalar","type":"Int"},{"name":"conversions","kind":"scalar","type":"Int"},{"name":"cpm","kind":"scalar","type":"Float"},{"name":"ctr","kind":"scalar","type":"Float"},{"name":"cpc","kind":"scalar","type":"Float"},{"name":"roas","kind":"scalar","type":"Float"},{"name":"syncedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"AiAdvisorCache":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"guesthouseId","kind":"scalar","type":"String"},{"name":"guesthouse","kind":"object","type":"Guesthouse","relationName":"AiAdvisorCacheToGuesthouse"},{"name":"windowDays","kind":"scalar","type":"Int"},{"name":"adviceJson","kind":"scalar","type":"String"},{"name":"generatedAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
    defineDmmfProperty2(exports.Prisma, config2.runtimeDataModel);
    config2.engineWasm = {
      getRuntime: /* @__PURE__ */ __name(async () => require_query_engine_bg(), "getRuntime"),
      getQueryEngineWasmModule: /* @__PURE__ */ __name(async () => {
        const loader = (await Promise.resolve().then(() => (init_wasm_worker_loader(), wasm_worker_loader_exports))).default;
        const engine = (await loader).default;
        return engine;
      }, "getQueryEngineWasmModule")
    };
    config2.compilerWasm = void 0;
    config2.injectableEdgeEnv = () => ({
      parsed: {
        DATABASE_URL: typeof globalThis !== "undefined" && globalThis["DATABASE_URL"] || typeof process !== "undefined" && process.env && process.env.DATABASE_URL || void 0
      }
    });
    if (typeof globalThis !== "undefined" && globalThis["DEBUG"] || typeof process !== "undefined" && process.env && process.env.DEBUG || void 0) {
      Debug3.enable(typeof globalThis !== "undefined" && globalThis["DEBUG"] || typeof process !== "undefined" && process.env && process.env.DEBUG || void 0);
    }
    var PrismaClient2 = getPrismaClient2(config2);
    exports.PrismaClient = PrismaClient2;
    Object.assign(exports, Prisma);
  }
});

// node_modules/.prisma/client/default.js
var require_default = __commonJS({
  "node_modules/.prisma/client/default.js"(exports, module) {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = { ...require_wasm() };
  }
});

// node_modules/@prisma/client/default.js
var require_default2 = __commonJS({
  "node_modules/@prisma/client/default.js"(exports, module) {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = {
      ...require_default()
    };
  }
});

// .wrangler/tmp/bundle-WxYSdF/middleware-loader.entry.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// .wrangler/tmp/bundle-WxYSdF/middleware-insertion-facade.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/worker.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/server.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/hono.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/hono-base.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/compose.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var compose = /* @__PURE__ */ __name((middleware, onError3, onNotFound) => {
  return (context2, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context2.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context2, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError3) {
            context2.error = err;
            res = await onError3(err, context2);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context2.finalized === false && onNotFound) {
          res = await onNotFound(context2);
        }
      }
      if (res && (context2.finalized === false || isError)) {
        context2.res = res;
      }
      return context2;
    }
    __name(dispatch, "dispatch");
  };
}, "compose");

// node_modules/hono/dist/context.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/request.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/http-exception.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/request/constants.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// node_modules/hono/dist/utils/body.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var parseBody = /* @__PURE__ */ __name(async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
}, "parseBody");
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
__name(parseFormData, "parseFormData");
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
__name(convertFormDataToBodyData, "convertFormDataToBodyData");
var handleParsingAllValues = /* @__PURE__ */ __name((form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
}, "handleParsingAllValues");
var handleParsingNestedValues = /* @__PURE__ */ __name((form, key, value) => {
  if (/(?:^|\.)__proto__\./.test(key)) {
    return;
  }
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
}, "handleParsingNestedValues");

// node_modules/hono/dist/utils/url.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var splitPath = /* @__PURE__ */ __name((path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
}, "splitPath");
var splitRoutingPath = /* @__PURE__ */ __name((routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
}, "splitRoutingPath");
var extractGroupsFromPath = /* @__PURE__ */ __name((path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path };
}, "extractGroupsFromPath");
var replaceGroupMarks = /* @__PURE__ */ __name((paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
}, "replaceGroupMarks");
var patternCache = {};
var getPattern = /* @__PURE__ */ __name((label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
}, "getPattern");
var tryDecode = /* @__PURE__ */ __name((str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
}, "tryDecode");
var tryDecodeURI = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURI), "tryDecodeURI");
var getPath = /* @__PURE__ */ __name((request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63 || charCode === 35) {
      break;
    }
  }
  return url.slice(start, i);
}, "getPath");
var getPathNoStrict = /* @__PURE__ */ __name((request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
}, "getPathNoStrict");
var mergePath = /* @__PURE__ */ __name((base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
}, "mergePath");
var checkOptionalParameter = /* @__PURE__ */ __name((path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
}, "checkOptionalParameter");
var _decodeURI = /* @__PURE__ */ __name((value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
}, "_decodeURI");
var _getQueryParam = /* @__PURE__ */ __name((url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name2 = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name2 = _decodeURI(name2);
    }
    keyIndex = nextKeyIndex;
    if (name2 === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name2] && Array.isArray(results[name2]))) {
        results[name2] = [];
      }
      ;
      results[name2].push(value);
    } else {
      results[name2] ??= value;
    }
  }
  return key ? results[key] : results;
}, "_getQueryParam");
var getQueryParam = _getQueryParam;
var getQueryParams = /* @__PURE__ */ __name((url, key) => {
  return _getQueryParam(url, key, true);
}, "getQueryParams");
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var tryDecodeURIComponent = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURIComponent_), "tryDecodeURIComponent");
var HonoRequest = class {
  static {
    __name(this, "HonoRequest");
  }
  /**
   * `.raw` can get the raw Request object.
   *
   * @see {@link https://hono.dev/docs/api/request#raw}
   *
   * @example
   * ```ts
   * // For Cloudflare Workers
   * app.post('/', async (c) => {
   *   const metadata = c.req.raw.cf?.hostMetadata?
   *   ...
   * })
   * ```
   */
  raw;
  #validatedData;
  // Short name of validatedData
  #matchResult;
  routeIndex = 0;
  /**
   * `.path` can get the pathname of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#path}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const pathname = c.req.path // `/about/me`
   * })
   * ```
   */
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name2) {
    if (name2) {
      return this.raw.headers.get(name2) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return parseBody(this, options);
  }
  #cachedBody = /* @__PURE__ */ __name((key) => {
    const { bodyCache, raw: raw3 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw3[key]();
  }, "#cachedBody");
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return this.#cachedBody("text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
   * `.bytes()` parses the request body as a `Uint8Array`.
   *
   * @see {@link https://hono.dev/docs/api/request#bytes}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.bytes()
   * })
   * ```
   */
  bytes() {
    return this.#cachedBody("arrayBuffer").then((buffer) => new Uint8Array(buffer));
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/utils/html.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw2 = /* @__PURE__ */ __name((value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
}, "raw");
var resolveCallback = /* @__PURE__ */ __name(async (str, phase, preserveCallbacks, context2, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context: context2 }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context2, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw2(await resStr, callbacks);
  } else {
    return resStr;
  }
}, "resolveCallback");

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = /* @__PURE__ */ __name((contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
}, "setDefaultContentType");
var createResponseInstance = /* @__PURE__ */ __name((body, init3) => new Response(body, init3), "createResponseInstance");
var Context = class {
  static {
    __name(this, "Context");
  }
  #rawRequest;
  #req;
  /**
   * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
   *
   * @see {@link https://hono.dev/docs/api/context#env}
   *
   * @example
   * ```ts
   * // Environment object for Cloudflare Workers
   * app.get('*', async c => {
   *   const counter = c.env.COUNTER
   * })
   * ```
   */
  env = {};
  #var;
  finalized = false;
  /**
   * `.error` can get the error object from the middleware if the Handler throws an error.
   *
   * @see {@link https://hono.dev/docs/api/context#error}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   await next()
   *   if (c.error) {
   *     // do something...
   *   }
   * })
   * ```
   */
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return this.#res ||= createResponseInstance(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(_res) {
    if (this.#res && _res) {
      _res = createResponseInstance(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  /**
   * `.render()` can create a response within a layout.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   return c.render('Hello!')
   * })
   * ```
   */
  render = /* @__PURE__ */ __name((...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  }, "render");
  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = /* @__PURE__ */ __name((layout) => this.#layout = layout, "setLayout");
  /**
   * Gets the current layout for the response.
   *
   * @returns The current layout function.
   */
  getLayout = /* @__PURE__ */ __name(() => this.#layout, "getLayout");
  /**
   * `.setRenderer()` can set the layout in the custom middleware.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```tsx
   * app.use('*', async (c, next) => {
   *   c.setRenderer((content) => {
   *     return c.html(
   *       <html>
   *         <body>
   *           <p>{content}</p>
   *         </body>
   *       </html>
   *     )
   *   })
   *   await next()
   * })
   * ```
   */
  setRenderer = /* @__PURE__ */ __name((renderer) => {
    this.#renderer = renderer;
  }, "setRenderer");
  /**
   * `.header()` can set headers.
   *
   * @see {@link https://hono.dev/docs/api/context#header}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  header = /* @__PURE__ */ __name((name2, value, options) => {
    if (this.finalized) {
      this.#res = createResponseInstance(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name2);
    } else if (options?.append) {
      headers.append(name2, value);
    } else {
      headers.set(name2, value);
    }
  }, "header");
  status = /* @__PURE__ */ __name((status) => {
    this.#status = status;
  }, "status");
  /**
   * `.set()` can set the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   c.set('message', 'Hono is hot!!')
   *   await next()
   * })
   * ```
   */
  set = /* @__PURE__ */ __name((key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  }, "set");
  /**
   * `.get()` can use the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   const message = c.get('message')
   *   return c.text(`The message is "${message}"`)
   * })
   * ```
   */
  get = /* @__PURE__ */ __name((key) => {
    return this.#var ? this.#var.get(key) : void 0;
  }, "get");
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          responseHeaders.set(k, v);
        } else {
          responseHeaders.delete(k);
          for (const v2 of v) {
            responseHeaders.append(k, v2);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return createResponseInstance(data, { status, headers: responseHeaders });
  }
  newResponse = /* @__PURE__ */ __name((...args) => this.#newResponse(...args), "newResponse");
  /**
   * `.body()` can return the HTTP response.
   * You can set headers with `.header()` and set HTTP status code with `.status`.
   * This can also be set in `.text()`, `.json()` and so on.
   *
   * @see {@link https://hono.dev/docs/api/context#body}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *   // Set HTTP status code
   *   c.status(201)
   *
   *   // Return the response body
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  body = /* @__PURE__ */ __name((data, arg, headers) => this.#newResponse(data, arg, headers), "body");
  /**
   * `.text()` can render text as `Content-Type:text/plain`.
   *
   * @see {@link https://hono.dev/docs/api/context#text}
   *
   * @example
   * ```ts
   * app.get('/say', (c) => {
   *   return c.text('Hello!')
   * })
   * ```
   */
  text = /* @__PURE__ */ __name((text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  }, "text");
  /**
   * `.json()` can render JSON as `Content-Type:application/json`.
   *
   * @see {@link https://hono.dev/docs/api/context#json}
   *
   * @example
   * ```ts
   * app.get('/api', (c) => {
   *   return c.json({ message: 'Hello!' })
   * })
   * ```
   */
  json = /* @__PURE__ */ __name((object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  }, "json");
  html = /* @__PURE__ */ __name((html, arg, headers) => {
    const res = /* @__PURE__ */ __name((html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers)), "res");
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  }, "html");
  /**
   * `.redirect()` can Redirect, default status code is 302.
   *
   * @see {@link https://hono.dev/docs/api/context#redirect}
   *
   * @example
   * ```ts
   * app.get('/redirect', (c) => {
   *   return c.redirect('/')
   * })
   * app.get('/redirect-permanently', (c) => {
   *   return c.redirect('/', 301)
   * })
   * ```
   */
  redirect = /* @__PURE__ */ __name((location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      // Multibyes should be encoded
      // eslint-disable-next-line no-control-regex
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  }, "redirect");
  /**
   * `.notFound()` can return the Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/context#notfound}
   *
   * @example
   * ```ts
   * app.get('/notfound', (c) => {
   *   return c.notFound()
   * })
   * ```
   */
  notFound = /* @__PURE__ */ __name(() => {
    this.#notFoundHandler ??= () => createResponseInstance();
    return this.#notFoundHandler(this);
  }, "notFound");
};

// node_modules/hono/dist/router.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
  static {
    __name(this, "UnsupportedPathError");
  }
};

// node_modules/hono/dist/utils/constants.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/hono/dist/hono-base.js
var notFoundHandler = /* @__PURE__ */ __name((c) => {
  return c.text("404 Not Found", 404);
}, "notFoundHandler");
var errorHandler = /* @__PURE__ */ __name((err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
}, "errorHandler");
var Hono = class _Hono {
  static {
    __name(this, "_Hono");
  }
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  /*
    This class is like an abstract class and does not have a router.
    To use it, inherit the class and implement router in the constructor.
  */
  router;
  getPath;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  errorHandler = errorHandler;
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = /* @__PURE__ */ __name(async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res, "handler");
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler, r.basePath);
    });
    return this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  /**
   * `.onError()` handles an error and returns a customized Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#error-handling}
   *
   * @param {ErrorHandler} handler - request Handler for error
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.onError((err, c) => {
   *   console.error(`${err}`)
   *   return c.text('Custom Error Message', 500)
   * })
   * ```
   */
  onError = /* @__PURE__ */ __name((handler) => {
    this.errorHandler = handler;
    return this;
  }, "onError");
  /**
   * `.notFound()` allows you to customize a Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#not-found}
   *
   * @param {NotFoundHandler} handler - request handler for not-found
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.notFound((c) => {
   *   return c.text('Custom 404 Message', 404)
   * })
   * ```
   */
  notFound = /* @__PURE__ */ __name((handler) => {
    this.#notFoundHandler = handler;
    return this;
  }, "notFound");
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = /* @__PURE__ */ __name((request) => request, "replaceRequest");
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = this.getPath(request).slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = /* @__PURE__ */ __name(async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    }, "handler");
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler, baseRoutePath) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = {
      basePath: baseRoutePath !== void 0 ? mergePath(this._basePath, baseRoutePath) : this._basePath,
      path,
      method,
      handler
    };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env2, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env2, "GET")))();
    }
    const path = this.getPath(request, { env: env2 });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env: env2,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context2 = await composed(c);
        if (!context2.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context2.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  /**
   * `.fetch()` will be entry point of your app.
   *
   * @see {@link https://hono.dev/docs/api/hono#fetch}
   *
   * @param {Request} request - request Object of request
   * @param {Env} Env - env Object
   * @param {ExecutionContext} - context of execution
   * @returns {Response | Promise<Response>} response of request
   *
   */
  fetch = /* @__PURE__ */ __name((request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  }, "fetch");
  /**
   * `.request()` is a useful method for testing.
   * You can pass a URL or pathname to send a GET request.
   * app will return a Response object.
   * ```ts
   * test('GET /hello is ok', async () => {
   *   const res = await app.request('/hello')
   *   expect(res.status).toBe(200)
   * })
   * ```
   * @see https://hono.dev/docs/api/hono#request
   */
  request = /* @__PURE__ */ __name((input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  }, "request");
  /**
   * `.fire()` automatically adds a global fetch event listener.
   * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
   * @deprecated
   * Use `fire` from `hono/service-worker` instead.
   * ```ts
   * import { Hono } from 'hono'
   * import { fire } from 'hono/service-worker'
   *
   * const app = new Hono()
   * // ...
   * fire(app)
   * ```
   * @see https://hono.dev/docs/api/hono#fire
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
   * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
   */
  fire = /* @__PURE__ */ __name(() => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  }, "fire");
};

// node_modules/hono/dist/router/reg-exp-router/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/router/reg-exp-router/router.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/router/reg-exp-router/matcher.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = /* @__PURE__ */ __name(((method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  }), "match2");
  this.match = match2;
  return match2(method, path);
}
__name(match, "match");

// node_modules/hono/dist/router/reg-exp-router/node.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
__name(compareKey, "compareKey");
var Node = class _Node {
  static {
    __name(this, "_Node");
  }
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context2, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name2 = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name2 && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new _Node();
        if (name2 !== "") {
          node.#varIndex = context2.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name2 !== "") {
        paramMap.push([name2, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new _Node();
      }
    }
    node.insert(restTokens, index, paramMap, context2, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var Trie = class {
  static {
    __name(this, "Trie");
  }
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
__name(buildWildcardRegExp, "buildWildcardRegExp");
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
__name(clearWildcardRegExpCache, "clearWildcardRegExpCache");
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
__name(buildMatcherFromPreprocessedRoutes, "buildMatcherFromPreprocessedRoutes");
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
__name(findMiddleware, "findMiddleware");
var RegExpRouter = class {
  static {
    __name(this, "RegExpRouter");
  }
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// node_modules/hono/dist/router/reg-exp-router/prepared-router.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/router/smart-router/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/router/smart-router/router.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var SmartRouter = class {
  static {
    __name(this, "SmartRouter");
  }
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init3) {
    this.#routers = init3.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/router/trie-router/router.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/router/trie-router/node.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var emptyParams = /* @__PURE__ */ Object.create(null);
var hasChildren = /* @__PURE__ */ __name((children) => {
  for (const _ in children) {
    return true;
  }
  return false;
}, "hasChildren");
var Node2 = class _Node2 {
  static {
    __name(this, "_Node");
  }
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new _Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    const len = parts.length;
    let partOffsets = null;
    for (let i = 0; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
            }
            this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              this.#pushHandlerSets(handlerSets, astNode, method, node.#params);
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name2, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          if (matcher instanceof RegExp) {
            if (partOffsets === null) {
              partOffsets = new Array(len);
              let offset = path[0] === "/" ? 1 : 0;
              for (let p = 0; p < len; p++) {
                partOffsets[p] = offset;
                offset += parts[p].length + 1;
              }
            }
            const restPathString = path.substring(partOffsets[i]);
            const m = matcher.exec(restPathString);
            if (m) {
              params[name2] = m[0];
              this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
              if (hasChildren(child.#children)) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name2] = part;
            if (isLast) {
              this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
              if (child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  params,
                  node.#params
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      const shifted = curNodesQueue.shift();
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  static {
    __name(this, "TrieRouter");
  }
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  static {
    __name(this, "Hono");
  }
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// src/server.ts
var import_client = __toESM(require_default2(), 1);

// node_modules/@prisma/adapter-d1/dist/index.mjs
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@prisma/driver-adapter-utils/dist/index.mjs
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/@prisma/debug/dist/index.mjs
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var __defProp2 = Object.defineProperty;
var __export2 = /* @__PURE__ */ __name((target, all) => {
  for (var name2 in all)
    __defProp2(target, name2, { get: all[name2], enumerable: true });
}, "__export");
var colors_exports = {};
__export2(colors_exports, {
  $: /* @__PURE__ */ __name(() => $, "$"),
  bgBlack: /* @__PURE__ */ __name(() => bgBlack, "bgBlack"),
  bgBlue: /* @__PURE__ */ __name(() => bgBlue, "bgBlue"),
  bgCyan: /* @__PURE__ */ __name(() => bgCyan, "bgCyan"),
  bgGreen: /* @__PURE__ */ __name(() => bgGreen, "bgGreen"),
  bgMagenta: /* @__PURE__ */ __name(() => bgMagenta, "bgMagenta"),
  bgRed: /* @__PURE__ */ __name(() => bgRed, "bgRed"),
  bgWhite: /* @__PURE__ */ __name(() => bgWhite, "bgWhite"),
  bgYellow: /* @__PURE__ */ __name(() => bgYellow, "bgYellow"),
  black: /* @__PURE__ */ __name(() => black, "black"),
  blue: /* @__PURE__ */ __name(() => blue, "blue"),
  bold: /* @__PURE__ */ __name(() => bold, "bold"),
  cyan: /* @__PURE__ */ __name(() => cyan, "cyan"),
  dim: /* @__PURE__ */ __name(() => dim, "dim"),
  gray: /* @__PURE__ */ __name(() => gray, "gray"),
  green: /* @__PURE__ */ __name(() => green, "green"),
  grey: /* @__PURE__ */ __name(() => grey, "grey"),
  hidden: /* @__PURE__ */ __name(() => hidden, "hidden"),
  inverse: /* @__PURE__ */ __name(() => inverse, "inverse"),
  italic: /* @__PURE__ */ __name(() => italic, "italic"),
  magenta: /* @__PURE__ */ __name(() => magenta, "magenta"),
  red: /* @__PURE__ */ __name(() => red, "red"),
  reset: /* @__PURE__ */ __name(() => reset, "reset"),
  strikethrough: /* @__PURE__ */ __name(() => strikethrough, "strikethrough"),
  underline: /* @__PURE__ */ __name(() => underline, "underline"),
  white: /* @__PURE__ */ __name(() => white, "white"),
  yellow: /* @__PURE__ */ __name(() => yellow, "yellow")
});
var FORCE_COLOR;
var NODE_DISABLE_COLORS;
var NO_COLOR;
var TERM;
var isTTY = true;
if (typeof process !== "undefined") {
  ({ FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM } = process.env || {});
  isTTY = process.stdout && process.stdout.isTTY;
}
var $ = {
  enabled: !NODE_DISABLE_COLORS && NO_COLOR == null && TERM !== "dumb" && (FORCE_COLOR != null && FORCE_COLOR !== "0" || isTTY)
};
function init(x, y) {
  let rgx = new RegExp(`\\x1b\\[${y}m`, "g");
  let open = `\x1B[${x}m`, close = `\x1B[${y}m`;
  return function(txt) {
    if (!$.enabled || txt == null) return txt;
    return open + (!!~("" + txt).indexOf(close) ? txt.replace(rgx, close + open) : txt) + close;
  };
}
__name(init, "init");
var reset = init(0, 0);
var bold = init(1, 22);
var dim = init(2, 22);
var italic = init(3, 23);
var underline = init(4, 24);
var inverse = init(7, 27);
var hidden = init(8, 28);
var strikethrough = init(9, 29);
var black = init(30, 39);
var red = init(31, 39);
var green = init(32, 39);
var yellow = init(33, 39);
var blue = init(34, 39);
var magenta = init(35, 39);
var cyan = init(36, 39);
var white = init(37, 39);
var gray = init(90, 39);
var grey = init(90, 39);
var bgBlack = init(40, 49);
var bgRed = init(41, 49);
var bgGreen = init(42, 49);
var bgYellow = init(43, 49);
var bgBlue = init(44, 49);
var bgMagenta = init(45, 49);
var bgCyan = init(46, 49);
var bgWhite = init(47, 49);
var MAX_ARGS_HISTORY = 100;
var COLORS = ["green", "yellow", "blue", "magenta", "cyan", "red"];
var argsHistory = [];
var lastTimestamp = Date.now();
var lastColor = 0;
var processEnv = typeof process !== "undefined" ? process.env : {};
globalThis.DEBUG ??= processEnv.DEBUG ?? "";
globalThis.DEBUG_COLORS ??= processEnv.DEBUG_COLORS ? processEnv.DEBUG_COLORS === "true" : true;
var topProps = {
  enable(namespace) {
    if (typeof namespace === "string") {
      globalThis.DEBUG = namespace;
    }
  },
  disable() {
    const prev = globalThis.DEBUG;
    globalThis.DEBUG = "";
    return prev;
  },
  // this is the core logic to check if logging should happen or not
  enabled(namespace) {
    const listenedNamespaces = globalThis.DEBUG.split(",").map((s) => {
      return s.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
    });
    const isListened = listenedNamespaces.some((listenedNamespace) => {
      if (listenedNamespace === "" || listenedNamespace[0] === "-") return false;
      return namespace.match(RegExp(listenedNamespace.split("*").join(".*") + "$"));
    });
    const isExcluded = listenedNamespaces.some((listenedNamespace) => {
      if (listenedNamespace === "" || listenedNamespace[0] !== "-") return false;
      return namespace.match(RegExp(listenedNamespace.slice(1).split("*").join(".*") + "$"));
    });
    return isListened && !isExcluded;
  },
  log: /* @__PURE__ */ __name((...args) => {
    const [namespace, format, ...rest] = args;
    const logWithFormatting = console.warn ?? console.log;
    logWithFormatting(`${namespace} ${format}`, ...rest);
  }, "log"),
  formatters: {}
  // not implemented
};
function debugCreate(namespace) {
  const instanceProps = {
    color: COLORS[lastColor++ % COLORS.length],
    enabled: topProps.enabled(namespace),
    namespace,
    log: topProps.log,
    extend: /* @__PURE__ */ __name(() => {
    }, "extend")
    // not implemented
  };
  const debugCall = /* @__PURE__ */ __name((...args) => {
    const { enabled, namespace: namespace2, color, log: log3 } = instanceProps;
    if (args.length !== 0) {
      argsHistory.push([namespace2, ...args]);
    }
    if (argsHistory.length > MAX_ARGS_HISTORY) {
      argsHistory.shift();
    }
    if (topProps.enabled(namespace2) || enabled) {
      const stringArgs = args.map((arg) => {
        if (typeof arg === "string") {
          return arg;
        }
        return safeStringify(arg);
      });
      const ms = `+${Date.now() - lastTimestamp}ms`;
      lastTimestamp = Date.now();
      if (globalThis.DEBUG_COLORS) {
        log3(colors_exports[color](bold(namespace2)), ...stringArgs, colors_exports[color](ms));
      } else {
        log3(namespace2, ...stringArgs, ms);
      }
    }
  }, "debugCall");
  return new Proxy(debugCall, {
    get: /* @__PURE__ */ __name((_, prop) => instanceProps[prop], "get"),
    set: /* @__PURE__ */ __name((_, prop, value) => instanceProps[prop] = value, "set")
  });
}
__name(debugCreate, "debugCreate");
var Debug2 = new Proxy(debugCreate, {
  get: /* @__PURE__ */ __name((_, prop) => topProps[prop], "get"),
  set: /* @__PURE__ */ __name((_, prop, value) => topProps[prop] = value, "set")
});
function safeStringify(value, indent = 2) {
  const cache = /* @__PURE__ */ new Set();
  return JSON.stringify(
    value,
    (key, value2) => {
      if (typeof value2 === "object" && value2 !== null) {
        if (cache.has(value2)) {
          return `[Circular *]`;
        }
        cache.add(value2);
      } else if (typeof value2 === "bigint") {
        return value2.toString();
      }
      return value2;
    },
    indent
  );
}
__name(safeStringify, "safeStringify");

// node_modules/@prisma/driver-adapter-utils/dist/index.mjs
var DriverAdapterError = class extends Error {
  static {
    __name(this, "DriverAdapterError");
  }
  name = "DriverAdapterError";
  cause;
  constructor(payload) {
    super(typeof payload["message"] === "string" ? payload["message"] : payload.kind);
    this.cause = payload;
  }
};
var debug3 = Debug2("driver-adapter-utils");
var ColumnTypeEnum = {
  // Scalars
  Int32: 0,
  Int64: 1,
  Float: 2,
  Double: 3,
  Numeric: 4,
  Boolean: 5,
  Character: 6,
  Text: 7,
  Date: 8,
  Time: 9,
  DateTime: 10,
  Json: 11,
  Enum: 12,
  Bytes: 13,
  Set: 14,
  Uuid: 15,
  // Arrays
  Int32Array: 64,
  Int64Array: 65,
  FloatArray: 66,
  DoubleArray: 67,
  NumericArray: 68,
  BooleanArray: 69,
  CharacterArray: 70,
  TextArray: 71,
  DateArray: 72,
  TimeArray: 73,
  DateTimeArray: 74,
  JsonArray: 75,
  EnumArray: 76,
  BytesArray: 77,
  UuidArray: 78,
  // Custom
  UnknownNumber: 128
};
var mockAdapterErrors = {
  queryRaw: new Error("Not implemented: queryRaw"),
  executeRaw: new Error("Not implemented: executeRaw"),
  startTransaction: new Error("Not implemented: startTransaction"),
  executeScript: new Error("Not implemented: executeScript"),
  dispose: new Error("Not implemented: dispose")
};

// node_modules/ky/distribution/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/ky/distribution/core/Ky.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/ky/distribution/errors/HTTPError.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var HTTPError = class extends Error {
  static {
    __name(this, "HTTPError");
  }
  response;
  request;
  options;
  constructor(response, request, options) {
    const code = response.status || response.status === 0 ? response.status : "";
    const title2 = response.statusText || "";
    const status = `${code} ${title2}`.trim();
    const reason = status ? `status code ${status}` : "an unknown error";
    super(`Request failed with ${reason}: ${request.method} ${request.url}`);
    this.name = "HTTPError";
    this.response = response;
    this.request = request;
    this.options = options;
  }
};

// node_modules/ky/distribution/errors/TimeoutError.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var TimeoutError = class extends Error {
  static {
    __name(this, "TimeoutError");
  }
  request;
  constructor(request) {
    super(`Request timed out: ${request.method} ${request.url}`);
    this.name = "TimeoutError";
    this.request = request;
  }
};

// node_modules/ky/distribution/utils/merge.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/ky/distribution/utils/is.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var isObject = /* @__PURE__ */ __name((value) => value !== null && typeof value === "object", "isObject");

// node_modules/ky/distribution/utils/merge.js
var validateAndMerge = /* @__PURE__ */ __name((...sources) => {
  for (const source of sources) {
    if ((!isObject(source) || Array.isArray(source)) && source !== void 0) {
      throw new TypeError("The `options` argument must be an object");
    }
  }
  return deepMerge({}, ...sources);
}, "validateAndMerge");
var mergeHeaders = /* @__PURE__ */ __name((source1 = {}, source2 = {}) => {
  const result = new globalThis.Headers(source1);
  const isHeadersInstance = source2 instanceof globalThis.Headers;
  const source = new globalThis.Headers(source2);
  for (const [key, value] of source.entries()) {
    if (isHeadersInstance && value === "undefined" || value === void 0) {
      result.delete(key);
    } else {
      result.set(key, value);
    }
  }
  return result;
}, "mergeHeaders");
function newHookValue(original, incoming, property) {
  return Object.hasOwn(incoming, property) && incoming[property] === void 0 ? [] : deepMerge(original[property] ?? [], incoming[property] ?? []);
}
__name(newHookValue, "newHookValue");
var mergeHooks = /* @__PURE__ */ __name((original = {}, incoming = {}) => ({
  beforeRequest: newHookValue(original, incoming, "beforeRequest"),
  beforeRetry: newHookValue(original, incoming, "beforeRetry"),
  afterResponse: newHookValue(original, incoming, "afterResponse"),
  beforeError: newHookValue(original, incoming, "beforeError")
}), "mergeHooks");
var deepMerge = /* @__PURE__ */ __name((...sources) => {
  let returnValue = {};
  let headers = {};
  let hooks = {};
  for (const source of sources) {
    if (Array.isArray(source)) {
      if (!Array.isArray(returnValue)) {
        returnValue = [];
      }
      returnValue = [...returnValue, ...source];
    } else if (isObject(source)) {
      for (let [key, value] of Object.entries(source)) {
        if (isObject(value) && key in returnValue) {
          value = deepMerge(returnValue[key], value);
        }
        returnValue = { ...returnValue, [key]: value };
      }
      if (isObject(source.hooks)) {
        hooks = mergeHooks(hooks, source.hooks);
        returnValue.hooks = hooks;
      }
      if (isObject(source.headers)) {
        headers = mergeHeaders(headers, source.headers);
        returnValue.headers = headers;
      }
    }
  }
  return returnValue;
}, "deepMerge");

// node_modules/ky/distribution/utils/normalize.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/ky/distribution/core/constants.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var supportsRequestStreams = (() => {
  let duplexAccessed = false;
  let hasContentType = false;
  const supportsReadableStream = typeof globalThis.ReadableStream === "function";
  const supportsRequest = typeof globalThis.Request === "function";
  if (supportsReadableStream && supportsRequest) {
    try {
      hasContentType = new globalThis.Request("https://empty.invalid", {
        body: new globalThis.ReadableStream(),
        method: "POST",
        // @ts-expect-error - Types are outdated.
        get duplex() {
          duplexAccessed = true;
          return "half";
        }
      }).headers.has("Content-Type");
    } catch (error3) {
      if (error3 instanceof Error && error3.message === "unsupported BodyInit type") {
        return false;
      }
      throw error3;
    }
  }
  return duplexAccessed && !hasContentType;
})();
var supportsAbortController = typeof globalThis.AbortController === "function";
var supportsResponseStreams = typeof globalThis.ReadableStream === "function";
var supportsFormData = typeof globalThis.FormData === "function";
var requestMethods = ["get", "post", "put", "patch", "head", "delete"];
var validate = /* @__PURE__ */ __name(() => void 0, "validate");
validate();
var responseTypes = {
  json: "application/json",
  text: "text/*",
  formData: "multipart/form-data",
  arrayBuffer: "*/*",
  blob: "*/*"
};
var maxSafeTimeout = 2147483647;
var stop = /* @__PURE__ */ Symbol("stop");
var kyOptionKeys = {
  json: true,
  parseJson: true,
  stringifyJson: true,
  searchParams: true,
  prefixUrl: true,
  retry: true,
  timeout: true,
  hooks: true,
  throwHttpErrors: true,
  onDownloadProgress: true,
  fetch: true
};
var requestOptionsRegistry = {
  method: true,
  headers: true,
  body: true,
  mode: true,
  credentials: true,
  cache: true,
  redirect: true,
  referrer: true,
  referrerPolicy: true,
  integrity: true,
  keepalive: true,
  signal: true,
  window: true,
  dispatcher: true,
  duplex: true,
  priority: true
};

// node_modules/ky/distribution/utils/normalize.js
var normalizeRequestMethod = /* @__PURE__ */ __name((input) => requestMethods.includes(input) ? input.toUpperCase() : input, "normalizeRequestMethod");
var retryMethods = ["get", "put", "head", "delete", "options", "trace"];
var retryStatusCodes = [408, 413, 429, 500, 502, 503, 504];
var retryAfterStatusCodes = [413, 429, 503];
var defaultRetryOptions = {
  limit: 2,
  methods: retryMethods,
  statusCodes: retryStatusCodes,
  afterStatusCodes: retryAfterStatusCodes,
  maxRetryAfter: Number.POSITIVE_INFINITY,
  backoffLimit: Number.POSITIVE_INFINITY,
  delay: /* @__PURE__ */ __name((attemptCount) => 0.3 * 2 ** (attemptCount - 1) * 1e3, "delay")
};
var normalizeRetryOptions = /* @__PURE__ */ __name((retry = {}) => {
  if (typeof retry === "number") {
    return {
      ...defaultRetryOptions,
      limit: retry
    };
  }
  if (retry.methods && !Array.isArray(retry.methods)) {
    throw new Error("retry.methods must be an array");
  }
  if (retry.statusCodes && !Array.isArray(retry.statusCodes)) {
    throw new Error("retry.statusCodes must be an array");
  }
  return {
    ...defaultRetryOptions,
    ...retry
  };
}, "normalizeRetryOptions");

// node_modules/ky/distribution/utils/timeout.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
async function timeout(request, init3, abortController, options) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      if (abortController) {
        abortController.abort();
      }
      reject(new TimeoutError(request));
    }, options.timeout);
    void options.fetch(request, init3).then(resolve).catch(reject).then(() => {
      clearTimeout(timeoutId);
    });
  });
}
__name(timeout, "timeout");

// node_modules/ky/distribution/utils/delay.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
async function delay(ms, { signal }) {
  return new Promise((resolve, reject) => {
    if (signal) {
      signal.throwIfAborted();
      signal.addEventListener("abort", abortHandler, { once: true });
    }
    function abortHandler() {
      clearTimeout(timeoutId);
      reject(signal.reason);
    }
    __name(abortHandler, "abortHandler");
    const timeoutId = setTimeout(() => {
      signal?.removeEventListener("abort", abortHandler);
      resolve();
    }, ms);
  });
}
__name(delay, "delay");

// node_modules/ky/distribution/utils/options.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var findUnknownOptions = /* @__PURE__ */ __name((request, options) => {
  const unknownOptions = {};
  for (const key in options) {
    if (!(key in requestOptionsRegistry) && !(key in kyOptionKeys) && !(key in request)) {
      unknownOptions[key] = options[key];
    }
  }
  return unknownOptions;
}, "findUnknownOptions");

// node_modules/ky/distribution/core/Ky.js
var Ky = class _Ky {
  static {
    __name(this, "Ky");
  }
  static create(input, options) {
    const ky2 = new _Ky(input, options);
    const function_ = /* @__PURE__ */ __name(async () => {
      if (typeof ky2._options.timeout === "number" && ky2._options.timeout > maxSafeTimeout) {
        throw new RangeError(`The \`timeout\` option cannot be greater than ${maxSafeTimeout}`);
      }
      await Promise.resolve();
      let response = await ky2._fetch();
      for (const hook of ky2._options.hooks.afterResponse) {
        const modifiedResponse = await hook(ky2.request, ky2._options, ky2._decorateResponse(response.clone()));
        if (modifiedResponse instanceof globalThis.Response) {
          response = modifiedResponse;
        }
      }
      ky2._decorateResponse(response);
      if (!response.ok && ky2._options.throwHttpErrors) {
        let error3 = new HTTPError(response, ky2.request, ky2._options);
        for (const hook of ky2._options.hooks.beforeError) {
          error3 = await hook(error3);
        }
        throw error3;
      }
      if (ky2._options.onDownloadProgress) {
        if (typeof ky2._options.onDownloadProgress !== "function") {
          throw new TypeError("The `onDownloadProgress` option must be a function");
        }
        if (!supportsResponseStreams) {
          throw new Error("Streams are not supported in your environment. `ReadableStream` is missing.");
        }
        return ky2._stream(response.clone(), ky2._options.onDownloadProgress);
      }
      return response;
    }, "function_");
    const isRetriableMethod = ky2._options.retry.methods.includes(ky2.request.method.toLowerCase());
    const result = isRetriableMethod ? ky2._retry(function_) : function_();
    for (const [type, mimeType] of Object.entries(responseTypes)) {
      result[type] = async () => {
        ky2.request.headers.set("accept", ky2.request.headers.get("accept") || mimeType);
        const response = await result;
        if (type === "json") {
          if (response.status === 204) {
            return "";
          }
          const arrayBuffer = await response.clone().arrayBuffer();
          const responseSize = arrayBuffer.byteLength;
          if (responseSize === 0) {
            return "";
          }
          if (options.parseJson) {
            return options.parseJson(await response.text());
          }
        }
        return response[type]();
      };
    }
    return result;
  }
  request;
  abortController;
  _retryCount = 0;
  _input;
  _options;
  // eslint-disable-next-line complexity
  constructor(input, options = {}) {
    this._input = input;
    this._options = {
      ...options,
      headers: mergeHeaders(this._input.headers, options.headers),
      hooks: mergeHooks({
        beforeRequest: [],
        beforeRetry: [],
        beforeError: [],
        afterResponse: []
      }, options.hooks),
      method: normalizeRequestMethod(options.method ?? this._input.method ?? "GET"),
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      prefixUrl: String(options.prefixUrl || ""),
      retry: normalizeRetryOptions(options.retry),
      throwHttpErrors: options.throwHttpErrors !== false,
      timeout: options.timeout ?? 1e4,
      fetch: options.fetch ?? globalThis.fetch.bind(globalThis)
    };
    if (typeof this._input !== "string" && !(this._input instanceof URL || this._input instanceof globalThis.Request)) {
      throw new TypeError("`input` must be a string, URL, or Request");
    }
    if (this._options.prefixUrl && typeof this._input === "string") {
      if (this._input.startsWith("/")) {
        throw new Error("`input` must not begin with a slash when using `prefixUrl`");
      }
      if (!this._options.prefixUrl.endsWith("/")) {
        this._options.prefixUrl += "/";
      }
      this._input = this._options.prefixUrl + this._input;
    }
    if (supportsAbortController) {
      this.abortController = new globalThis.AbortController();
      const originalSignal = this._options.signal ?? this._input.signal;
      if (originalSignal?.aborted) {
        this.abortController.abort(originalSignal?.reason);
      }
      originalSignal?.addEventListener("abort", () => {
        this.abortController.abort(originalSignal.reason);
      });
      this._options.signal = this.abortController.signal;
    }
    if (supportsRequestStreams) {
      this._options.duplex = "half";
    }
    if (this._options.json !== void 0) {
      this._options.body = this._options.stringifyJson?.(this._options.json) ?? JSON.stringify(this._options.json);
      this._options.headers.set("content-type", this._options.headers.get("content-type") ?? "application/json");
    }
    this.request = new globalThis.Request(this._input, this._options);
    if (this._options.searchParams) {
      const textSearchParams = typeof this._options.searchParams === "string" ? this._options.searchParams.replace(/^\?/, "") : new URLSearchParams(this._options.searchParams).toString();
      const searchParams = "?" + textSearchParams;
      const url = this.request.url.replace(/(?:\?.*?)?(?=#|$)/, searchParams);
      if ((supportsFormData && this._options.body instanceof globalThis.FormData || this._options.body instanceof URLSearchParams) && !(this._options.headers && this._options.headers["content-type"])) {
        this.request.headers.delete("content-type");
      }
      this.request = new globalThis.Request(new globalThis.Request(url, { ...this.request }), this._options);
    }
  }
  _calculateRetryDelay(error3) {
    this._retryCount++;
    if (this._retryCount > this._options.retry.limit || error3 instanceof TimeoutError) {
      throw error3;
    }
    if (error3 instanceof HTTPError) {
      if (!this._options.retry.statusCodes.includes(error3.response.status)) {
        throw error3;
      }
      const retryAfter = error3.response.headers.get("Retry-After") ?? error3.response.headers.get("RateLimit-Reset") ?? error3.response.headers.get("X-RateLimit-Reset") ?? error3.response.headers.get("X-Rate-Limit-Reset");
      if (retryAfter && this._options.retry.afterStatusCodes.includes(error3.response.status)) {
        let after = Number(retryAfter) * 1e3;
        if (Number.isNaN(after)) {
          after = Date.parse(retryAfter) - Date.now();
        } else if (after >= Date.parse("2024-01-01")) {
          after -= Date.now();
        }
        const max = this._options.retry.maxRetryAfter ?? after;
        return after < max ? after : max;
      }
      if (error3.response.status === 413) {
        throw error3;
      }
    }
    const retryDelay = this._options.retry.delay(this._retryCount);
    return Math.min(this._options.retry.backoffLimit, retryDelay);
  }
  _decorateResponse(response) {
    if (this._options.parseJson) {
      response.json = async () => this._options.parseJson(await response.text());
    }
    return response;
  }
  async _retry(function_) {
    try {
      return await function_();
    } catch (error3) {
      const ms = Math.min(this._calculateRetryDelay(error3), maxSafeTimeout);
      if (this._retryCount < 1) {
        throw error3;
      }
      await delay(ms, { signal: this._options.signal });
      for (const hook of this._options.hooks.beforeRetry) {
        const hookResult = await hook({
          request: this.request,
          options: this._options,
          error: error3,
          retryCount: this._retryCount
        });
        if (hookResult === stop) {
          return;
        }
      }
      return this._retry(function_);
    }
  }
  async _fetch() {
    for (const hook of this._options.hooks.beforeRequest) {
      const result = await hook(this.request, this._options);
      if (result instanceof Request) {
        this.request = result;
        break;
      }
      if (result instanceof Response) {
        return result;
      }
    }
    const nonRequestOptions = findUnknownOptions(this.request, this._options);
    const mainRequest = this.request;
    this.request = mainRequest.clone();
    if (this._options.timeout === false) {
      return this._options.fetch(mainRequest, nonRequestOptions);
    }
    return timeout(mainRequest, nonRequestOptions, this.abortController, this._options);
  }
  /* istanbul ignore next */
  _stream(response, onDownloadProgress) {
    const totalBytes = Number(response.headers.get("content-length")) || 0;
    let transferredBytes = 0;
    if (response.status === 204) {
      if (onDownloadProgress) {
        onDownloadProgress({ percent: 1, totalBytes, transferredBytes }, new Uint8Array());
      }
      return new globalThis.Response(null, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
    }
    return new globalThis.Response(new globalThis.ReadableStream({
      async start(controller) {
        const reader = response.body.getReader();
        if (onDownloadProgress) {
          onDownloadProgress({ percent: 0, transferredBytes: 0, totalBytes }, new Uint8Array());
        }
        async function read() {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            return;
          }
          if (onDownloadProgress) {
            transferredBytes += value.byteLength;
            const percent = totalBytes === 0 ? 0 : transferredBytes / totalBytes;
            onDownloadProgress({ percent, transferredBytes, totalBytes }, value);
          }
          controller.enqueue(value);
          await read();
        }
        __name(read, "read");
        await read();
      }
    }), {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });
  }
};

// node_modules/ky/distribution/index.js
var createInstance = /* @__PURE__ */ __name((defaults) => {
  const ky2 = /* @__PURE__ */ __name((input, options) => Ky.create(input, validateAndMerge(defaults, options)), "ky");
  for (const method of requestMethods) {
    ky2[method] = (input, options) => Ky.create(input, validateAndMerge(defaults, options, { method }));
  }
  ky2.create = (newDefaults) => createInstance(validateAndMerge(newDefaults));
  ky2.extend = (newDefaults) => {
    if (typeof newDefaults === "function") {
      newDefaults = newDefaults(defaults ?? {});
    }
    return createInstance(validateAndMerge(defaults, newDefaults));
  };
  ky2.stop = stop;
  return ky2;
}, "createInstance");
var ky = createInstance();
var distribution_default = ky;

// node_modules/@prisma/adapter-d1/dist/index.mjs
var name = "@prisma/adapter-d1";
var FORCE_COLOR2;
var NODE_DISABLE_COLORS2;
var NO_COLOR2;
var TERM2;
var isTTY2 = true;
if (typeof process !== "undefined") {
  ({ FORCE_COLOR: FORCE_COLOR2, NODE_DISABLE_COLORS: NODE_DISABLE_COLORS2, NO_COLOR: NO_COLOR2, TERM: TERM2 } = process.env || {});
  isTTY2 = process.stdout && process.stdout.isTTY;
}
var $2 = {
  enabled: !NODE_DISABLE_COLORS2 && NO_COLOR2 == null && TERM2 !== "dumb" && (FORCE_COLOR2 != null && FORCE_COLOR2 !== "0" || isTTY2)
};
function init2(x, y) {
  let rgx = new RegExp(`\\x1b\\[${y}m`, "g");
  let open = `\x1B[${x}m`, close = `\x1B[${y}m`;
  return function(txt) {
    if (!$2.enabled || txt == null) return txt;
    return open + (!!~("" + txt).indexOf(close) ? txt.replace(rgx, close + open) : txt) + close;
  };
}
__name(init2, "init");
var reset2 = init2(0, 0);
var bold2 = init2(1, 22);
var dim2 = init2(2, 22);
var italic2 = init2(3, 23);
var underline2 = init2(4, 24);
var inverse2 = init2(7, 27);
var hidden2 = init2(8, 28);
var strikethrough2 = init2(9, 29);
var black2 = init2(30, 39);
var red2 = init2(31, 39);
var green2 = init2(32, 39);
var yellow2 = init2(33, 39);
var blue2 = init2(34, 39);
var magenta2 = init2(35, 39);
var cyan2 = init2(36, 39);
var white2 = init2(37, 39);
var gray2 = init2(90, 39);
var grey2 = init2(90, 39);
var bgBlack2 = init2(40, 49);
var bgRed2 = init2(41, 49);
var bgGreen2 = init2(42, 49);
var bgYellow2 = init2(43, 49);
var bgBlue2 = init2(44, 49);
var bgMagenta2 = init2(45, 49);
var bgCyan2 = init2(46, 49);
var bgWhite2 = init2(47, 49);
var MAX_BIND_VALUES = 98;
var GENERIC_SQLITE_ERROR = 1;
function getColumnTypes(columnNames, rows) {
  const columnTypes = [];
  columnLoop: for (let columnIndex = 0; columnIndex < columnNames.length; columnIndex++) {
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const candidateValue = rows[rowIndex][columnIndex];
      if (candidateValue !== null) {
        const inferred = inferColumnType(candidateValue);
        if (columnTypes[columnIndex] === void 0 || inferred === ColumnTypeEnum.Text) {
          columnTypes[columnIndex] = inferred;
        }
        if (inferred !== ColumnTypeEnum.UnknownNumber) {
          continue columnLoop;
        }
      }
    }
    if (columnTypes[columnIndex] === void 0) {
      columnTypes[columnIndex] = ColumnTypeEnum.Int32;
    }
  }
  return columnTypes;
}
__name(getColumnTypes, "getColumnTypes");
function inferColumnType(value) {
  switch (typeof value) {
    case "string":
      return inferStringType(value);
    case "number":
      return inferNumberType(value);
    case "object":
      return inferObjectType(value);
    default:
      throw new UnexpectedTypeError(value);
  }
}
__name(inferColumnType, "inferColumnType");
var isoDateRegex = new RegExp(
  /^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))$|^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$|^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$/
);
var sqliteDateRegex = /^\d{4}-[0-1]\d-[0-3]\d [0-2]\d:[0-5]\d:[0-5]\d$/;
function isISODate(str) {
  return isoDateRegex.test(str) || sqliteDateRegex.test(str);
}
__name(isISODate, "isISODate");
function inferStringType(value) {
  if (isISODate(value)) {
    return ColumnTypeEnum.DateTime;
  }
  return ColumnTypeEnum.Text;
}
__name(inferStringType, "inferStringType");
function inferNumberType(_) {
  return ColumnTypeEnum.UnknownNumber;
}
__name(inferNumberType, "inferNumberType");
function inferObjectType(value) {
  if (value instanceof Array) {
    return ColumnTypeEnum.Bytes;
  }
  throw new UnexpectedTypeError(value);
}
__name(inferObjectType, "inferObjectType");
var UnexpectedTypeError = class extends Error {
  static {
    __name(this, "UnexpectedTypeError");
  }
  name = "UnexpectedTypeError";
  constructor(value) {
    const type = typeof value;
    const repr = type === "object" ? JSON.stringify(value) : String(value);
    super(`unexpected value of type ${type}: ${repr}`);
  }
};
function mapRow(result, columnTypes) {
  for (let i = 0; i < result.length; i++) {
    const value = result[i];
    if (value instanceof ArrayBuffer) {
      result[i] = Array.from(new Uint8Array(value));
      continue;
    }
    if (typeof value === "number" && (columnTypes[i] === ColumnTypeEnum.Int32 || columnTypes[i] === ColumnTypeEnum.Int64) && !Number.isInteger(value)) {
      result[i] = Math.trunc(value);
      continue;
    }
    if (typeof value === "number" && columnTypes[i] === ColumnTypeEnum.Text) {
      result[i] = value.toString();
      continue;
    }
    if (typeof value === "bigint") {
      result[i] = value.toString();
      continue;
    }
    if (columnTypes[i] === ColumnTypeEnum.Boolean) {
      result[i] = JSON.parse(value);
    }
  }
  return result;
}
__name(mapRow, "mapRow");
function mapArg(arg, argType) {
  if (arg === null) {
    return null;
  }
  if (typeof arg === "bigint" || argType.scalarType === "bigint") {
    const asInt56 = Number.parseInt(`${arg}`);
    if (!Number.isSafeInteger(asInt56)) {
      throw new Error(`Invalid Int64-encoded value received: ${arg}`);
    }
    return asInt56;
  }
  if (typeof arg === "string" && argType.scalarType === "int") {
    return Number.parseInt(arg);
  }
  if (typeof arg === "string" && argType.scalarType === "float") {
    return Number.parseFloat(arg);
  }
  if (typeof arg === "string" && argType.scalarType === "decimal") {
    return Number.parseFloat(arg);
  }
  if (arg === true) {
    return 1;
  }
  if (arg === false) {
    return 0;
  }
  if (typeof arg === "string" && argType.scalarType === "datetime") {
    arg = new Date(arg);
  }
  if (arg instanceof Date) {
    return arg.toISOString().replace("Z", "+00:00");
  }
  if (typeof arg === "string" && argType.scalarType === "bytes") {
    return Array.from(Buffer.from(arg, "base64"));
  }
  if (arg instanceof Uint8Array) {
    return Array.from(arg);
  }
  return arg;
}
__name(mapArg, "mapArg");
function convertDriverError(error3) {
  if (isDriverError(error3)) {
    return {
      originalMessage: error3.message,
      ...mapDriverError(error3)
    };
  }
  throw error3;
}
__name(convertDriverError, "convertDriverError");
function mapDriverError(error3) {
  let stripped = error3.message.split("D1_ERROR: ").at(1) ?? error3.message;
  stripped = stripped.split("SqliteError: ").at(1) ?? stripped;
  if (stripped.startsWith("UNIQUE constraint failed") || stripped.startsWith("PRIMARY KEY constraint failed")) {
    const fields = stripped.split(": ").at(1)?.split(", ").map((field) => field.split(".").pop());
    return {
      kind: "UniqueConstraintViolation",
      constraint: fields !== void 0 ? { fields } : void 0
    };
  } else if (stripped.startsWith("NOT NULL constraint failed")) {
    const fields = stripped.split(": ").at(1)?.split(", ").map((field) => field.split(".").pop());
    return {
      kind: "NullConstraintViolation",
      constraint: fields !== void 0 ? { fields } : void 0
    };
  } else if (stripped.startsWith("FOREIGN KEY constraint failed") || stripped.startsWith("CHECK constraint failed")) {
    return {
      kind: "ForeignKeyConstraintViolation",
      constraint: { foreignKey: {} }
    };
  } else if (stripped.startsWith("no such table")) {
    return {
      kind: "TableDoesNotExist",
      table: stripped.split(": ").at(1)
    };
  } else if (stripped.startsWith("no such column")) {
    return {
      kind: "ColumnNotFound",
      column: stripped.split(": ").at(1)
    };
  } else if (stripped.includes("has no column named ")) {
    return {
      kind: "ColumnNotFound",
      column: stripped.split("has no column named ").at(1)
    };
  }
  return {
    kind: "sqlite",
    extendedCode: error3["code"] ?? error3["cause"]?.["code"] ?? 1,
    message: error3.message
  };
}
__name(mapDriverError, "mapDriverError");
function isDriverError(error3) {
  return typeof error3["message"] === "string";
}
__name(isDriverError, "isDriverError");
var debug4 = Debug2("prisma:driver-adapter:d1-http");
function onUnsuccessfulD1HTTPResponse({ errors }) {
  debug4("D1 HTTP Errors: %O", errors);
  const error3 = errors.at(0) ?? { message: "Unknown error", code: GENERIC_SQLITE_ERROR };
  throw new DriverAdapterError(convertDriverError(error3));
}
__name(onUnsuccessfulD1HTTPResponse, "onUnsuccessfulD1HTTPResponse");
function onGenericD1HTTPError(error3) {
  debug4("HTTP Error: %O", error3);
  throw new DriverAdapterError(convertDriverError(error3));
}
__name(onGenericD1HTTPError, "onGenericD1HTTPError");
function onError(error3) {
  console.error("Error in performIO: %O", error3);
  throw new DriverAdapterError(convertDriverError(error3));
}
__name(onError, "onError");
async function performRawQuery(client, options) {
  try {
    const response = await client.post("raw", options).json();
    const tag = "[js::performRawQuery]";
    debug4(`${tag} %O`, {
      success: response.success,
      errors: response.errors,
      messages: response.messages,
      result: response.result
    });
    if (!response.success) {
      onUnsuccessfulD1HTTPResponse(response);
    }
    return response.result;
  } catch (e) {
    onGenericD1HTTPError(e);
  }
}
__name(performRawQuery, "performRawQuery");
function isD1HTTPParams(params) {
  return typeof params === "object" && params !== null && "CLOUDFLARE_D1_TOKEN" in params && "CLOUDFLARE_ACCOUNT_ID" in params && "CLOUDFLARE_DATABASE_ID" in params;
}
__name(isD1HTTPParams, "isD1HTTPParams");
var D1HTTPQueryable = class {
  static {
    __name(this, "D1HTTPQueryable");
  }
  constructor(client) {
    this.client = client;
  }
  provider = "sqlite";
  adapterName = `${name}-http`;
  /**
   * Execute a query given as SQL, interpolating the given parameters.
   */
  async queryRaw(query) {
    const tag = "[js::query_raw]";
    debug4(`${tag} %O`, query);
    const data = await this.performIO(query);
    const convertedData = this.convertData(data);
    return convertedData;
  }
  convertData({ columnNames, rows: results }) {
    if (results.length === 0) {
      return {
        columnNames: [],
        columnTypes: [],
        rows: []
      };
    }
    const columnTypes = getColumnTypes(columnNames, results);
    const rows = results.map((value) => mapRow(value, columnTypes));
    return {
      columnNames,
      columnTypes,
      rows
    };
  }
  /**
   * Execute a query given as SQL, interpolating the given parameters and
   * returning the number of affected rows.
   * Note: Queryable expects a u64, but napi.rs only supports u32.
   */
  async executeRaw(query) {
    const tag = "[js::execute_raw]";
    debug4(`${tag} %O`, query);
    const result = await this.performIO(query);
    return result.affectedRows ?? 0;
  }
  async performIO(query) {
    try {
      const body = {
        json: {
          sql: query.sql,
          params: query.args.map((arg, i) => mapArg(arg, query.argTypes[i]))
        }
      };
      const tag = "[js::perform_io]";
      debug4(`${tag} %O`, body);
      const results = await performRawQuery(this.client, body);
      if (results.length !== 1) {
        throw new Error("Expected exactly one result");
      }
      const result = results[0];
      const { columns: columnNames = [], rows = [] } = result.results ?? {};
      const affectedRows = result.meta?.changes;
      return { rows, columnNames, affectedRows };
    } catch (e) {
      onError(e);
    }
  }
};
var D1HTTPTransaction = class extends D1HTTPQueryable {
  static {
    __name(this, "D1HTTPTransaction");
  }
  constructor(client, options) {
    super(client);
    this.options = options;
  }
  async commit() {
    debug4(`[js::commit]`);
  }
  async rollback() {
    debug4(`[js::rollback]`);
  }
};
var PrismaD1HTTPAdapter = class extends D1HTTPQueryable {
  static {
    __name(this, "PrismaD1HTTPAdapter");
  }
  constructor(params, release2) {
    const D1_API_BASE_URL = `https://api.cloudflare.com/client/v4/accounts/${params.CLOUDFLARE_ACCOUNT_ID}/d1/database/${params.CLOUDFLARE_DATABASE_ID}`;
    const client = distribution_default.create({
      prefixUrl: D1_API_BASE_URL,
      headers: {
        Authorization: `Bearer ${params.CLOUDFLARE_D1_TOKEN}`
      },
      // Don't automatically throw on non-2xx status codes
      throwHttpErrors: false
    });
    super(client);
    this.release = release2;
  }
  tags = {
    error: red2("prisma:error"),
    warn: yellow2("prisma:warn"),
    info: cyan2("prisma:info"),
    query: blue2("prisma:query")
  };
  alreadyWarned = /* @__PURE__ */ new Set();
  /**
   * This will warn once per transaction
   * e.g. the following two explicit transactions
   * will only trigger _two_ warnings
   *
   * ```ts
   * await prisma.$transaction([ ...queries ])
   * await prisma.$transaction([ ...moreQueries ])
   * ```
   */
  warnOnce = /* @__PURE__ */ __name((key, message, ...args) => {
    if (!this.alreadyWarned.has(key)) {
      this.alreadyWarned.add(key);
      console.info(`${this.tags.warn} ${message}`, ...args);
    }
  }, "warnOnce");
  async executeScript(script) {
    try {
      await performRawQuery(this.client, {
        json: {
          sql: script
        }
      });
    } catch (error3) {
      onError(error3);
    }
  }
  getConnectionInfo() {
    return {
      maxBindValues: MAX_BIND_VALUES,
      supportsRelationJoins: false
    };
  }
  async startTransaction(isolationLevel) {
    if (isolationLevel && isolationLevel !== "SERIALIZABLE") {
      throw new DriverAdapterError({
        kind: "InvalidIsolationLevel",
        level: isolationLevel
      });
    }
    this.warnOnce(
      "D1 Transaction",
      "Cloudflare D1 does not support transactions yet. When using Prisma's D1 adapter, implicit & explicit transactions will be ignored and run as individual queries, which breaks the guarantees of the ACID properties of transactions. For more details see https://pris.ly/d/d1-transactions"
    );
    const options = {
      usePhantomQuery: true
    };
    const tag = "[js::startTransaction]";
    debug4("%s options: %O", tag, options);
    return new D1HTTPTransaction(this.client, options);
  }
  async dispose() {
    await this.release?.();
  }
};
var PrismaD1HTTPAdapterFactory = class {
  static {
    __name(this, "PrismaD1HTTPAdapterFactory");
  }
  constructor(params) {
    this.params = params;
  }
  provider = "sqlite";
  adapterName = `${name}-http`;
  async connect() {
    return new PrismaD1HTTPAdapter(this.params, async () => {
    });
  }
  async connectToShadowDb() {
    const D1_API_BASE_URL = `https://api.cloudflare.com/client/v4/accounts/${this.params.CLOUDFLARE_ACCOUNT_ID}/d1/database`;
    const client = distribution_default.create({
      headers: {
        Authorization: `Bearer ${this.params.CLOUDFLARE_D1_TOKEN}`
      },
      // Don't throw on non-2xx status codes
      throwHttpErrors: false
    });
    const createShadowDatabase = /* @__PURE__ */ __name(async () => {
      const tag = "[js::connectToShadowDb::createShadowDatabase]";
      const SHADOW_DATABASE_PREFIX = "_prisma_shadow_";
      const CLOUDFLARE_SHADOW_DATABASE_NAME = `${SHADOW_DATABASE_PREFIX}${globalThis.crypto.randomUUID()}`;
      debug4(`${tag} creating database %s`, CLOUDFLARE_SHADOW_DATABASE_NAME);
      try {
        const response = await client.post(D1_API_BASE_URL, {
          json: {
            name: CLOUDFLARE_SHADOW_DATABASE_NAME
          }
        }).json();
        debug4(`${tag} %O`, response);
        if (!response.success) {
          onUnsuccessfulD1HTTPResponse(response);
        }
        const { uuid: CLOUDFLARE_SHADOW_DATABASE_ID2 } = response.result;
        debug4(`${tag} created database %s with ID %s`, CLOUDFLARE_SHADOW_DATABASE_NAME, CLOUDFLARE_SHADOW_DATABASE_ID2);
        return CLOUDFLARE_SHADOW_DATABASE_ID2;
      } catch (e) {
        onGenericD1HTTPError(e);
      }
    }, "createShadowDatabase");
    const CLOUDFLARE_SHADOW_DATABASE_ID = this.params.CLOUDFLARE_SHADOW_DATABASE_ID ?? await createShadowDatabase();
    const dispose = /* @__PURE__ */ __name(async () => {
      const tag = "[js::connectToShadowDb::dispose]";
      try {
        debug4(`${tag} deleting database %s`, CLOUDFLARE_SHADOW_DATABASE_ID);
        const response = await client.delete(`${D1_API_BASE_URL}/${CLOUDFLARE_SHADOW_DATABASE_ID}`).json();
        debug4(`${tag} %O`, response);
        if (!response.success) {
          onUnsuccessfulD1HTTPResponse(response);
        }
      } catch (e) {
        onGenericD1HTTPError(e);
      }
    }, "dispose");
    return new PrismaD1HTTPAdapter(this.params, dispose);
  }
};
var debug22 = Debug2("prisma:driver-adapter:d1");
var D1WorkerQueryable = class {
  static {
    __name(this, "D1WorkerQueryable");
  }
  constructor(client) {
    this.client = client;
  }
  provider = "sqlite";
  adapterName = name;
  /**
   * Execute a query given as SQL, interpolating the given parameters.
   */
  async queryRaw(query) {
    const tag = "[js::query_raw]";
    debug22(`${tag} %O`, query);
    const data = await this.performIO(query);
    const convertedData = this.convertData(data);
    return convertedData;
  }
  convertData(ioResult) {
    const columnNames = ioResult[0];
    const results = ioResult[1];
    if (results.length === 0) {
      return {
        columnNames: [],
        columnTypes: [],
        rows: []
      };
    }
    const columnTypes = Object.values(getColumnTypes(columnNames, results));
    const rows = results.map((value) => mapRow(value, columnTypes));
    return {
      columnNames,
      // * Note: without Object.values the array looks like
      // * columnTypes: [ id: 128 ],
      // * and errors with:
      // * ✘ [ERROR] A hanging Promise was canceled. This happens when the worker runtime is waiting for a Promise from JavaScript to resolve, but has detected that the Promise cannot possibly ever resolve because all code and events related to the Promise's I/O context have already finished.
      columnTypes,
      rows
    };
  }
  /**
   * Execute a query given as SQL, interpolating the given parameters and
   * returning the number of affected rows.
   * Note: Queryable expects a u64, but napi.rs only supports u32.
   */
  async executeRaw(query) {
    const tag = "[js::execute_raw]";
    debug22(`${tag} %O`, query);
    const result = await this.performIO(query, true);
    return result.meta.changes ?? 0;
  }
  async performIO(query, executeRaw = false) {
    try {
      const args = query.args.map((arg, i) => mapArg(arg, query.argTypes[i]));
      const stmt = this.client.prepare(query.sql).bind(...args);
      if (executeRaw) {
        return await stmt.run();
      } else {
        const [columnNames, ...rows] = await stmt.raw({ columnNames: true });
        return [columnNames, rows];
      }
    } catch (e) {
      onError2(e);
    }
  }
};
var D1WorkerTransaction = class extends D1WorkerQueryable {
  static {
    __name(this, "D1WorkerTransaction");
  }
  constructor(client, options) {
    super(client);
    this.options = options;
  }
  async commit() {
    debug22(`[js::commit]`);
  }
  async rollback() {
    debug22(`[js::rollback]`);
  }
};
var PrismaD1WorkerAdapter = class extends D1WorkerQueryable {
  static {
    __name(this, "PrismaD1WorkerAdapter");
  }
  constructor(client, release2) {
    super(client);
    this.release = release2;
  }
  tags = {
    error: red2("prisma:error"),
    warn: yellow2("prisma:warn"),
    info: cyan2("prisma:info"),
    query: blue2("prisma:query")
  };
  alreadyWarned = /* @__PURE__ */ new Set();
  /**
   * This will warn once per transaction
   * e.g. the following two explicit transactions
   * will only trigger _two_ warnings
   *
   * ```ts
   * await prisma.$transaction([ ...queries ])
   * await prisma.$transaction([ ...moreQueries ])
   * ```
   */
  warnOnce = /* @__PURE__ */ __name((key, message, ...args) => {
    if (!this.alreadyWarned.has(key)) {
      this.alreadyWarned.add(key);
      console.info(`${this.tags.warn} ${message}`, ...args);
    }
  }, "warnOnce");
  async executeScript(script) {
    try {
      await this.client.exec(script);
    } catch (error3) {
      onError2(error3);
    }
  }
  getConnectionInfo() {
    return {
      maxBindValues: MAX_BIND_VALUES,
      supportsRelationJoins: false
    };
  }
  async startTransaction(isolationLevel) {
    if (isolationLevel && isolationLevel !== "SERIALIZABLE") {
      throw new DriverAdapterError({
        kind: "InvalidIsolationLevel",
        level: isolationLevel
      });
    }
    this.warnOnce(
      "D1 Transaction",
      "Cloudflare D1 does not support transactions yet. When using Prisma's D1 adapter, implicit & explicit transactions will be ignored and run as individual queries, which breaks the guarantees of the ACID properties of transactions. For more details see https://pris.ly/d/d1-transactions"
    );
    const options = {
      usePhantomQuery: true
    };
    const tag = "[js::startTransaction]";
    debug22("%s options: %O", tag, options);
    return new D1WorkerTransaction(this.client, options);
  }
  async dispose() {
    await this.release?.();
  }
};
var PrismaD1WorkerAdapterFactory = class {
  static {
    __name(this, "PrismaD1WorkerAdapterFactory");
  }
  constructor(client) {
    this.client = client;
  }
  provider = "sqlite";
  adapterName = name;
  async connect() {
    return new PrismaD1WorkerAdapter(this.client, async () => {
    });
  }
};
function onError2(error3) {
  console.error("Error in performIO: %O", error3);
  throw new DriverAdapterError(convertDriverError(error3));
}
__name(onError2, "onError2");
var PrismaD1 = class {
  static {
    __name(this, "PrismaD1");
  }
  provider = "sqlite";
  adapterName = name;
  connect;
  connectToShadowDb;
  constructor(params) {
    if (isD1HTTPParams(params)) {
      const factory = new PrismaD1HTTPAdapterFactory(params);
      const self2 = this;
      self2.connect = factory.connect.bind(factory);
      self2.connectToShadowDb = factory.connectToShadowDb.bind(factory);
    } else {
      const factory = new PrismaD1WorkerAdapterFactory(params);
      const self2 = this;
      self2.connect = factory.connect.bind(factory);
    }
  }
};

// src/services/ai.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
async function generateFuturePredictions(bookings, guesthouseName, apiKey) {
  const key = apiKey;
  if (!key || key === "MY_GEMINI_API_KEY") {
    console.log("Gemini API Key not set. Serving synthetic AI-driven forecast.");
    return generateSyntheticForecast(bookings, guesthouseName);
  }
  const formattedHistory = bookings.map((b) => ({
    checkIn: b.checkIn.toISOString().split("T")[0],
    checkOut: b.checkOut.toISOString().split("T")[0],
    amount: b.totalAmount,
    status: b.status
  }));
  const prompt = `
You are an expert hospitality data analyst. Analyze the following booking history of "${guesthouseName}" and generate a day-by-day 30-day forecast starting from today (June 29, 2026).
Historical Bookings:
${JSON.stringify(formattedHistory, null, 2)}

Provide a structured analysis containing:
1. Day-by-day occupancy rate (%) and revenue projection for the next 30 days.
2. A high-level executive summary analyzing peak days, revenue opportunities, and pricing recommendations.
3. 3-4 specific WhatsApp promotional ideas based on predicted low occupancy periods.

You must reply with ONLY the JSON object conforming to the requested schema.
`;
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
    const payload = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            predictions: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  date: { type: "STRING", description: "YYYY-MM-DD" },
                  predictedOccupancyRate: { type: "NUMBER", description: "Percentage from 0 to 100" },
                  predictedRevenue: { type: "NUMBER", description: "Projected daily revenue in currency" },
                  confidenceScore: { type: "NUMBER", description: "Confidence level 0.0 to 1.0" },
                  seasonalFactors: { type: "STRING", description: "Reasoning" }
                },
                required: ["date", "predictedOccupancyRate", "predictedRevenue", "confidenceScore", "seasonalFactors"]
              }
            },
            summaryText: { type: "STRING", description: "Executive narrative of upcoming trends and pricing suggestions" },
            recommendedPromotions: {
              type: "ARRAY",
              items: { type: "STRING" },
              description: "Actionable targeted promotional ideas for low-demand periods"
            }
          },
          required: ["predictions", "summaryText", "recommendedPromotions"]
        }
      }
    };
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "aistudio-build"
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error(`Gemini API responded with status ${res.status}: ${await res.text()}`);
    }
    const data = await res.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) {
      throw new Error("Empty response from Gemini API");
    }
    return JSON.parse(textResponse);
  } catch (error3) {
    console.error("Error generating AI predictions via Gemini edge API:", error3);
    return generateSyntheticForecast(bookings, guesthouseName);
  }
}
__name(generateFuturePredictions, "generateFuturePredictions");
function generateSyntheticForecast(bookings, guesthouseName) {
  const predictions = [];
  const baseDate = /* @__PURE__ */ new Date("2026-06-29T12:00:00Z");
  const activeBookings = bookings.filter((b) => b.status !== "CANCELLED");
  const avgRevenue = activeBookings.length > 0 ? activeBookings.reduce((sum, b) => sum + b.totalAmount, 0) / activeBookings.length : 150;
  for (let i = 0; i < 30; i++) {
    const targetDate = new Date(baseDate);
    targetDate.setDate(targetDate.getDate() + i);
    const dayOfWeek = targetDate.getDay();
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
    let baseOcc = isWeekend ? 85 : 45;
    baseOcc += Math.floor(Math.sin(i / 2) * 10) + Math.floor(Math.random() * 8);
    baseOcc = Math.max(10, Math.min(100, baseOcc));
    const predRev = Math.round(baseOcc * (avgRevenue / 50) * 10) / 10;
    const dateStr = targetDate.toISOString().split("T")[0];
    predictions.push({
      date: dateStr,
      predictedOccupancyRate: baseOcc,
      predictedRevenue: predRev,
      confidenceScore: Math.round((0.85 - i * 5e-3) * 100) / 100,
      // confidence lowers further in the future
      seasonalFactors: isWeekend ? "Weekend surge due to local leisure travelers" : i > 15 ? "Mid-summer seasonal baseline uplift" : "Standard mid-week business traveler pricing"
    });
  }
  const lowPeriods = predictions.filter((p) => p.predictedOccupancyRate < 45).slice(0, 3).map((p) => p.date);
  const promoDates = lowPeriods.length > 0 ? lowPeriods.join(", ") : "upcoming mid-weeks";
  return {
    predictions,
    summaryText: `Based on an analysis of historical patterns at ${guesthouseName}, we forecast a strong weekend occupancy performance (averaging 80%+), with a standard mid-week lull down to 40-45%. We anticipate July will see a 12% increase in baseline bookings. We highly recommend launching targeted WhatsApp promotions targeting the low-occupancy periods around ${promoDates} to capture latent demand.`,
    recommendedPromotions: [
      `Mid-Week Explorer Discount: Send a WhatsApp promo offering a 'Stay 3, Pay 2' package for checkout dates aligning with mid-week lulls.`,
      `WhatsApp Exclusive 15% off: Target repeat customers with a custom Meta Campaign discount for bookings during the week of ${predictions[12]?.date || "next week"}.`,
      `Last-Minute Fill: Automate WhatsApp template blasts 48 hours prior to open rooms with complimentary breakfasts.`
    ]
  };
}
__name(generateSyntheticForecast, "generateSyntheticForecast");

// src/services/whatsapp.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
async function sendWhatsAppMessage(prisma, params) {
  const { guesthouseId, phone, content, messageType, bookingId, campaignId, config: config2 } = params;
  const messageId = `wa-msg-${Date.now()}-${Math.floor(Math.random() * 1e4)}`;
  const normalizedPhone = phone.replace(/[\s\-\+]/g, "");
  if (config2 && config2.phoneId && config2.token && config2.token !== "EAAGb0ZC...") {
    try {
      const url = `https://graph.facebook.com/v18.0/${config2.phoneId}/messages`;
      const payload = {
        messaging_product: "whatsapp",
        to: normalizedPhone
      };
      if (messageType === "REVIEW_REQUEST") {
        payload.type = "template";
        payload.template = {
          name: "checkout_feedback",
          language: { code: "en_US" },
          components: [
            {
              type: "body",
              parameters: [{ type: "text", text: content.substring(0, 100) }]
            }
          ]
        };
      } else {
        payload.type = "text";
        payload.text = { preview_url: true, body: content };
      }
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config2.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok) {
        await prisma.messageLog.create({
          data: {
            guesthouseId,
            bookingId,
            campaignId,
            phone,
            direction: "OUTBOUND",
            messageType,
            content,
            status: "DELIVERED"
          }
        });
        return {
          success: true,
          messageId: data.messages?.[0]?.id || messageId,
          status: "DELIVERED",
          contentSent: content
        };
      }
      throw new Error(data.error?.message || "Meta API failure");
    } catch (err) {
      console.error(`Meta WhatsApp dispatch failed: ${err.message}`);
      await prisma.messageLog.create({
        data: {
          guesthouseId,
          bookingId,
          campaignId,
          phone,
          direction: "OUTBOUND",
          messageType,
          content,
          status: "FAILED"
        }
      });
      return { success: false, messageId, status: "FAILED", contentSent: content };
    }
  }
  let finalStatus = "DELIVERED";
  if (messageType === "PROMO") {
    const r = Math.random();
    if (r < 0.55) finalStatus = "READ";
    else if (r < 0.8) finalStatus = "DELIVERED";
    else if (r < 0.95) finalStatus = "SENT";
    else finalStatus = "FAILED";
  }
  await prisma.messageLog.create({
    data: {
      guesthouseId,
      bookingId,
      campaignId,
      phone,
      direction: "OUTBOUND",
      messageType,
      content,
      status: finalStatus
    }
  });
  if (finalStatus === "READ" && messageType === "PROMO" && campaignId) {
    if (Math.random() < 0.6) {
      const replies = [
        "Sounds like an amazing offer! Count me in. Just booked!",
        "Thanks for this discount. What rooms are available next weekend?",
        "Perfect! Pula! We loved our stay and would love to visit again.",
        "Is the coupon code SUMMER15 also valid for premium suites?"
      ];
      const replyContent = replies[Math.floor(Math.random() * replies.length)];
      await prisma.messageLog.create({
        data: {
          guesthouseId,
          campaignId,
          phone,
          direction: "INBOUND",
          messageType: "GENERAL",
          content: replyContent,
          status: "READ"
        }
      });
      const customer = await prisma.customer.findFirst({
        where: { guesthouseId, phone }
      });
      const customerName = customer ? customer.name : "Valued Guest";
      if (Math.random() < 0.5) {
        const rooms = ["Executive Suite", "Deluxe Room", "Garden Cottage", "Standard Room"];
        const checkIn = /* @__PURE__ */ new Date();
        checkIn.setDate(checkIn.getDate() + Math.floor(Math.random() * 7) + 1);
        const checkOut = new Date(checkIn);
        checkOut.setDate(checkOut.getDate() + Math.floor(Math.random() * 3) + 1);
        await prisma.booking.create({
          data: {
            guesthouseId,
            customerName,
            customerEmail: customer?.email || "guest@example.com",
            customerPhone: phone,
            roomName: rooms[Math.floor(Math.random() * rooms.length)],
            checkIn,
            checkOut,
            status: Math.random() > 0.4 ? "CHECKED_IN" : "CONFIRMED",
            totalAmount: Math.floor(Math.random() * 800) + 350
          }
        });
      }
    }
  }
  return {
    success: finalStatus !== "FAILED",
    messageId,
    status: finalStatus,
    contentSent: content
  };
}
__name(sendWhatsAppMessage, "sendWhatsAppMessage");
async function runCheckoutReviewAutomation(prisma, guesthouseId) {
  const guesthouse = await prisma.guesthouse.findUnique({ where: { id: guesthouseId } });
  if (!guesthouse) return { processed: 0, sent: 0 };
  const startOfDay = /* @__PURE__ */ new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = /* @__PURE__ */ new Date();
  endOfDay.setHours(23, 59, 59, 999);
  const eligible = await prisma.booking.findMany({
    where: {
      guesthouseId,
      checkOut: { gte: startOfDay, lte: endOfDay },
      reviewMessageStatus: "PENDING",
      status: { in: ["CHECKED_OUT", "CHECKED_IN"] }
    }
  });
  const waConfig = guesthouse.whatsappPhoneId && guesthouse.whatsappToken ? {
    phoneId: guesthouse.whatsappPhoneId,
    token: guesthouse.whatsappToken,
    businessId: guesthouse.whatsappBusinessId || void 0
  } : void 0;
  let processed = 0;
  let sent = 0;
  for (const b of eligible) {
    processed++;
    const slug = guesthouse.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    const reviewContent = `Hi ${b.customerName}! Thank you for staying at ${guesthouse.name}. Please take 30 seconds to share your review: https://g.page/${slug}/review`;
    const result = await sendWhatsAppMessage(prisma, {
      guesthouseId,
      phone: b.customerPhone,
      content: reviewContent,
      messageType: "REVIEW_REQUEST",
      bookingId: b.id,
      config: waConfig
    });
    await prisma.booking.update({
      where: { id: b.id },
      data: {
        reviewMessageStatus: result.success ? "SENT" : "FAILED",
        reviewCollected: result.success
      }
    });
    if (result.success) sent++;
  }
  return { processed, sent };
}
__name(runCheckoutReviewAutomation, "runCheckoutReviewAutomation");
async function executeMarketingCampaign(prisma, guesthouseId, campaignName, templateContent, customerIds) {
  const guesthouse = await prisma.guesthouse.findUnique({ where: { id: guesthouseId } });
  if (!guesthouse) return { totalOptIn: 0, sent: 0 };
  const consented = await prisma.customer.findMany({
    where: {
      guesthouseId,
      optInPromo: true,
      ...customerIds && customerIds.length > 0 ? { id: { in: customerIds } } : {}
    }
  });
  const waConfig = guesthouse.whatsappPhoneId && guesthouse.whatsappToken ? {
    phoneId: guesthouse.whatsappPhoneId,
    token: guesthouse.whatsappToken,
    businessId: guesthouse.whatsappBusinessId || void 0
  } : void 0;
  const campaign = await prisma.campaign.create({
    data: {
      guesthouseId,
      name: campaignName,
      messageTemplate: templateContent.substring(0, 50),
      status: "SENT",
      scheduledAt: /* @__PURE__ */ new Date()
    }
  });
  let sent = 0;
  for (const c of consented) {
    const personalized = templateContent.replace(/\{\{name\}\}/gi, c.name);
    const result = await sendWhatsAppMessage(prisma, {
      guesthouseId,
      phone: c.phone,
      content: personalized,
      messageType: "PROMO",
      campaignId: campaign.id,
      config: waConfig
    });
    if (result.success) sent++;
  }
  return { totalOptIn: consented.length, sent };
}
__name(executeMarketingCampaign, "executeMarketingCampaign");

// src/services/reports.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function compileReportData(params) {
  const days = params.days || 30;
  const endDate = /* @__PURE__ */ new Date("2026-06-29T23:59:59Z");
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - days);
  const filteredBookings = params.bookings.filter(
    (b) => b.checkIn >= startDate && b.checkIn <= endDate && b.status !== "CANCELLED"
  );
  const totalRevenue = filteredBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalBookings = filteredBookings.length;
  const totalRooms = 5;
  const totalAvailableNights = totalRooms * days;
  const occupiedNights = filteredBookings.reduce((nights, b) => {
    const diffTime = Math.abs(b.checkOut.getTime() - b.checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
    return nights + diffDays;
  }, 0);
  const occupancyRate = totalAvailableNights > 0 ? Math.round(occupiedNights / totalAvailableNights * 100) : 0;
  const averageDailyRate = occupiedNights > 0 ? Math.round(totalRevenue / occupiedNights * 100) / 100 : 0;
  const RevPAR = Math.round(averageDailyRate * (occupancyRate / 100) * 100) / 100;
  const optIns = params.customers.filter((c) => c.optInPromo).length;
  const reviewSent = params.logs.filter((l) => l.messageType === "REVIEW_REQUEST").length;
  const reviewsRead = params.logs.filter(
    (l) => l.messageType === "REVIEW_REQUEST" && l.status === "READ"
  ).length;
  const responseRate = reviewSent > 0 ? Math.round(reviewsRead / reviewSent * 100) : 0;
  const summary = {
    guesthouseName: params.guesthouseName,
    generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
    totalRevenue,
    totalBookings,
    occupancyRate,
    averageDailyRate,
    revenuePerAvailableRoom: RevPAR,
    whatsappOptInCount: optIns,
    whatsappCampaignCount: Math.max(1, params.logs.filter((l) => l.messageType === "PROMO").length),
    whatsappReviewRequestsSent: reviewSent,
    whatsappResponseRate: responseRate
  };
  const roomRevenueMap = {};
  filteredBookings.forEach((b) => {
    const room = b.roomName || "Standard Room";
    const diffTime = Math.abs(b.checkOut.getTime() - b.checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
    if (!roomRevenueMap[room]) {
      roomRevenueMap[room] = { bookings: 0, revenue: 0, nights: 0 };
    }
    roomRevenueMap[room].bookings += 1;
    roomRevenueMap[room].revenue += b.totalAmount;
    roomRevenueMap[room].nights += diffDays;
  });
  const revenueByRoomTable = Object.entries(roomRevenueMap).map(([room, data]) => ({
    room,
    bookingsCount: data.bookings,
    nightsSold: data.nights,
    revenueCollected: data.revenue,
    averageRatePerNight: Math.round(data.revenue / (data.nights || 1) * 100) / 100
  }));
  const bookingDetailsTable = filteredBookings.map((b) => ({
    id: b.id,
    customer: b.customerName,
    phone: b.customerPhone,
    room: b.roomName,
    checkInDate: b.checkIn.toISOString().split("T")[0],
    checkOutDate: b.checkOut.toISOString().split("T")[0],
    revenue: b.totalAmount,
    status: b.status,
    whatsappAutomated: b.reviewMessageStatus
  }));
  const customerMap = /* @__PURE__ */ new Map();
  params.customers.forEach((c) => {
    customerMap.set(c.phone.trim().replace(/\s+/g, ""), c);
  });
  const countryMap = {};
  const genderMap = {};
  const ageGroupMap = {};
  const groupStyleMap = {};
  filteredBookings.forEach((b) => {
    const normPhone = b.customerPhone.trim().replace(/\s+/g, "");
    const cust = customerMap.get(normPhone);
    const country = b.customerCountry || (cust ? cust.customerCountry : void 0) || "Botswana (local)";
    if (!countryMap[country]) countryMap[country] = { bookings: 0, revenue: 0 };
    countryMap[country].bookings += 1;
    countryMap[country].revenue += b.totalAmount;
    let gender = cust && cust.gender ? cust.gender : "Unspecified";
    if (gender === "MALE") gender = "Male";
    else if (gender === "FEMALE") gender = "Female";
    else if (gender === "OTHER") gender = "Other";
    if (!genderMap[gender]) genderMap[gender] = { bookings: 0, revenue: 0 };
    genderMap[gender].bookings += 1;
    genderMap[gender].revenue += b.totalAmount;
    const ageGroup = cust && cust.ageGroup ? cust.ageGroup : "Unspecified";
    if (!ageGroupMap[ageGroup]) ageGroupMap[ageGroup] = { bookings: 0, revenue: 0 };
    ageGroupMap[ageGroup].bookings += 1;
    ageGroupMap[ageGroup].revenue += b.totalAmount;
    let groupStyle = cust && cust.groupStyle ? cust.groupStyle : "Unspecified";
    if (groupStyle === "SINGLE") groupStyle = "Solo Traveler";
    else if (groupStyle === "COUPLE") groupStyle = "Couple";
    else if (groupStyle === "FAMILY") groupStyle = "Family";
    if (!groupStyleMap[groupStyle]) groupStyleMap[groupStyle] = { bookings: 0, revenue: 0 };
    groupStyleMap[groupStyle].bookings += 1;
    groupStyleMap[groupStyle].revenue += b.totalAmount;
  });
  const byCountry = Object.entries(countryMap).map(([name2, val]) => ({
    name: name2,
    bookingsCount: val.bookings,
    revenueCollected: val.revenue
  })).sort((a, b) => b.revenueCollected - a.revenueCollected);
  const byGender = Object.entries(genderMap).map(([name2, val]) => ({
    name: name2,
    bookingsCount: val.bookings,
    revenueCollected: val.revenue
  })).sort((a, b) => b.revenueCollected - a.revenueCollected);
  const byAgeGroup = Object.entries(ageGroupMap).map(([name2, val]) => ({
    name: name2,
    bookingsCount: val.bookings,
    revenueCollected: val.revenue
  })).sort((a, b) => b.revenueCollected - a.revenueCollected);
  const byGroupStyle = Object.entries(groupStyleMap).map(([name2, val]) => ({
    name: name2,
    bookingsCount: val.bookings,
    revenueCollected: val.revenue
  })).sort((a, b) => b.revenueCollected - a.revenueCollected);
  return {
    summary,
    revenueByRoomTable,
    bookingDetailsTable,
    demographics: {
      byCountry,
      byGender,
      byAgeGroup,
      byGroupStyle
    }
  };
}
__name(compileReportData, "compileReportData");
function convertToCSV(headers, keys, data) {
  const headerLine = headers.join(",");
  const rowLines = data.map(
    (item) => keys.map((key) => {
      const val = item[key];
      if (val === void 0 || val === null) return '""';
      const strVal = String(val).replace(/"/g, '""');
      return `"${strVal}"`;
    }).join(",")
  );
  return [headerLine, ...rowLines].join("\n");
}
__name(convertToCSV, "convertToCSV");

// src/services/facebook.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var GRAPH_API_BASE = "https://graph.facebook.com/v21.0";
function normalizeInsights(raw3, level) {
  return raw3.map((r) => {
    const impressions = parseInt(r.impressions || "0", 10);
    const clicks = parseInt(r.clicks || "0", 10);
    const spend = parseFloat(r.spend || "0");
    const reach = parseInt(r.reach || "0", 10);
    const cpm = parseFloat(r.cpm || "0");
    const ctr = parseFloat(r.ctr || "0");
    const cpc = parseFloat(r.cpc || "0");
    const conversionTypes = [
      "purchase",
      "offsite_conversion.fb_pixel_purchase",
      "complete_registration",
      "lead",
      "omni_purchase"
    ];
    const conversions = (r.actions || []).filter((a) => conversionTypes.includes(a.action_type)).reduce((sum, a) => sum + parseInt(a.value || "0", 10), 0);
    const purchaseValue = (r.action_values || []).filter(
      (a) => ["purchase", "offsite_conversion.fb_pixel_purchase", "omni_purchase"].includes(a.action_type)
    ).reduce((sum, a) => sum + parseFloat(a.value || "0"), 0);
    const roas = spend > 0 ? Math.round(purchaseValue / spend * 100) / 100 : 0;
    const objectId = level === "CAMPAIGN" ? r.campaign_id || "" : level === "ADSET" ? r.adset_id || "" : level === "AD" ? r.ad_id || "" : "account";
    const objectName = level === "CAMPAIGN" ? r.campaign_name || "" : level === "ADSET" ? r.adset_name || "" : level === "AD" ? r.ad_name || "" : "Account";
    return {
      objectId,
      objectLevel: level,
      objectName,
      date: r.date_start,
      impressions,
      clicks,
      spend,
      reach,
      conversions,
      cpm,
      ctr,
      cpc,
      roas
    };
  });
}
__name(normalizeInsights, "normalizeInsights");
async function graphGet(path, accessToken) {
  const url = `${GRAPH_API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Meta Graph API error ${res.status}: ${body}`);
  }
  return res.json();
}
__name(graphGet, "graphGet");
async function graphPost(path, accessToken, body) {
  const url = `${GRAPH_API_BASE}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const b = await res.text();
    throw new Error(`Meta Graph API error ${res.status}: ${b}`);
  }
  return res.json();
}
__name(graphPost, "graphPost");
async function graphPatch(path, accessToken, body) {
  const url = `${GRAPH_API_BASE}${path}`;
  const res = await fetch(url, {
    method: "POST",
    // Graph API uses POST with method_override for PATCH
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ ...body, method: "post" })
  });
  if (!res.ok) {
    const b = await res.text();
    throw new Error(`Meta Graph API error ${res.status}: ${b}`);
  }
  return res.json();
}
__name(graphPatch, "graphPatch");
async function fetchAdInsights(accessToken, adAccountId, {
  since,
  until,
  level = "campaign"
}) {
  const fields = [
    "campaign_id",
    "campaign_name",
    "adset_id",
    "adset_name",
    "ad_id",
    "ad_name",
    "impressions",
    "clicks",
    "spend",
    "reach",
    "cpm",
    "ctr",
    "cpc",
    "actions",
    "action_values",
    "date_start"
  ].join(",");
  const params = new URLSearchParams({
    fields,
    time_range: JSON.stringify({ since, until }),
    time_increment: "1",
    level,
    limit: "200",
    access_token: accessToken
  });
  const path = `/${adAccountId}/insights?${params.toString()}`;
  const data = await graphGet(path, accessToken);
  const raw3 = data.data || [];
  const levelMap = {
    campaign: "CAMPAIGN",
    adset: "ADSET",
    ad: "AD",
    account: "ACCOUNT"
  };
  return normalizeInsights(raw3, levelMap[level] || "CAMPAIGN");
}
__name(fetchAdInsights, "fetchAdInsights");
async function fetchCampaigns(accessToken, adAccountId) {
  const fields = "id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time";
  const params = new URLSearchParams({ fields, limit: "100", access_token: accessToken });
  const data = await graphGet(`/${adAccountId}/campaigns?${params}`, accessToken);
  return data.data || [];
}
__name(fetchCampaigns, "fetchCampaigns");
async function createCampaign(accessToken, adAccountId, payload) {
  const body = {
    name: payload.name,
    objective: payload.objective,
    status: payload.status || "PAUSED",
    special_ad_categories: []
  };
  if (payload.dailyBudget) body.daily_budget = Math.round(payload.dailyBudget * 100);
  if (payload.lifetimeBudget) body.lifetime_budget = Math.round(payload.lifetimeBudget * 100);
  if (payload.startTime) body.start_time = payload.startTime;
  if (payload.stopTime) body.stop_time = payload.stopTime;
  return graphPost(`/${adAccountId}/campaigns`, accessToken, body);
}
__name(createCampaign, "createCampaign");
async function updateCampaignBudget(accessToken, campaignId, dailyBudgetCents) {
  return graphPatch(`/${campaignId}`, accessToken, {
    daily_budget: dailyBudgetCents
  });
}
__name(updateCampaignBudget, "updateCampaignBudget");
function generateMockInsights(adAccountId) {
  const campaigns = [
    { id: "mock-camp-001", name: "Weekend Getaway Promo", spend_base: 45, imp_base: 3200, ctr_base: 2.1 },
    { id: "mock-camp-002", name: "Honeymoon Package", spend_base: 30, imp_base: 1800, ctr_base: 3.4 },
    { id: "mock-camp-003", name: "Business Traveler", spend_base: 20, imp_base: 1100, ctr_base: 1.8 }
  ];
  const insights = [];
  const baseDate = /* @__PURE__ */ new Date("2026-06-01");
  for (let d = 0; d < 30; d++) {
    const day = new Date(baseDate);
    day.setDate(day.getDate() + d);
    const dateStr = day.toISOString().split("T")[0];
    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
    const weekendMult = isWeekend ? 1.45 : 1;
    for (const c of campaigns) {
      const jitter = 0.85 + Math.random() * 0.3;
      const impressions = Math.round(c.imp_base * weekendMult * jitter);
      const ctr = c.ctr_base * (0.9 + Math.random() * 0.2);
      const clicks = Math.round(impressions * ctr / 100);
      const spend = Math.round(c.spend_base * weekendMult * jitter * 100) / 100;
      const cpm = spend > 0 && impressions > 0 ? spend / impressions * 1e3 : 0;
      const cpc = clicks > 0 ? spend / clicks : 0;
      const conversions = Math.round(clicks * 0.04 * (0.8 + Math.random() * 0.4));
      const roas = spend > 0 ? Math.round(conversions * 180 / spend * 100) / 100 : 0;
      insights.push({
        objectId: c.id,
        objectLevel: "CAMPAIGN",
        objectName: c.name,
        date: dateStr,
        impressions,
        clicks,
        spend,
        reach: Math.round(impressions * 0.85),
        conversions,
        cpm: Math.round(cpm * 100) / 100,
        ctr: Math.round(ctr * 100) / 100,
        cpc: Math.round(cpc * 100) / 100,
        roas
      });
    }
  }
  return insights;
}
__name(generateMockInsights, "generateMockInsights");
function generateMockCampaigns() {
  return [
    {
      id: "mock-camp-001",
      name: "Weekend Getaway Promo",
      status: "ACTIVE",
      objective: "CONVERSIONS",
      daily_budget: "4500",
      start_time: "2026-06-01T00:00:00+0000"
    },
    {
      id: "mock-camp-002",
      name: "Honeymoon Package",
      status: "ACTIVE",
      objective: "TRAFFIC",
      daily_budget: "3000",
      start_time: "2026-06-01T00:00:00+0000"
    },
    {
      id: "mock-camp-003",
      name: "Business Traveler",
      status: "PAUSED",
      objective: "REACH",
      daily_budget: "2000",
      start_time: "2026-06-01T00:00:00+0000"
    }
  ];
}
__name(generateMockCampaigns, "generateMockCampaigns");

// src/services/facebook_ai.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
async function buildAdvisorContext(prisma, guesthouseId, windowDays) {
  const since = /* @__PURE__ */ new Date();
  since.setDate(since.getDate() - windowDays);
  const sinceStr = since.toISOString().split("T")[0];
  const insights = await prisma.facebookInsight.findMany({
    where: {
      guesthouseId,
      objectLevel: "CAMPAIGN",
      date: { gte: sinceStr }
    },
    orderBy: { date: "asc" }
  });
  const campaigns = await prisma.facebookCampaign.findMany({
    where: { guesthouseId }
  });
  const campaignTotals = {};
  for (const row of insights) {
    const id = row.objectId;
    if (!campaignTotals[id]) {
      campaignTotals[id] = {
        campaignId: id,
        campaignName: row.objectName || id,
        totalSpend: 0,
        totalImpressions: 0,
        totalClicks: 0,
        totalConversions: 0,
        avgCtr: 0,
        avgCpc: 0,
        avgRoas: 0
      };
    }
    const t = campaignTotals[id];
    t.totalSpend += row.spend;
    t.totalImpressions += row.impressions;
    t.totalClicks += row.clicks;
    t.totalConversions += row.conversions;
  }
  for (const t of Object.values(campaignTotals)) {
    t.avgCtr = t.totalImpressions > 0 ? t.totalClicks / t.totalImpressions * 100 : 0;
    t.avgCpc = t.totalClicks > 0 ? t.totalSpend / t.totalClicks : 0;
    t.avgRoas = t.totalSpend > 0 ? t.totalConversions * 180 / t.totalSpend : 0;
    t.totalSpend = Math.round(t.totalSpend * 100) / 100;
    t.avgCtr = Math.round(t.avgCtr * 100) / 100;
    t.avgCpc = Math.round(t.avgCpc * 100) / 100;
    t.avgRoas = Math.round(t.avgRoas * 100) / 100;
  }
  const allTotals = Object.values(campaignTotals);
  const totalSpend = allTotals.reduce((s, c) => s + c.totalSpend, 0);
  const totalImpressions = allTotals.reduce((s, c) => s + c.totalImpressions, 0);
  const totalClicks = allTotals.reduce((s, c) => s + c.totalClicks, 0);
  const totalConversions = allTotals.reduce((s, c) => s + c.totalConversions, 0);
  const overallCtr = totalImpressions > 0 ? totalClicks / totalImpressions * 100 : 0;
  const overallCpc = totalClicks > 0 ? totalSpend / totalClicks : 0;
  const dailySpend = {};
  for (const row of insights) {
    if (!dailySpend[row.date]) dailySpend[row.date] = 0;
    dailySpend[row.date] += row.spend;
  }
  const spendTrend = Object.entries(dailySpend).slice(-14).map(([date, spend]) => ({ date, spend: Math.round(spend * 100) / 100 }));
  return {
    windowDays,
    analysisDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    overview: {
      totalSpend: Math.round(totalSpend * 100) / 100,
      totalImpressions,
      totalClicks,
      totalConversions,
      overallCtr: Math.round(overallCtr * 100) / 100,
      overallCpc: Math.round(overallCpc * 100) / 100
    },
    campaigns: campaigns.map((c) => ({
      id: c.id,
      name: c.name,
      status: c.status,
      objective: c.objective,
      dailyBudget: c.dailyBudget,
      lifetimeBudget: c.lifetimeBudget,
      performance: campaignTotals[c.id] || null
    })),
    campaignPerformance: allTotals,
    dailySpendTrend: spendTrend
  };
}
__name(buildAdvisorContext, "buildAdvisorContext");
async function generateAdvisorAdvice(context2, guesthouseName, geminiApiKey) {
  const prompt = `
You are an expert Facebook Ads performance analyst for the hospitality industry.
Analyze the following ${context2.windowDays}-day Facebook Ads performance data for "${guesthouseName}" and provide actionable advice.

Performance Data:
${JSON.stringify(context2, null, 2)}

Provide a structured analysis with:
1. A concise executive performance summary (2-3 sentences).
2. Budget reallocation suggestions: For each campaign, suggest an optimal daily budget with a specific data-driven rationale.
3. Identify the top 2-3 performing campaigns with key metrics.
4. Identify the bottom 1-2 underperforming campaigns with specific improvement actions.
5. Target audience insights based on CTR and conversion patterns.
6. A 30-day forward outlook with projected spend, clicks, and conversions.

Be specific with numbers and percentages. Focus on actionable next steps.
Reply with ONLY the JSON object conforming to the schema.
`;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          performanceSummary: { type: "STRING" },
          budgetSuggestions: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                campaignId: { type: "STRING" },
                campaignName: { type: "STRING" },
                currentDailyBudget: { type: "NUMBER" },
                suggestedDailyBudget: { type: "NUMBER" },
                rationale: { type: "STRING" }
              },
              required: ["campaignId", "campaignName", "currentDailyBudget", "suggestedDailyBudget", "rationale"]
            }
          },
          topPerformers: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                campaignId: { type: "STRING" },
                campaignName: { type: "STRING" },
                totalSpend: { type: "NUMBER" },
                totalImpressions: { type: "NUMBER" },
                totalClicks: { type: "NUMBER" },
                totalConversions: { type: "NUMBER" },
                avgCtr: { type: "NUMBER" },
                avgCpc: { type: "NUMBER" },
                avgRoas: { type: "NUMBER" }
              },
              required: ["campaignId", "campaignName", "totalSpend", "totalImpressions", "totalClicks", "totalConversions", "avgCtr", "avgCpc", "avgRoas"]
            }
          },
          bottomPerformers: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                campaignId: { type: "STRING" },
                campaignName: { type: "STRING" },
                totalSpend: { type: "NUMBER" },
                totalImpressions: { type: "NUMBER" },
                totalClicks: { type: "NUMBER" },
                totalConversions: { type: "NUMBER" },
                avgCtr: { type: "NUMBER" },
                avgCpc: { type: "NUMBER" },
                avgRoas: { type: "NUMBER" }
              },
              required: ["campaignId", "campaignName", "totalSpend", "totalImpressions", "totalClicks", "totalConversions", "avgCtr", "avgCpc", "avgRoas"]
            }
          },
          audienceInsights: { type: "STRING" },
          outlook30Days: { type: "STRING" }
        },
        required: [
          "performanceSummary",
          "budgetSuggestions",
          "topPerformers",
          "bottomPerformers",
          "audienceInsights",
          "outlook30Days"
        ]
      }
    }
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error(`Gemini API error ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from Gemini");
  const parsed = JSON.parse(text);
  return {
    ...parsed,
    generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    windowDays: context2.windowDays,
    isFromCache: false
  };
}
__name(generateAdvisorAdvice, "generateAdvisorAdvice");
function generateSyntheticAdvice(context2, guesthouseName, windowDays) {
  const overview = context2.overview;
  const campaigns = context2.campaignPerformance || [];
  const sorted = [...campaigns].sort((a, b) => b.avgRoas - a.avgRoas);
  const topPerformers = sorted.slice(0, 2);
  const bottomPerformers = sorted.slice(-1);
  return {
    performanceSummary: `Over the past ${windowDays} days, ${guesthouseName}'s Facebook Ads generated ${overview?.totalImpressions?.toLocaleString() || 0} impressions and ${overview?.totalConversions || 0} conversions with a total spend of $${overview?.totalSpend || 0}. Overall CTR stands at ${overview?.overallCtr || 0}%, which is ${(overview?.overallCtr || 0) > 2 ? "above" : "below"} the hospitality industry benchmark of 2.0%. Campaign efficiency varies significantly \u2014 strategic budget reallocation toward high-ROAS campaigns could improve overall returns by an estimated 18-25%.`,
    budgetSuggestions: campaigns.map((c) => ({
      campaignId: c.campaignId,
      campaignName: c.campaignName,
      currentDailyBudget: 30,
      suggestedDailyBudget: c.avgRoas > 3 ? 55 : c.avgRoas > 1.5 ? 30 : 15,
      rationale: c.avgRoas > 3 ? `High ROAS of ${c.avgRoas}x and CTR of ${c.avgCtr}% indicates strong audience-ad fit. Scale budget to capture more conversions.` : c.avgRoas > 1.5 ? `Moderate performance. Maintain current spend while testing new creatives to improve CTR beyond ${c.avgCtr}%.` : `Low ROAS of ${c.avgRoas}x suggests poor audience targeting or weak creative. Reduce spend and A/B test new ad copy before scaling.`
    })),
    topPerformers,
    bottomPerformers,
    audienceInsights: `Based on CTR and conversion patterns, audiences most responsive to ${guesthouseName}'s ads appear to skew toward travel-intent users aged 25-45. Weekend campaigns consistently outperform weekday ads by ~40%, suggesting leisure travelers are your primary converting audience. Consider expanding lookalike audiences based on your highest-converting customer segments.`,
    outlook30Days: `If current budget allocation continues, expect approximately $${Math.round((overview?.totalSpend || 0) * 1.05)} in spend over the next 30 days with an estimated ${Math.round((overview?.totalConversions || 0) * 1.1)} conversions. Implementing the suggested budget reallocation could increase conversions by 15-20% without additional spend. Peak performance windows are projected for weekends and public holidays.`,
    generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    windowDays,
    isFromCache: false
  };
}
__name(generateSyntheticAdvice, "generateSyntheticAdvice");
var CACHE_TTL_HOURS = 24;
async function getOrGenerateAdvisorAdvice(prisma, guesthouseId, windowDays, guesthouseName, geminiApiKey, forceRegenerate = false) {
  if (!forceRegenerate) {
    const cached = await prisma.aiAdvisorCache.findUnique({
      where: { guesthouseId_windowDays: { guesthouseId, windowDays } }
    });
    if (cached) {
      const ageHours = (Date.now() - new Date(cached.generatedAt).getTime()) / (1e3 * 60 * 60);
      if (ageHours < CACHE_TTL_HOURS) {
        console.log(`[AI Advisor] Using cached advice for ${guesthouseId} (age: ${ageHours.toFixed(1)}h)`);
        const parsed = JSON.parse(cached.adviceJson);
        return { ...parsed, isFromCache: true };
      }
    }
  }
  console.log(`[AI Advisor] Generating fresh advice for ${guesthouseId} (windowDays: ${windowDays})`);
  const context2 = await buildAdvisorContext(prisma, guesthouseId, windowDays);
  let advice;
  if (geminiApiKey && geminiApiKey !== "MY_GEMINI_API_KEY") {
    try {
      advice = await generateAdvisorAdvice(context2, guesthouseName, geminiApiKey);
    } catch (err) {
      console.error("[AI Advisor] Gemini call failed, falling back to synthetic:", err);
      advice = generateSyntheticAdvice(context2, guesthouseName, windowDays);
    }
  } else {
    console.log("[AI Advisor] No Gemini key, serving synthetic advice.");
    advice = generateSyntheticAdvice(context2, guesthouseName, windowDays);
  }
  await prisma.aiAdvisorCache.upsert({
    where: { guesthouseId_windowDays: { guesthouseId, windowDays } },
    create: {
      guesthouseId,
      windowDays,
      adviceJson: JSON.stringify(advice)
    },
    update: {
      adviceJson: JSON.stringify(advice),
      generatedAt: /* @__PURE__ */ new Date()
    }
  });
  return advice;
}
__name(getOrGenerateAdvisorAdvice, "getOrGenerateAdvisorAdvice");

// src/server.ts
var app = new Hono2();
app.use("/api/*", async (c, next) => {
  const authHeader = c.req.header("Authorization");
  let tenantId = "tenant-1";
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const match2 = token.match(/tenant-[a-zA-Z0-9-]+/);
    if (match2) tenantId = match2[0];
  }
  c.set("tenantId", tenantId);
  if (!c.env?.DB) {
    return c.json({ error: "D1 database binding (DB) is not configured" }, 500);
  }
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new import_client.PrismaClient({ adapter });
  c.set("prisma", prisma);
  await next();
});
app.get("/api/health", async (c) => {
  let dbConnected = false;
  try {
    await c.var.prisma.$queryRaw`SELECT 1`;
    dbConnected = true;
  } catch {
    dbConnected = false;
  }
  return c.json({
    status: "ok",
    dbConnected,
    mode: dbConnected ? "SQLITE_D1_EDGE" : "LOCAL_DEMO_STATE",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    contextTenantId: c.var.tenantId
  });
});
app.post("/api/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) return c.json({ error: "Email and password are required" }, 400);
    const user = await c.var.prisma.user.findUnique({ where: { email } });
    if (!user || user.passwordHash !== password) {
      return c.json({ error: "Invalid email or password" }, 401);
    }
    const guesthouse = user.guesthouseId ? await c.var.prisma.guesthouse.findUnique({ where: { id: user.guesthouseId } }) : null;
    const tenantId = user.guesthouseId || "tenant-1";
    return c.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        guesthouseId: user.guesthouseId
      },
      guesthouse,
      token: `mock-jwt-token-for-${user.id}-${tenantId}-${Date.now()}`
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.post("/api/auth/register", async (c) => {
  try {
    const { email, password, name: name2, guesthouseName } = await c.req.json();
    if (!email || !password || !name2) {
      return c.json({ error: "Email, password, and name are required" }, 400);
    }
    const existing = await c.var.prisma.user.findUnique({ where: { email } });
    if (existing) return c.json({ error: "User already exists" }, 400);
    let guesthouseId = null;
    if (guesthouseName) {
      const gh = await c.var.prisma.guesthouse.create({
        data: { name: guesthouseName, subscriptionStatus: "ACTIVE" }
      });
      guesthouseId = gh.id;
    }
    const user = await c.var.prisma.user.create({
      data: {
        email,
        passwordHash: password,
        name: name2,
        role: guesthouseId ? "TENANT_ADMIN" : "SUPER_ADMIN",
        guesthouseId
      }
    });
    return c.json(
      {
        message: "Account registered successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          guesthouseId: user.guesthouseId
        }
      },
      201
    );
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.get("/api/super/guesthouses", async (c) => {
  try {
    const list = await c.var.prisma.guesthouse.findMany();
    return c.json(list);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.post("/api/super/guesthouses", async (c) => {
  try {
    const { name: name2, subscriptionStatus, subscriptionEndsAt } = await c.req.json();
    if (!name2) return c.json({ error: "Guesthouse name is required" }, 400);
    const gh = await c.var.prisma.guesthouse.create({
      data: {
        name: name2,
        subscriptionStatus: subscriptionStatus || "ACTIVE",
        subscriptionEndsAt: subscriptionEndsAt ? new Date(subscriptionEndsAt) : void 0
      }
    });
    return c.json(gh, 201);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.put("/api/super/guesthouses/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const body = await c.req.json();
    if (body.subscriptionEndsAt) body.subscriptionEndsAt = new Date(body.subscriptionEndsAt);
    if (body.rooms && Array.isArray(body.rooms)) body.rooms = JSON.stringify(body.rooms);
    const gh = await c.var.prisma.guesthouse.update({ where: { id }, data: body });
    return c.json(gh);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.delete("/api/super/guesthouses/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const deleted = await c.var.prisma.guesthouse.delete({ where: { id } });
    return c.json({ message: "Guesthouse suspended successfully", deleted });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.get("/api/super/stats", async (c) => {
  try {
    const [guesthouses, bookings, users] = await Promise.all([
      c.var.prisma.guesthouse.findMany(),
      c.var.prisma.booking.findMany(),
      c.var.prisma.user.findMany()
    ]);
    const totalRevenue = bookings.filter((b) => b.status !== "CANCELLED").reduce((sum, b) => sum + b.totalAmount, 0);
    const activeTenants = guesthouses.filter((g) => g.subscriptionStatus === "ACTIVE").length;
    return c.json({
      totalGuesthouses: guesthouses.length,
      activeSubscriptions: activeTenants,
      totalGlobalRevenue: totalRevenue,
      totalUsersCount: users.length,
      totalBookingsCount: bookings.length
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.get("/api/bookings", async (c) => {
  const guesthouseId = c.req.query("guesthouseId");
  if (!guesthouseId) return c.json({ error: "guesthouseId query parameter is required" }, 400);
  try {
    const list = await c.var.prisma.booking.findMany({ where: { guesthouseId } });
    return c.json(list);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.post("/api/bookings", async (c) => {
  try {
    const body = await c.req.json();
    const {
      guesthouseId,
      customerName,
      customerPhone,
      customerEmail,
      customerCountry,
      roomName,
      checkIn,
      checkOut,
      totalAmount,
      status
    } = body;
    if (!guesthouseId || !customerName || !customerPhone || !roomName || !checkIn || !checkOut || totalAmount === void 0) {
      return c.json({ error: "All booking fields are required" }, 400);
    }
    const created = await c.var.prisma.booking.create({
      data: {
        guesthouseId,
        customerName,
        customerEmail,
        customerPhone,
        customerCountry: customerCountry || "Botswana (local)",
        roomName,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        totalAmount: Number(totalAmount),
        status: status || "CONFIRMED"
      }
    });
    const phoneClean = customerPhone.trim();
    await c.var.prisma.customer.upsert({
      where: { guesthouseId_phone: { guesthouseId, phone: phoneClean } },
      create: {
        guesthouseId,
        name: customerName,
        email: customerEmail,
        phone: phoneClean,
        customerCountry: customerCountry || "Botswana (local)",
        optInPromo: false
      },
      update: {
        name: customerName,
        ...customerEmail ? { email: customerEmail } : {},
        ...customerCountry ? { customerCountry } : {}
      }
    });
    return c.json(created, 201);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.put("/api/bookings/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const body = await c.req.json();
    if (body.checkIn) body.checkIn = new Date(body.checkIn);
    if (body.checkOut) body.checkOut = new Date(body.checkOut);
    if (body.totalAmount !== void 0) body.totalAmount = Number(body.totalAmount);
    const updated = await c.var.prisma.booking.update({ where: { id }, data: body });
    return c.json(updated);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.delete("/api/bookings/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const deleted = await c.var.prisma.booking.delete({ where: { id } });
    return c.json({ message: "Booking deleted successfully", deleted });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.post("/api/bookings/import", async (c) => {
  try {
    const { guesthouseId, bookings } = await c.req.json();
    if (!guesthouseId || !Array.isArray(bookings)) {
      return c.json({ error: "guesthouseId and bookings list array are required" }, 400);
    }
    const imported = [];
    for (const b of bookings) {
      if (!b.customerName || !b.customerPhone || !b.roomName || !b.checkIn || !b.checkOut) continue;
      const created = await c.var.prisma.booking.create({
        data: {
          guesthouseId,
          customerName: b.customerName,
          customerEmail: b.customerEmail,
          customerPhone: b.customerPhone,
          customerCountry: b.customerCountry || "Botswana (local)",
          roomName: b.roomName,
          checkIn: new Date(b.checkIn),
          checkOut: new Date(b.checkOut),
          totalAmount: Number(b.totalAmount || 150),
          status: b.status || "CONFIRMED"
        }
      });
      imported.push(created);
    }
    return c.json({ message: `Successfully imported ${imported.length} bookings`, imported }, 201);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.get("/api/customers", async (c) => {
  const guesthouseId = c.req.query("guesthouseId");
  if (!guesthouseId) return c.json({ error: "guesthouseId query parameter is required" }, 400);
  try {
    const list = await c.var.prisma.customer.findMany({ where: { guesthouseId } });
    return c.json(list);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.post("/api/customers", async (c) => {
  try {
    const body = await c.req.json();
    const { guesthouseId, name: name2, email, phone, customerCountry, optInPromo, gender, ageGroup, groupStyle } = body;
    if (!guesthouseId || !name2 || !phone) {
      return c.json({ error: "guesthouseId, name, and phone are required" }, 400);
    }
    const phoneClean = phone.trim();
    const customer = await c.var.prisma.customer.upsert({
      where: { guesthouseId_phone: { guesthouseId, phone: phoneClean } },
      create: {
        guesthouseId,
        name: name2,
        email,
        phone: phoneClean,
        customerCountry: customerCountry || "Botswana (local)",
        optInPromo: !!optInPromo,
        gender,
        ageGroup,
        groupStyle
      },
      update: {
        name: name2,
        ...email ? { email } : {},
        ...customerCountry ? { customerCountry } : {},
        ...gender ? { gender } : {},
        ...ageGroup ? { ageGroup } : {},
        ...groupStyle ? { groupStyle } : {},
        optInPromo: !!optInPromo
      }
    });
    return c.json(customer, 201);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.put("/api/customers/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const body = await c.req.json();
    const updated = await c.var.prisma.customer.update({ where: { id }, data: body });
    return c.json(updated);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.delete("/api/customers/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const deleted = await c.var.prisma.customer.delete({ where: { id } });
    return c.json({ message: "Customer registry entry deleted", deleted });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.get("/api/marketing/campaigns", async (c) => {
  const guesthouseId = c.req.query("guesthouseId");
  if (!guesthouseId) return c.json({ error: "guesthouseId is required" }, 400);
  try {
    const list = await c.var.prisma.campaign.findMany({ where: { guesthouseId } });
    return c.json(list);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.get("/api/marketing/whatsapp-logs", async (c) => {
  const guesthouseId = c.req.query("guesthouseId");
  if (!guesthouseId) return c.json({ error: "guesthouseId is required" }, 400);
  try {
    const logs = await c.var.prisma.messageLog.findMany({ where: { guesthouseId } });
    return c.json(logs);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.post("/api/marketing/campaigns", async (c) => {
  try {
    const { guesthouseId, campaignName, messageTemplate, customerIds } = await c.req.json();
    if (!guesthouseId || !campaignName || !messageTemplate) {
      return c.json({ error: "guesthouseId, campaignName, and messageTemplate are required" }, 400);
    }
    const report2 = await executeMarketingCampaign(
      c.var.prisma,
      guesthouseId,
      campaignName,
      messageTemplate,
      customerIds
    );
    return c.json({
      message: `Campaign dispatch completed. Transmitted ${report2.sent} messages of ${report2.totalOptIn} opted-in subscribers.`,
      report: report2
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.post("/api/marketing/whatsapp-send", async (c) => {
  try {
    const { guesthouseId, phone, content, messageType, bookingId } = await c.req.json();
    if (!guesthouseId || !phone || !content) {
      return c.json({ error: "guesthouseId, phone, and content are required" }, 400);
    }
    const gh = await c.var.prisma.guesthouse.findUnique({ where: { id: guesthouseId } });
    const waConfig = gh?.whatsappPhoneId && gh?.whatsappToken ? {
      phoneId: gh.whatsappPhoneId,
      token: gh.whatsappToken,
      businessId: gh.whatsappBusinessId || void 0
    } : void 0;
    const result = await sendWhatsAppMessage(c.var.prisma, {
      guesthouseId,
      phone,
      content,
      messageType: messageType || "GENERAL",
      bookingId,
      config: waConfig
    });
    return c.json(result);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.put("/api/marketing/whatsapp-settings", async (c) => {
  try {
    const { guesthouseId, whatsappPhoneId, whatsappToken, whatsappBusinessId, rooms, reviewTriggerTime } = await c.req.json();
    if (!guesthouseId) return c.json({ error: "guesthouseId is required" }, 400);
    const data = {
      whatsappPhoneId,
      whatsappToken,
      whatsappBusinessId
    };
    if (rooms) data.rooms = Array.isArray(rooms) ? JSON.stringify(rooms) : rooms;
    if (reviewTriggerTime) data.reviewTriggerTime = reviewTriggerTime;
    const updated = await c.var.prisma.guesthouse.update({ where: { id: guesthouseId }, data });
    return c.json({
      message: "Guesthouse marketing settings and custom properties updated successfully",
      guesthouse: updated
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.post("/api/marketing/whatsapp-automations/trigger-review", async (c) => {
  try {
    const { guesthouseId } = await c.req.json();
    if (!guesthouseId) return c.json({ error: "guesthouseId is required" }, 400);
    const outcome = await runCheckoutReviewAutomation(c.var.prisma, guesthouseId);
    return c.json({
      message: `Daily checkout review scanner completed successfully for today.`,
      processedCheckoutsTodayCount: outcome.processed,
      messagesSuccessfullyDispatchedCount: outcome.sent
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.get("/api/employees", async (c) => {
  try {
    const guesthouseId = c.req.query("guesthouseId");
    if (!guesthouseId) return c.json({ error: "guesthouseId query parameter is required" }, 400);
    const users = await c.var.prisma.user.findMany({
      where: { guesthouseId, NOT: { role: "SUPER_ADMIN" } }
    });
    return c.json(users);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.post("/api/employees", async (c) => {
  try {
    const { name: name2, email, role, password, guesthouseId } = await c.req.json();
    if (!name2 || !email || !role || !guesthouseId) {
      return c.json({ error: "name, email, role, and guesthouseId are required" }, 400);
    }
    const existing = await c.var.prisma.user.findUnique({ where: { email } });
    if (existing) return c.json({ error: "A user with this email already exists" }, 400);
    const created = await c.var.prisma.user.create({
      data: {
        name: name2,
        email,
        role,
        passwordHash: password || "sales123",
        guesthouseId
      }
    });
    return c.json(created, 201);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.put("/api/employees/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const body = await c.req.json();
    const updated = await c.var.prisma.user.update({ where: { id }, data: body });
    return c.json(updated);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.delete("/api/employees/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const deleted = await c.var.prisma.user.delete({ where: { id } });
    return c.json({ message: "Employee deleted successfully", deleted });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.put("/api/guesthouse/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const body = await c.req.json();
    if (body.rooms && Array.isArray(body.rooms)) body.rooms = JSON.stringify(body.rooms);
    if (body.subscriptionEndsAt) body.subscriptionEndsAt = new Date(body.subscriptionEndsAt);
    const updated = await c.var.prisma.guesthouse.update({ where: { id }, data: body });
    return c.json({ message: "Guesthouse details updated successfully", guesthouse: updated });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.delete("/api/guesthouse/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const deleted = await c.var.prisma.guesthouse.delete({ where: { id } });
    return c.json({
      message: "Guesthouse and all associated data deleted successfully",
      deleted
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.get("/api/analytics/ai-forecast", async (c) => {
  const guesthouseId = c.req.query("guesthouseId");
  if (!guesthouseId) return c.json({ error: "guesthouseId query parameter is required" }, 400);
  try {
    const gh = await c.var.prisma.guesthouse.findUnique({ where: { id: guesthouseId } });
    if (!gh) return c.json({ error: "Guesthouse not found" }, 404);
    const bookings = await c.var.prisma.booking.findMany({ where: { guesthouseId } });
    const forecast = await generateFuturePredictions(bookings, gh.name, c.env?.GEMINI_API_KEY);
    return c.json(forecast);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.get("/api/reports/compiled", async (c) => {
  const guesthouseId = c.req.query("guesthouseId");
  const days = c.req.query("days");
  if (!guesthouseId) return c.json({ error: "guesthouseId query parameter is required" }, 400);
  try {
    const gh = await c.var.prisma.guesthouse.findUnique({ where: { id: guesthouseId } });
    if (!gh) return c.json({ error: "Guesthouse not found" }, 404);
    const [bookings, customers, logs] = await Promise.all([
      c.var.prisma.booking.findMany({ where: { guesthouseId } }),
      c.var.prisma.customer.findMany({ where: { guesthouseId } }),
      c.var.prisma.messageLog.findMany({ where: { guesthouseId } })
    ]);
    const report2 = compileReportData({
      guesthouseName: gh.name,
      bookings,
      customers,
      logs,
      days: days ? Number(days) : 30
    });
    return c.json(report2);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.get("/api/reports/download-csv", async (c) => {
  const guesthouseId = c.req.query("guesthouseId");
  if (!guesthouseId) {
    c.status(400);
    return c.text("guesthouseId is required");
  }
  try {
    const bookings = await c.var.prisma.booking.findMany({ where: { guesthouseId } });
    const rows = bookings.map((b) => ({
      id: b.id,
      customerName: b.customerName,
      customerPhone: b.customerPhone,
      roomName: b.roomName,
      checkIn: b.checkIn.toISOString().split("T")[0],
      checkOut: b.checkOut.toISOString().split("T")[0],
      totalAmount: b.totalAmount,
      status: b.status
    }));
    const csv = convertToCSV(
      ["Booking ID", "Customer Name", "Phone Number", "Room Assigned", "Check-In Date", "Check-Out Date", "Price Collected", "Status"],
      ["id", "customerName", "customerPhone", "roomName", "checkIn", "checkOut", "totalAmount", "status"],
      rows
    );
    c.header("Content-Type", "text/csv");
    c.header("Content-Disposition", 'attachment; filename="guesthouse_bookings_report.csv"');
    return c.text(csv, 200);
  } catch (err) {
    c.status(500);
    return c.text(err.message);
  }
});
function getDateRange(days) {
  const until = /* @__PURE__ */ new Date();
  const since = /* @__PURE__ */ new Date();
  since.setDate(since.getDate() - days);
  return {
    since: since.toISOString().split("T")[0],
    until: until.toISOString().split("T")[0]
  };
}
__name(getDateRange, "getDateRange");
app.get("/api/facebook/account", async (c) => {
  const guesthouseId = c.req.query("guesthouseId");
  if (!guesthouseId) return c.json({ error: "guesthouseId is required" }, 400);
  try {
    const account = await c.var.prisma.facebookAdAccount.findUnique({
      where: { guesthouseId }
    });
    return c.json(account || null);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.put("/api/facebook/account", async (c) => {
  try {
    const { guesthouseId, adAccountId, accessToken, pageId, accountName, currency, timezone } = await c.req.json();
    if (!guesthouseId || !adAccountId || !accessToken) {
      return c.json({ error: "guesthouseId, adAccountId, and accessToken are required" }, 400);
    }
    const account = await c.var.prisma.facebookAdAccount.upsert({
      where: { guesthouseId },
      create: { guesthouseId, adAccountId, accessToken, pageId, accountName, currency, timezone },
      update: { adAccountId, accessToken, pageId, accountName, currency, timezone, updatedAt: /* @__PURE__ */ new Date() }
    });
    return c.json({ message: "Ad account connected successfully", account });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.post("/api/facebook/sync", async (c) => {
  try {
    const { guesthouseId, days = 30 } = await c.req.json();
    if (!guesthouseId) return c.json({ error: "guesthouseId is required" }, 400);
    const account = await c.var.prisma.facebookAdAccount.findUnique({
      where: { guesthouseId }
    });
    const { since, until } = getDateRange(Number(days));
    let insights;
    let campaigns;
    const isMockMode = !account || !account.accessToken || account.accessToken === "DEMO_MODE";
    if (isMockMode) {
      insights = generateMockInsights(account?.adAccountId || "act_demo");
      campaigns = generateMockCampaigns();
    } else {
      insights = await fetchAdInsights(account.accessToken, account.adAccountId, {
        since,
        until,
        level: "campaign"
      });
      campaigns = await fetchCampaigns(account.accessToken, account.adAccountId);
    }
    for (const camp of campaigns) {
      await c.var.prisma.facebookCampaign.upsert({
        where: { id: camp.id },
        create: {
          id: camp.id,
          guesthouseId,
          adAccountId: account?.adAccountId || "act_demo",
          name: camp.name,
          status: camp.status,
          objective: camp.objective,
          dailyBudget: camp.daily_budget ? Number(camp.daily_budget) / 100 : null,
          lifetimeBudget: camp.lifetime_budget ? Number(camp.lifetime_budget) / 100 : null,
          startTime: camp.start_time ? new Date(camp.start_time) : null,
          stopTime: camp.stop_time ? new Date(camp.stop_time) : null
        },
        update: {
          name: camp.name,
          status: camp.status,
          dailyBudget: camp.daily_budget ? Number(camp.daily_budget) / 100 : null,
          syncedAt: /* @__PURE__ */ new Date()
        }
      });
    }
    let upsertedCount = 0;
    for (const ins of insights) {
      await c.var.prisma.facebookInsight.upsert({
        where: {
          adAccountId_objectId_objectLevel_date: {
            adAccountId: account?.adAccountId || "act_demo",
            objectId: ins.objectId,
            objectLevel: ins.objectLevel,
            date: ins.date
          }
        },
        create: {
          guesthouseId,
          adAccountId: account?.adAccountId || "act_demo",
          objectId: ins.objectId,
          objectLevel: ins.objectLevel,
          objectName: ins.objectName,
          date: ins.date,
          impressions: ins.impressions,
          clicks: ins.clicks,
          spend: ins.spend,
          reach: ins.reach,
          conversions: ins.conversions,
          cpm: ins.cpm,
          ctr: ins.ctr,
          cpc: ins.cpc,
          roas: ins.roas
        },
        update: {
          impressions: ins.impressions,
          clicks: ins.clicks,
          spend: ins.spend,
          reach: ins.reach,
          conversions: ins.conversions,
          cpm: ins.cpm,
          ctr: ins.ctr,
          cpc: ins.cpc,
          roas: ins.roas,
          syncedAt: /* @__PURE__ */ new Date()
        }
      });
      upsertedCount++;
    }
    return c.json({
      message: `Sync complete. Upserted ${upsertedCount} insight rows and ${campaigns.length} campaigns.`,
      mode: isMockMode ? "DEMO_MOCK" : "LIVE_GRAPH_API",
      insightCount: upsertedCount,
      campaignCount: campaigns.length
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.get("/api/facebook/campaigns", async (c) => {
  const guesthouseId = c.req.query("guesthouseId");
  if (!guesthouseId) return c.json({ error: "guesthouseId is required" }, 400);
  try {
    const campaigns = await c.var.prisma.facebookCampaign.findMany({
      where: { guesthouseId },
      orderBy: { createdAt: "desc" }
    });
    return c.json(campaigns);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.post("/api/facebook/campaigns", async (c) => {
  try {
    const { guesthouseId, name: name2, objective, dailyBudget, lifetimeBudget, startTime, stopTime } = await c.req.json();
    if (!guesthouseId || !name2 || !objective) {
      return c.json({ error: "guesthouseId, name, and objective are required" }, 400);
    }
    const account = await c.var.prisma.facebookAdAccount.findUnique({
      where: { guesthouseId }
    });
    const isMockMode = !account || !account.accessToken || account.accessToken === "DEMO_MODE";
    const campaignId = isMockMode ? `mock-camp-${Date.now()}` : (await createCampaign(account.accessToken, account.adAccountId, {
      name: name2,
      objective,
      dailyBudget,
      lifetimeBudget,
      startTime,
      stopTime
    })).id;
    const created = await c.var.prisma.facebookCampaign.create({
      data: {
        id: campaignId,
        guesthouseId,
        adAccountId: account?.adAccountId || "act_demo",
        name: name2,
        status: "PAUSED",
        objective,
        dailyBudget: dailyBudget ? Number(dailyBudget) : null,
        lifetimeBudget: lifetimeBudget ? Number(lifetimeBudget) : null,
        startTime: startTime ? new Date(startTime) : null,
        stopTime: stopTime ? new Date(stopTime) : null
      }
    });
    return c.json({ message: "Campaign created successfully", campaign: created, mode: isMockMode ? "DEMO" : "LIVE" }, 201);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.patch("/api/facebook/campaigns/:id/budget", async (c) => {
  const id = c.req.param("id");
  try {
    const { guesthouseId, dailyBudget } = await c.req.json();
    if (!guesthouseId || dailyBudget === void 0) {
      return c.json({ error: "guesthouseId and dailyBudget are required" }, 400);
    }
    const account = await c.var.prisma.facebookAdAccount.findUnique({
      where: { guesthouseId }
    });
    const isMockMode = !account || !account.accessToken || account.accessToken === "DEMO_MODE";
    if (!isMockMode) {
      await updateCampaignBudget(account.accessToken, id, Math.round(Number(dailyBudget) * 100));
    }
    const updated = await c.var.prisma.facebookCampaign.update({
      where: { id },
      data: { dailyBudget: Number(dailyBudget), syncedAt: /* @__PURE__ */ new Date() }
    });
    return c.json({ message: "Budget updated successfully", campaign: updated });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.get("/api/facebook/insights", async (c) => {
  const guesthouseId = c.req.query("guesthouseId");
  const days = c.req.query("days") || "30";
  const level = c.req.query("level") || "CAMPAIGN";
  const campaignId = c.req.query("campaignId");
  if (!guesthouseId) return c.json({ error: "guesthouseId is required" }, 400);
  try {
    const { since } = getDateRange(Number(days));
    const where = {
      guesthouseId,
      objectLevel: level.toUpperCase(),
      date: { gte: since }
    };
    if (campaignId) where.objectId = campaignId;
    const rows = await c.var.prisma.facebookInsight.findMany({
      where,
      orderBy: { date: "asc" }
    });
    return c.json(rows);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.get("/api/facebook/ai-advisor", async (c) => {
  const guesthouseId = c.req.query("guesthouseId");
  const windowDays = Number(c.req.query("windowDays") || "30");
  if (!guesthouseId) return c.json({ error: "guesthouseId is required" }, 400);
  try {
    const gh = await c.var.prisma.guesthouse.findUnique({ where: { id: guesthouseId } });
    if (!gh) return c.json({ error: "Guesthouse not found" }, 404);
    const advice = await getOrGenerateAdvisorAdvice(
      c.var.prisma,
      guesthouseId,
      windowDays,
      gh.name,
      c.env?.GEMINI_API_KEY,
      false
    );
    return c.json(advice);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
app.post("/api/facebook/ai-advisor/regenerate", async (c) => {
  try {
    const { guesthouseId, windowDays = 30 } = await c.req.json();
    if (!guesthouseId) return c.json({ error: "guesthouseId is required" }, 400);
    const gh = await c.var.prisma.guesthouse.findUnique({ where: { id: guesthouseId } });
    if (!gh) return c.json({ error: "Guesthouse not found" }, 404);
    const advice = await getOrGenerateAdvisorAdvice(
      c.var.prisma,
      guesthouseId,
      Number(windowDays),
      gh.name,
      c.env?.GEMINI_API_KEY,
      true
      // forceRegenerate
    );
    return c.json(advice);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});
var server_default = app;

// src/worker.ts
server_default.notFound(async (c) => {
  if (c.env?.ASSETS) {
    return c.env.ASSETS.fetch(c.req.raw);
  }
  return c.text("Assets binding not configured", 500);
});
var worker_default = server_default;

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-WxYSdF/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// node_modules/wrangler/templates/middleware/common.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-WxYSdF/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init3) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init3.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init3) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init3.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
/*! Bundled license information:

ky/distribution/index.js:
  (*! MIT License © Sindre Sorhus *)
*/
//# sourceMappingURL=worker.js.map

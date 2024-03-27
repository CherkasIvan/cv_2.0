// node_modules/zone.js/fesm2015/zone.js
(function(global) {
  const performance = global["performance"];
  function mark(name) {
    performance && performance["mark"] && performance["mark"](name);
  }
  function performanceMeasure(name, label) {
    performance && performance["measure"] && performance["measure"](name, label);
  }
  mark("Zone");
  const symbolPrefix = global["__Zone_symbol_prefix"] || "__zone_symbol__";
  function __symbol__(name) {
    return symbolPrefix + name;
  }
  const checkDuplicate = global[__symbol__("forceDuplicateZoneCheck")] === true;
  if (global["Zone"]) {
    if (checkDuplicate || typeof global["Zone"].__symbol__ !== "function") {
      throw new Error("Zone already loaded.");
    } else {
      return global["Zone"];
    }
  }
  const _Zone = class _Zone {
    static assertZonePatched() {
      if (global["Promise"] !== patches["ZoneAwarePromise"]) {
        throw new Error("Zone.js has detected that ZoneAwarePromise `(window|global).Promise` has been overwritten.\nMost likely cause is that a Promise polyfill has been loaded after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. If you must load one, do so before loading zone.js.)");
      }
    }
    static get root() {
      let zone = _Zone.current;
      while (zone.parent) {
        zone = zone.parent;
      }
      return zone;
    }
    static get current() {
      return _currentZoneFrame.zone;
    }
    static get currentTask() {
      return _currentTask;
    }
    // tslint:disable-next-line:require-internal-with-underscore
    static __load_patch(name, fn, ignoreDuplicate = false) {
      if (patches.hasOwnProperty(name)) {
        if (!ignoreDuplicate && checkDuplicate) {
          throw Error("Already loaded patch: " + name);
        }
      } else if (!global["__Zone_disable_" + name]) {
        const perfName = "Zone:" + name;
        mark(perfName);
        patches[name] = fn(global, _Zone, _api);
        performanceMeasure(perfName, perfName);
      }
    }
    get parent() {
      return this._parent;
    }
    get name() {
      return this._name;
    }
    constructor(parent, zoneSpec) {
      this._parent = parent;
      this._name = zoneSpec ? zoneSpec.name || "unnamed" : "<root>";
      this._properties = zoneSpec && zoneSpec.properties || {};
      this._zoneDelegate = new _ZoneDelegate(this, this._parent && this._parent._zoneDelegate, zoneSpec);
    }
    get(key) {
      const zone = this.getZoneWith(key);
      if (zone)
        return zone._properties[key];
    }
    getZoneWith(key) {
      let current = this;
      while (current) {
        if (current._properties.hasOwnProperty(key)) {
          return current;
        }
        current = current._parent;
      }
      return null;
    }
    fork(zoneSpec) {
      if (!zoneSpec)
        throw new Error("ZoneSpec required!");
      return this._zoneDelegate.fork(this, zoneSpec);
    }
    wrap(callback, source) {
      if (typeof callback !== "function") {
        throw new Error("Expecting function got: " + callback);
      }
      const _callback = this._zoneDelegate.intercept(this, callback, source);
      const zone = this;
      return function() {
        return zone.runGuarded(_callback, this, arguments, source);
      };
    }
    run(callback, applyThis, applyArgs, source) {
      _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
      try {
        return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
      } finally {
        _currentZoneFrame = _currentZoneFrame.parent;
      }
    }
    runGuarded(callback, applyThis = null, applyArgs, source) {
      _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
      try {
        try {
          return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
        } catch (error) {
          if (this._zoneDelegate.handleError(this, error)) {
            throw error;
          }
        }
      } finally {
        _currentZoneFrame = _currentZoneFrame.parent;
      }
    }
    runTask(task, applyThis, applyArgs) {
      if (task.zone != this) {
        throw new Error("A task can only be run in the zone of creation! (Creation: " + (task.zone || NO_ZONE).name + "; Execution: " + this.name + ")");
      }
      if (task.state === notScheduled && (task.type === eventTask || task.type === macroTask)) {
        return;
      }
      const reEntryGuard = task.state != running;
      reEntryGuard && task._transitionTo(running, scheduled);
      task.runCount++;
      const previousTask = _currentTask;
      _currentTask = task;
      _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
      try {
        if (task.type == macroTask && task.data && !task.data.isPeriodic) {
          task.cancelFn = void 0;
        }
        try {
          return this._zoneDelegate.invokeTask(this, task, applyThis, applyArgs);
        } catch (error) {
          if (this._zoneDelegate.handleError(this, error)) {
            throw error;
          }
        }
      } finally {
        if (task.state !== notScheduled && task.state !== unknown) {
          if (task.type == eventTask || task.data && task.data.isPeriodic) {
            reEntryGuard && task._transitionTo(scheduled, running);
          } else {
            task.runCount = 0;
            this._updateTaskCount(task, -1);
            reEntryGuard && task._transitionTo(notScheduled, running, notScheduled);
          }
        }
        _currentZoneFrame = _currentZoneFrame.parent;
        _currentTask = previousTask;
      }
    }
    scheduleTask(task) {
      if (task.zone && task.zone !== this) {
        let newZone = this;
        while (newZone) {
          if (newZone === task.zone) {
            throw Error(`can not reschedule task to ${this.name} which is descendants of the original zone ${task.zone.name}`);
          }
          newZone = newZone.parent;
        }
      }
      task._transitionTo(scheduling, notScheduled);
      const zoneDelegates = [];
      task._zoneDelegates = zoneDelegates;
      task._zone = this;
      try {
        task = this._zoneDelegate.scheduleTask(this, task);
      } catch (err) {
        task._transitionTo(unknown, scheduling, notScheduled);
        this._zoneDelegate.handleError(this, err);
        throw err;
      }
      if (task._zoneDelegates === zoneDelegates) {
        this._updateTaskCount(task, 1);
      }
      if (task.state == scheduling) {
        task._transitionTo(scheduled, scheduling);
      }
      return task;
    }
    scheduleMicroTask(source, callback, data, customSchedule) {
      return this.scheduleTask(new ZoneTask(microTask, source, callback, data, customSchedule, void 0));
    }
    scheduleMacroTask(source, callback, data, customSchedule, customCancel) {
      return this.scheduleTask(new ZoneTask(macroTask, source, callback, data, customSchedule, customCancel));
    }
    scheduleEventTask(source, callback, data, customSchedule, customCancel) {
      return this.scheduleTask(new ZoneTask(eventTask, source, callback, data, customSchedule, customCancel));
    }
    cancelTask(task) {
      if (task.zone != this)
        throw new Error("A task can only be cancelled in the zone of creation! (Creation: " + (task.zone || NO_ZONE).name + "; Execution: " + this.name + ")");
      if (task.state !== scheduled && task.state !== running) {
        return;
      }
      task._transitionTo(canceling, scheduled, running);
      try {
        this._zoneDelegate.cancelTask(this, task);
      } catch (err) {
        task._transitionTo(unknown, canceling);
        this._zoneDelegate.handleError(this, err);
        throw err;
      }
      this._updateTaskCount(task, -1);
      task._transitionTo(notScheduled, canceling);
      task.runCount = 0;
      return task;
    }
    _updateTaskCount(task, count) {
      const zoneDelegates = task._zoneDelegates;
      if (count == -1) {
        task._zoneDelegates = null;
      }
      for (let i = 0; i < zoneDelegates.length; i++) {
        zoneDelegates[i]._updateTaskCount(task.type, count);
      }
    }
  };
  _Zone.__symbol__ = __symbol__;
  let Zone2 = _Zone;
  const DELEGATE_ZS = {
    name: "",
    onHasTask: (delegate, _, target, hasTaskState) => delegate.hasTask(target, hasTaskState),
    onScheduleTask: (delegate, _, target, task) => delegate.scheduleTask(target, task),
    onInvokeTask: (delegate, _, target, task, applyThis, applyArgs) => delegate.invokeTask(target, task, applyThis, applyArgs),
    onCancelTask: (delegate, _, target, task) => delegate.cancelTask(target, task)
  };
  class _ZoneDelegate {
    constructor(zone, parentDelegate, zoneSpec) {
      this._taskCounts = { "microTask": 0, "macroTask": 0, "eventTask": 0 };
      this.zone = zone;
      this._parentDelegate = parentDelegate;
      this._forkZS = zoneSpec && (zoneSpec && zoneSpec.onFork ? zoneSpec : parentDelegate._forkZS);
      this._forkDlgt = zoneSpec && (zoneSpec.onFork ? parentDelegate : parentDelegate._forkDlgt);
      this._forkCurrZone = zoneSpec && (zoneSpec.onFork ? this.zone : parentDelegate._forkCurrZone);
      this._interceptZS = zoneSpec && (zoneSpec.onIntercept ? zoneSpec : parentDelegate._interceptZS);
      this._interceptDlgt = zoneSpec && (zoneSpec.onIntercept ? parentDelegate : parentDelegate._interceptDlgt);
      this._interceptCurrZone = zoneSpec && (zoneSpec.onIntercept ? this.zone : parentDelegate._interceptCurrZone);
      this._invokeZS = zoneSpec && (zoneSpec.onInvoke ? zoneSpec : parentDelegate._invokeZS);
      this._invokeDlgt = zoneSpec && (zoneSpec.onInvoke ? parentDelegate : parentDelegate._invokeDlgt);
      this._invokeCurrZone = zoneSpec && (zoneSpec.onInvoke ? this.zone : parentDelegate._invokeCurrZone);
      this._handleErrorZS = zoneSpec && (zoneSpec.onHandleError ? zoneSpec : parentDelegate._handleErrorZS);
      this._handleErrorDlgt = zoneSpec && (zoneSpec.onHandleError ? parentDelegate : parentDelegate._handleErrorDlgt);
      this._handleErrorCurrZone = zoneSpec && (zoneSpec.onHandleError ? this.zone : parentDelegate._handleErrorCurrZone);
      this._scheduleTaskZS = zoneSpec && (zoneSpec.onScheduleTask ? zoneSpec : parentDelegate._scheduleTaskZS);
      this._scheduleTaskDlgt = zoneSpec && (zoneSpec.onScheduleTask ? parentDelegate : parentDelegate._scheduleTaskDlgt);
      this._scheduleTaskCurrZone = zoneSpec && (zoneSpec.onScheduleTask ? this.zone : parentDelegate._scheduleTaskCurrZone);
      this._invokeTaskZS = zoneSpec && (zoneSpec.onInvokeTask ? zoneSpec : parentDelegate._invokeTaskZS);
      this._invokeTaskDlgt = zoneSpec && (zoneSpec.onInvokeTask ? parentDelegate : parentDelegate._invokeTaskDlgt);
      this._invokeTaskCurrZone = zoneSpec && (zoneSpec.onInvokeTask ? this.zone : parentDelegate._invokeTaskCurrZone);
      this._cancelTaskZS = zoneSpec && (zoneSpec.onCancelTask ? zoneSpec : parentDelegate._cancelTaskZS);
      this._cancelTaskDlgt = zoneSpec && (zoneSpec.onCancelTask ? parentDelegate : parentDelegate._cancelTaskDlgt);
      this._cancelTaskCurrZone = zoneSpec && (zoneSpec.onCancelTask ? this.zone : parentDelegate._cancelTaskCurrZone);
      this._hasTaskZS = null;
      this._hasTaskDlgt = null;
      this._hasTaskDlgtOwner = null;
      this._hasTaskCurrZone = null;
      const zoneSpecHasTask = zoneSpec && zoneSpec.onHasTask;
      const parentHasTask = parentDelegate && parentDelegate._hasTaskZS;
      if (zoneSpecHasTask || parentHasTask) {
        this._hasTaskZS = zoneSpecHasTask ? zoneSpec : DELEGATE_ZS;
        this._hasTaskDlgt = parentDelegate;
        this._hasTaskDlgtOwner = this;
        this._hasTaskCurrZone = zone;
        if (!zoneSpec.onScheduleTask) {
          this._scheduleTaskZS = DELEGATE_ZS;
          this._scheduleTaskDlgt = parentDelegate;
          this._scheduleTaskCurrZone = this.zone;
        }
        if (!zoneSpec.onInvokeTask) {
          this._invokeTaskZS = DELEGATE_ZS;
          this._invokeTaskDlgt = parentDelegate;
          this._invokeTaskCurrZone = this.zone;
        }
        if (!zoneSpec.onCancelTask) {
          this._cancelTaskZS = DELEGATE_ZS;
          this._cancelTaskDlgt = parentDelegate;
          this._cancelTaskCurrZone = this.zone;
        }
      }
    }
    fork(targetZone, zoneSpec) {
      return this._forkZS ? this._forkZS.onFork(this._forkDlgt, this.zone, targetZone, zoneSpec) : new Zone2(targetZone, zoneSpec);
    }
    intercept(targetZone, callback, source) {
      return this._interceptZS ? this._interceptZS.onIntercept(this._interceptDlgt, this._interceptCurrZone, targetZone, callback, source) : callback;
    }
    invoke(targetZone, callback, applyThis, applyArgs, source) {
      return this._invokeZS ? this._invokeZS.onInvoke(this._invokeDlgt, this._invokeCurrZone, targetZone, callback, applyThis, applyArgs, source) : callback.apply(applyThis, applyArgs);
    }
    handleError(targetZone, error) {
      return this._handleErrorZS ? this._handleErrorZS.onHandleError(this._handleErrorDlgt, this._handleErrorCurrZone, targetZone, error) : true;
    }
    scheduleTask(targetZone, task) {
      let returnTask = task;
      if (this._scheduleTaskZS) {
        if (this._hasTaskZS) {
          returnTask._zoneDelegates.push(this._hasTaskDlgtOwner);
        }
        returnTask = this._scheduleTaskZS.onScheduleTask(this._scheduleTaskDlgt, this._scheduleTaskCurrZone, targetZone, task);
        if (!returnTask)
          returnTask = task;
      } else {
        if (task.scheduleFn) {
          task.scheduleFn(task);
        } else if (task.type == microTask) {
          scheduleMicroTask(task);
        } else {
          throw new Error("Task is missing scheduleFn.");
        }
      }
      return returnTask;
    }
    invokeTask(targetZone, task, applyThis, applyArgs) {
      return this._invokeTaskZS ? this._invokeTaskZS.onInvokeTask(this._invokeTaskDlgt, this._invokeTaskCurrZone, targetZone, task, applyThis, applyArgs) : task.callback.apply(applyThis, applyArgs);
    }
    cancelTask(targetZone, task) {
      let value;
      if (this._cancelTaskZS) {
        value = this._cancelTaskZS.onCancelTask(this._cancelTaskDlgt, this._cancelTaskCurrZone, targetZone, task);
      } else {
        if (!task.cancelFn) {
          throw Error("Task is not cancelable");
        }
        value = task.cancelFn(task);
      }
      return value;
    }
    hasTask(targetZone, isEmpty) {
      try {
        this._hasTaskZS && this._hasTaskZS.onHasTask(this._hasTaskDlgt, this._hasTaskCurrZone, targetZone, isEmpty);
      } catch (err) {
        this.handleError(targetZone, err);
      }
    }
    // tslint:disable-next-line:require-internal-with-underscore
    _updateTaskCount(type, count) {
      const counts = this._taskCounts;
      const prev = counts[type];
      const next = counts[type] = prev + count;
      if (next < 0) {
        throw new Error("More tasks executed then were scheduled.");
      }
      if (prev == 0 || next == 0) {
        const isEmpty = {
          microTask: counts["microTask"] > 0,
          macroTask: counts["macroTask"] > 0,
          eventTask: counts["eventTask"] > 0,
          change: type
        };
        this.hasTask(this.zone, isEmpty);
      }
    }
  }
  class ZoneTask {
    constructor(type, source, callback, options, scheduleFn, cancelFn) {
      this._zone = null;
      this.runCount = 0;
      this._zoneDelegates = null;
      this._state = "notScheduled";
      this.type = type;
      this.source = source;
      this.data = options;
      this.scheduleFn = scheduleFn;
      this.cancelFn = cancelFn;
      if (!callback) {
        throw new Error("callback is not defined");
      }
      this.callback = callback;
      const self2 = this;
      if (type === eventTask && options && options.useG) {
        this.invoke = ZoneTask.invokeTask;
      } else {
        this.invoke = function() {
          return ZoneTask.invokeTask.call(global, self2, this, arguments);
        };
      }
    }
    static invokeTask(task, target, args) {
      if (!task) {
        task = this;
      }
      _numberOfNestedTaskFrames++;
      try {
        task.runCount++;
        return task.zone.runTask(task, target, args);
      } finally {
        if (_numberOfNestedTaskFrames == 1) {
          drainMicroTaskQueue();
        }
        _numberOfNestedTaskFrames--;
      }
    }
    get zone() {
      return this._zone;
    }
    get state() {
      return this._state;
    }
    cancelScheduleRequest() {
      this._transitionTo(notScheduled, scheduling);
    }
    // tslint:disable-next-line:require-internal-with-underscore
    _transitionTo(toState, fromState1, fromState2) {
      if (this._state === fromState1 || this._state === fromState2) {
        this._state = toState;
        if (toState == notScheduled) {
          this._zoneDelegates = null;
        }
      } else {
        throw new Error(`${this.type} '${this.source}': can not transition to '${toState}', expecting state '${fromState1}'${fromState2 ? " or '" + fromState2 + "'" : ""}, was '${this._state}'.`);
      }
    }
    toString() {
      if (this.data && typeof this.data.handleId !== "undefined") {
        return this.data.handleId.toString();
      } else {
        return Object.prototype.toString.call(this);
      }
    }
    // add toJSON method to prevent cyclic error when
    // call JSON.stringify(zoneTask)
    toJSON() {
      return {
        type: this.type,
        state: this.state,
        source: this.source,
        zone: this.zone.name,
        runCount: this.runCount
      };
    }
  }
  const symbolSetTimeout = __symbol__("setTimeout");
  const symbolPromise = __symbol__("Promise");
  const symbolThen = __symbol__("then");
  let _microTaskQueue = [];
  let _isDrainingMicrotaskQueue = false;
  let nativeMicroTaskQueuePromise;
  function nativeScheduleMicroTask(func) {
    if (!nativeMicroTaskQueuePromise) {
      if (global[symbolPromise]) {
        nativeMicroTaskQueuePromise = global[symbolPromise].resolve(0);
      }
    }
    if (nativeMicroTaskQueuePromise) {
      let nativeThen = nativeMicroTaskQueuePromise[symbolThen];
      if (!nativeThen) {
        nativeThen = nativeMicroTaskQueuePromise["then"];
      }
      nativeThen.call(nativeMicroTaskQueuePromise, func);
    } else {
      global[symbolSetTimeout](func, 0);
    }
  }
  function scheduleMicroTask(task) {
    if (_numberOfNestedTaskFrames === 0 && _microTaskQueue.length === 0) {
      nativeScheduleMicroTask(drainMicroTaskQueue);
    }
    task && _microTaskQueue.push(task);
  }
  function drainMicroTaskQueue() {
    if (!_isDrainingMicrotaskQueue) {
      _isDrainingMicrotaskQueue = true;
      while (_microTaskQueue.length) {
        const queue = _microTaskQueue;
        _microTaskQueue = [];
        for (let i = 0; i < queue.length; i++) {
          const task = queue[i];
          try {
            task.zone.runTask(task, null, null);
          } catch (error) {
            _api.onUnhandledError(error);
          }
        }
      }
      _api.microtaskDrainDone();
      _isDrainingMicrotaskQueue = false;
    }
  }
  const NO_ZONE = {
    name: "NO ZONE"
  };
  const notScheduled = "notScheduled", scheduling = "scheduling", scheduled = "scheduled", running = "running", canceling = "canceling", unknown = "unknown";
  const microTask = "microTask", macroTask = "macroTask", eventTask = "eventTask";
  const patches = {};
  const _api = {
    symbol: __symbol__,
    currentZoneFrame: () => _currentZoneFrame,
    onUnhandledError: noop,
    microtaskDrainDone: noop,
    scheduleMicroTask,
    showUncaughtError: () => !Zone2[__symbol__("ignoreConsoleErrorUncaughtError")],
    patchEventTarget: () => [],
    patchOnProperties: noop,
    patchMethod: () => noop,
    bindArguments: () => [],
    patchThen: () => noop,
    patchMacroTask: () => noop,
    patchEventPrototype: () => noop,
    isIEOrEdge: () => false,
    getGlobalObjects: () => void 0,
    ObjectDefineProperty: () => noop,
    ObjectGetOwnPropertyDescriptor: () => void 0,
    ObjectCreate: () => void 0,
    ArraySlice: () => [],
    patchClass: () => noop,
    wrapWithCurrentZone: () => noop,
    filterProperties: () => [],
    attachOriginToPatched: () => noop,
    _redefineProperty: () => noop,
    patchCallbacks: () => noop,
    nativeScheduleMicroTask
  };
  let _currentZoneFrame = { parent: null, zone: new Zone2(null, null) };
  let _currentTask = null;
  let _numberOfNestedTaskFrames = 0;
  function noop() {
  }
  performanceMeasure("Zone", "Zone");
  return global["Zone"] = Zone2;
})(globalThis);
var ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ObjectDefineProperty = Object.defineProperty;
var ObjectGetPrototypeOf = Object.getPrototypeOf;
var ObjectCreate = Object.create;
var ArraySlice = Array.prototype.slice;
var ADD_EVENT_LISTENER_STR = "addEventListener";
var REMOVE_EVENT_LISTENER_STR = "removeEventListener";
var ZONE_SYMBOL_ADD_EVENT_LISTENER = Zone.__symbol__(ADD_EVENT_LISTENER_STR);
var ZONE_SYMBOL_REMOVE_EVENT_LISTENER = Zone.__symbol__(REMOVE_EVENT_LISTENER_STR);
var TRUE_STR = "true";
var FALSE_STR = "false";
var ZONE_SYMBOL_PREFIX = Zone.__symbol__("");
function wrapWithCurrentZone(callback, source) {
  return Zone.current.wrap(callback, source);
}
function scheduleMacroTaskWithCurrentZone(source, callback, data, customSchedule, customCancel) {
  return Zone.current.scheduleMacroTask(source, callback, data, customSchedule, customCancel);
}
var zoneSymbol = Zone.__symbol__;
var isWindowExists = typeof window !== "undefined";
var internalWindow = isWindowExists ? window : void 0;
var _global = isWindowExists && internalWindow || globalThis;
var REMOVE_ATTRIBUTE = "removeAttribute";
function bindArguments(args, source) {
  for (let i = args.length - 1; i >= 0; i--) {
    if (typeof args[i] === "function") {
      args[i] = wrapWithCurrentZone(args[i], source + "_" + i);
    }
  }
  return args;
}
function patchPrototype(prototype, fnNames) {
  const source = prototype.constructor["name"];
  for (let i = 0; i < fnNames.length; i++) {
    const name = fnNames[i];
    const delegate = prototype[name];
    if (delegate) {
      const prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, name);
      if (!isPropertyWritable(prototypeDesc)) {
        continue;
      }
      prototype[name] = ((delegate2) => {
        const patched = function() {
          return delegate2.apply(this, bindArguments(arguments, source + "." + name));
        };
        attachOriginToPatched(patched, delegate2);
        return patched;
      })(delegate);
    }
  }
}
function isPropertyWritable(propertyDesc) {
  if (!propertyDesc) {
    return true;
  }
  if (propertyDesc.writable === false) {
    return false;
  }
  return !(typeof propertyDesc.get === "function" && typeof propertyDesc.set === "undefined");
}
var isWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
var isNode = !("nw" in _global) && typeof _global.process !== "undefined" && {}.toString.call(_global.process) === "[object process]";
var isBrowser = !isNode && !isWebWorker && !!(isWindowExists && internalWindow["HTMLElement"]);
var isMix = typeof _global.process !== "undefined" && {}.toString.call(_global.process) === "[object process]" && !isWebWorker && !!(isWindowExists && internalWindow["HTMLElement"]);
var zoneSymbolEventNames$1 = {};
var wrapFn = function(event) {
  event = event || _global.event;
  if (!event) {
    return;
  }
  let eventNameSymbol = zoneSymbolEventNames$1[event.type];
  if (!eventNameSymbol) {
    eventNameSymbol = zoneSymbolEventNames$1[event.type] = zoneSymbol("ON_PROPERTY" + event.type);
  }
  const target = this || event.target || _global;
  const listener = target[eventNameSymbol];
  let result;
  if (isBrowser && target === internalWindow && event.type === "error") {
    const errorEvent = event;
    result = listener && listener.call(this, errorEvent.message, errorEvent.filename, errorEvent.lineno, errorEvent.colno, errorEvent.error);
    if (result === true) {
      event.preventDefault();
    }
  } else {
    result = listener && listener.apply(this, arguments);
    if (result != void 0 && !result) {
      event.preventDefault();
    }
  }
  return result;
};
function patchProperty(obj, prop, prototype) {
  let desc = ObjectGetOwnPropertyDescriptor(obj, prop);
  if (!desc && prototype) {
    const prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, prop);
    if (prototypeDesc) {
      desc = { enumerable: true, configurable: true };
    }
  }
  if (!desc || !desc.configurable) {
    return;
  }
  const onPropPatchedSymbol = zoneSymbol("on" + prop + "patched");
  if (obj.hasOwnProperty(onPropPatchedSymbol) && obj[onPropPatchedSymbol]) {
    return;
  }
  delete desc.writable;
  delete desc.value;
  const originalDescGet = desc.get;
  const originalDescSet = desc.set;
  const eventName = prop.slice(2);
  let eventNameSymbol = zoneSymbolEventNames$1[eventName];
  if (!eventNameSymbol) {
    eventNameSymbol = zoneSymbolEventNames$1[eventName] = zoneSymbol("ON_PROPERTY" + eventName);
  }
  desc.set = function(newValue) {
    let target = this;
    if (!target && obj === _global) {
      target = _global;
    }
    if (!target) {
      return;
    }
    const previousValue = target[eventNameSymbol];
    if (typeof previousValue === "function") {
      target.removeEventListener(eventName, wrapFn);
    }
    originalDescSet && originalDescSet.call(target, null);
    target[eventNameSymbol] = newValue;
    if (typeof newValue === "function") {
      target.addEventListener(eventName, wrapFn, false);
    }
  };
  desc.get = function() {
    let target = this;
    if (!target && obj === _global) {
      target = _global;
    }
    if (!target) {
      return null;
    }
    const listener = target[eventNameSymbol];
    if (listener) {
      return listener;
    } else if (originalDescGet) {
      let value = originalDescGet.call(this);
      if (value) {
        desc.set.call(this, value);
        if (typeof target[REMOVE_ATTRIBUTE] === "function") {
          target.removeAttribute(prop);
        }
        return value;
      }
    }
    return null;
  };
  ObjectDefineProperty(obj, prop, desc);
  obj[onPropPatchedSymbol] = true;
}
function patchOnProperties(obj, properties, prototype) {
  if (properties) {
    for (let i = 0; i < properties.length; i++) {
      patchProperty(obj, "on" + properties[i], prototype);
    }
  } else {
    const onProperties = [];
    for (const prop in obj) {
      if (prop.slice(0, 2) == "on") {
        onProperties.push(prop);
      }
    }
    for (let j = 0; j < onProperties.length; j++) {
      patchProperty(obj, onProperties[j], prototype);
    }
  }
}
var originalInstanceKey = zoneSymbol("originalInstance");
function patchClass(className) {
  const OriginalClass = _global[className];
  if (!OriginalClass)
    return;
  _global[zoneSymbol(className)] = OriginalClass;
  _global[className] = function() {
    const a = bindArguments(arguments, className);
    switch (a.length) {
      case 0:
        this[originalInstanceKey] = new OriginalClass();
        break;
      case 1:
        this[originalInstanceKey] = new OriginalClass(a[0]);
        break;
      case 2:
        this[originalInstanceKey] = new OriginalClass(a[0], a[1]);
        break;
      case 3:
        this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2]);
        break;
      case 4:
        this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2], a[3]);
        break;
      default:
        throw new Error("Arg list too long.");
    }
  };
  attachOriginToPatched(_global[className], OriginalClass);
  const instance = new OriginalClass(function() {
  });
  let prop;
  for (prop in instance) {
    if (className === "XMLHttpRequest" && prop === "responseBlob")
      continue;
    (function(prop2) {
      if (typeof instance[prop2] === "function") {
        _global[className].prototype[prop2] = function() {
          return this[originalInstanceKey][prop2].apply(this[originalInstanceKey], arguments);
        };
      } else {
        ObjectDefineProperty(_global[className].prototype, prop2, {
          set: function(fn) {
            if (typeof fn === "function") {
              this[originalInstanceKey][prop2] = wrapWithCurrentZone(fn, className + "." + prop2);
              attachOriginToPatched(this[originalInstanceKey][prop2], fn);
            } else {
              this[originalInstanceKey][prop2] = fn;
            }
          },
          get: function() {
            return this[originalInstanceKey][prop2];
          }
        });
      }
    })(prop);
  }
  for (prop in OriginalClass) {
    if (prop !== "prototype" && OriginalClass.hasOwnProperty(prop)) {
      _global[className][prop] = OriginalClass[prop];
    }
  }
}
function patchMethod(target, name, patchFn) {
  let proto = target;
  while (proto && !proto.hasOwnProperty(name)) {
    proto = ObjectGetPrototypeOf(proto);
  }
  if (!proto && target[name]) {
    proto = target;
  }
  const delegateName = zoneSymbol(name);
  let delegate = null;
  if (proto && (!(delegate = proto[delegateName]) || !proto.hasOwnProperty(delegateName))) {
    delegate = proto[delegateName] = proto[name];
    const desc = proto && ObjectGetOwnPropertyDescriptor(proto, name);
    if (isPropertyWritable(desc)) {
      const patchDelegate = patchFn(delegate, delegateName, name);
      proto[name] = function() {
        return patchDelegate(this, arguments);
      };
      attachOriginToPatched(proto[name], delegate);
    }
  }
  return delegate;
}
function patchMacroTask(obj, funcName, metaCreator) {
  let setNative = null;
  function scheduleTask(task) {
    const data = task.data;
    data.args[data.cbIdx] = function() {
      task.invoke.apply(this, arguments);
    };
    setNative.apply(data.target, data.args);
    return task;
  }
  setNative = patchMethod(obj, funcName, (delegate) => function(self2, args) {
    const meta = metaCreator(self2, args);
    if (meta.cbIdx >= 0 && typeof args[meta.cbIdx] === "function") {
      return scheduleMacroTaskWithCurrentZone(meta.name, args[meta.cbIdx], meta, scheduleTask);
    } else {
      return delegate.apply(self2, args);
    }
  });
}
function attachOriginToPatched(patched, original) {
  patched[zoneSymbol("OriginalDelegate")] = original;
}
var isDetectedIEOrEdge = false;
var ieOrEdge = false;
function isIE() {
  try {
    const ua = internalWindow.navigator.userAgent;
    if (ua.indexOf("MSIE ") !== -1 || ua.indexOf("Trident/") !== -1) {
      return true;
    }
  } catch (error) {
  }
  return false;
}
function isIEOrEdge() {
  if (isDetectedIEOrEdge) {
    return ieOrEdge;
  }
  isDetectedIEOrEdge = true;
  try {
    const ua = internalWindow.navigator.userAgent;
    if (ua.indexOf("MSIE ") !== -1 || ua.indexOf("Trident/") !== -1 || ua.indexOf("Edge/") !== -1) {
      ieOrEdge = true;
    }
  } catch (error) {
  }
  return ieOrEdge;
}
Zone.__load_patch("ZoneAwarePromise", (global, Zone2, api) => {
  const ObjectGetOwnPropertyDescriptor2 = Object.getOwnPropertyDescriptor;
  const ObjectDefineProperty2 = Object.defineProperty;
  function readableObjectToString(obj) {
    if (obj && obj.toString === Object.prototype.toString) {
      const className = obj.constructor && obj.constructor.name;
      return (className ? className : "") + ": " + JSON.stringify(obj);
    }
    return obj ? obj.toString() : Object.prototype.toString.call(obj);
  }
  const __symbol__ = api.symbol;
  const _uncaughtPromiseErrors = [];
  const isDisableWrappingUncaughtPromiseRejection = global[__symbol__("DISABLE_WRAPPING_UNCAUGHT_PROMISE_REJECTION")] !== false;
  const symbolPromise = __symbol__("Promise");
  const symbolThen = __symbol__("then");
  const creationTrace = "__creationTrace__";
  api.onUnhandledError = (e) => {
    if (api.showUncaughtError()) {
      const rejection = e && e.rejection;
      if (rejection) {
        console.error("Unhandled Promise rejection:", rejection instanceof Error ? rejection.message : rejection, "; Zone:", e.zone.name, "; Task:", e.task && e.task.source, "; Value:", rejection, rejection instanceof Error ? rejection.stack : void 0);
      } else {
        console.error(e);
      }
    }
  };
  api.microtaskDrainDone = () => {
    while (_uncaughtPromiseErrors.length) {
      const uncaughtPromiseError = _uncaughtPromiseErrors.shift();
      try {
        uncaughtPromiseError.zone.runGuarded(() => {
          if (uncaughtPromiseError.throwOriginal) {
            throw uncaughtPromiseError.rejection;
          }
          throw uncaughtPromiseError;
        });
      } catch (error) {
        handleUnhandledRejection(error);
      }
    }
  };
  const UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL = __symbol__("unhandledPromiseRejectionHandler");
  function handleUnhandledRejection(e) {
    api.onUnhandledError(e);
    try {
      const handler = Zone2[UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL];
      if (typeof handler === "function") {
        handler.call(this, e);
      }
    } catch (err) {
    }
  }
  function isThenable(value) {
    return value && value.then;
  }
  function forwardResolution(value) {
    return value;
  }
  function forwardRejection(rejection) {
    return ZoneAwarePromise.reject(rejection);
  }
  const symbolState = __symbol__("state");
  const symbolValue = __symbol__("value");
  const symbolFinally = __symbol__("finally");
  const symbolParentPromiseValue = __symbol__("parentPromiseValue");
  const symbolParentPromiseState = __symbol__("parentPromiseState");
  const source = "Promise.then";
  const UNRESOLVED = null;
  const RESOLVED = true;
  const REJECTED = false;
  const REJECTED_NO_CATCH = 0;
  function makeResolver(promise, state) {
    return (v) => {
      try {
        resolvePromise(promise, state, v);
      } catch (err) {
        resolvePromise(promise, false, err);
      }
    };
  }
  const once = function() {
    let wasCalled = false;
    return function wrapper(wrappedFunction) {
      return function() {
        if (wasCalled) {
          return;
        }
        wasCalled = true;
        wrappedFunction.apply(null, arguments);
      };
    };
  };
  const TYPE_ERROR = "Promise resolved with itself";
  const CURRENT_TASK_TRACE_SYMBOL = __symbol__("currentTaskTrace");
  function resolvePromise(promise, state, value) {
    const onceWrapper = once();
    if (promise === value) {
      throw new TypeError(TYPE_ERROR);
    }
    if (promise[symbolState] === UNRESOLVED) {
      let then = null;
      try {
        if (typeof value === "object" || typeof value === "function") {
          then = value && value.then;
        }
      } catch (err) {
        onceWrapper(() => {
          resolvePromise(promise, false, err);
        })();
        return promise;
      }
      if (state !== REJECTED && value instanceof ZoneAwarePromise && value.hasOwnProperty(symbolState) && value.hasOwnProperty(symbolValue) && value[symbolState] !== UNRESOLVED) {
        clearRejectedNoCatch(value);
        resolvePromise(promise, value[symbolState], value[symbolValue]);
      } else if (state !== REJECTED && typeof then === "function") {
        try {
          then.call(value, onceWrapper(makeResolver(promise, state)), onceWrapper(makeResolver(promise, false)));
        } catch (err) {
          onceWrapper(() => {
            resolvePromise(promise, false, err);
          })();
        }
      } else {
        promise[symbolState] = state;
        const queue = promise[symbolValue];
        promise[symbolValue] = value;
        if (promise[symbolFinally] === symbolFinally) {
          if (state === RESOLVED) {
            promise[symbolState] = promise[symbolParentPromiseState];
            promise[symbolValue] = promise[symbolParentPromiseValue];
          }
        }
        if (state === REJECTED && value instanceof Error) {
          const trace = Zone2.currentTask && Zone2.currentTask.data && Zone2.currentTask.data[creationTrace];
          if (trace) {
            ObjectDefineProperty2(value, CURRENT_TASK_TRACE_SYMBOL, { configurable: true, enumerable: false, writable: true, value: trace });
          }
        }
        for (let i = 0; i < queue.length; ) {
          scheduleResolveOrReject(promise, queue[i++], queue[i++], queue[i++], queue[i++]);
        }
        if (queue.length == 0 && state == REJECTED) {
          promise[symbolState] = REJECTED_NO_CATCH;
          let uncaughtPromiseError = value;
          try {
            throw new Error("Uncaught (in promise): " + readableObjectToString(value) + (value && value.stack ? "\n" + value.stack : ""));
          } catch (err) {
            uncaughtPromiseError = err;
          }
          if (isDisableWrappingUncaughtPromiseRejection) {
            uncaughtPromiseError.throwOriginal = true;
          }
          uncaughtPromiseError.rejection = value;
          uncaughtPromiseError.promise = promise;
          uncaughtPromiseError.zone = Zone2.current;
          uncaughtPromiseError.task = Zone2.currentTask;
          _uncaughtPromiseErrors.push(uncaughtPromiseError);
          api.scheduleMicroTask();
        }
      }
    }
    return promise;
  }
  const REJECTION_HANDLED_HANDLER = __symbol__("rejectionHandledHandler");
  function clearRejectedNoCatch(promise) {
    if (promise[symbolState] === REJECTED_NO_CATCH) {
      try {
        const handler = Zone2[REJECTION_HANDLED_HANDLER];
        if (handler && typeof handler === "function") {
          handler.call(this, { rejection: promise[symbolValue], promise });
        }
      } catch (err) {
      }
      promise[symbolState] = REJECTED;
      for (let i = 0; i < _uncaughtPromiseErrors.length; i++) {
        if (promise === _uncaughtPromiseErrors[i].promise) {
          _uncaughtPromiseErrors.splice(i, 1);
        }
      }
    }
  }
  function scheduleResolveOrReject(promise, zone, chainPromise, onFulfilled, onRejected) {
    clearRejectedNoCatch(promise);
    const promiseState = promise[symbolState];
    const delegate = promiseState ? typeof onFulfilled === "function" ? onFulfilled : forwardResolution : typeof onRejected === "function" ? onRejected : forwardRejection;
    zone.scheduleMicroTask(source, () => {
      try {
        const parentPromiseValue = promise[symbolValue];
        const isFinallyPromise = !!chainPromise && symbolFinally === chainPromise[symbolFinally];
        if (isFinallyPromise) {
          chainPromise[symbolParentPromiseValue] = parentPromiseValue;
          chainPromise[symbolParentPromiseState] = promiseState;
        }
        const value = zone.run(delegate, void 0, isFinallyPromise && delegate !== forwardRejection && delegate !== forwardResolution ? [] : [parentPromiseValue]);
        resolvePromise(chainPromise, true, value);
      } catch (error) {
        resolvePromise(chainPromise, false, error);
      }
    }, chainPromise);
  }
  const ZONE_AWARE_PROMISE_TO_STRING = "function ZoneAwarePromise() { [native code] }";
  const noop = function() {
  };
  const AggregateError = global.AggregateError;
  class ZoneAwarePromise {
    static toString() {
      return ZONE_AWARE_PROMISE_TO_STRING;
    }
    static resolve(value) {
      if (value instanceof ZoneAwarePromise) {
        return value;
      }
      return resolvePromise(new this(null), RESOLVED, value);
    }
    static reject(error) {
      return resolvePromise(new this(null), REJECTED, error);
    }
    static withResolvers() {
      const result = {};
      result.promise = new ZoneAwarePromise((res, rej) => {
        result.resolve = res;
        result.reject = rej;
      });
      return result;
    }
    static any(values) {
      if (!values || typeof values[Symbol.iterator] !== "function") {
        return Promise.reject(new AggregateError([], "All promises were rejected"));
      }
      const promises = [];
      let count = 0;
      try {
        for (let v of values) {
          count++;
          promises.push(ZoneAwarePromise.resolve(v));
        }
      } catch (err) {
        return Promise.reject(new AggregateError([], "All promises were rejected"));
      }
      if (count === 0) {
        return Promise.reject(new AggregateError([], "All promises were rejected"));
      }
      let finished = false;
      const errors = [];
      return new ZoneAwarePromise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
          promises[i].then((v) => {
            if (finished) {
              return;
            }
            finished = true;
            resolve(v);
          }, (err) => {
            errors.push(err);
            count--;
            if (count === 0) {
              finished = true;
              reject(new AggregateError(errors, "All promises were rejected"));
            }
          });
        }
      });
    }
    static race(values) {
      let resolve;
      let reject;
      let promise = new this((res, rej) => {
        resolve = res;
        reject = rej;
      });
      function onResolve(value) {
        resolve(value);
      }
      function onReject(error) {
        reject(error);
      }
      for (let value of values) {
        if (!isThenable(value)) {
          value = this.resolve(value);
        }
        value.then(onResolve, onReject);
      }
      return promise;
    }
    static all(values) {
      return ZoneAwarePromise.allWithCallback(values);
    }
    static allSettled(values) {
      const P = this && this.prototype instanceof ZoneAwarePromise ? this : ZoneAwarePromise;
      return P.allWithCallback(values, {
        thenCallback: (value) => ({ status: "fulfilled", value }),
        errorCallback: (err) => ({ status: "rejected", reason: err })
      });
    }
    static allWithCallback(values, callback) {
      let resolve;
      let reject;
      let promise = new this((res, rej) => {
        resolve = res;
        reject = rej;
      });
      let unresolvedCount = 2;
      let valueIndex = 0;
      const resolvedValues = [];
      for (let value of values) {
        if (!isThenable(value)) {
          value = this.resolve(value);
        }
        const curValueIndex = valueIndex;
        try {
          value.then((value2) => {
            resolvedValues[curValueIndex] = callback ? callback.thenCallback(value2) : value2;
            unresolvedCount--;
            if (unresolvedCount === 0) {
              resolve(resolvedValues);
            }
          }, (err) => {
            if (!callback) {
              reject(err);
            } else {
              resolvedValues[curValueIndex] = callback.errorCallback(err);
              unresolvedCount--;
              if (unresolvedCount === 0) {
                resolve(resolvedValues);
              }
            }
          });
        } catch (thenErr) {
          reject(thenErr);
        }
        unresolvedCount++;
        valueIndex++;
      }
      unresolvedCount -= 2;
      if (unresolvedCount === 0) {
        resolve(resolvedValues);
      }
      return promise;
    }
    constructor(executor) {
      const promise = this;
      if (!(promise instanceof ZoneAwarePromise)) {
        throw new Error("Must be an instanceof Promise.");
      }
      promise[symbolState] = UNRESOLVED;
      promise[symbolValue] = [];
      try {
        const onceWrapper = once();
        executor && executor(onceWrapper(makeResolver(promise, RESOLVED)), onceWrapper(makeResolver(promise, REJECTED)));
      } catch (error) {
        resolvePromise(promise, false, error);
      }
    }
    get [Symbol.toStringTag]() {
      return "Promise";
    }
    get [Symbol.species]() {
      return ZoneAwarePromise;
    }
    then(onFulfilled, onRejected) {
      let C = this.constructor?.[Symbol.species];
      if (!C || typeof C !== "function") {
        C = this.constructor || ZoneAwarePromise;
      }
      const chainPromise = new C(noop);
      const zone = Zone2.current;
      if (this[symbolState] == UNRESOLVED) {
        this[symbolValue].push(zone, chainPromise, onFulfilled, onRejected);
      } else {
        scheduleResolveOrReject(this, zone, chainPromise, onFulfilled, onRejected);
      }
      return chainPromise;
    }
    catch(onRejected) {
      return this.then(null, onRejected);
    }
    finally(onFinally) {
      let C = this.constructor?.[Symbol.species];
      if (!C || typeof C !== "function") {
        C = ZoneAwarePromise;
      }
      const chainPromise = new C(noop);
      chainPromise[symbolFinally] = symbolFinally;
      const zone = Zone2.current;
      if (this[symbolState] == UNRESOLVED) {
        this[symbolValue].push(zone, chainPromise, onFinally, onFinally);
      } else {
        scheduleResolveOrReject(this, zone, chainPromise, onFinally, onFinally);
      }
      return chainPromise;
    }
  }
  ZoneAwarePromise["resolve"] = ZoneAwarePromise.resolve;
  ZoneAwarePromise["reject"] = ZoneAwarePromise.reject;
  ZoneAwarePromise["race"] = ZoneAwarePromise.race;
  ZoneAwarePromise["all"] = ZoneAwarePromise.all;
  const NativePromise = global[symbolPromise] = global["Promise"];
  global["Promise"] = ZoneAwarePromise;
  const symbolThenPatched = __symbol__("thenPatched");
  function patchThen(Ctor) {
    const proto = Ctor.prototype;
    const prop = ObjectGetOwnPropertyDescriptor2(proto, "then");
    if (prop && (prop.writable === false || !prop.configurable)) {
      return;
    }
    const originalThen = proto.then;
    proto[symbolThen] = originalThen;
    Ctor.prototype.then = function(onResolve, onReject) {
      const wrapped = new ZoneAwarePromise((resolve, reject) => {
        originalThen.call(this, resolve, reject);
      });
      return wrapped.then(onResolve, onReject);
    };
    Ctor[symbolThenPatched] = true;
  }
  api.patchThen = patchThen;
  function zoneify(fn) {
    return function(self2, args) {
      let resultPromise = fn.apply(self2, args);
      if (resultPromise instanceof ZoneAwarePromise) {
        return resultPromise;
      }
      let ctor = resultPromise.constructor;
      if (!ctor[symbolThenPatched]) {
        patchThen(ctor);
      }
      return resultPromise;
    };
  }
  if (NativePromise) {
    patchThen(NativePromise);
    patchMethod(global, "fetch", (delegate) => zoneify(delegate));
  }
  Promise[Zone2.__symbol__("uncaughtPromiseErrors")] = _uncaughtPromiseErrors;
  return ZoneAwarePromise;
});
Zone.__load_patch("toString", (global) => {
  const originalFunctionToString = Function.prototype.toString;
  const ORIGINAL_DELEGATE_SYMBOL = zoneSymbol("OriginalDelegate");
  const PROMISE_SYMBOL = zoneSymbol("Promise");
  const ERROR_SYMBOL = zoneSymbol("Error");
  const newFunctionToString = function toString() {
    if (typeof this === "function") {
      const originalDelegate = this[ORIGINAL_DELEGATE_SYMBOL];
      if (originalDelegate) {
        if (typeof originalDelegate === "function") {
          return originalFunctionToString.call(originalDelegate);
        } else {
          return Object.prototype.toString.call(originalDelegate);
        }
      }
      if (this === Promise) {
        const nativePromise = global[PROMISE_SYMBOL];
        if (nativePromise) {
          return originalFunctionToString.call(nativePromise);
        }
      }
      if (this === Error) {
        const nativeError = global[ERROR_SYMBOL];
        if (nativeError) {
          return originalFunctionToString.call(nativeError);
        }
      }
    }
    return originalFunctionToString.call(this);
  };
  newFunctionToString[ORIGINAL_DELEGATE_SYMBOL] = originalFunctionToString;
  Function.prototype.toString = newFunctionToString;
  const originalObjectToString = Object.prototype.toString;
  const PROMISE_OBJECT_TO_STRING = "[object Promise]";
  Object.prototype.toString = function() {
    if (typeof Promise === "function" && this instanceof Promise) {
      return PROMISE_OBJECT_TO_STRING;
    }
    return originalObjectToString.call(this);
  };
});
var passiveSupported = false;
if (typeof window !== "undefined") {
  try {
    const options = Object.defineProperty({}, "passive", {
      get: function() {
        passiveSupported = true;
      }
    });
    window.addEventListener("test", options, options);
    window.removeEventListener("test", options, options);
  } catch (err) {
    passiveSupported = false;
  }
}
var OPTIMIZED_ZONE_EVENT_TASK_DATA = {
  useG: true
};
var zoneSymbolEventNames = {};
var globalSources = {};
var EVENT_NAME_SYMBOL_REGX = new RegExp("^" + ZONE_SYMBOL_PREFIX + "(\\w+)(true|false)$");
var IMMEDIATE_PROPAGATION_SYMBOL = zoneSymbol("propagationStopped");
function prepareEventNames(eventName, eventNameToString) {
  const falseEventName = (eventNameToString ? eventNameToString(eventName) : eventName) + FALSE_STR;
  const trueEventName = (eventNameToString ? eventNameToString(eventName) : eventName) + TRUE_STR;
  const symbol = ZONE_SYMBOL_PREFIX + falseEventName;
  const symbolCapture = ZONE_SYMBOL_PREFIX + trueEventName;
  zoneSymbolEventNames[eventName] = {};
  zoneSymbolEventNames[eventName][FALSE_STR] = symbol;
  zoneSymbolEventNames[eventName][TRUE_STR] = symbolCapture;
}
function patchEventTarget(_global2, api, apis, patchOptions) {
  const ADD_EVENT_LISTENER = patchOptions && patchOptions.add || ADD_EVENT_LISTENER_STR;
  const REMOVE_EVENT_LISTENER = patchOptions && patchOptions.rm || REMOVE_EVENT_LISTENER_STR;
  const LISTENERS_EVENT_LISTENER = patchOptions && patchOptions.listeners || "eventListeners";
  const REMOVE_ALL_LISTENERS_EVENT_LISTENER = patchOptions && patchOptions.rmAll || "removeAllListeners";
  const zoneSymbolAddEventListener = zoneSymbol(ADD_EVENT_LISTENER);
  const ADD_EVENT_LISTENER_SOURCE = "." + ADD_EVENT_LISTENER + ":";
  const PREPEND_EVENT_LISTENER = "prependListener";
  const PREPEND_EVENT_LISTENER_SOURCE = "." + PREPEND_EVENT_LISTENER + ":";
  const invokeTask = function(task, target, event) {
    if (task.isRemoved) {
      return;
    }
    const delegate = task.callback;
    if (typeof delegate === "object" && delegate.handleEvent) {
      task.callback = (event2) => delegate.handleEvent(event2);
      task.originalDelegate = delegate;
    }
    let error;
    try {
      task.invoke(task, target, [event]);
    } catch (err) {
      error = err;
    }
    const options = task.options;
    if (options && typeof options === "object" && options.once) {
      const delegate2 = task.originalDelegate ? task.originalDelegate : task.callback;
      target[REMOVE_EVENT_LISTENER].call(target, event.type, delegate2, options);
    }
    return error;
  };
  function globalCallback(context, event, isCapture) {
    event = event || _global2.event;
    if (!event) {
      return;
    }
    const target = context || event.target || _global2;
    const tasks = target[zoneSymbolEventNames[event.type][isCapture ? TRUE_STR : FALSE_STR]];
    if (tasks) {
      const errors = [];
      if (tasks.length === 1) {
        const err = invokeTask(tasks[0], target, event);
        err && errors.push(err);
      } else {
        const copyTasks = tasks.slice();
        for (let i = 0; i < copyTasks.length; i++) {
          if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
            break;
          }
          const err = invokeTask(copyTasks[i], target, event);
          err && errors.push(err);
        }
      }
      if (errors.length === 1) {
        throw errors[0];
      } else {
        for (let i = 0; i < errors.length; i++) {
          const err = errors[i];
          api.nativeScheduleMicroTask(() => {
            throw err;
          });
        }
      }
    }
  }
  const globalZoneAwareCallback = function(event) {
    return globalCallback(this, event, false);
  };
  const globalZoneAwareCaptureCallback = function(event) {
    return globalCallback(this, event, true);
  };
  function patchEventTargetMethods(obj, patchOptions2) {
    if (!obj) {
      return false;
    }
    let useGlobalCallback = true;
    if (patchOptions2 && patchOptions2.useG !== void 0) {
      useGlobalCallback = patchOptions2.useG;
    }
    const validateHandler = patchOptions2 && patchOptions2.vh;
    let checkDuplicate = true;
    if (patchOptions2 && patchOptions2.chkDup !== void 0) {
      checkDuplicate = patchOptions2.chkDup;
    }
    let returnTarget = false;
    if (patchOptions2 && patchOptions2.rt !== void 0) {
      returnTarget = patchOptions2.rt;
    }
    let proto = obj;
    while (proto && !proto.hasOwnProperty(ADD_EVENT_LISTENER)) {
      proto = ObjectGetPrototypeOf(proto);
    }
    if (!proto && obj[ADD_EVENT_LISTENER]) {
      proto = obj;
    }
    if (!proto) {
      return false;
    }
    if (proto[zoneSymbolAddEventListener]) {
      return false;
    }
    const eventNameToString = patchOptions2 && patchOptions2.eventNameToString;
    const taskData = {};
    const nativeAddEventListener = proto[zoneSymbolAddEventListener] = proto[ADD_EVENT_LISTENER];
    const nativeRemoveEventListener = proto[zoneSymbol(REMOVE_EVENT_LISTENER)] = proto[REMOVE_EVENT_LISTENER];
    const nativeListeners = proto[zoneSymbol(LISTENERS_EVENT_LISTENER)] = proto[LISTENERS_EVENT_LISTENER];
    const nativeRemoveAllListeners = proto[zoneSymbol(REMOVE_ALL_LISTENERS_EVENT_LISTENER)] = proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER];
    let nativePrependEventListener;
    if (patchOptions2 && patchOptions2.prepend) {
      nativePrependEventListener = proto[zoneSymbol(patchOptions2.prepend)] = proto[patchOptions2.prepend];
    }
    function buildEventListenerOptions(options, passive) {
      if (!passiveSupported && typeof options === "object" && options) {
        return !!options.capture;
      }
      if (!passiveSupported || !passive) {
        return options;
      }
      if (typeof options === "boolean") {
        return { capture: options, passive: true };
      }
      if (!options) {
        return { passive: true };
      }
      if (typeof options === "object" && options.passive !== false) {
        return { ...options, passive: true };
      }
      return options;
    }
    const customScheduleGlobal = function(task) {
      if (taskData.isExisting) {
        return;
      }
      return nativeAddEventListener.call(taskData.target, taskData.eventName, taskData.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, taskData.options);
    };
    const customCancelGlobal = function(task) {
      if (!task.isRemoved) {
        const symbolEventNames = zoneSymbolEventNames[task.eventName];
        let symbolEventName;
        if (symbolEventNames) {
          symbolEventName = symbolEventNames[task.capture ? TRUE_STR : FALSE_STR];
        }
        const existingTasks = symbolEventName && task.target[symbolEventName];
        if (existingTasks) {
          for (let i = 0; i < existingTasks.length; i++) {
            const existingTask = existingTasks[i];
            if (existingTask === task) {
              existingTasks.splice(i, 1);
              task.isRemoved = true;
              if (existingTasks.length === 0) {
                task.allRemoved = true;
                task.target[symbolEventName] = null;
              }
              break;
            }
          }
        }
      }
      if (!task.allRemoved) {
        return;
      }
      return nativeRemoveEventListener.call(task.target, task.eventName, task.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, task.options);
    };
    const customScheduleNonGlobal = function(task) {
      return nativeAddEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
    };
    const customSchedulePrepend = function(task) {
      return nativePrependEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
    };
    const customCancelNonGlobal = function(task) {
      return nativeRemoveEventListener.call(task.target, task.eventName, task.invoke, task.options);
    };
    const customSchedule = useGlobalCallback ? customScheduleGlobal : customScheduleNonGlobal;
    const customCancel = useGlobalCallback ? customCancelGlobal : customCancelNonGlobal;
    const compareTaskCallbackVsDelegate = function(task, delegate) {
      const typeOfDelegate = typeof delegate;
      return typeOfDelegate === "function" && task.callback === delegate || typeOfDelegate === "object" && task.originalDelegate === delegate;
    };
    const compare = patchOptions2 && patchOptions2.diff ? patchOptions2.diff : compareTaskCallbackVsDelegate;
    const unpatchedEvents = Zone[zoneSymbol("UNPATCHED_EVENTS")];
    const passiveEvents = _global2[zoneSymbol("PASSIVE_EVENTS")];
    const makeAddListener = function(nativeListener, addSource, customScheduleFn, customCancelFn, returnTarget2 = false, prepend = false) {
      return function() {
        const target = this || _global2;
        let eventName = arguments[0];
        if (patchOptions2 && patchOptions2.transferEventName) {
          eventName = patchOptions2.transferEventName(eventName);
        }
        let delegate = arguments[1];
        if (!delegate) {
          return nativeListener.apply(this, arguments);
        }
        if (isNode && eventName === "uncaughtException") {
          return nativeListener.apply(this, arguments);
        }
        let isHandleEvent = false;
        if (typeof delegate !== "function") {
          if (!delegate.handleEvent) {
            return nativeListener.apply(this, arguments);
          }
          isHandleEvent = true;
        }
        if (validateHandler && !validateHandler(nativeListener, delegate, target, arguments)) {
          return;
        }
        const passive = passiveSupported && !!passiveEvents && passiveEvents.indexOf(eventName) !== -1;
        const options = buildEventListenerOptions(arguments[2], passive);
        const signal = options && typeof options === "object" && options.signal && typeof options.signal === "object" ? options.signal : void 0;
        if (signal?.aborted) {
          return;
        }
        if (unpatchedEvents) {
          for (let i = 0; i < unpatchedEvents.length; i++) {
            if (eventName === unpatchedEvents[i]) {
              if (passive) {
                return nativeListener.call(target, eventName, delegate, options);
              } else {
                return nativeListener.apply(this, arguments);
              }
            }
          }
        }
        const capture = !options ? false : typeof options === "boolean" ? true : options.capture;
        const once = options && typeof options === "object" ? options.once : false;
        const zone = Zone.current;
        let symbolEventNames = zoneSymbolEventNames[eventName];
        if (!symbolEventNames) {
          prepareEventNames(eventName, eventNameToString);
          symbolEventNames = zoneSymbolEventNames[eventName];
        }
        const symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
        let existingTasks = target[symbolEventName];
        let isExisting = false;
        if (existingTasks) {
          isExisting = true;
          if (checkDuplicate) {
            for (let i = 0; i < existingTasks.length; i++) {
              if (compare(existingTasks[i], delegate)) {
                return;
              }
            }
          }
        } else {
          existingTasks = target[symbolEventName] = [];
        }
        let source;
        const constructorName = target.constructor["name"];
        const targetSource = globalSources[constructorName];
        if (targetSource) {
          source = targetSource[eventName];
        }
        if (!source) {
          source = constructorName + addSource + (eventNameToString ? eventNameToString(eventName) : eventName);
        }
        taskData.options = options;
        if (once) {
          taskData.options.once = false;
        }
        taskData.target = target;
        taskData.capture = capture;
        taskData.eventName = eventName;
        taskData.isExisting = isExisting;
        const data = useGlobalCallback ? OPTIMIZED_ZONE_EVENT_TASK_DATA : void 0;
        if (data) {
          data.taskData = taskData;
        }
        if (signal) {
          taskData.options.signal = void 0;
        }
        const task = zone.scheduleEventTask(source, delegate, data, customScheduleFn, customCancelFn);
        if (signal) {
          taskData.options.signal = signal;
          nativeListener.call(signal, "abort", () => {
            task.zone.cancelTask(task);
          }, { once: true });
        }
        taskData.target = null;
        if (data) {
          data.taskData = null;
        }
        if (once) {
          options.once = true;
        }
        if (!(!passiveSupported && typeof task.options === "boolean")) {
          task.options = options;
        }
        task.target = target;
        task.capture = capture;
        task.eventName = eventName;
        if (isHandleEvent) {
          task.originalDelegate = delegate;
        }
        if (!prepend) {
          existingTasks.push(task);
        } else {
          existingTasks.unshift(task);
        }
        if (returnTarget2) {
          return target;
        }
      };
    };
    proto[ADD_EVENT_LISTENER] = makeAddListener(nativeAddEventListener, ADD_EVENT_LISTENER_SOURCE, customSchedule, customCancel, returnTarget);
    if (nativePrependEventListener) {
      proto[PREPEND_EVENT_LISTENER] = makeAddListener(nativePrependEventListener, PREPEND_EVENT_LISTENER_SOURCE, customSchedulePrepend, customCancel, returnTarget, true);
    }
    proto[REMOVE_EVENT_LISTENER] = function() {
      const target = this || _global2;
      let eventName = arguments[0];
      if (patchOptions2 && patchOptions2.transferEventName) {
        eventName = patchOptions2.transferEventName(eventName);
      }
      const options = arguments[2];
      const capture = !options ? false : typeof options === "boolean" ? true : options.capture;
      const delegate = arguments[1];
      if (!delegate) {
        return nativeRemoveEventListener.apply(this, arguments);
      }
      if (validateHandler && !validateHandler(nativeRemoveEventListener, delegate, target, arguments)) {
        return;
      }
      const symbolEventNames = zoneSymbolEventNames[eventName];
      let symbolEventName;
      if (symbolEventNames) {
        symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
      }
      const existingTasks = symbolEventName && target[symbolEventName];
      if (existingTasks) {
        for (let i = 0; i < existingTasks.length; i++) {
          const existingTask = existingTasks[i];
          if (compare(existingTask, delegate)) {
            existingTasks.splice(i, 1);
            existingTask.isRemoved = true;
            if (existingTasks.length === 0) {
              existingTask.allRemoved = true;
              target[symbolEventName] = null;
              if (typeof eventName === "string") {
                const onPropertySymbol = ZONE_SYMBOL_PREFIX + "ON_PROPERTY" + eventName;
                target[onPropertySymbol] = null;
              }
            }
            existingTask.zone.cancelTask(existingTask);
            if (returnTarget) {
              return target;
            }
            return;
          }
        }
      }
      return nativeRemoveEventListener.apply(this, arguments);
    };
    proto[LISTENERS_EVENT_LISTENER] = function() {
      const target = this || _global2;
      let eventName = arguments[0];
      if (patchOptions2 && patchOptions2.transferEventName) {
        eventName = patchOptions2.transferEventName(eventName);
      }
      const listeners = [];
      const tasks = findEventTasks(target, eventNameToString ? eventNameToString(eventName) : eventName);
      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        let delegate = task.originalDelegate ? task.originalDelegate : task.callback;
        listeners.push(delegate);
      }
      return listeners;
    };
    proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER] = function() {
      const target = this || _global2;
      let eventName = arguments[0];
      if (!eventName) {
        const keys = Object.keys(target);
        for (let i = 0; i < keys.length; i++) {
          const prop = keys[i];
          const match = EVENT_NAME_SYMBOL_REGX.exec(prop);
          let evtName = match && match[1];
          if (evtName && evtName !== "removeListener") {
            this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, evtName);
          }
        }
        this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, "removeListener");
      } else {
        if (patchOptions2 && patchOptions2.transferEventName) {
          eventName = patchOptions2.transferEventName(eventName);
        }
        const symbolEventNames = zoneSymbolEventNames[eventName];
        if (symbolEventNames) {
          const symbolEventName = symbolEventNames[FALSE_STR];
          const symbolCaptureEventName = symbolEventNames[TRUE_STR];
          const tasks = target[symbolEventName];
          const captureTasks = target[symbolCaptureEventName];
          if (tasks) {
            const removeTasks = tasks.slice();
            for (let i = 0; i < removeTasks.length; i++) {
              const task = removeTasks[i];
              let delegate = task.originalDelegate ? task.originalDelegate : task.callback;
              this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
            }
          }
          if (captureTasks) {
            const removeTasks = captureTasks.slice();
            for (let i = 0; i < removeTasks.length; i++) {
              const task = removeTasks[i];
              let delegate = task.originalDelegate ? task.originalDelegate : task.callback;
              this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
            }
          }
        }
      }
      if (returnTarget) {
        return this;
      }
    };
    attachOriginToPatched(proto[ADD_EVENT_LISTENER], nativeAddEventListener);
    attachOriginToPatched(proto[REMOVE_EVENT_LISTENER], nativeRemoveEventListener);
    if (nativeRemoveAllListeners) {
      attachOriginToPatched(proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER], nativeRemoveAllListeners);
    }
    if (nativeListeners) {
      attachOriginToPatched(proto[LISTENERS_EVENT_LISTENER], nativeListeners);
    }
    return true;
  }
  let results = [];
  for (let i = 0; i < apis.length; i++) {
    results[i] = patchEventTargetMethods(apis[i], patchOptions);
  }
  return results;
}
function findEventTasks(target, eventName) {
  if (!eventName) {
    const foundTasks = [];
    for (let prop in target) {
      const match = EVENT_NAME_SYMBOL_REGX.exec(prop);
      let evtName = match && match[1];
      if (evtName && (!eventName || evtName === eventName)) {
        const tasks = target[prop];
        if (tasks) {
          for (let i = 0; i < tasks.length; i++) {
            foundTasks.push(tasks[i]);
          }
        }
      }
    }
    return foundTasks;
  }
  let symbolEventName = zoneSymbolEventNames[eventName];
  if (!symbolEventName) {
    prepareEventNames(eventName);
    symbolEventName = zoneSymbolEventNames[eventName];
  }
  const captureFalseTasks = target[symbolEventName[FALSE_STR]];
  const captureTrueTasks = target[symbolEventName[TRUE_STR]];
  if (!captureFalseTasks) {
    return captureTrueTasks ? captureTrueTasks.slice() : [];
  } else {
    return captureTrueTasks ? captureFalseTasks.concat(captureTrueTasks) : captureFalseTasks.slice();
  }
}
function patchEventPrototype(global, api) {
  const Event = global["Event"];
  if (Event && Event.prototype) {
    api.patchMethod(Event.prototype, "stopImmediatePropagation", (delegate) => function(self2, args) {
      self2[IMMEDIATE_PROPAGATION_SYMBOL] = true;
      delegate && delegate.apply(self2, args);
    });
  }
}
function patchCallbacks(api, target, targetName, method, callbacks) {
  const symbol = Zone.__symbol__(method);
  if (target[symbol]) {
    return;
  }
  const nativeDelegate = target[symbol] = target[method];
  target[method] = function(name, opts, options) {
    if (opts && opts.prototype) {
      callbacks.forEach(function(callback) {
        const source = `${targetName}.${method}::` + callback;
        const prototype = opts.prototype;
        try {
          if (prototype.hasOwnProperty(callback)) {
            const descriptor = api.ObjectGetOwnPropertyDescriptor(prototype, callback);
            if (descriptor && descriptor.value) {
              descriptor.value = api.wrapWithCurrentZone(descriptor.value, source);
              api._redefineProperty(opts.prototype, callback, descriptor);
            } else if (prototype[callback]) {
              prototype[callback] = api.wrapWithCurrentZone(prototype[callback], source);
            }
          } else if (prototype[callback]) {
            prototype[callback] = api.wrapWithCurrentZone(prototype[callback], source);
          }
        } catch {
        }
      });
    }
    return nativeDelegate.call(target, name, opts, options);
  };
  api.attachOriginToPatched(target[method], nativeDelegate);
}
function filterProperties(target, onProperties, ignoreProperties) {
  if (!ignoreProperties || ignoreProperties.length === 0) {
    return onProperties;
  }
  const tip = ignoreProperties.filter((ip) => ip.target === target);
  if (!tip || tip.length === 0) {
    return onProperties;
  }
  const targetIgnoreProperties = tip[0].ignoreProperties;
  return onProperties.filter((op) => targetIgnoreProperties.indexOf(op) === -1);
}
function patchFilteredProperties(target, onProperties, ignoreProperties, prototype) {
  if (!target) {
    return;
  }
  const filteredProperties = filterProperties(target, onProperties, ignoreProperties);
  patchOnProperties(target, filteredProperties, prototype);
}
function getOnEventNames(target) {
  return Object.getOwnPropertyNames(target).filter((name) => name.startsWith("on") && name.length > 2).map((name) => name.substring(2));
}
function propertyDescriptorPatch(api, _global2) {
  if (isNode && !isMix) {
    return;
  }
  if (Zone[api.symbol("patchEvents")]) {
    return;
  }
  const ignoreProperties = _global2["__Zone_ignore_on_properties"];
  let patchTargets = [];
  if (isBrowser) {
    const internalWindow2 = window;
    patchTargets = patchTargets.concat([
      "Document",
      "SVGElement",
      "Element",
      "HTMLElement",
      "HTMLBodyElement",
      "HTMLMediaElement",
      "HTMLFrameSetElement",
      "HTMLFrameElement",
      "HTMLIFrameElement",
      "HTMLMarqueeElement",
      "Worker"
    ]);
    const ignoreErrorProperties = isIE() ? [{ target: internalWindow2, ignoreProperties: ["error"] }] : [];
    patchFilteredProperties(internalWindow2, getOnEventNames(internalWindow2), ignoreProperties ? ignoreProperties.concat(ignoreErrorProperties) : ignoreProperties, ObjectGetPrototypeOf(internalWindow2));
  }
  patchTargets = patchTargets.concat([
    "XMLHttpRequest",
    "XMLHttpRequestEventTarget",
    "IDBIndex",
    "IDBRequest",
    "IDBOpenDBRequest",
    "IDBDatabase",
    "IDBTransaction",
    "IDBCursor",
    "WebSocket"
  ]);
  for (let i = 0; i < patchTargets.length; i++) {
    const target = _global2[patchTargets[i]];
    target && target.prototype && patchFilteredProperties(target.prototype, getOnEventNames(target.prototype), ignoreProperties);
  }
}
Zone.__load_patch("util", (global, Zone2, api) => {
  const eventNames = getOnEventNames(global);
  api.patchOnProperties = patchOnProperties;
  api.patchMethod = patchMethod;
  api.bindArguments = bindArguments;
  api.patchMacroTask = patchMacroTask;
  const SYMBOL_BLACK_LISTED_EVENTS = Zone2.__symbol__("BLACK_LISTED_EVENTS");
  const SYMBOL_UNPATCHED_EVENTS = Zone2.__symbol__("UNPATCHED_EVENTS");
  if (global[SYMBOL_UNPATCHED_EVENTS]) {
    global[SYMBOL_BLACK_LISTED_EVENTS] = global[SYMBOL_UNPATCHED_EVENTS];
  }
  if (global[SYMBOL_BLACK_LISTED_EVENTS]) {
    Zone2[SYMBOL_BLACK_LISTED_EVENTS] = Zone2[SYMBOL_UNPATCHED_EVENTS] = global[SYMBOL_BLACK_LISTED_EVENTS];
  }
  api.patchEventPrototype = patchEventPrototype;
  api.patchEventTarget = patchEventTarget;
  api.isIEOrEdge = isIEOrEdge;
  api.ObjectDefineProperty = ObjectDefineProperty;
  api.ObjectGetOwnPropertyDescriptor = ObjectGetOwnPropertyDescriptor;
  api.ObjectCreate = ObjectCreate;
  api.ArraySlice = ArraySlice;
  api.patchClass = patchClass;
  api.wrapWithCurrentZone = wrapWithCurrentZone;
  api.filterProperties = filterProperties;
  api.attachOriginToPatched = attachOriginToPatched;
  api._redefineProperty = Object.defineProperty;
  api.patchCallbacks = patchCallbacks;
  api.getGlobalObjects = () => ({
    globalSources,
    zoneSymbolEventNames,
    eventNames,
    isBrowser,
    isMix,
    isNode,
    TRUE_STR,
    FALSE_STR,
    ZONE_SYMBOL_PREFIX,
    ADD_EVENT_LISTENER_STR,
    REMOVE_EVENT_LISTENER_STR
  });
});
function patchQueueMicrotask(global, api) {
  api.patchMethod(global, "queueMicrotask", (delegate) => {
    return function(self2, args) {
      Zone.current.scheduleMicroTask("queueMicrotask", args[0]);
    };
  });
}
var taskSymbol = zoneSymbol("zoneTask");
function patchTimer(window2, setName, cancelName, nameSuffix) {
  let setNative = null;
  let clearNative = null;
  setName += nameSuffix;
  cancelName += nameSuffix;
  const tasksByHandleId = {};
  function scheduleTask(task) {
    const data = task.data;
    data.args[0] = function() {
      return task.invoke.apply(this, arguments);
    };
    data.handleId = setNative.apply(window2, data.args);
    return task;
  }
  function clearTask(task) {
    return clearNative.call(window2, task.data.handleId);
  }
  setNative = patchMethod(window2, setName, (delegate) => function(self2, args) {
    if (typeof args[0] === "function") {
      const options = {
        isPeriodic: nameSuffix === "Interval",
        delay: nameSuffix === "Timeout" || nameSuffix === "Interval" ? args[1] || 0 : void 0,
        args
      };
      const callback = args[0];
      args[0] = function timer() {
        try {
          return callback.apply(this, arguments);
        } finally {
          if (!options.isPeriodic) {
            if (typeof options.handleId === "number") {
              delete tasksByHandleId[options.handleId];
            } else if (options.handleId) {
              options.handleId[taskSymbol] = null;
            }
          }
        }
      };
      const task = scheduleMacroTaskWithCurrentZone(setName, args[0], options, scheduleTask, clearTask);
      if (!task) {
        return task;
      }
      const handle = task.data.handleId;
      if (typeof handle === "number") {
        tasksByHandleId[handle] = task;
      } else if (handle) {
        handle[taskSymbol] = task;
      }
      if (handle && handle.ref && handle.unref && typeof handle.ref === "function" && typeof handle.unref === "function") {
        task.ref = handle.ref.bind(handle);
        task.unref = handle.unref.bind(handle);
      }
      if (typeof handle === "number" || handle) {
        return handle;
      }
      return task;
    } else {
      return delegate.apply(window2, args);
    }
  });
  clearNative = patchMethod(window2, cancelName, (delegate) => function(self2, args) {
    const id = args[0];
    let task;
    if (typeof id === "number") {
      task = tasksByHandleId[id];
    } else {
      task = id && id[taskSymbol];
      if (!task) {
        task = id;
      }
    }
    if (task && typeof task.type === "string") {
      if (task.state !== "notScheduled" && (task.cancelFn && task.data.isPeriodic || task.runCount === 0)) {
        if (typeof id === "number") {
          delete tasksByHandleId[id];
        } else if (id) {
          id[taskSymbol] = null;
        }
        task.zone.cancelTask(task);
      }
    } else {
      delegate.apply(window2, args);
    }
  });
}
function patchCustomElements(_global2, api) {
  const { isBrowser: isBrowser2, isMix: isMix2 } = api.getGlobalObjects();
  if (!isBrowser2 && !isMix2 || !_global2["customElements"] || !("customElements" in _global2)) {
    return;
  }
  const callbacks = [
    "connectedCallback",
    "disconnectedCallback",
    "adoptedCallback",
    "attributeChangedCallback",
    "formAssociatedCallback",
    "formDisabledCallback",
    "formResetCallback",
    "formStateRestoreCallback"
  ];
  api.patchCallbacks(api, _global2.customElements, "customElements", "define", callbacks);
}
function eventTargetPatch(_global2, api) {
  if (Zone[api.symbol("patchEventTarget")]) {
    return;
  }
  const { eventNames, zoneSymbolEventNames: zoneSymbolEventNames2, TRUE_STR: TRUE_STR2, FALSE_STR: FALSE_STR2, ZONE_SYMBOL_PREFIX: ZONE_SYMBOL_PREFIX2 } = api.getGlobalObjects();
  for (let i = 0; i < eventNames.length; i++) {
    const eventName = eventNames[i];
    const falseEventName = eventName + FALSE_STR2;
    const trueEventName = eventName + TRUE_STR2;
    const symbol = ZONE_SYMBOL_PREFIX2 + falseEventName;
    const symbolCapture = ZONE_SYMBOL_PREFIX2 + trueEventName;
    zoneSymbolEventNames2[eventName] = {};
    zoneSymbolEventNames2[eventName][FALSE_STR2] = symbol;
    zoneSymbolEventNames2[eventName][TRUE_STR2] = symbolCapture;
  }
  const EVENT_TARGET = _global2["EventTarget"];
  if (!EVENT_TARGET || !EVENT_TARGET.prototype) {
    return;
  }
  api.patchEventTarget(_global2, api, [EVENT_TARGET && EVENT_TARGET.prototype]);
  return true;
}
function patchEvent(global, api) {
  api.patchEventPrototype(global, api);
}
Zone.__load_patch("legacy", (global) => {
  const legacyPatch = global[Zone.__symbol__("legacyPatch")];
  if (legacyPatch) {
    legacyPatch();
  }
});
Zone.__load_patch("timers", (global) => {
  const set = "set";
  const clear = "clear";
  patchTimer(global, set, clear, "Timeout");
  patchTimer(global, set, clear, "Interval");
  patchTimer(global, set, clear, "Immediate");
});
Zone.__load_patch("requestAnimationFrame", (global) => {
  patchTimer(global, "request", "cancel", "AnimationFrame");
  patchTimer(global, "mozRequest", "mozCancel", "AnimationFrame");
  patchTimer(global, "webkitRequest", "webkitCancel", "AnimationFrame");
});
Zone.__load_patch("blocking", (global, Zone2) => {
  const blockingMethods = ["alert", "prompt", "confirm"];
  for (let i = 0; i < blockingMethods.length; i++) {
    const name = blockingMethods[i];
    patchMethod(global, name, (delegate, symbol, name2) => {
      return function(s, args) {
        return Zone2.current.run(delegate, global, args, name2);
      };
    });
  }
});
Zone.__load_patch("EventTarget", (global, Zone2, api) => {
  patchEvent(global, api);
  eventTargetPatch(global, api);
  const XMLHttpRequestEventTarget = global["XMLHttpRequestEventTarget"];
  if (XMLHttpRequestEventTarget && XMLHttpRequestEventTarget.prototype) {
    api.patchEventTarget(global, api, [XMLHttpRequestEventTarget.prototype]);
  }
});
Zone.__load_patch("MutationObserver", (global, Zone2, api) => {
  patchClass("MutationObserver");
  patchClass("WebKitMutationObserver");
});
Zone.__load_patch("IntersectionObserver", (global, Zone2, api) => {
  patchClass("IntersectionObserver");
});
Zone.__load_patch("FileReader", (global, Zone2, api) => {
  patchClass("FileReader");
});
Zone.__load_patch("on_property", (global, Zone2, api) => {
  propertyDescriptorPatch(api, global);
});
Zone.__load_patch("customElements", (global, Zone2, api) => {
  patchCustomElements(global, api);
});
Zone.__load_patch("XHR", (global, Zone2) => {
  patchXHR(global);
  const XHR_TASK = zoneSymbol("xhrTask");
  const XHR_SYNC = zoneSymbol("xhrSync");
  const XHR_LISTENER = zoneSymbol("xhrListener");
  const XHR_SCHEDULED = zoneSymbol("xhrScheduled");
  const XHR_URL = zoneSymbol("xhrURL");
  const XHR_ERROR_BEFORE_SCHEDULED = zoneSymbol("xhrErrorBeforeScheduled");
  function patchXHR(window2) {
    const XMLHttpRequest = window2["XMLHttpRequest"];
    if (!XMLHttpRequest) {
      return;
    }
    const XMLHttpRequestPrototype = XMLHttpRequest.prototype;
    function findPendingTask(target) {
      return target[XHR_TASK];
    }
    let oriAddListener = XMLHttpRequestPrototype[ZONE_SYMBOL_ADD_EVENT_LISTENER];
    let oriRemoveListener = XMLHttpRequestPrototype[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
    if (!oriAddListener) {
      const XMLHttpRequestEventTarget = window2["XMLHttpRequestEventTarget"];
      if (XMLHttpRequestEventTarget) {
        const XMLHttpRequestEventTargetPrototype = XMLHttpRequestEventTarget.prototype;
        oriAddListener = XMLHttpRequestEventTargetPrototype[ZONE_SYMBOL_ADD_EVENT_LISTENER];
        oriRemoveListener = XMLHttpRequestEventTargetPrototype[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
      }
    }
    const READY_STATE_CHANGE = "readystatechange";
    const SCHEDULED = "scheduled";
    function scheduleTask(task) {
      const data = task.data;
      const target = data.target;
      target[XHR_SCHEDULED] = false;
      target[XHR_ERROR_BEFORE_SCHEDULED] = false;
      const listener = target[XHR_LISTENER];
      if (!oriAddListener) {
        oriAddListener = target[ZONE_SYMBOL_ADD_EVENT_LISTENER];
        oriRemoveListener = target[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
      }
      if (listener) {
        oriRemoveListener.call(target, READY_STATE_CHANGE, listener);
      }
      const newListener = target[XHR_LISTENER] = () => {
        if (target.readyState === target.DONE) {
          if (!data.aborted && target[XHR_SCHEDULED] && task.state === SCHEDULED) {
            const loadTasks = target[Zone2.__symbol__("loadfalse")];
            if (target.status !== 0 && loadTasks && loadTasks.length > 0) {
              const oriInvoke = task.invoke;
              task.invoke = function() {
                const loadTasks2 = target[Zone2.__symbol__("loadfalse")];
                for (let i = 0; i < loadTasks2.length; i++) {
                  if (loadTasks2[i] === task) {
                    loadTasks2.splice(i, 1);
                  }
                }
                if (!data.aborted && task.state === SCHEDULED) {
                  oriInvoke.call(task);
                }
              };
              loadTasks.push(task);
            } else {
              task.invoke();
            }
          } else if (!data.aborted && target[XHR_SCHEDULED] === false) {
            target[XHR_ERROR_BEFORE_SCHEDULED] = true;
          }
        }
      };
      oriAddListener.call(target, READY_STATE_CHANGE, newListener);
      const storedTask = target[XHR_TASK];
      if (!storedTask) {
        target[XHR_TASK] = task;
      }
      sendNative.apply(target, data.args);
      target[XHR_SCHEDULED] = true;
      return task;
    }
    function placeholderCallback() {
    }
    function clearTask(task) {
      const data = task.data;
      data.aborted = true;
      return abortNative.apply(data.target, data.args);
    }
    const openNative = patchMethod(XMLHttpRequestPrototype, "open", () => function(self2, args) {
      self2[XHR_SYNC] = args[2] == false;
      self2[XHR_URL] = args[1];
      return openNative.apply(self2, args);
    });
    const XMLHTTPREQUEST_SOURCE = "XMLHttpRequest.send";
    const fetchTaskAborting = zoneSymbol("fetchTaskAborting");
    const fetchTaskScheduling = zoneSymbol("fetchTaskScheduling");
    const sendNative = patchMethod(XMLHttpRequestPrototype, "send", () => function(self2, args) {
      if (Zone2.current[fetchTaskScheduling] === true) {
        return sendNative.apply(self2, args);
      }
      if (self2[XHR_SYNC]) {
        return sendNative.apply(self2, args);
      } else {
        const options = { target: self2, url: self2[XHR_URL], isPeriodic: false, args, aborted: false };
        const task = scheduleMacroTaskWithCurrentZone(XMLHTTPREQUEST_SOURCE, placeholderCallback, options, scheduleTask, clearTask);
        if (self2 && self2[XHR_ERROR_BEFORE_SCHEDULED] === true && !options.aborted && task.state === SCHEDULED) {
          task.invoke();
        }
      }
    });
    const abortNative = patchMethod(XMLHttpRequestPrototype, "abort", () => function(self2, args) {
      const task = findPendingTask(self2);
      if (task && typeof task.type == "string") {
        if (task.cancelFn == null || task.data && task.data.aborted) {
          return;
        }
        task.zone.cancelTask(task);
      } else if (Zone2.current[fetchTaskAborting] === true) {
        return abortNative.apply(self2, args);
      }
    });
  }
});
Zone.__load_patch("geolocation", (global) => {
  if (global["navigator"] && global["navigator"].geolocation) {
    patchPrototype(global["navigator"].geolocation, ["getCurrentPosition", "watchPosition"]);
  }
});
Zone.__load_patch("PromiseRejectionEvent", (global, Zone2) => {
  function findPromiseRejectionHandler(evtName) {
    return function(e) {
      const eventTasks = findEventTasks(global, evtName);
      eventTasks.forEach((eventTask) => {
        const PromiseRejectionEvent = global["PromiseRejectionEvent"];
        if (PromiseRejectionEvent) {
          const evt = new PromiseRejectionEvent(evtName, { promise: e.promise, reason: e.rejection });
          eventTask.invoke(evt);
        }
      });
    };
  }
  if (global["PromiseRejectionEvent"]) {
    Zone2[zoneSymbol("unhandledPromiseRejectionHandler")] = findPromiseRejectionHandler("unhandledrejection");
    Zone2[zoneSymbol("rejectionHandledHandler")] = findPromiseRejectionHandler("rejectionhandled");
  }
});
Zone.__load_patch("queueMicrotask", (global, Zone2, api) => {
  patchQueueMicrotask(global, api);
});
/*! Bundled license information:

zone.js/fesm2015/zone.js:
  (**
   * @license Angular v<unknown>
   * (c) 2010-2022 Google LLC. https://angular.io/
   * License: MIT
   *)
*/


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy96b25lLmpzL2Zlc20yMDE1L3pvbmUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBAbGljZW5zZSBBbmd1bGFyIHY8dW5rbm93bj5cbiAqIChjKSAyMDEwLTIwMjIgR29vZ2xlIExMQy4gaHR0cHM6Ly9hbmd1bGFyLmlvL1xuICogTGljZW5zZTogTUlUXG4gKi9cbi8vIEluaXRpYWxpemUgZ2xvYmFsIGBab25lYCBjb25zdGFudC5cbihmdW5jdGlvbiAoZ2xvYmFsKSB7XG4gICAgY29uc3QgcGVyZm9ybWFuY2UgPSBnbG9iYWxbJ3BlcmZvcm1hbmNlJ107XG4gICAgZnVuY3Rpb24gbWFyayhuYW1lKSB7XG4gICAgICAgIHBlcmZvcm1hbmNlICYmIHBlcmZvcm1hbmNlWydtYXJrJ10gJiYgcGVyZm9ybWFuY2VbJ21hcmsnXShuYW1lKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcGVyZm9ybWFuY2VNZWFzdXJlKG5hbWUsIGxhYmVsKSB7XG4gICAgICAgIHBlcmZvcm1hbmNlICYmIHBlcmZvcm1hbmNlWydtZWFzdXJlJ10gJiYgcGVyZm9ybWFuY2VbJ21lYXN1cmUnXShuYW1lLCBsYWJlbCk7XG4gICAgfVxuICAgIG1hcmsoJ1pvbmUnKTtcbiAgICAvLyBJbml0aWFsaXplIGJlZm9yZSBpdCdzIGFjY2Vzc2VkIGJlbG93LlxuICAgIC8vIF9fWm9uZV9zeW1ib2xfcHJlZml4IGdsb2JhbCBjYW4gYmUgdXNlZCB0byBvdmVycmlkZSB0aGUgZGVmYXVsdCB6b25lXG4gICAgLy8gc3ltYm9sIHByZWZpeCB3aXRoIGEgY3VzdG9tIG9uZSBpZiBuZWVkZWQuXG4gICAgY29uc3Qgc3ltYm9sUHJlZml4ID0gZ2xvYmFsWydfX1pvbmVfc3ltYm9sX3ByZWZpeCddIHx8ICdfX3pvbmVfc3ltYm9sX18nO1xuICAgIGZ1bmN0aW9uIF9fc3ltYm9sX18obmFtZSkge1xuICAgICAgICByZXR1cm4gc3ltYm9sUHJlZml4ICsgbmFtZTtcbiAgICB9XG4gICAgY29uc3QgY2hlY2tEdXBsaWNhdGUgPSBnbG9iYWxbX19zeW1ib2xfXygnZm9yY2VEdXBsaWNhdGVab25lQ2hlY2snKV0gPT09IHRydWU7XG4gICAgaWYgKGdsb2JhbFsnWm9uZSddKSB7XG4gICAgICAgIC8vIGlmIGdsb2JhbFsnWm9uZSddIGFscmVhZHkgZXhpc3RzIChtYXliZSB6b25lLmpzIHdhcyBhbHJlYWR5IGxvYWRlZCBvclxuICAgICAgICAvLyBzb21lIG90aGVyIGxpYiBhbHNvIHJlZ2lzdGVyZWQgYSBnbG9iYWwgb2JqZWN0IG5hbWVkIFpvbmUpLCB3ZSBtYXkgbmVlZFxuICAgICAgICAvLyB0byB0aHJvdyBhbiBlcnJvciwgYnV0IHNvbWV0aW1lcyB1c2VyIG1heSBub3Qgd2FudCB0aGlzIGVycm9yLlxuICAgICAgICAvLyBGb3IgZXhhbXBsZSxcbiAgICAgICAgLy8gd2UgaGF2ZSB0d28gd2ViIHBhZ2VzLCBwYWdlMSBpbmNsdWRlcyB6b25lLmpzLCBwYWdlMiBkb2Vzbid0LlxuICAgICAgICAvLyBhbmQgdGhlIDFzdCB0aW1lIHVzZXIgbG9hZCBwYWdlMSBhbmQgcGFnZTIsIGV2ZXJ5dGhpbmcgd29yayBmaW5lLFxuICAgICAgICAvLyBidXQgd2hlbiB1c2VyIGxvYWQgcGFnZTIgYWdhaW4sIGVycm9yIG9jY3VycyBiZWNhdXNlIGdsb2JhbFsnWm9uZSddIGFscmVhZHkgZXhpc3RzLlxuICAgICAgICAvLyBzbyB3ZSBhZGQgYSBmbGFnIHRvIGxldCB1c2VyIGNob29zZSB3aGV0aGVyIHRvIHRocm93IHRoaXMgZXJyb3Igb3Igbm90LlxuICAgICAgICAvLyBCeSBkZWZhdWx0LCBpZiBleGlzdGluZyBab25lIGlzIGZyb20gem9uZS5qcywgd2Ugd2lsbCBub3QgdGhyb3cgdGhlIGVycm9yLlxuICAgICAgICBpZiAoY2hlY2tEdXBsaWNhdGUgfHwgdHlwZW9mIGdsb2JhbFsnWm9uZSddLl9fc3ltYm9sX18gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignWm9uZSBhbHJlYWR5IGxvYWRlZC4nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWxbJ1pvbmUnXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjbGFzcyBab25lIHtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnJlcXVpcmUtaW50ZXJuYWwtd2l0aC11bmRlcnNjb3JlXG4gICAgICAgIHN0YXRpYyB7IHRoaXMuX19zeW1ib2xfXyA9IF9fc3ltYm9sX187IH1cbiAgICAgICAgc3RhdGljIGFzc2VydFpvbmVQYXRjaGVkKCkge1xuICAgICAgICAgICAgaWYgKGdsb2JhbFsnUHJvbWlzZSddICE9PSBwYXRjaGVzWydab25lQXdhcmVQcm9taXNlJ10pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1pvbmUuanMgaGFzIGRldGVjdGVkIHRoYXQgWm9uZUF3YXJlUHJvbWlzZSBgKHdpbmRvd3xnbG9iYWwpLlByb21pc2VgICcgK1xuICAgICAgICAgICAgICAgICAgICAnaGFzIGJlZW4gb3ZlcndyaXR0ZW4uXFxuJyArXG4gICAgICAgICAgICAgICAgICAgICdNb3N0IGxpa2VseSBjYXVzZSBpcyB0aGF0IGEgUHJvbWlzZSBwb2x5ZmlsbCBoYXMgYmVlbiBsb2FkZWQgJyArXG4gICAgICAgICAgICAgICAgICAgICdhZnRlciBab25lLmpzIChQb2x5ZmlsbGluZyBQcm9taXNlIGFwaSBpcyBub3QgbmVjZXNzYXJ5IHdoZW4gem9uZS5qcyBpcyBsb2FkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnSWYgeW91IG11c3QgbG9hZCBvbmUsIGRvIHNvIGJlZm9yZSBsb2FkaW5nIHpvbmUuanMuKScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN0YXRpYyBnZXQgcm9vdCgpIHtcbiAgICAgICAgICAgIGxldCB6b25lID0gWm9uZS5jdXJyZW50O1xuICAgICAgICAgICAgd2hpbGUgKHpvbmUucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgem9uZSA9IHpvbmUucGFyZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHpvbmU7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGljIGdldCBjdXJyZW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIF9jdXJyZW50Wm9uZUZyYW1lLnpvbmU7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGljIGdldCBjdXJyZW50VGFzaygpIHtcbiAgICAgICAgICAgIHJldHVybiBfY3VycmVudFRhc2s7XG4gICAgICAgIH1cbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnJlcXVpcmUtaW50ZXJuYWwtd2l0aC11bmRlcnNjb3JlXG4gICAgICAgIHN0YXRpYyBfX2xvYWRfcGF0Y2gobmFtZSwgZm4sIGlnbm9yZUR1cGxpY2F0ZSA9IGZhbHNlKSB7XG4gICAgICAgICAgICBpZiAocGF0Y2hlcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgICAgICAgICAgIC8vIGBjaGVja0R1cGxpY2F0ZWAgb3B0aW9uIGlzIGRlZmluZWQgZnJvbSBnbG9iYWwgdmFyaWFibGVcbiAgICAgICAgICAgICAgICAvLyBzbyBpdCB3b3JrcyBmb3IgYWxsIG1vZHVsZXMuXG4gICAgICAgICAgICAgICAgLy8gYGlnbm9yZUR1cGxpY2F0ZWAgY2FuIHdvcmsgZm9yIHRoZSBzcGVjaWZpZWQgbW9kdWxlXG4gICAgICAgICAgICAgICAgaWYgKCFpZ25vcmVEdXBsaWNhdGUgJiYgY2hlY2tEdXBsaWNhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ0FscmVhZHkgbG9hZGVkIHBhdGNoOiAnICsgbmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoIWdsb2JhbFsnX19ab25lX2Rpc2FibGVfJyArIG5hbWVdKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGVyZk5hbWUgPSAnWm9uZTonICsgbmFtZTtcbiAgICAgICAgICAgICAgICBtYXJrKHBlcmZOYW1lKTtcbiAgICAgICAgICAgICAgICBwYXRjaGVzW25hbWVdID0gZm4oZ2xvYmFsLCBab25lLCBfYXBpKTtcbiAgICAgICAgICAgICAgICBwZXJmb3JtYW5jZU1lYXN1cmUocGVyZk5hbWUsIHBlcmZOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBnZXQgcGFyZW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0cnVjdG9yKHBhcmVudCwgem9uZVNwZWMpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgICAgICAgICAgIHRoaXMuX25hbWUgPSB6b25lU3BlYyA/IHpvbmVTcGVjLm5hbWUgfHwgJ3VubmFtZWQnIDogJzxyb290Pic7XG4gICAgICAgICAgICB0aGlzLl9wcm9wZXJ0aWVzID0gem9uZVNwZWMgJiYgem9uZVNwZWMucHJvcGVydGllcyB8fCB7fTtcbiAgICAgICAgICAgIHRoaXMuX3pvbmVEZWxlZ2F0ZSA9XG4gICAgICAgICAgICAgICAgbmV3IF9ab25lRGVsZWdhdGUodGhpcywgdGhpcy5fcGFyZW50ICYmIHRoaXMuX3BhcmVudC5fem9uZURlbGVnYXRlLCB6b25lU3BlYyk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0KGtleSkge1xuICAgICAgICAgICAgY29uc3Qgem9uZSA9IHRoaXMuZ2V0Wm9uZVdpdGgoa2V5KTtcbiAgICAgICAgICAgIGlmICh6b25lKVxuICAgICAgICAgICAgICAgIHJldHVybiB6b25lLl9wcm9wZXJ0aWVzW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgZ2V0Wm9uZVdpdGgoa2V5KSB7XG4gICAgICAgICAgICBsZXQgY3VycmVudCA9IHRoaXM7XG4gICAgICAgICAgICB3aGlsZSAoY3VycmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50Ll9wcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50Ll9wYXJlbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBmb3JrKHpvbmVTcGVjKSB7XG4gICAgICAgICAgICBpZiAoIXpvbmVTcGVjKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignWm9uZVNwZWMgcmVxdWlyZWQhJyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fem9uZURlbGVnYXRlLmZvcmsodGhpcywgem9uZVNwZWMpO1xuICAgICAgICB9XG4gICAgICAgIHdyYXAoY2FsbGJhY2ssIHNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0aW5nIGZ1bmN0aW9uIGdvdDogJyArIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IF9jYWxsYmFjayA9IHRoaXMuX3pvbmVEZWxlZ2F0ZS5pbnRlcmNlcHQodGhpcywgY2FsbGJhY2ssIHNvdXJjZSk7XG4gICAgICAgICAgICBjb25zdCB6b25lID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHpvbmUucnVuR3VhcmRlZChfY2FsbGJhY2ssIHRoaXMsIGFyZ3VtZW50cywgc291cmNlKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcnVuKGNhbGxiYWNrLCBhcHBseVRoaXMsIGFwcGx5QXJncywgc291cmNlKSB7XG4gICAgICAgICAgICBfY3VycmVudFpvbmVGcmFtZSA9IHsgcGFyZW50OiBfY3VycmVudFpvbmVGcmFtZSwgem9uZTogdGhpcyB9O1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fem9uZURlbGVnYXRlLmludm9rZSh0aGlzLCBjYWxsYmFjaywgYXBwbHlUaGlzLCBhcHBseUFyZ3MsIHNvdXJjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICBfY3VycmVudFpvbmVGcmFtZSA9IF9jdXJyZW50Wm9uZUZyYW1lLnBhcmVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBydW5HdWFyZGVkKGNhbGxiYWNrLCBhcHBseVRoaXMgPSBudWxsLCBhcHBseUFyZ3MsIHNvdXJjZSkge1xuICAgICAgICAgICAgX2N1cnJlbnRab25lRnJhbWUgPSB7IHBhcmVudDogX2N1cnJlbnRab25lRnJhbWUsIHpvbmU6IHRoaXMgfTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3pvbmVEZWxlZ2F0ZS5pbnZva2UodGhpcywgY2FsbGJhY2ssIGFwcGx5VGhpcywgYXBwbHlBcmdzLCBzb3VyY2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3pvbmVEZWxlZ2F0ZS5oYW5kbGVFcnJvcih0aGlzLCBlcnJvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICAgICAgX2N1cnJlbnRab25lRnJhbWUgPSBfY3VycmVudFpvbmVGcmFtZS5wYXJlbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcnVuVGFzayh0YXNrLCBhcHBseVRoaXMsIGFwcGx5QXJncykge1xuICAgICAgICAgICAgaWYgKHRhc2suem9uZSAhPSB0aGlzKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBIHRhc2sgY2FuIG9ubHkgYmUgcnVuIGluIHRoZSB6b25lIG9mIGNyZWF0aW9uISAoQ3JlYXRpb246ICcgK1xuICAgICAgICAgICAgICAgICAgICAodGFzay56b25lIHx8IE5PX1pPTkUpLm5hbWUgKyAnOyBFeGVjdXRpb246ICcgKyB0aGlzLm5hbWUgKyAnKScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvem9uZS5qcy9pc3N1ZXMvNzc4LCBzb21ldGltZXMgZXZlbnRUYXNrXG4gICAgICAgICAgICAvLyB3aWxsIHJ1biBpbiBub3RTY2hlZHVsZWQoY2FuY2VsZWQpIHN0YXRlLCB3ZSBzaG91bGQgbm90IHRyeSB0b1xuICAgICAgICAgICAgLy8gcnVuIHN1Y2gga2luZCBvZiB0YXNrIGJ1dCBqdXN0IHJldHVyblxuICAgICAgICAgICAgaWYgKHRhc2suc3RhdGUgPT09IG5vdFNjaGVkdWxlZCAmJiAodGFzay50eXBlID09PSBldmVudFRhc2sgfHwgdGFzay50eXBlID09PSBtYWNyb1Rhc2spKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcmVFbnRyeUd1YXJkID0gdGFzay5zdGF0ZSAhPSBydW5uaW5nO1xuICAgICAgICAgICAgcmVFbnRyeUd1YXJkICYmIHRhc2suX3RyYW5zaXRpb25UbyhydW5uaW5nLCBzY2hlZHVsZWQpO1xuICAgICAgICAgICAgdGFzay5ydW5Db3VudCsrO1xuICAgICAgICAgICAgY29uc3QgcHJldmlvdXNUYXNrID0gX2N1cnJlbnRUYXNrO1xuICAgICAgICAgICAgX2N1cnJlbnRUYXNrID0gdGFzaztcbiAgICAgICAgICAgIF9jdXJyZW50Wm9uZUZyYW1lID0geyBwYXJlbnQ6IF9jdXJyZW50Wm9uZUZyYW1lLCB6b25lOiB0aGlzIH07XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmICh0YXNrLnR5cGUgPT0gbWFjcm9UYXNrICYmIHRhc2suZGF0YSAmJiAhdGFzay5kYXRhLmlzUGVyaW9kaWMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFzay5jYW5jZWxGbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3pvbmVEZWxlZ2F0ZS5pbnZva2VUYXNrKHRoaXMsIHRhc2ssIGFwcGx5VGhpcywgYXBwbHlBcmdzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl96b25lRGVsZWdhdGUuaGFuZGxlRXJyb3IodGhpcywgZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSB0YXNrJ3Mgc3RhdGUgaXMgbm90U2NoZWR1bGVkIG9yIHVua25vd24sIHRoZW4gaXQgaGFzIGFscmVhZHkgYmVlbiBjYW5jZWxsZWRcbiAgICAgICAgICAgICAgICAvLyB3ZSBzaG91bGQgbm90IHJlc2V0IHRoZSBzdGF0ZSB0byBzY2hlZHVsZWRcbiAgICAgICAgICAgICAgICBpZiAodGFzay5zdGF0ZSAhPT0gbm90U2NoZWR1bGVkICYmIHRhc2suc3RhdGUgIT09IHVua25vd24pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhc2sudHlwZSA9PSBldmVudFRhc2sgfHwgKHRhc2suZGF0YSAmJiB0YXNrLmRhdGEuaXNQZXJpb2RpYykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlRW50cnlHdWFyZCAmJiB0YXNrLl90cmFuc2l0aW9uVG8oc2NoZWR1bGVkLCBydW5uaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhc2sucnVuQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlVGFza0NvdW50KHRhc2ssIC0xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlRW50cnlHdWFyZCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2suX3RyYW5zaXRpb25Ubyhub3RTY2hlZHVsZWQsIHJ1bm5pbmcsIG5vdFNjaGVkdWxlZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX2N1cnJlbnRab25lRnJhbWUgPSBfY3VycmVudFpvbmVGcmFtZS5wYXJlbnQ7XG4gICAgICAgICAgICAgICAgX2N1cnJlbnRUYXNrID0gcHJldmlvdXNUYXNrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNjaGVkdWxlVGFzayh0YXNrKSB7XG4gICAgICAgICAgICBpZiAodGFzay56b25lICYmIHRhc2suem9uZSAhPT0gdGhpcykge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIHRoZSB0YXNrIHdhcyByZXNjaGVkdWxlZCwgdGhlIG5ld1pvbmVcbiAgICAgICAgICAgICAgICAvLyBzaG91bGQgbm90IGJlIHRoZSBjaGlsZHJlbiBvZiB0aGUgb3JpZ2luYWwgem9uZVxuICAgICAgICAgICAgICAgIGxldCBuZXdab25lID0gdGhpcztcbiAgICAgICAgICAgICAgICB3aGlsZSAobmV3Wm9uZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV3Wm9uZSA9PT0gdGFzay56b25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihgY2FuIG5vdCByZXNjaGVkdWxlIHRhc2sgdG8gJHt0aGlzLm5hbWV9IHdoaWNoIGlzIGRlc2NlbmRhbnRzIG9mIHRoZSBvcmlnaW5hbCB6b25lICR7dGFzay56b25lLm5hbWV9YCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV3Wm9uZSA9IG5ld1pvbmUucGFyZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRhc2suX3RyYW5zaXRpb25UbyhzY2hlZHVsaW5nLCBub3RTY2hlZHVsZWQpO1xuICAgICAgICAgICAgY29uc3Qgem9uZURlbGVnYXRlcyA9IFtdO1xuICAgICAgICAgICAgdGFzay5fem9uZURlbGVnYXRlcyA9IHpvbmVEZWxlZ2F0ZXM7XG4gICAgICAgICAgICB0YXNrLl96b25lID0gdGhpcztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdGFzayA9IHRoaXMuX3pvbmVEZWxlZ2F0ZS5zY2hlZHVsZVRhc2sodGhpcywgdGFzayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgLy8gc2hvdWxkIHNldCB0YXNrJ3Mgc3RhdGUgdG8gdW5rbm93biB3aGVuIHNjaGVkdWxlVGFzayB0aHJvdyBlcnJvclxuICAgICAgICAgICAgICAgIC8vIGJlY2F1c2UgdGhlIGVyciBtYXkgZnJvbSByZXNjaGVkdWxlLCBzbyB0aGUgZnJvbVN0YXRlIG1heWJlIG5vdFNjaGVkdWxlZFxuICAgICAgICAgICAgICAgIHRhc2suX3RyYW5zaXRpb25Ubyh1bmtub3duLCBzY2hlZHVsaW5nLCBub3RTY2hlZHVsZWQpO1xuICAgICAgICAgICAgICAgIC8vIFRPRE86IEBKaWFMaVBhc3Npb24sIHNob3VsZCB3ZSBjaGVjayB0aGUgcmVzdWx0IGZyb20gaGFuZGxlRXJyb3I/XG4gICAgICAgICAgICAgICAgdGhpcy5fem9uZURlbGVnYXRlLmhhbmRsZUVycm9yKHRoaXMsIGVycik7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRhc2suX3pvbmVEZWxlZ2F0ZXMgPT09IHpvbmVEZWxlZ2F0ZXMpIHtcbiAgICAgICAgICAgICAgICAvLyB3ZSBoYXZlIHRvIGNoZWNrIGJlY2F1c2UgaW50ZXJuYWxseSB0aGUgZGVsZWdhdGUgY2FuIHJlc2NoZWR1bGUgdGhlIHRhc2suXG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlVGFza0NvdW50KHRhc2ssIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRhc2suc3RhdGUgPT0gc2NoZWR1bGluZykge1xuICAgICAgICAgICAgICAgIHRhc2suX3RyYW5zaXRpb25UbyhzY2hlZHVsZWQsIHNjaGVkdWxpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRhc2s7XG4gICAgICAgIH1cbiAgICAgICAgc2NoZWR1bGVNaWNyb1Rhc2soc291cmNlLCBjYWxsYmFjaywgZGF0YSwgY3VzdG9tU2NoZWR1bGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNjaGVkdWxlVGFzayhuZXcgWm9uZVRhc2sobWljcm9UYXNrLCBzb3VyY2UsIGNhbGxiYWNrLCBkYXRhLCBjdXN0b21TY2hlZHVsZSwgdW5kZWZpbmVkKSk7XG4gICAgICAgIH1cbiAgICAgICAgc2NoZWR1bGVNYWNyb1Rhc2soc291cmNlLCBjYWxsYmFjaywgZGF0YSwgY3VzdG9tU2NoZWR1bGUsIGN1c3RvbUNhbmNlbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NoZWR1bGVUYXNrKG5ldyBab25lVGFzayhtYWNyb1Rhc2ssIHNvdXJjZSwgY2FsbGJhY2ssIGRhdGEsIGN1c3RvbVNjaGVkdWxlLCBjdXN0b21DYW5jZWwpKTtcbiAgICAgICAgfVxuICAgICAgICBzY2hlZHVsZUV2ZW50VGFzayhzb3VyY2UsIGNhbGxiYWNrLCBkYXRhLCBjdXN0b21TY2hlZHVsZSwgY3VzdG9tQ2FuY2VsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zY2hlZHVsZVRhc2sobmV3IFpvbmVUYXNrKGV2ZW50VGFzaywgc291cmNlLCBjYWxsYmFjaywgZGF0YSwgY3VzdG9tU2NoZWR1bGUsIGN1c3RvbUNhbmNlbCkpO1xuICAgICAgICB9XG4gICAgICAgIGNhbmNlbFRhc2sodGFzaykge1xuICAgICAgICAgICAgaWYgKHRhc2suem9uZSAhPSB0aGlzKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQSB0YXNrIGNhbiBvbmx5IGJlIGNhbmNlbGxlZCBpbiB0aGUgem9uZSBvZiBjcmVhdGlvbiEgKENyZWF0aW9uOiAnICtcbiAgICAgICAgICAgICAgICAgICAgKHRhc2suem9uZSB8fCBOT19aT05FKS5uYW1lICsgJzsgRXhlY3V0aW9uOiAnICsgdGhpcy5uYW1lICsgJyknKTtcbiAgICAgICAgICAgIGlmICh0YXNrLnN0YXRlICE9PSBzY2hlZHVsZWQgJiYgdGFzay5zdGF0ZSAhPT0gcnVubmluZykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRhc2suX3RyYW5zaXRpb25UbyhjYW5jZWxpbmcsIHNjaGVkdWxlZCwgcnVubmluZyk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3pvbmVEZWxlZ2F0ZS5jYW5jZWxUYXNrKHRoaXMsIHRhc2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIC8vIGlmIGVycm9yIG9jY3VycyB3aGVuIGNhbmNlbFRhc2ssIHRyYW5zaXQgdGhlIHN0YXRlIHRvIHVua25vd25cbiAgICAgICAgICAgICAgICB0YXNrLl90cmFuc2l0aW9uVG8odW5rbm93biwgY2FuY2VsaW5nKTtcbiAgICAgICAgICAgICAgICB0aGlzLl96b25lRGVsZWdhdGUuaGFuZGxlRXJyb3IodGhpcywgZXJyKTtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVUYXNrQ291bnQodGFzaywgLTEpO1xuICAgICAgICAgICAgdGFzay5fdHJhbnNpdGlvblRvKG5vdFNjaGVkdWxlZCwgY2FuY2VsaW5nKTtcbiAgICAgICAgICAgIHRhc2sucnVuQ291bnQgPSAwO1xuICAgICAgICAgICAgcmV0dXJuIHRhc2s7XG4gICAgICAgIH1cbiAgICAgICAgX3VwZGF0ZVRhc2tDb3VudCh0YXNrLCBjb3VudCkge1xuICAgICAgICAgICAgY29uc3Qgem9uZURlbGVnYXRlcyA9IHRhc2suX3pvbmVEZWxlZ2F0ZXM7XG4gICAgICAgICAgICBpZiAoY291bnQgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICB0YXNrLl96b25lRGVsZWdhdGVzID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgem9uZURlbGVnYXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHpvbmVEZWxlZ2F0ZXNbaV0uX3VwZGF0ZVRhc2tDb3VudCh0YXNrLnR5cGUsIGNvdW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBERUxFR0FURV9aUyA9IHtcbiAgICAgICAgbmFtZTogJycsXG4gICAgICAgIG9uSGFzVGFzazogKGRlbGVnYXRlLCBfLCB0YXJnZXQsIGhhc1Rhc2tTdGF0ZSkgPT4gZGVsZWdhdGUuaGFzVGFzayh0YXJnZXQsIGhhc1Rhc2tTdGF0ZSksXG4gICAgICAgIG9uU2NoZWR1bGVUYXNrOiAoZGVsZWdhdGUsIF8sIHRhcmdldCwgdGFzaykgPT4gZGVsZWdhdGUuc2NoZWR1bGVUYXNrKHRhcmdldCwgdGFzayksXG4gICAgICAgIG9uSW52b2tlVGFzazogKGRlbGVnYXRlLCBfLCB0YXJnZXQsIHRhc2ssIGFwcGx5VGhpcywgYXBwbHlBcmdzKSA9PiBkZWxlZ2F0ZS5pbnZva2VUYXNrKHRhcmdldCwgdGFzaywgYXBwbHlUaGlzLCBhcHBseUFyZ3MpLFxuICAgICAgICBvbkNhbmNlbFRhc2s6IChkZWxlZ2F0ZSwgXywgdGFyZ2V0LCB0YXNrKSA9PiBkZWxlZ2F0ZS5jYW5jZWxUYXNrKHRhcmdldCwgdGFzaylcbiAgICB9O1xuICAgIGNsYXNzIF9ab25lRGVsZWdhdGUge1xuICAgICAgICBjb25zdHJ1Y3Rvcih6b25lLCBwYXJlbnREZWxlZ2F0ZSwgem9uZVNwZWMpIHtcbiAgICAgICAgICAgIHRoaXMuX3Rhc2tDb3VudHMgPSB7ICdtaWNyb1Rhc2snOiAwLCAnbWFjcm9UYXNrJzogMCwgJ2V2ZW50VGFzayc6IDAgfTtcbiAgICAgICAgICAgIHRoaXMuem9uZSA9IHpvbmU7XG4gICAgICAgICAgICB0aGlzLl9wYXJlbnREZWxlZ2F0ZSA9IHBhcmVudERlbGVnYXRlO1xuICAgICAgICAgICAgdGhpcy5fZm9ya1pTID0gem9uZVNwZWMgJiYgKHpvbmVTcGVjICYmIHpvbmVTcGVjLm9uRm9yayA/IHpvbmVTcGVjIDogcGFyZW50RGVsZWdhdGUuX2ZvcmtaUyk7XG4gICAgICAgICAgICB0aGlzLl9mb3JrRGxndCA9IHpvbmVTcGVjICYmICh6b25lU3BlYy5vbkZvcmsgPyBwYXJlbnREZWxlZ2F0ZSA6IHBhcmVudERlbGVnYXRlLl9mb3JrRGxndCk7XG4gICAgICAgICAgICB0aGlzLl9mb3JrQ3VyclpvbmUgPSB6b25lU3BlYyAmJiAoem9uZVNwZWMub25Gb3JrID8gdGhpcy56b25lIDogcGFyZW50RGVsZWdhdGUuX2ZvcmtDdXJyWm9uZSk7XG4gICAgICAgICAgICB0aGlzLl9pbnRlcmNlcHRaUyA9XG4gICAgICAgICAgICAgICAgem9uZVNwZWMgJiYgKHpvbmVTcGVjLm9uSW50ZXJjZXB0ID8gem9uZVNwZWMgOiBwYXJlbnREZWxlZ2F0ZS5faW50ZXJjZXB0WlMpO1xuICAgICAgICAgICAgdGhpcy5faW50ZXJjZXB0RGxndCA9XG4gICAgICAgICAgICAgICAgem9uZVNwZWMgJiYgKHpvbmVTcGVjLm9uSW50ZXJjZXB0ID8gcGFyZW50RGVsZWdhdGUgOiBwYXJlbnREZWxlZ2F0ZS5faW50ZXJjZXB0RGxndCk7XG4gICAgICAgICAgICB0aGlzLl9pbnRlcmNlcHRDdXJyWm9uZSA9XG4gICAgICAgICAgICAgICAgem9uZVNwZWMgJiYgKHpvbmVTcGVjLm9uSW50ZXJjZXB0ID8gdGhpcy56b25lIDogcGFyZW50RGVsZWdhdGUuX2ludGVyY2VwdEN1cnJab25lKTtcbiAgICAgICAgICAgIHRoaXMuX2ludm9rZVpTID0gem9uZVNwZWMgJiYgKHpvbmVTcGVjLm9uSW52b2tlID8gem9uZVNwZWMgOiBwYXJlbnREZWxlZ2F0ZS5faW52b2tlWlMpO1xuICAgICAgICAgICAgdGhpcy5faW52b2tlRGxndCA9XG4gICAgICAgICAgICAgICAgem9uZVNwZWMgJiYgKHpvbmVTcGVjLm9uSW52b2tlID8gcGFyZW50RGVsZWdhdGUgOiBwYXJlbnREZWxlZ2F0ZS5faW52b2tlRGxndCk7XG4gICAgICAgICAgICB0aGlzLl9pbnZva2VDdXJyWm9uZSA9XG4gICAgICAgICAgICAgICAgem9uZVNwZWMgJiYgKHpvbmVTcGVjLm9uSW52b2tlID8gdGhpcy56b25lIDogcGFyZW50RGVsZWdhdGUuX2ludm9rZUN1cnJab25lKTtcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVycm9yWlMgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vbkhhbmRsZUVycm9yID8gem9uZVNwZWMgOiBwYXJlbnREZWxlZ2F0ZS5faGFuZGxlRXJyb3JaUyk7XG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvckRsZ3QgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vbkhhbmRsZUVycm9yID8gcGFyZW50RGVsZWdhdGUgOiBwYXJlbnREZWxlZ2F0ZS5faGFuZGxlRXJyb3JEbGd0KTtcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVycm9yQ3VyclpvbmUgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vbkhhbmRsZUVycm9yID8gdGhpcy56b25lIDogcGFyZW50RGVsZWdhdGUuX2hhbmRsZUVycm9yQ3VyclpvbmUpO1xuICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVUYXNrWlMgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vblNjaGVkdWxlVGFzayA/IHpvbmVTcGVjIDogcGFyZW50RGVsZWdhdGUuX3NjaGVkdWxlVGFza1pTKTtcbiAgICAgICAgICAgIHRoaXMuX3NjaGVkdWxlVGFza0RsZ3QgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vblNjaGVkdWxlVGFzayA/IHBhcmVudERlbGVnYXRlIDogcGFyZW50RGVsZWdhdGUuX3NjaGVkdWxlVGFza0RsZ3QpO1xuICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVUYXNrQ3VyclpvbmUgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vblNjaGVkdWxlVGFzayA/IHRoaXMuem9uZSA6IHBhcmVudERlbGVnYXRlLl9zY2hlZHVsZVRhc2tDdXJyWm9uZSk7XG4gICAgICAgICAgICB0aGlzLl9pbnZva2VUYXNrWlMgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vbkludm9rZVRhc2sgPyB6b25lU3BlYyA6IHBhcmVudERlbGVnYXRlLl9pbnZva2VUYXNrWlMpO1xuICAgICAgICAgICAgdGhpcy5faW52b2tlVGFza0RsZ3QgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vbkludm9rZVRhc2sgPyBwYXJlbnREZWxlZ2F0ZSA6IHBhcmVudERlbGVnYXRlLl9pbnZva2VUYXNrRGxndCk7XG4gICAgICAgICAgICB0aGlzLl9pbnZva2VUYXNrQ3VyclpvbmUgPVxuICAgICAgICAgICAgICAgIHpvbmVTcGVjICYmICh6b25lU3BlYy5vbkludm9rZVRhc2sgPyB0aGlzLnpvbmUgOiBwYXJlbnREZWxlZ2F0ZS5faW52b2tlVGFza0N1cnJab25lKTtcbiAgICAgICAgICAgIHRoaXMuX2NhbmNlbFRhc2taUyA9XG4gICAgICAgICAgICAgICAgem9uZVNwZWMgJiYgKHpvbmVTcGVjLm9uQ2FuY2VsVGFzayA/IHpvbmVTcGVjIDogcGFyZW50RGVsZWdhdGUuX2NhbmNlbFRhc2taUyk7XG4gICAgICAgICAgICB0aGlzLl9jYW5jZWxUYXNrRGxndCA9XG4gICAgICAgICAgICAgICAgem9uZVNwZWMgJiYgKHpvbmVTcGVjLm9uQ2FuY2VsVGFzayA/IHBhcmVudERlbGVnYXRlIDogcGFyZW50RGVsZWdhdGUuX2NhbmNlbFRhc2tEbGd0KTtcbiAgICAgICAgICAgIHRoaXMuX2NhbmNlbFRhc2tDdXJyWm9uZSA9XG4gICAgICAgICAgICAgICAgem9uZVNwZWMgJiYgKHpvbmVTcGVjLm9uQ2FuY2VsVGFzayA/IHRoaXMuem9uZSA6IHBhcmVudERlbGVnYXRlLl9jYW5jZWxUYXNrQ3VyclpvbmUpO1xuICAgICAgICAgICAgdGhpcy5faGFzVGFza1pTID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX2hhc1Rhc2tEbGd0ID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX2hhc1Rhc2tEbGd0T3duZXIgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5faGFzVGFza0N1cnJab25lID0gbnVsbDtcbiAgICAgICAgICAgIGNvbnN0IHpvbmVTcGVjSGFzVGFzayA9IHpvbmVTcGVjICYmIHpvbmVTcGVjLm9uSGFzVGFzaztcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudEhhc1Rhc2sgPSBwYXJlbnREZWxlZ2F0ZSAmJiBwYXJlbnREZWxlZ2F0ZS5faGFzVGFza1pTO1xuICAgICAgICAgICAgaWYgKHpvbmVTcGVjSGFzVGFzayB8fCBwYXJlbnRIYXNUYXNrKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgd2UgbmVlZCB0byByZXBvcnQgaGFzVGFzaywgdGhhbiB0aGlzIFpTIG5lZWRzIHRvIGRvIHJlZiBjb3VudGluZyBvbiB0YXNrcy4gSW4gc3VjaFxuICAgICAgICAgICAgICAgIC8vIGEgY2FzZSBhbGwgdGFzayByZWxhdGVkIGludGVyY2VwdG9ycyBtdXN0IGdvIHRocm91Z2ggdGhpcyBaRC4gV2UgY2FuJ3Qgc2hvcnQgY2lyY3VpdCBpdC5cbiAgICAgICAgICAgICAgICB0aGlzLl9oYXNUYXNrWlMgPSB6b25lU3BlY0hhc1Rhc2sgPyB6b25lU3BlYyA6IERFTEVHQVRFX1pTO1xuICAgICAgICAgICAgICAgIHRoaXMuX2hhc1Rhc2tEbGd0ID0gcGFyZW50RGVsZWdhdGU7XG4gICAgICAgICAgICAgICAgdGhpcy5faGFzVGFza0RsZ3RPd25lciA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdGhpcy5faGFzVGFza0N1cnJab25lID0gem9uZTtcbiAgICAgICAgICAgICAgICBpZiAoIXpvbmVTcGVjLm9uU2NoZWR1bGVUYXNrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NjaGVkdWxlVGFza1pTID0gREVMRUdBVEVfWlM7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NjaGVkdWxlVGFza0RsZ3QgPSBwYXJlbnREZWxlZ2F0ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVUYXNrQ3VyclpvbmUgPSB0aGlzLnpvbmU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghem9uZVNwZWMub25JbnZva2VUYXNrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ludm9rZVRhc2taUyA9IERFTEVHQVRFX1pTO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnZva2VUYXNrRGxndCA9IHBhcmVudERlbGVnYXRlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnZva2VUYXNrQ3VyclpvbmUgPSB0aGlzLnpvbmU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghem9uZVNwZWMub25DYW5jZWxUYXNrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhbmNlbFRhc2taUyA9IERFTEVHQVRFX1pTO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYW5jZWxUYXNrRGxndCA9IHBhcmVudERlbGVnYXRlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYW5jZWxUYXNrQ3VyclpvbmUgPSB0aGlzLnpvbmU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvcmsodGFyZ2V0Wm9uZSwgem9uZVNwZWMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb3JrWlMgPyB0aGlzLl9mb3JrWlMub25Gb3JrKHRoaXMuX2ZvcmtEbGd0LCB0aGlzLnpvbmUsIHRhcmdldFpvbmUsIHpvbmVTcGVjKSA6XG4gICAgICAgICAgICAgICAgbmV3IFpvbmUodGFyZ2V0Wm9uZSwgem9uZVNwZWMpO1xuICAgICAgICB9XG4gICAgICAgIGludGVyY2VwdCh0YXJnZXRab25lLCBjYWxsYmFjaywgc291cmNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faW50ZXJjZXB0WlMgP1xuICAgICAgICAgICAgICAgIHRoaXMuX2ludGVyY2VwdFpTLm9uSW50ZXJjZXB0KHRoaXMuX2ludGVyY2VwdERsZ3QsIHRoaXMuX2ludGVyY2VwdEN1cnJab25lLCB0YXJnZXRab25lLCBjYWxsYmFjaywgc291cmNlKSA6XG4gICAgICAgICAgICAgICAgY2FsbGJhY2s7XG4gICAgICAgIH1cbiAgICAgICAgaW52b2tlKHRhcmdldFpvbmUsIGNhbGxiYWNrLCBhcHBseVRoaXMsIGFwcGx5QXJncywgc291cmNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faW52b2tlWlMgPyB0aGlzLl9pbnZva2VaUy5vbkludm9rZSh0aGlzLl9pbnZva2VEbGd0LCB0aGlzLl9pbnZva2VDdXJyWm9uZSwgdGFyZ2V0Wm9uZSwgY2FsbGJhY2ssIGFwcGx5VGhpcywgYXBwbHlBcmdzLCBzb3VyY2UpIDpcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShhcHBseVRoaXMsIGFwcGx5QXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgaGFuZGxlRXJyb3IodGFyZ2V0Wm9uZSwgZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9oYW5kbGVFcnJvclpTID9cbiAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvclpTLm9uSGFuZGxlRXJyb3IodGhpcy5faGFuZGxlRXJyb3JEbGd0LCB0aGlzLl9oYW5kbGVFcnJvckN1cnJab25lLCB0YXJnZXRab25lLCBlcnJvcikgOlxuICAgICAgICAgICAgICAgIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgc2NoZWR1bGVUYXNrKHRhcmdldFpvbmUsIHRhc2spIHtcbiAgICAgICAgICAgIGxldCByZXR1cm5UYXNrID0gdGFzaztcbiAgICAgICAgICAgIGlmICh0aGlzLl9zY2hlZHVsZVRhc2taUykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9oYXNUYXNrWlMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuVGFzay5fem9uZURlbGVnYXRlcy5wdXNoKHRoaXMuX2hhc1Rhc2tEbGd0T3duZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBjbGFuZy1mb3JtYXQgb2ZmXG4gICAgICAgICAgICAgICAgcmV0dXJuVGFzayA9IHRoaXMuX3NjaGVkdWxlVGFza1pTLm9uU2NoZWR1bGVUYXNrKHRoaXMuX3NjaGVkdWxlVGFza0RsZ3QsIHRoaXMuX3NjaGVkdWxlVGFza0N1cnJab25lLCB0YXJnZXRab25lLCB0YXNrKTtcbiAgICAgICAgICAgICAgICAvLyBjbGFuZy1mb3JtYXQgb25cbiAgICAgICAgICAgICAgICBpZiAoIXJldHVyblRhc2spXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblRhc2sgPSB0YXNrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRhc2suc2NoZWR1bGVGbikge1xuICAgICAgICAgICAgICAgICAgICB0YXNrLnNjaGVkdWxlRm4odGFzayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRhc2sudHlwZSA9PSBtaWNyb1Rhc2spIHtcbiAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVNaWNyb1Rhc2sodGFzayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Rhc2sgaXMgbWlzc2luZyBzY2hlZHVsZUZuLicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXR1cm5UYXNrO1xuICAgICAgICB9XG4gICAgICAgIGludm9rZVRhc2sodGFyZ2V0Wm9uZSwgdGFzaywgYXBwbHlUaGlzLCBhcHBseUFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbnZva2VUYXNrWlMgP1xuICAgICAgICAgICAgICAgIHRoaXMuX2ludm9rZVRhc2taUy5vbkludm9rZVRhc2sodGhpcy5faW52b2tlVGFza0RsZ3QsIHRoaXMuX2ludm9rZVRhc2tDdXJyWm9uZSwgdGFyZ2V0Wm9uZSwgdGFzaywgYXBwbHlUaGlzLCBhcHBseUFyZ3MpIDpcbiAgICAgICAgICAgICAgICB0YXNrLmNhbGxiYWNrLmFwcGx5KGFwcGx5VGhpcywgYXBwbHlBcmdzKTtcbiAgICAgICAgfVxuICAgICAgICBjYW5jZWxUYXNrKHRhcmdldFpvbmUsIHRhc2spIHtcbiAgICAgICAgICAgIGxldCB2YWx1ZTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jYW5jZWxUYXNrWlMpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMuX2NhbmNlbFRhc2taUy5vbkNhbmNlbFRhc2sodGhpcy5fY2FuY2VsVGFza0RsZ3QsIHRoaXMuX2NhbmNlbFRhc2tDdXJyWm9uZSwgdGFyZ2V0Wm9uZSwgdGFzayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRhc2suY2FuY2VsRm4pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ1Rhc2sgaXMgbm90IGNhbmNlbGFibGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0YXNrLmNhbmNlbEZuKHRhc2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGhhc1Rhc2sodGFyZ2V0Wm9uZSwgaXNFbXB0eSkge1xuICAgICAgICAgICAgLy8gaGFzVGFzayBzaG91bGQgbm90IHRocm93IGVycm9yIHNvIG90aGVyIFpvbmVEZWxlZ2F0ZVxuICAgICAgICAgICAgLy8gY2FuIHN0aWxsIHRyaWdnZXIgaGFzVGFzayBjYWxsYmFja1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9oYXNUYXNrWlMgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faGFzVGFza1pTLm9uSGFzVGFzayh0aGlzLl9oYXNUYXNrRGxndCwgdGhpcy5faGFzVGFza0N1cnJab25lLCB0YXJnZXRab25lLCBpc0VtcHR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUVycm9yKHRhcmdldFpvbmUsIGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnJlcXVpcmUtaW50ZXJuYWwtd2l0aC11bmRlcnNjb3JlXG4gICAgICAgIF91cGRhdGVUYXNrQ291bnQodHlwZSwgY291bnQpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvdW50cyA9IHRoaXMuX3Rhc2tDb3VudHM7XG4gICAgICAgICAgICBjb25zdCBwcmV2ID0gY291bnRzW3R5cGVdO1xuICAgICAgICAgICAgY29uc3QgbmV4dCA9IGNvdW50c1t0eXBlXSA9IHByZXYgKyBjb3VudDtcbiAgICAgICAgICAgIGlmIChuZXh0IDwgMCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTW9yZSB0YXNrcyBleGVjdXRlZCB0aGVuIHdlcmUgc2NoZWR1bGVkLicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByZXYgPT0gMCB8fCBuZXh0ID09IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpc0VtcHR5ID0ge1xuICAgICAgICAgICAgICAgICAgICBtaWNyb1Rhc2s6IGNvdW50c1snbWljcm9UYXNrJ10gPiAwLFxuICAgICAgICAgICAgICAgICAgICBtYWNyb1Rhc2s6IGNvdW50c1snbWFjcm9UYXNrJ10gPiAwLFxuICAgICAgICAgICAgICAgICAgICBldmVudFRhc2s6IGNvdW50c1snZXZlbnRUYXNrJ10gPiAwLFxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2U6IHR5cGVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHRoaXMuaGFzVGFzayh0aGlzLnpvbmUsIGlzRW1wdHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGNsYXNzIFpvbmVUYXNrIHtcbiAgICAgICAgY29uc3RydWN0b3IodHlwZSwgc291cmNlLCBjYWxsYmFjaywgb3B0aW9ucywgc2NoZWR1bGVGbiwgY2FuY2VsRm4pIHtcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpyZXF1aXJlLWludGVybmFsLXdpdGgtdW5kZXJzY29yZVxuICAgICAgICAgICAgdGhpcy5fem9uZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnJ1bkNvdW50ID0gMDtcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpyZXF1aXJlLWludGVybmFsLXdpdGgtdW5kZXJzY29yZVxuICAgICAgICAgICAgdGhpcy5fem9uZURlbGVnYXRlcyA9IG51bGw7XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cmVxdWlyZS1pbnRlcm5hbC13aXRoLXVuZGVyc2NvcmVcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gJ25vdFNjaGVkdWxlZCc7XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBvcHRpb25zO1xuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZUZuID0gc2NoZWR1bGVGbjtcbiAgICAgICAgICAgIHRoaXMuY2FuY2VsRm4gPSBjYW5jZWxGbjtcbiAgICAgICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NhbGxiYWNrIGlzIG5vdCBkZWZpbmVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIC8vIFRPRE86IEBKaWFMaVBhc3Npb24gb3B0aW9ucyBzaG91bGQgaGF2ZSBpbnRlcmZhY2VcbiAgICAgICAgICAgIGlmICh0eXBlID09PSBldmVudFRhc2sgJiYgb3B0aW9ucyAmJiBvcHRpb25zLnVzZUcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmludm9rZSA9IFpvbmVUYXNrLmludm9rZVRhc2s7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmludm9rZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFpvbmVUYXNrLmludm9rZVRhc2suY2FsbChnbG9iYWwsIHNlbGYsIHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzdGF0aWMgaW52b2tlVGFzayh0YXNrLCB0YXJnZXQsIGFyZ3MpIHtcbiAgICAgICAgICAgIGlmICghdGFzaykge1xuICAgICAgICAgICAgICAgIHRhc2sgPSB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX251bWJlck9mTmVzdGVkVGFza0ZyYW1lcysrO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0YXNrLnJ1bkNvdW50Kys7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhc2suem9uZS5ydW5UYXNrKHRhc2ssIHRhcmdldCwgYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICBpZiAoX251bWJlck9mTmVzdGVkVGFza0ZyYW1lcyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGRyYWluTWljcm9UYXNrUXVldWUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX251bWJlck9mTmVzdGVkVGFza0ZyYW1lcy0tO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGdldCB6b25lKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3pvbmU7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHN0YXRlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xuICAgICAgICB9XG4gICAgICAgIGNhbmNlbFNjaGVkdWxlUmVxdWVzdCgpIHtcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zaXRpb25Ubyhub3RTY2hlZHVsZWQsIHNjaGVkdWxpbmcpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpyZXF1aXJlLWludGVybmFsLXdpdGgtdW5kZXJzY29yZVxuICAgICAgICBfdHJhbnNpdGlvblRvKHRvU3RhdGUsIGZyb21TdGF0ZTEsIGZyb21TdGF0ZTIpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdGF0ZSA9PT0gZnJvbVN0YXRlMSB8fCB0aGlzLl9zdGF0ZSA9PT0gZnJvbVN0YXRlMikge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gdG9TdGF0ZTtcbiAgICAgICAgICAgICAgICBpZiAodG9TdGF0ZSA9PSBub3RTY2hlZHVsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fem9uZURlbGVnYXRlcyA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMudHlwZX0gJyR7dGhpcy5zb3VyY2V9JzogY2FuIG5vdCB0cmFuc2l0aW9uIHRvICcke3RvU3RhdGV9JywgZXhwZWN0aW5nIHN0YXRlICcke2Zyb21TdGF0ZTF9JyR7ZnJvbVN0YXRlMiA/ICcgb3IgXFwnJyArIGZyb21TdGF0ZTIgKyAnXFwnJyA6ICcnfSwgd2FzICcke3RoaXMuX3N0YXRlfScuYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdG9TdHJpbmcoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhICYmIHR5cGVvZiB0aGlzLmRhdGEuaGFuZGxlSWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5oYW5kbGVJZC50b1N0cmluZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBhZGQgdG9KU09OIG1ldGhvZCB0byBwcmV2ZW50IGN5Y2xpYyBlcnJvciB3aGVuXG4gICAgICAgIC8vIGNhbGwgSlNPTi5zdHJpbmdpZnkoem9uZVRhc2spXG4gICAgICAgIHRvSlNPTigpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy50eXBlLFxuICAgICAgICAgICAgICAgIHN0YXRlOiB0aGlzLnN0YXRlLFxuICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2UsXG4gICAgICAgICAgICAgICAgem9uZTogdGhpcy56b25lLm5hbWUsXG4gICAgICAgICAgICAgICAgcnVuQ291bnQ6IHRoaXMucnVuQ291bnRcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8vICBNSUNST1RBU0sgUVVFVUVcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICBjb25zdCBzeW1ib2xTZXRUaW1lb3V0ID0gX19zeW1ib2xfXygnc2V0VGltZW91dCcpO1xuICAgIGNvbnN0IHN5bWJvbFByb21pc2UgPSBfX3N5bWJvbF9fKCdQcm9taXNlJyk7XG4gICAgY29uc3Qgc3ltYm9sVGhlbiA9IF9fc3ltYm9sX18oJ3RoZW4nKTtcbiAgICBsZXQgX21pY3JvVGFza1F1ZXVlID0gW107XG4gICAgbGV0IF9pc0RyYWluaW5nTWljcm90YXNrUXVldWUgPSBmYWxzZTtcbiAgICBsZXQgbmF0aXZlTWljcm9UYXNrUXVldWVQcm9taXNlO1xuICAgIGZ1bmN0aW9uIG5hdGl2ZVNjaGVkdWxlTWljcm9UYXNrKGZ1bmMpIHtcbiAgICAgICAgaWYgKCFuYXRpdmVNaWNyb1Rhc2tRdWV1ZVByb21pc2UpIHtcbiAgICAgICAgICAgIGlmIChnbG9iYWxbc3ltYm9sUHJvbWlzZV0pIHtcbiAgICAgICAgICAgICAgICBuYXRpdmVNaWNyb1Rhc2tRdWV1ZVByb21pc2UgPSBnbG9iYWxbc3ltYm9sUHJvbWlzZV0ucmVzb2x2ZSgwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobmF0aXZlTWljcm9UYXNrUXVldWVQcm9taXNlKSB7XG4gICAgICAgICAgICBsZXQgbmF0aXZlVGhlbiA9IG5hdGl2ZU1pY3JvVGFza1F1ZXVlUHJvbWlzZVtzeW1ib2xUaGVuXTtcbiAgICAgICAgICAgIGlmICghbmF0aXZlVGhlbikge1xuICAgICAgICAgICAgICAgIC8vIG5hdGl2ZSBQcm9taXNlIGlzIG5vdCBwYXRjaGFibGUsIHdlIG5lZWQgdG8gdXNlIGB0aGVuYCBkaXJlY3RseVxuICAgICAgICAgICAgICAgIC8vIGlzc3VlIDEwNzhcbiAgICAgICAgICAgICAgICBuYXRpdmVUaGVuID0gbmF0aXZlTWljcm9UYXNrUXVldWVQcm9taXNlWyd0aGVuJ107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuYXRpdmVUaGVuLmNhbGwobmF0aXZlTWljcm9UYXNrUXVldWVQcm9taXNlLCBmdW5jKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGdsb2JhbFtzeW1ib2xTZXRUaW1lb3V0XShmdW5jLCAwKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBzY2hlZHVsZU1pY3JvVGFzayh0YXNrKSB7XG4gICAgICAgIC8vIGlmIHdlIGFyZSBub3QgcnVubmluZyBpbiBhbnkgdGFzaywgYW5kIHRoZXJlIGhhcyBub3QgYmVlbiBhbnl0aGluZyBzY2hlZHVsZWRcbiAgICAgICAgLy8gd2UgbXVzdCBib290c3RyYXAgdGhlIGluaXRpYWwgdGFzayBjcmVhdGlvbiBieSBtYW51YWxseSBzY2hlZHVsaW5nIHRoZSBkcmFpblxuICAgICAgICBpZiAoX251bWJlck9mTmVzdGVkVGFza0ZyYW1lcyA9PT0gMCAmJiBfbWljcm9UYXNrUXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAvLyBXZSBhcmUgbm90IHJ1bm5pbmcgaW4gVGFzaywgc28gd2UgbmVlZCB0byBraWNrc3RhcnQgdGhlIG1pY3JvdGFzayBxdWV1ZS5cbiAgICAgICAgICAgIG5hdGl2ZVNjaGVkdWxlTWljcm9UYXNrKGRyYWluTWljcm9UYXNrUXVldWUpO1xuICAgICAgICB9XG4gICAgICAgIHRhc2sgJiYgX21pY3JvVGFza1F1ZXVlLnB1c2godGFzayk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRyYWluTWljcm9UYXNrUXVldWUoKSB7XG4gICAgICAgIGlmICghX2lzRHJhaW5pbmdNaWNyb3Rhc2tRdWV1ZSkge1xuICAgICAgICAgICAgX2lzRHJhaW5pbmdNaWNyb3Rhc2tRdWV1ZSA9IHRydWU7XG4gICAgICAgICAgICB3aGlsZSAoX21pY3JvVGFza1F1ZXVlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHF1ZXVlID0gX21pY3JvVGFza1F1ZXVlO1xuICAgICAgICAgICAgICAgIF9taWNyb1Rhc2tRdWV1ZSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFzayA9IHF1ZXVlW2ldO1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFzay56b25lLnJ1blRhc2sodGFzaywgbnVsbCwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfYXBpLm9uVW5oYW5kbGVkRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX2FwaS5taWNyb3Rhc2tEcmFpbkRvbmUoKTtcbiAgICAgICAgICAgIF9pc0RyYWluaW5nTWljcm90YXNrUXVldWUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLy8gIEJPT1RTVFJBUFxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIGNvbnN0IE5PX1pPTkUgPSB7XG4gICAgICAgIG5hbWU6ICdOTyBaT05FJ1xuICAgIH07XG4gICAgY29uc3Qgbm90U2NoZWR1bGVkID0gJ25vdFNjaGVkdWxlZCcsIHNjaGVkdWxpbmcgPSAnc2NoZWR1bGluZycsIHNjaGVkdWxlZCA9ICdzY2hlZHVsZWQnLCBydW5uaW5nID0gJ3J1bm5pbmcnLCBjYW5jZWxpbmcgPSAnY2FuY2VsaW5nJywgdW5rbm93biA9ICd1bmtub3duJztcbiAgICBjb25zdCBtaWNyb1Rhc2sgPSAnbWljcm9UYXNrJywgbWFjcm9UYXNrID0gJ21hY3JvVGFzaycsIGV2ZW50VGFzayA9ICdldmVudFRhc2snO1xuICAgIGNvbnN0IHBhdGNoZXMgPSB7fTtcbiAgICBjb25zdCBfYXBpID0ge1xuICAgICAgICBzeW1ib2w6IF9fc3ltYm9sX18sXG4gICAgICAgIGN1cnJlbnRab25lRnJhbWU6ICgpID0+IF9jdXJyZW50Wm9uZUZyYW1lLFxuICAgICAgICBvblVuaGFuZGxlZEVycm9yOiBub29wLFxuICAgICAgICBtaWNyb3Rhc2tEcmFpbkRvbmU6IG5vb3AsXG4gICAgICAgIHNjaGVkdWxlTWljcm9UYXNrOiBzY2hlZHVsZU1pY3JvVGFzayxcbiAgICAgICAgc2hvd1VuY2F1Z2h0RXJyb3I6ICgpID0+ICFab25lW19fc3ltYm9sX18oJ2lnbm9yZUNvbnNvbGVFcnJvclVuY2F1Z2h0RXJyb3InKV0sXG4gICAgICAgIHBhdGNoRXZlbnRUYXJnZXQ6ICgpID0+IFtdLFxuICAgICAgICBwYXRjaE9uUHJvcGVydGllczogbm9vcCxcbiAgICAgICAgcGF0Y2hNZXRob2Q6ICgpID0+IG5vb3AsXG4gICAgICAgIGJpbmRBcmd1bWVudHM6ICgpID0+IFtdLFxuICAgICAgICBwYXRjaFRoZW46ICgpID0+IG5vb3AsXG4gICAgICAgIHBhdGNoTWFjcm9UYXNrOiAoKSA9PiBub29wLFxuICAgICAgICBwYXRjaEV2ZW50UHJvdG90eXBlOiAoKSA9PiBub29wLFxuICAgICAgICBpc0lFT3JFZGdlOiAoKSA9PiBmYWxzZSxcbiAgICAgICAgZ2V0R2xvYmFsT2JqZWN0czogKCkgPT4gdW5kZWZpbmVkLFxuICAgICAgICBPYmplY3REZWZpbmVQcm9wZXJ0eTogKCkgPT4gbm9vcCxcbiAgICAgICAgT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAoKSA9PiB1bmRlZmluZWQsXG4gICAgICAgIE9iamVjdENyZWF0ZTogKCkgPT4gdW5kZWZpbmVkLFxuICAgICAgICBBcnJheVNsaWNlOiAoKSA9PiBbXSxcbiAgICAgICAgcGF0Y2hDbGFzczogKCkgPT4gbm9vcCxcbiAgICAgICAgd3JhcFdpdGhDdXJyZW50Wm9uZTogKCkgPT4gbm9vcCxcbiAgICAgICAgZmlsdGVyUHJvcGVydGllczogKCkgPT4gW10sXG4gICAgICAgIGF0dGFjaE9yaWdpblRvUGF0Y2hlZDogKCkgPT4gbm9vcCxcbiAgICAgICAgX3JlZGVmaW5lUHJvcGVydHk6ICgpID0+IG5vb3AsXG4gICAgICAgIHBhdGNoQ2FsbGJhY2tzOiAoKSA9PiBub29wLFxuICAgICAgICBuYXRpdmVTY2hlZHVsZU1pY3JvVGFzazogbmF0aXZlU2NoZWR1bGVNaWNyb1Rhc2tcbiAgICB9O1xuICAgIGxldCBfY3VycmVudFpvbmVGcmFtZSA9IHsgcGFyZW50OiBudWxsLCB6b25lOiBuZXcgWm9uZShudWxsLCBudWxsKSB9O1xuICAgIGxldCBfY3VycmVudFRhc2sgPSBudWxsO1xuICAgIGxldCBfbnVtYmVyT2ZOZXN0ZWRUYXNrRnJhbWVzID0gMDtcbiAgICBmdW5jdGlvbiBub29wKCkgeyB9XG4gICAgcGVyZm9ybWFuY2VNZWFzdXJlKCdab25lJywgJ1pvbmUnKTtcbiAgICByZXR1cm4gZ2xvYmFsWydab25lJ10gPSBab25lO1xufSkoZ2xvYmFsVGhpcyk7XG5cbi8qKlxuICogU3VwcHJlc3MgY2xvc3VyZSBjb21waWxlciBlcnJvcnMgYWJvdXQgdW5rbm93biAnWm9uZScgdmFyaWFibGVcbiAqIEBmaWxlb3ZlcnZpZXdcbiAqIEBzdXBwcmVzcyB7dW5kZWZpbmVkVmFycyxnbG9iYWxUaGlzLG1pc3NpbmdSZXF1aXJlfVxuICovXG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cIm5vZGVcIi8+XG4vLyBpc3N1ZSAjOTg5LCB0byByZWR1Y2UgYnVuZGxlIHNpemUsIHVzZSBzaG9ydCBuYW1lXG4vKiogT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciAqL1xuY29uc3QgT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbi8qKiBPYmplY3QuZGVmaW5lUHJvcGVydHkgKi9cbmNvbnN0IE9iamVjdERlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuLyoqIE9iamVjdC5nZXRQcm90b3R5cGVPZiAqL1xuY29uc3QgT2JqZWN0R2V0UHJvdG90eXBlT2YgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4vKiogT2JqZWN0LmNyZWF0ZSAqL1xuY29uc3QgT2JqZWN0Q3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcbi8qKiBBcnJheS5wcm90b3R5cGUuc2xpY2UgKi9cbmNvbnN0IEFycmF5U2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG4vKiogYWRkRXZlbnRMaXN0ZW5lciBzdHJpbmcgY29uc3QgKi9cbmNvbnN0IEFERF9FVkVOVF9MSVNURU5FUl9TVFIgPSAnYWRkRXZlbnRMaXN0ZW5lcic7XG4vKiogcmVtb3ZlRXZlbnRMaXN0ZW5lciBzdHJpbmcgY29uc3QgKi9cbmNvbnN0IFJFTU9WRV9FVkVOVF9MSVNURU5FUl9TVFIgPSAncmVtb3ZlRXZlbnRMaXN0ZW5lcic7XG4vKiogem9uZVN5bWJvbCBhZGRFdmVudExpc3RlbmVyICovXG5jb25zdCBaT05FX1NZTUJPTF9BRERfRVZFTlRfTElTVEVORVIgPSBab25lLl9fc3ltYm9sX18oQUREX0VWRU5UX0xJU1RFTkVSX1NUUik7XG4vKiogem9uZVN5bWJvbCByZW1vdmVFdmVudExpc3RlbmVyICovXG5jb25zdCBaT05FX1NZTUJPTF9SRU1PVkVfRVZFTlRfTElTVEVORVIgPSBab25lLl9fc3ltYm9sX18oUkVNT1ZFX0VWRU5UX0xJU1RFTkVSX1NUUik7XG4vKiogdHJ1ZSBzdHJpbmcgY29uc3QgKi9cbmNvbnN0IFRSVUVfU1RSID0gJ3RydWUnO1xuLyoqIGZhbHNlIHN0cmluZyBjb25zdCAqL1xuY29uc3QgRkFMU0VfU1RSID0gJ2ZhbHNlJztcbi8qKiBab25lIHN5bWJvbCBwcmVmaXggc3RyaW5nIGNvbnN0LiAqL1xuY29uc3QgWk9ORV9TWU1CT0xfUFJFRklYID0gWm9uZS5fX3N5bWJvbF9fKCcnKTtcbmZ1bmN0aW9uIHdyYXBXaXRoQ3VycmVudFpvbmUoY2FsbGJhY2ssIHNvdXJjZSkge1xuICAgIHJldHVybiBab25lLmN1cnJlbnQud3JhcChjYWxsYmFjaywgc291cmNlKTtcbn1cbmZ1bmN0aW9uIHNjaGVkdWxlTWFjcm9UYXNrV2l0aEN1cnJlbnRab25lKHNvdXJjZSwgY2FsbGJhY2ssIGRhdGEsIGN1c3RvbVNjaGVkdWxlLCBjdXN0b21DYW5jZWwpIHtcbiAgICByZXR1cm4gWm9uZS5jdXJyZW50LnNjaGVkdWxlTWFjcm9UYXNrKHNvdXJjZSwgY2FsbGJhY2ssIGRhdGEsIGN1c3RvbVNjaGVkdWxlLCBjdXN0b21DYW5jZWwpO1xufVxuY29uc3Qgem9uZVN5bWJvbCA9IFpvbmUuX19zeW1ib2xfXztcbmNvbnN0IGlzV2luZG93RXhpc3RzID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XG5jb25zdCBpbnRlcm5hbFdpbmRvdyA9IGlzV2luZG93RXhpc3RzID8gd2luZG93IDogdW5kZWZpbmVkO1xuY29uc3QgX2dsb2JhbCA9IGlzV2luZG93RXhpc3RzICYmIGludGVybmFsV2luZG93IHx8IGdsb2JhbFRoaXM7XG5jb25zdCBSRU1PVkVfQVRUUklCVVRFID0gJ3JlbW92ZUF0dHJpYnV0ZSc7XG5mdW5jdGlvbiBiaW5kQXJndW1lbnRzKGFyZ3MsIHNvdXJjZSkge1xuICAgIGZvciAobGV0IGkgPSBhcmdzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYXJnc1tpXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgYXJnc1tpXSA9IHdyYXBXaXRoQ3VycmVudFpvbmUoYXJnc1tpXSwgc291cmNlICsgJ18nICsgaSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFyZ3M7XG59XG5mdW5jdGlvbiBwYXRjaFByb3RvdHlwZShwcm90b3R5cGUsIGZuTmFtZXMpIHtcbiAgICBjb25zdCBzb3VyY2UgPSBwcm90b3R5cGUuY29uc3RydWN0b3JbJ25hbWUnXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZuTmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IGZuTmFtZXNbaV07XG4gICAgICAgIGNvbnN0IGRlbGVnYXRlID0gcHJvdG90eXBlW25hbWVdO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHByb3RvdHlwZURlc2MgPSBPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG90eXBlLCBuYW1lKTtcbiAgICAgICAgICAgIGlmICghaXNQcm9wZXJ0eVdyaXRhYmxlKHByb3RvdHlwZURlc2MpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm90b3R5cGVbbmFtZV0gPSAoKGRlbGVnYXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGF0Y2hlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlLmFwcGx5KHRoaXMsIGJpbmRBcmd1bWVudHMoYXJndW1lbnRzLCBzb3VyY2UgKyAnLicgKyBuYW1lKSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBhdHRhY2hPcmlnaW5Ub1BhdGNoZWQocGF0Y2hlZCwgZGVsZWdhdGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXRjaGVkO1xuICAgICAgICAgICAgfSkoZGVsZWdhdGUpO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gaXNQcm9wZXJ0eVdyaXRhYmxlKHByb3BlcnR5RGVzYykge1xuICAgIGlmICghcHJvcGVydHlEZXNjKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAocHJvcGVydHlEZXNjLndyaXRhYmxlID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiAhKHR5cGVvZiBwcm9wZXJ0eURlc2MuZ2V0ID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBwcm9wZXJ0eURlc2Muc2V0ID09PSAndW5kZWZpbmVkJyk7XG59XG5jb25zdCBpc1dlYldvcmtlciA9ICh0eXBlb2YgV29ya2VyR2xvYmFsU2NvcGUgIT09ICd1bmRlZmluZWQnICYmIHNlbGYgaW5zdGFuY2VvZiBXb3JrZXJHbG9iYWxTY29wZSk7XG4vLyBNYWtlIHN1cmUgdG8gYWNjZXNzIGBwcm9jZXNzYCB0aHJvdWdoIGBfZ2xvYmFsYCBzbyB0aGF0IFdlYlBhY2sgZG9lcyBub3QgYWNjaWRlbnRhbGx5IGJyb3dzZXJpZnlcbi8vIHRoaXMgY29kZS5cbmNvbnN0IGlzTm9kZSA9ICghKCdudycgaW4gX2dsb2JhbCkgJiYgdHlwZW9mIF9nbG9iYWwucHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB7fS50b1N0cmluZy5jYWxsKF9nbG9iYWwucHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJyk7XG5jb25zdCBpc0Jyb3dzZXIgPSAhaXNOb2RlICYmICFpc1dlYldvcmtlciAmJiAhIShpc1dpbmRvd0V4aXN0cyAmJiBpbnRlcm5hbFdpbmRvd1snSFRNTEVsZW1lbnQnXSk7XG4vLyB3ZSBhcmUgaW4gZWxlY3Ryb24gb2YgbncsIHNvIHdlIGFyZSBib3RoIGJyb3dzZXIgYW5kIG5vZGVqc1xuLy8gTWFrZSBzdXJlIHRvIGFjY2VzcyBgcHJvY2Vzc2AgdGhyb3VnaCBgX2dsb2JhbGAgc28gdGhhdCBXZWJQYWNrIGRvZXMgbm90IGFjY2lkZW50YWxseSBicm93c2VyaWZ5XG4vLyB0aGlzIGNvZGUuXG5jb25zdCBpc01peCA9IHR5cGVvZiBfZ2xvYmFsLnByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmXG4gICAge30udG9TdHJpbmcuY2FsbChfZ2xvYmFsLnByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXScgJiYgIWlzV2ViV29ya2VyICYmXG4gICAgISEoaXNXaW5kb3dFeGlzdHMgJiYgaW50ZXJuYWxXaW5kb3dbJ0hUTUxFbGVtZW50J10pO1xuY29uc3Qgem9uZVN5bWJvbEV2ZW50TmFtZXMkMSA9IHt9O1xuY29uc3Qgd3JhcEZuID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvem9uZS5qcy9pc3N1ZXMvOTExLCBpbiBJRSwgc29tZXRpbWVzXG4gICAgLy8gZXZlbnQgd2lsbCBiZSB1bmRlZmluZWQsIHNvIHdlIG5lZWQgdG8gdXNlIHdpbmRvdy5ldmVudFxuICAgIGV2ZW50ID0gZXZlbnQgfHwgX2dsb2JhbC5ldmVudDtcbiAgICBpZiAoIWV2ZW50KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IGV2ZW50TmFtZVN5bWJvbCA9IHpvbmVTeW1ib2xFdmVudE5hbWVzJDFbZXZlbnQudHlwZV07XG4gICAgaWYgKCFldmVudE5hbWVTeW1ib2wpIHtcbiAgICAgICAgZXZlbnROYW1lU3ltYm9sID0gem9uZVN5bWJvbEV2ZW50TmFtZXMkMVtldmVudC50eXBlXSA9IHpvbmVTeW1ib2woJ09OX1BST1BFUlRZJyArIGV2ZW50LnR5cGUpO1xuICAgIH1cbiAgICBjb25zdCB0YXJnZXQgPSB0aGlzIHx8IGV2ZW50LnRhcmdldCB8fCBfZ2xvYmFsO1xuICAgIGNvbnN0IGxpc3RlbmVyID0gdGFyZ2V0W2V2ZW50TmFtZVN5bWJvbF07XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAoaXNCcm93c2VyICYmIHRhcmdldCA9PT0gaW50ZXJuYWxXaW5kb3cgJiYgZXZlbnQudHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAvLyB3aW5kb3cub25lcnJvciBoYXZlIGRpZmZlcmVudCBzaWduYXR1cmVcbiAgICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0dsb2JhbEV2ZW50SGFuZGxlcnMvb25lcnJvciN3aW5kb3cub25lcnJvclxuICAgICAgICAvLyBhbmQgb25lcnJvciBjYWxsYmFjayB3aWxsIHByZXZlbnQgZGVmYXVsdCB3aGVuIGNhbGxiYWNrIHJldHVybiB0cnVlXG4gICAgICAgIGNvbnN0IGVycm9yRXZlbnQgPSBldmVudDtcbiAgICAgICAgcmVzdWx0ID0gbGlzdGVuZXIgJiZcbiAgICAgICAgICAgIGxpc3RlbmVyLmNhbGwodGhpcywgZXJyb3JFdmVudC5tZXNzYWdlLCBlcnJvckV2ZW50LmZpbGVuYW1lLCBlcnJvckV2ZW50LmxpbmVubywgZXJyb3JFdmVudC5jb2xubywgZXJyb3JFdmVudC5lcnJvcik7XG4gICAgICAgIGlmIChyZXN1bHQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IGxpc3RlbmVyICYmIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGlmIChyZXN1bHQgIT0gdW5kZWZpbmVkICYmICFyZXN1bHQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5mdW5jdGlvbiBwYXRjaFByb3BlcnR5KG9iaiwgcHJvcCwgcHJvdG90eXBlKSB7XG4gICAgbGV0IGRlc2MgPSBPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBwcm9wKTtcbiAgICBpZiAoIWRlc2MgJiYgcHJvdG90eXBlKSB7XG4gICAgICAgIC8vIHdoZW4gcGF0Y2ggd2luZG93IG9iamVjdCwgdXNlIHByb3RvdHlwZSB0byBjaGVjayBwcm9wIGV4aXN0IG9yIG5vdFxuICAgICAgICBjb25zdCBwcm90b3R5cGVEZXNjID0gT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvdHlwZSwgcHJvcCk7XG4gICAgICAgIGlmIChwcm90b3R5cGVEZXNjKSB7XG4gICAgICAgICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBpZiB0aGUgZGVzY3JpcHRvciBub3QgZXhpc3RzIG9yIGlzIG5vdCBjb25maWd1cmFibGVcbiAgICAvLyBqdXN0IHJldHVyblxuICAgIGlmICghZGVzYyB8fCAhZGVzYy5jb25maWd1cmFibGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBvblByb3BQYXRjaGVkU3ltYm9sID0gem9uZVN5bWJvbCgnb24nICsgcHJvcCArICdwYXRjaGVkJyk7XG4gICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShvblByb3BQYXRjaGVkU3ltYm9sKSAmJiBvYmpbb25Qcm9wUGF0Y2hlZFN5bWJvbF0pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBBIHByb3BlcnR5IGRlc2NyaXB0b3IgY2Fubm90IGhhdmUgZ2V0dGVyL3NldHRlciBhbmQgYmUgd3JpdGFibGVcbiAgICAvLyBkZWxldGluZyB0aGUgd3JpdGFibGUgYW5kIHZhbHVlIHByb3BlcnRpZXMgYXZvaWRzIHRoaXMgZXJyb3I6XG4gICAgLy9cbiAgICAvLyBUeXBlRXJyb3I6IHByb3BlcnR5IGRlc2NyaXB0b3JzIG11c3Qgbm90IHNwZWNpZnkgYSB2YWx1ZSBvciBiZSB3cml0YWJsZSB3aGVuIGFcbiAgICAvLyBnZXR0ZXIgb3Igc2V0dGVyIGhhcyBiZWVuIHNwZWNpZmllZFxuICAgIGRlbGV0ZSBkZXNjLndyaXRhYmxlO1xuICAgIGRlbGV0ZSBkZXNjLnZhbHVlO1xuICAgIGNvbnN0IG9yaWdpbmFsRGVzY0dldCA9IGRlc2MuZ2V0O1xuICAgIGNvbnN0IG9yaWdpbmFsRGVzY1NldCA9IGRlc2Muc2V0O1xuICAgIC8vIHNsaWNlKDIpIGN1eiAnb25jbGljaycgLT4gJ2NsaWNrJywgZXRjXG4gICAgY29uc3QgZXZlbnROYW1lID0gcHJvcC5zbGljZSgyKTtcbiAgICBsZXQgZXZlbnROYW1lU3ltYm9sID0gem9uZVN5bWJvbEV2ZW50TmFtZXMkMVtldmVudE5hbWVdO1xuICAgIGlmICghZXZlbnROYW1lU3ltYm9sKSB7XG4gICAgICAgIGV2ZW50TmFtZVN5bWJvbCA9IHpvbmVTeW1ib2xFdmVudE5hbWVzJDFbZXZlbnROYW1lXSA9IHpvbmVTeW1ib2woJ09OX1BST1BFUlRZJyArIGV2ZW50TmFtZSk7XG4gICAgfVxuICAgIGRlc2Muc2V0ID0gZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XG4gICAgICAgIC8vIGluIHNvbWUgb2Ygd2luZG93cydzIG9ucHJvcGVydHkgY2FsbGJhY2ssIHRoaXMgaXMgdW5kZWZpbmVkXG4gICAgICAgIC8vIHNvIHdlIG5lZWQgdG8gY2hlY2sgaXRcbiAgICAgICAgbGV0IHRhcmdldCA9IHRoaXM7XG4gICAgICAgIGlmICghdGFyZ2V0ICYmIG9iaiA9PT0gX2dsb2JhbCkge1xuICAgICAgICAgICAgdGFyZ2V0ID0gX2dsb2JhbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRhcmdldCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHByZXZpb3VzVmFsdWUgPSB0YXJnZXRbZXZlbnROYW1lU3ltYm9sXTtcbiAgICAgICAgaWYgKHR5cGVvZiBwcmV2aW91c1ZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHdyYXBGbik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaXNzdWUgIzk3OCwgd2hlbiBvbmxvYWQgaGFuZGxlciB3YXMgYWRkZWQgYmVmb3JlIGxvYWRpbmcgem9uZS5qc1xuICAgICAgICAvLyB3ZSBzaG91bGQgcmVtb3ZlIGl0IHdpdGggb3JpZ2luYWxEZXNjU2V0XG4gICAgICAgIG9yaWdpbmFsRGVzY1NldCAmJiBvcmlnaW5hbERlc2NTZXQuY2FsbCh0YXJnZXQsIG51bGwpO1xuICAgICAgICB0YXJnZXRbZXZlbnROYW1lU3ltYm9sXSA9IG5ld1ZhbHVlO1xuICAgICAgICBpZiAodHlwZW9mIG5ld1ZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHdyYXBGbiwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvLyBUaGUgZ2V0dGVyIHdvdWxkIHJldHVybiB1bmRlZmluZWQgZm9yIHVuYXNzaWduZWQgcHJvcGVydGllcyBidXQgdGhlIGRlZmF1bHQgdmFsdWUgb2YgYW5cbiAgICAvLyB1bmFzc2lnbmVkIHByb3BlcnR5IGlzIG51bGxcbiAgICBkZXNjLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gaW4gc29tZSBvZiB3aW5kb3dzJ3Mgb25wcm9wZXJ0eSBjYWxsYmFjaywgdGhpcyBpcyB1bmRlZmluZWRcbiAgICAgICAgLy8gc28gd2UgbmVlZCB0byBjaGVjayBpdFxuICAgICAgICBsZXQgdGFyZ2V0ID0gdGhpcztcbiAgICAgICAgaWYgKCF0YXJnZXQgJiYgb2JqID09PSBfZ2xvYmFsKSB7XG4gICAgICAgICAgICB0YXJnZXQgPSBfZ2xvYmFsO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsaXN0ZW5lciA9IHRhcmdldFtldmVudE5hbWVTeW1ib2xdO1xuICAgICAgICBpZiAobGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBsaXN0ZW5lcjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChvcmlnaW5hbERlc2NHZXQpIHtcbiAgICAgICAgICAgIC8vIHJlc3VsdCB3aWxsIGJlIG51bGwgd2hlbiB1c2UgaW5saW5lIGV2ZW50IGF0dHJpYnV0ZSxcbiAgICAgICAgICAgIC8vIHN1Y2ggYXMgPGJ1dHRvbiBvbmNsaWNrPVwiZnVuYygpO1wiPk9LPC9idXR0b24+XG4gICAgICAgICAgICAvLyBiZWNhdXNlIHRoZSBvbmNsaWNrIGZ1bmN0aW9uIGlzIGludGVybmFsIHJhdyB1bmNvbXBpbGVkIGhhbmRsZXJcbiAgICAgICAgICAgIC8vIHRoZSBvbmNsaWNrIHdpbGwgYmUgZXZhbHVhdGVkIHdoZW4gZmlyc3QgdGltZSBldmVudCB3YXMgdHJpZ2dlcmVkIG9yXG4gICAgICAgICAgICAvLyB0aGUgcHJvcGVydHkgaXMgYWNjZXNzZWQsIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL3pvbmUuanMvaXNzdWVzLzUyNVxuICAgICAgICAgICAgLy8gc28gd2Ugc2hvdWxkIHVzZSBvcmlnaW5hbCBuYXRpdmUgZ2V0IHRvIHJldHJpZXZlIHRoZSBoYW5kbGVyXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSBvcmlnaW5hbERlc2NHZXQuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGRlc2Muc2V0LmNhbGwodGhpcywgdmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0W1JFTU9WRV9BVFRSSUJVVEVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUocHJvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuICAgIE9iamVjdERlZmluZVByb3BlcnR5KG9iaiwgcHJvcCwgZGVzYyk7XG4gICAgb2JqW29uUHJvcFBhdGNoZWRTeW1ib2xdID0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIHBhdGNoT25Qcm9wZXJ0aWVzKG9iaiwgcHJvcGVydGllcywgcHJvdG90eXBlKSB7XG4gICAgaWYgKHByb3BlcnRpZXMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBwYXRjaFByb3BlcnR5KG9iaiwgJ29uJyArIHByb3BlcnRpZXNbaV0sIHByb3RvdHlwZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbnN0IG9uUHJvcGVydGllcyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHByb3AgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAocHJvcC5zbGljZSgwLCAyKSA9PSAnb24nKSB7XG4gICAgICAgICAgICAgICAgb25Qcm9wZXJ0aWVzLnB1c2gocHJvcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBvblByb3BlcnRpZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIHBhdGNoUHJvcGVydHkob2JqLCBvblByb3BlcnRpZXNbal0sIHByb3RvdHlwZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5jb25zdCBvcmlnaW5hbEluc3RhbmNlS2V5ID0gem9uZVN5bWJvbCgnb3JpZ2luYWxJbnN0YW5jZScpO1xuLy8gd3JhcCBzb21lIG5hdGl2ZSBBUEkgb24gYHdpbmRvd2BcbmZ1bmN0aW9uIHBhdGNoQ2xhc3MoY2xhc3NOYW1lKSB7XG4gICAgY29uc3QgT3JpZ2luYWxDbGFzcyA9IF9nbG9iYWxbY2xhc3NOYW1lXTtcbiAgICBpZiAoIU9yaWdpbmFsQ2xhc3MpXG4gICAgICAgIHJldHVybjtcbiAgICAvLyBrZWVwIG9yaWdpbmFsIGNsYXNzIGluIGdsb2JhbFxuICAgIF9nbG9iYWxbem9uZVN5bWJvbChjbGFzc05hbWUpXSA9IE9yaWdpbmFsQ2xhc3M7XG4gICAgX2dsb2JhbFtjbGFzc05hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCBhID0gYmluZEFyZ3VtZW50cyhhcmd1bWVudHMsIGNsYXNzTmFtZSk7XG4gICAgICAgIHN3aXRjaCAoYS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICB0aGlzW29yaWdpbmFsSW5zdGFuY2VLZXldID0gbmV3IE9yaWdpbmFsQ2xhc3MoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICB0aGlzW29yaWdpbmFsSW5zdGFuY2VLZXldID0gbmV3IE9yaWdpbmFsQ2xhc3MoYVswXSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgdGhpc1tvcmlnaW5hbEluc3RhbmNlS2V5XSA9IG5ldyBPcmlnaW5hbENsYXNzKGFbMF0sIGFbMV0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV0gPSBuZXcgT3JpZ2luYWxDbGFzcyhhWzBdLCBhWzFdLCBhWzJdKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICB0aGlzW29yaWdpbmFsSW5zdGFuY2VLZXldID0gbmV3IE9yaWdpbmFsQ2xhc3MoYVswXSwgYVsxXSwgYVsyXSwgYVszXSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQXJnIGxpc3QgdG9vIGxvbmcuJyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8vIGF0dGFjaCBvcmlnaW5hbCBkZWxlZ2F0ZSB0byBwYXRjaGVkIGZ1bmN0aW9uXG4gICAgYXR0YWNoT3JpZ2luVG9QYXRjaGVkKF9nbG9iYWxbY2xhc3NOYW1lXSwgT3JpZ2luYWxDbGFzcyk7XG4gICAgY29uc3QgaW5zdGFuY2UgPSBuZXcgT3JpZ2luYWxDbGFzcyhmdW5jdGlvbiAoKSB7IH0pO1xuICAgIGxldCBwcm9wO1xuICAgIGZvciAocHJvcCBpbiBpbnN0YW5jZSkge1xuICAgICAgICAvLyBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NDQ3MjFcbiAgICAgICAgaWYgKGNsYXNzTmFtZSA9PT0gJ1hNTEh0dHBSZXF1ZXN0JyAmJiBwcm9wID09PSAncmVzcG9uc2VCbG9iJylcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAoZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaW5zdGFuY2VbcHJvcF0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBfZ2xvYmFsW2NsYXNzTmFtZV0ucHJvdG90eXBlW3Byb3BdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1tvcmlnaW5hbEluc3RhbmNlS2V5XVtwcm9wXS5hcHBseSh0aGlzW29yaWdpbmFsSW5zdGFuY2VLZXldLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBPYmplY3REZWZpbmVQcm9wZXJ0eShfZ2xvYmFsW2NsYXNzTmFtZV0ucHJvdG90eXBlLCBwcm9wLCB7XG4gICAgICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1tvcmlnaW5hbEluc3RhbmNlS2V5XVtwcm9wXSA9IHdyYXBXaXRoQ3VycmVudFpvbmUoZm4sIGNsYXNzTmFtZSArICcuJyArIHByb3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGtlZXAgY2FsbGJhY2sgaW4gd3JhcHBlZCBmdW5jdGlvbiBzbyB3ZSBjYW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB1c2UgaXQgaW4gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nIHRvIHJldHVyblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSBuYXRpdmUgb25lLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dGFjaE9yaWdpblRvUGF0Y2hlZCh0aGlzW29yaWdpbmFsSW5zdGFuY2VLZXldW3Byb3BdLCBmbik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW29yaWdpbmFsSW5zdGFuY2VLZXldW3Byb3BdID0gZm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV1bcHJvcF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfShwcm9wKSk7XG4gICAgfVxuICAgIGZvciAocHJvcCBpbiBPcmlnaW5hbENsYXNzKSB7XG4gICAgICAgIGlmIChwcm9wICE9PSAncHJvdG90eXBlJyAmJiBPcmlnaW5hbENsYXNzLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgICBfZ2xvYmFsW2NsYXNzTmFtZV1bcHJvcF0gPSBPcmlnaW5hbENsYXNzW3Byb3BdO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gcGF0Y2hNZXRob2QodGFyZ2V0LCBuYW1lLCBwYXRjaEZuKSB7XG4gICAgbGV0IHByb3RvID0gdGFyZ2V0O1xuICAgIHdoaWxlIChwcm90byAmJiAhcHJvdG8uaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgcHJvdG8gPSBPYmplY3RHZXRQcm90b3R5cGVPZihwcm90byk7XG4gICAgfVxuICAgIGlmICghcHJvdG8gJiYgdGFyZ2V0W25hbWVdKSB7XG4gICAgICAgIC8vIHNvbWVob3cgd2UgZGlkIG5vdCBmaW5kIGl0LCBidXQgd2UgY2FuIHNlZSBpdC4gVGhpcyBoYXBwZW5zIG9uIElFIGZvciBXaW5kb3cgcHJvcGVydGllcy5cbiAgICAgICAgcHJvdG8gPSB0YXJnZXQ7XG4gICAgfVxuICAgIGNvbnN0IGRlbGVnYXRlTmFtZSA9IHpvbmVTeW1ib2wobmFtZSk7XG4gICAgbGV0IGRlbGVnYXRlID0gbnVsbDtcbiAgICBpZiAocHJvdG8gJiYgKCEoZGVsZWdhdGUgPSBwcm90b1tkZWxlZ2F0ZU5hbWVdKSB8fCAhcHJvdG8uaGFzT3duUHJvcGVydHkoZGVsZWdhdGVOYW1lKSkpIHtcbiAgICAgICAgZGVsZWdhdGUgPSBwcm90b1tkZWxlZ2F0ZU5hbWVdID0gcHJvdG9bbmFtZV07XG4gICAgICAgIC8vIGNoZWNrIHdoZXRoZXIgcHJvdG9bbmFtZV0gaXMgd3JpdGFibGVcbiAgICAgICAgLy8gc29tZSBwcm9wZXJ0eSBpcyByZWFkb25seSBpbiBzYWZhcmksIHN1Y2ggYXMgSHRtbENhbnZhc0VsZW1lbnQucHJvdG90eXBlLnRvQmxvYlxuICAgICAgICBjb25zdCBkZXNjID0gcHJvdG8gJiYgT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvLCBuYW1lKTtcbiAgICAgICAgaWYgKGlzUHJvcGVydHlXcml0YWJsZShkZXNjKSkge1xuICAgICAgICAgICAgY29uc3QgcGF0Y2hEZWxlZ2F0ZSA9IHBhdGNoRm4oZGVsZWdhdGUsIGRlbGVnYXRlTmFtZSwgbmFtZSk7XG4gICAgICAgICAgICBwcm90b1tuYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF0Y2hEZWxlZ2F0ZSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGF0dGFjaE9yaWdpblRvUGF0Y2hlZChwcm90b1tuYW1lXSwgZGVsZWdhdGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkZWxlZ2F0ZTtcbn1cbi8vIFRPRE86IEBKaWFMaVBhc3Npb24sIHN1cHBvcnQgY2FuY2VsIHRhc2sgbGF0ZXIgaWYgbmVjZXNzYXJ5XG5mdW5jdGlvbiBwYXRjaE1hY3JvVGFzayhvYmosIGZ1bmNOYW1lLCBtZXRhQ3JlYXRvcikge1xuICAgIGxldCBzZXROYXRpdmUgPSBudWxsO1xuICAgIGZ1bmN0aW9uIHNjaGVkdWxlVGFzayh0YXNrKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0YXNrLmRhdGE7XG4gICAgICAgIGRhdGEuYXJnc1tkYXRhLmNiSWR4XSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRhc2suaW52b2tlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgICAgIHNldE5hdGl2ZS5hcHBseShkYXRhLnRhcmdldCwgZGF0YS5hcmdzKTtcbiAgICAgICAgcmV0dXJuIHRhc2s7XG4gICAgfVxuICAgIHNldE5hdGl2ZSA9IHBhdGNoTWV0aG9kKG9iaiwgZnVuY05hbWUsIChkZWxlZ2F0ZSkgPT4gZnVuY3Rpb24gKHNlbGYsIGFyZ3MpIHtcbiAgICAgICAgY29uc3QgbWV0YSA9IG1ldGFDcmVhdG9yKHNlbGYsIGFyZ3MpO1xuICAgICAgICBpZiAobWV0YS5jYklkeCA+PSAwICYmIHR5cGVvZiBhcmdzW21ldGEuY2JJZHhdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gc2NoZWR1bGVNYWNyb1Rhc2tXaXRoQ3VycmVudFpvbmUobWV0YS5uYW1lLCBhcmdzW21ldGEuY2JJZHhdLCBtZXRhLCBzY2hlZHVsZVRhc2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gY2F1c2UgYW4gZXJyb3IgYnkgY2FsbGluZyBpdCBkaXJlY3RseS5cbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuZnVuY3Rpb24gYXR0YWNoT3JpZ2luVG9QYXRjaGVkKHBhdGNoZWQsIG9yaWdpbmFsKSB7XG4gICAgcGF0Y2hlZFt6b25lU3ltYm9sKCdPcmlnaW5hbERlbGVnYXRlJyldID0gb3JpZ2luYWw7XG59XG5sZXQgaXNEZXRlY3RlZElFT3JFZGdlID0gZmFsc2U7XG5sZXQgaWVPckVkZ2UgPSBmYWxzZTtcbmZ1bmN0aW9uIGlzSUUoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdWEgPSBpbnRlcm5hbFdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICAgICAgICBpZiAodWEuaW5kZXhPZignTVNJRSAnKSAhPT0gLTEgfHwgdWEuaW5kZXhPZignVHJpZGVudC8nKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5mdW5jdGlvbiBpc0lFT3JFZGdlKCkge1xuICAgIGlmIChpc0RldGVjdGVkSUVPckVkZ2UpIHtcbiAgICAgICAgcmV0dXJuIGllT3JFZGdlO1xuICAgIH1cbiAgICBpc0RldGVjdGVkSUVPckVkZ2UgPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHVhID0gaW50ZXJuYWxXaW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICAgICAgaWYgKHVhLmluZGV4T2YoJ01TSUUgJykgIT09IC0xIHx8IHVhLmluZGV4T2YoJ1RyaWRlbnQvJykgIT09IC0xIHx8IHVhLmluZGV4T2YoJ0VkZ2UvJykgIT09IC0xKSB7XG4gICAgICAgICAgICBpZU9yRWRnZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgfVxuICAgIHJldHVybiBpZU9yRWRnZTtcbn1cblxuWm9uZS5fX2xvYWRfcGF0Y2goJ1pvbmVBd2FyZVByb21pc2UnLCAoZ2xvYmFsLCBab25lLCBhcGkpID0+IHtcbiAgICBjb25zdCBPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuICAgIGNvbnN0IE9iamVjdERlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuICAgIGZ1bmN0aW9uIHJlYWRhYmxlT2JqZWN0VG9TdHJpbmcob2JqKSB7XG4gICAgICAgIGlmIChvYmogJiYgb2JqLnRvU3RyaW5nID09PSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKSB7XG4gICAgICAgICAgICBjb25zdCBjbGFzc05hbWUgPSBvYmouY29uc3RydWN0b3IgJiYgb2JqLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgICAgICByZXR1cm4gKGNsYXNzTmFtZSA/IGNsYXNzTmFtZSA6ICcnKSArICc6ICcgKyBKU09OLnN0cmluZ2lmeShvYmopO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmogPyBvYmoudG9TdHJpbmcoKSA6IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopO1xuICAgIH1cbiAgICBjb25zdCBfX3N5bWJvbF9fID0gYXBpLnN5bWJvbDtcbiAgICBjb25zdCBfdW5jYXVnaHRQcm9taXNlRXJyb3JzID0gW107XG4gICAgY29uc3QgaXNEaXNhYmxlV3JhcHBpbmdVbmNhdWdodFByb21pc2VSZWplY3Rpb24gPSBnbG9iYWxbX19zeW1ib2xfXygnRElTQUJMRV9XUkFQUElOR19VTkNBVUdIVF9QUk9NSVNFX1JFSkVDVElPTicpXSAhPT0gZmFsc2U7XG4gICAgY29uc3Qgc3ltYm9sUHJvbWlzZSA9IF9fc3ltYm9sX18oJ1Byb21pc2UnKTtcbiAgICBjb25zdCBzeW1ib2xUaGVuID0gX19zeW1ib2xfXygndGhlbicpO1xuICAgIGNvbnN0IGNyZWF0aW9uVHJhY2UgPSAnX19jcmVhdGlvblRyYWNlX18nO1xuICAgIGFwaS5vblVuaGFuZGxlZEVycm9yID0gKGUpID0+IHtcbiAgICAgICAgaWYgKGFwaS5zaG93VW5jYXVnaHRFcnJvcigpKSB7XG4gICAgICAgICAgICBjb25zdCByZWplY3Rpb24gPSBlICYmIGUucmVqZWN0aW9uO1xuICAgICAgICAgICAgaWYgKHJlamVjdGlvbikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1VuaGFuZGxlZCBQcm9taXNlIHJlamVjdGlvbjonLCByZWplY3Rpb24gaW5zdGFuY2VvZiBFcnJvciA/IHJlamVjdGlvbi5tZXNzYWdlIDogcmVqZWN0aW9uLCAnOyBab25lOicsIGUuem9uZS5uYW1lLCAnOyBUYXNrOicsIGUudGFzayAmJiBlLnRhc2suc291cmNlLCAnOyBWYWx1ZTonLCByZWplY3Rpb24sIHJlamVjdGlvbiBpbnN0YW5jZW9mIEVycm9yID8gcmVqZWN0aW9uLnN0YWNrIDogdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGFwaS5taWNyb3Rhc2tEcmFpbkRvbmUgPSAoKSA9PiB7XG4gICAgICAgIHdoaWxlIChfdW5jYXVnaHRQcm9taXNlRXJyb3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgdW5jYXVnaHRQcm9taXNlRXJyb3IgPSBfdW5jYXVnaHRQcm9taXNlRXJyb3JzLnNoaWZ0KCk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHVuY2F1Z2h0UHJvbWlzZUVycm9yLnpvbmUucnVuR3VhcmRlZCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1bmNhdWdodFByb21pc2VFcnJvci50aHJvd09yaWdpbmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB1bmNhdWdodFByb21pc2VFcnJvci5yZWplY3Rpb247XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgdW5jYXVnaHRQcm9taXNlRXJyb3I7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVVbmhhbmRsZWRSZWplY3Rpb24oZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBVTkhBTkRMRURfUFJPTUlTRV9SRUpFQ1RJT05fSEFORExFUl9TWU1CT0wgPSBfX3N5bWJvbF9fKCd1bmhhbmRsZWRQcm9taXNlUmVqZWN0aW9uSGFuZGxlcicpO1xuICAgIGZ1bmN0aW9uIGhhbmRsZVVuaGFuZGxlZFJlamVjdGlvbihlKSB7XG4gICAgICAgIGFwaS5vblVuaGFuZGxlZEVycm9yKGUpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IFpvbmVbVU5IQU5ETEVEX1BST01JU0VfUkVKRUNUSU9OX0hBTkRMRVJfU1lNQk9MXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gaXNUaGVuYWJsZSh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgJiYgdmFsdWUudGhlbjtcbiAgICB9XG4gICAgZnVuY3Rpb24gZm9yd2FyZFJlc29sdXRpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBmdW5jdGlvbiBmb3J3YXJkUmVqZWN0aW9uKHJlamVjdGlvbikge1xuICAgICAgICByZXR1cm4gWm9uZUF3YXJlUHJvbWlzZS5yZWplY3QocmVqZWN0aW9uKTtcbiAgICB9XG4gICAgY29uc3Qgc3ltYm9sU3RhdGUgPSBfX3N5bWJvbF9fKCdzdGF0ZScpO1xuICAgIGNvbnN0IHN5bWJvbFZhbHVlID0gX19zeW1ib2xfXygndmFsdWUnKTtcbiAgICBjb25zdCBzeW1ib2xGaW5hbGx5ID0gX19zeW1ib2xfXygnZmluYWxseScpO1xuICAgIGNvbnN0IHN5bWJvbFBhcmVudFByb21pc2VWYWx1ZSA9IF9fc3ltYm9sX18oJ3BhcmVudFByb21pc2VWYWx1ZScpO1xuICAgIGNvbnN0IHN5bWJvbFBhcmVudFByb21pc2VTdGF0ZSA9IF9fc3ltYm9sX18oJ3BhcmVudFByb21pc2VTdGF0ZScpO1xuICAgIGNvbnN0IHNvdXJjZSA9ICdQcm9taXNlLnRoZW4nO1xuICAgIGNvbnN0IFVOUkVTT0xWRUQgPSBudWxsO1xuICAgIGNvbnN0IFJFU09MVkVEID0gdHJ1ZTtcbiAgICBjb25zdCBSRUpFQ1RFRCA9IGZhbHNlO1xuICAgIGNvbnN0IFJFSkVDVEVEX05PX0NBVENIID0gMDtcbiAgICBmdW5jdGlvbiBtYWtlUmVzb2x2ZXIocHJvbWlzZSwgc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuICh2KSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJlc29sdmVQcm9taXNlKHByb21pc2UsIHN0YXRlLCB2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlUHJvbWlzZShwcm9taXNlLCBmYWxzZSwgZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIERvIG5vdCByZXR1cm4gdmFsdWUgb3IgeW91IHdpbGwgYnJlYWsgdGhlIFByb21pc2Ugc3BlYy5cbiAgICAgICAgfTtcbiAgICB9XG4gICAgY29uc3Qgb25jZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IHdhc0NhbGxlZCA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gd3JhcHBlcih3cmFwcGVkRnVuY3Rpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHdhc0NhbGxlZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHdhc0NhbGxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgd3JhcHBlZEZ1bmN0aW9uLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgIH07XG4gICAgY29uc3QgVFlQRV9FUlJPUiA9ICdQcm9taXNlIHJlc29sdmVkIHdpdGggaXRzZWxmJztcbiAgICBjb25zdCBDVVJSRU5UX1RBU0tfVFJBQ0VfU1lNQk9MID0gX19zeW1ib2xfXygnY3VycmVudFRhc2tUcmFjZScpO1xuICAgIC8vIFByb21pc2UgUmVzb2x1dGlvblxuICAgIGZ1bmN0aW9uIHJlc29sdmVQcm9taXNlKHByb21pc2UsIHN0YXRlLCB2YWx1ZSkge1xuICAgICAgICBjb25zdCBvbmNlV3JhcHBlciA9IG9uY2UoKTtcbiAgICAgICAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFRZUEVfRVJST1IpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9taXNlW3N5bWJvbFN0YXRlXSA9PT0gVU5SRVNPTFZFRCkge1xuICAgICAgICAgICAgLy8gc2hvdWxkIG9ubHkgZ2V0IHZhbHVlLnRoZW4gb25jZSBiYXNlZCBvbiBwcm9taXNlIHNwZWMuXG4gICAgICAgICAgICBsZXQgdGhlbiA9IG51bGw7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICB0aGVuID0gdmFsdWUgJiYgdmFsdWUudGhlbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgb25jZVdyYXBwZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlUHJvbWlzZShwcm9taXNlLCBmYWxzZSwgZXJyKTtcbiAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgKHZhbHVlIGluc3RhbmNlb2YgWm9uZUF3YXJlUHJvbWlzZSkge1xuICAgICAgICAgICAgaWYgKHN0YXRlICE9PSBSRUpFQ1RFRCAmJiB2YWx1ZSBpbnN0YW5jZW9mIFpvbmVBd2FyZVByb21pc2UgJiZcbiAgICAgICAgICAgICAgICB2YWx1ZS5oYXNPd25Qcm9wZXJ0eShzeW1ib2xTdGF0ZSkgJiYgdmFsdWUuaGFzT3duUHJvcGVydHkoc3ltYm9sVmFsdWUpICYmXG4gICAgICAgICAgICAgICAgdmFsdWVbc3ltYm9sU3RhdGVdICE9PSBVTlJFU09MVkVEKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJSZWplY3RlZE5vQ2F0Y2godmFsdWUpO1xuICAgICAgICAgICAgICAgIHJlc29sdmVQcm9taXNlKHByb21pc2UsIHZhbHVlW3N5bWJvbFN0YXRlXSwgdmFsdWVbc3ltYm9sVmFsdWVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHN0YXRlICE9PSBSRUpFQ1RFRCAmJiB0eXBlb2YgdGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgb25jZVdyYXBwZXIobWFrZVJlc29sdmVyKHByb21pc2UsIHN0YXRlKSksIG9uY2VXcmFwcGVyKG1ha2VSZXNvbHZlcihwcm9taXNlLCBmYWxzZSkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBvbmNlV3JhcHBlcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlUHJvbWlzZShwcm9taXNlLCBmYWxzZSwgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwcm9taXNlW3N5bWJvbFN0YXRlXSA9IHN0YXRlO1xuICAgICAgICAgICAgICAgIGNvbnN0IHF1ZXVlID0gcHJvbWlzZVtzeW1ib2xWYWx1ZV07XG4gICAgICAgICAgICAgICAgcHJvbWlzZVtzeW1ib2xWYWx1ZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAocHJvbWlzZVtzeW1ib2xGaW5hbGx5XSA9PT0gc3ltYm9sRmluYWxseSkge1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgcHJvbWlzZSBpcyBnZW5lcmF0ZWQgYnkgUHJvbWlzZS5wcm90b3R5cGUuZmluYWxseVxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGUgPT09IFJFU09MVkVEKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgc3RhdGUgaXMgcmVzb2x2ZWQsIHNob3VsZCBpZ25vcmUgdGhlIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhbmQgdXNlIHBhcmVudCBwcm9taXNlIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlW3N5bWJvbFN0YXRlXSA9IHByb21pc2Vbc3ltYm9sUGFyZW50UHJvbWlzZVN0YXRlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2Vbc3ltYm9sVmFsdWVdID0gcHJvbWlzZVtzeW1ib2xQYXJlbnRQcm9taXNlVmFsdWVdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHJlY29yZCB0YXNrIGluZm9ybWF0aW9uIGluIHZhbHVlIHdoZW4gZXJyb3Igb2NjdXJzLCBzbyB3ZSBjYW5cbiAgICAgICAgICAgICAgICAvLyBkbyBzb21lIGFkZGl0aW9uYWwgd29yayBzdWNoIGFzIHJlbmRlciBsb25nU3RhY2tUcmFjZVxuICAgICAgICAgICAgICAgIGlmIChzdGF0ZSA9PT0gUkVKRUNURUQgJiYgdmFsdWUgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiBsb25nU3RhY2tUcmFjZVpvbmUgaXMgaGVyZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0cmFjZSA9IFpvbmUuY3VycmVudFRhc2sgJiYgWm9uZS5jdXJyZW50VGFzay5kYXRhICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBab25lLmN1cnJlbnRUYXNrLmRhdGFbY3JlYXRpb25UcmFjZV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0cmFjZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gb25seSBrZWVwIHRoZSBsb25nIHN0YWNrIHRyYWNlIGludG8gZXJyb3Igd2hlbiBpbiBsb25nU3RhY2tUcmFjZVpvbmVcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdERlZmluZVByb3BlcnR5KHZhbHVlLCBDVVJSRU5UX1RBU0tfVFJBQ0VfU1lNQk9MLCB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCB2YWx1ZTogdHJhY2UgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7KSB7XG4gICAgICAgICAgICAgICAgICAgIHNjaGVkdWxlUmVzb2x2ZU9yUmVqZWN0KHByb21pc2UsIHF1ZXVlW2krK10sIHF1ZXVlW2krK10sIHF1ZXVlW2krK10sIHF1ZXVlW2krK10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID09IDAgJiYgc3RhdGUgPT0gUkVKRUNURUQpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZVtzeW1ib2xTdGF0ZV0gPSBSRUpFQ1RFRF9OT19DQVRDSDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHVuY2F1Z2h0UHJvbWlzZUVycm9yID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBIZXJlIHdlIHRocm93cyBhIG5ldyBFcnJvciB0byBwcmludCBtb3JlIHJlYWRhYmxlIGVycm9yIGxvZ1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYW5kIGlmIHRoZSB2YWx1ZSBpcyBub3QgYW4gZXJyb3IsIHpvbmUuanMgYnVpbGRzIGFuIGBFcnJvcmBcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9iamVjdCBoZXJlIHRvIGF0dGFjaCB0aGUgc3RhY2sgaW5mb3JtYXRpb24uXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuY2F1Z2h0IChpbiBwcm9taXNlKTogJyArIHJlYWRhYmxlT2JqZWN0VG9TdHJpbmcodmFsdWUpICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAodmFsdWUgJiYgdmFsdWUuc3RhY2sgPyAnXFxuJyArIHZhbHVlLnN0YWNrIDogJycpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1bmNhdWdodFByb21pc2VFcnJvciA9IGVycjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNEaXNhYmxlV3JhcHBpbmdVbmNhdWdodFByb21pc2VSZWplY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIGRpc2FibGUgd3JhcHBpbmcgdW5jYXVnaHQgcHJvbWlzZSByZWplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVzZSB0aGUgdmFsdWUgaW5zdGVhZCBvZiB3cmFwcGluZyBpdC5cbiAgICAgICAgICAgICAgICAgICAgICAgIHVuY2F1Z2h0UHJvbWlzZUVycm9yLnRocm93T3JpZ2luYWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHVuY2F1Z2h0UHJvbWlzZUVycm9yLnJlamVjdGlvbiA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB1bmNhdWdodFByb21pc2VFcnJvci5wcm9taXNlID0gcHJvbWlzZTtcbiAgICAgICAgICAgICAgICAgICAgdW5jYXVnaHRQcm9taXNlRXJyb3Iuem9uZSA9IFpvbmUuY3VycmVudDtcbiAgICAgICAgICAgICAgICAgICAgdW5jYXVnaHRQcm9taXNlRXJyb3IudGFzayA9IFpvbmUuY3VycmVudFRhc2s7XG4gICAgICAgICAgICAgICAgICAgIF91bmNhdWdodFByb21pc2VFcnJvcnMucHVzaCh1bmNhdWdodFByb21pc2VFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIGFwaS5zY2hlZHVsZU1pY3JvVGFzaygpOyAvLyB0byBtYWtlIHN1cmUgdGhhdCBpdCBpcyBydW5uaW5nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFJlc29sdmluZyBhbiBhbHJlYWR5IHJlc29sdmVkIHByb21pc2UgaXMgYSBub29wLlxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG4gICAgY29uc3QgUkVKRUNUSU9OX0hBTkRMRURfSEFORExFUiA9IF9fc3ltYm9sX18oJ3JlamVjdGlvbkhhbmRsZWRIYW5kbGVyJyk7XG4gICAgZnVuY3Rpb24gY2xlYXJSZWplY3RlZE5vQ2F0Y2gocHJvbWlzZSkge1xuICAgICAgICBpZiAocHJvbWlzZVtzeW1ib2xTdGF0ZV0gPT09IFJFSkVDVEVEX05PX0NBVENIKSB7XG4gICAgICAgICAgICAvLyBpZiB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCBubyBjYXRjaCBzdGF0dXNcbiAgICAgICAgICAgIC8vIGFuZCBxdWV1ZS5sZW5ndGggPiAwLCBtZWFucyB0aGVyZSBpcyBhIGVycm9yIGhhbmRsZXJcbiAgICAgICAgICAgIC8vIGhlcmUgdG8gaGFuZGxlIHRoZSByZWplY3RlZCBwcm9taXNlLCB3ZSBzaG91bGQgdHJpZ2dlclxuICAgICAgICAgICAgLy8gd2luZG93cy5yZWplY3Rpb25oYW5kbGVkIGV2ZW50SGFuZGxlciBvciBub2RlanMgcmVqZWN0aW9uSGFuZGxlZFxuICAgICAgICAgICAgLy8gZXZlbnRIYW5kbGVyXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBab25lW1JFSkVDVElPTl9IQU5ETEVEX0hBTkRMRVJdO1xuICAgICAgICAgICAgICAgIGlmIChoYW5kbGVyICYmIHR5cGVvZiBoYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCB7IHJlamVjdGlvbjogcHJvbWlzZVtzeW1ib2xWYWx1ZV0sIHByb21pc2U6IHByb21pc2UgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvbWlzZVtzeW1ib2xTdGF0ZV0gPSBSRUpFQ1RFRDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgX3VuY2F1Z2h0UHJvbWlzZUVycm9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChwcm9taXNlID09PSBfdW5jYXVnaHRQcm9taXNlRXJyb3JzW2ldLnByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgX3VuY2F1Z2h0UHJvbWlzZUVycm9ycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNjaGVkdWxlUmVzb2x2ZU9yUmVqZWN0KHByb21pc2UsIHpvbmUsIGNoYWluUHJvbWlzZSwgb25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbiAgICAgICAgY2xlYXJSZWplY3RlZE5vQ2F0Y2gocHJvbWlzZSk7XG4gICAgICAgIGNvbnN0IHByb21pc2VTdGF0ZSA9IHByb21pc2Vbc3ltYm9sU3RhdGVdO1xuICAgICAgICBjb25zdCBkZWxlZ2F0ZSA9IHByb21pc2VTdGF0ZSA/XG4gICAgICAgICAgICAodHlwZW9mIG9uRnVsZmlsbGVkID09PSAnZnVuY3Rpb24nKSA/IG9uRnVsZmlsbGVkIDogZm9yd2FyZFJlc29sdXRpb24gOlxuICAgICAgICAgICAgKHR5cGVvZiBvblJlamVjdGVkID09PSAnZnVuY3Rpb24nKSA/IG9uUmVqZWN0ZWQgOlxuICAgICAgICAgICAgICAgIGZvcndhcmRSZWplY3Rpb247XG4gICAgICAgIHpvbmUuc2NoZWR1bGVNaWNyb1Rhc2soc291cmNlLCAoKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudFByb21pc2VWYWx1ZSA9IHByb21pc2Vbc3ltYm9sVmFsdWVdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzRmluYWxseVByb21pc2UgPSAhIWNoYWluUHJvbWlzZSAmJiBzeW1ib2xGaW5hbGx5ID09PSBjaGFpblByb21pc2Vbc3ltYm9sRmluYWxseV07XG4gICAgICAgICAgICAgICAgaWYgKGlzRmluYWxseVByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIHByb21pc2UgaXMgZ2VuZXJhdGVkIGZyb20gZmluYWxseSBjYWxsLCBrZWVwIHBhcmVudCBwcm9taXNlJ3Mgc3RhdGUgYW5kIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIGNoYWluUHJvbWlzZVtzeW1ib2xQYXJlbnRQcm9taXNlVmFsdWVdID0gcGFyZW50UHJvbWlzZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBjaGFpblByb21pc2Vbc3ltYm9sUGFyZW50UHJvbWlzZVN0YXRlXSA9IHByb21pc2VTdGF0ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gc2hvdWxkIG5vdCBwYXNzIHZhbHVlIHRvIGZpbmFsbHkgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHpvbmUucnVuKGRlbGVnYXRlLCB1bmRlZmluZWQsIGlzRmluYWxseVByb21pc2UgJiYgZGVsZWdhdGUgIT09IGZvcndhcmRSZWplY3Rpb24gJiYgZGVsZWdhdGUgIT09IGZvcndhcmRSZXNvbHV0aW9uID9cbiAgICAgICAgICAgICAgICAgICAgW10gOlxuICAgICAgICAgICAgICAgICAgICBbcGFyZW50UHJvbWlzZVZhbHVlXSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZVByb21pc2UoY2hhaW5Qcm9taXNlLCB0cnVlLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiBlcnJvciBvY2N1cnMsIHNob3VsZCBhbHdheXMgcmV0dXJuIHRoaXMgZXJyb3JcbiAgICAgICAgICAgICAgICByZXNvbHZlUHJvbWlzZShjaGFpblByb21pc2UsIGZhbHNlLCBlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIGNoYWluUHJvbWlzZSk7XG4gICAgfVxuICAgIGNvbnN0IFpPTkVfQVdBUkVfUFJPTUlTRV9UT19TVFJJTkcgPSAnZnVuY3Rpb24gWm9uZUF3YXJlUHJvbWlzZSgpIHsgW25hdGl2ZSBjb2RlXSB9JztcbiAgICBjb25zdCBub29wID0gZnVuY3Rpb24gKCkgeyB9O1xuICAgIGNvbnN0IEFnZ3JlZ2F0ZUVycm9yID0gZ2xvYmFsLkFnZ3JlZ2F0ZUVycm9yO1xuICAgIGNsYXNzIFpvbmVBd2FyZVByb21pc2Uge1xuICAgICAgICBzdGF0aWMgdG9TdHJpbmcoKSB7XG4gICAgICAgICAgICByZXR1cm4gWk9ORV9BV0FSRV9QUk9NSVNFX1RPX1NUUklORztcbiAgICAgICAgfVxuICAgICAgICBzdGF0aWMgcmVzb2x2ZSh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgWm9uZUF3YXJlUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlUHJvbWlzZShuZXcgdGhpcyhudWxsKSwgUkVTT0xWRUQsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBzdGF0aWMgcmVqZWN0KGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZVByb21pc2UobmV3IHRoaXMobnVsbCksIFJFSkVDVEVELCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGljIHdpdGhSZXNvbHZlcnMoKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICAgICAgICAgIHJlc3VsdC5wcm9taXNlID0gbmV3IFpvbmVBd2FyZVByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnJlc29sdmUgPSByZXM7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnJlamVjdCA9IHJlajtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICBzdGF0aWMgYW55KHZhbHVlcykge1xuICAgICAgICAgICAgaWYgKCF2YWx1ZXMgfHwgdHlwZW9mIHZhbHVlc1tTeW1ib2wuaXRlcmF0b3JdICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBBZ2dyZWdhdGVFcnJvcihbXSwgJ0FsbCBwcm9taXNlcyB3ZXJlIHJlamVjdGVkJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcHJvbWlzZXMgPSBbXTtcbiAgICAgICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHYgb2YgdmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgIHByb21pc2VzLnB1c2goWm9uZUF3YXJlUHJvbWlzZS5yZXNvbHZlKHYpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBBZ2dyZWdhdGVFcnJvcihbXSwgJ0FsbCBwcm9taXNlcyB3ZXJlIHJlamVjdGVkJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBBZ2dyZWdhdGVFcnJvcihbXSwgJ0FsbCBwcm9taXNlcyB3ZXJlIHJlamVjdGVkJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGZpbmlzaGVkID0gZmFsc2U7XG4gICAgICAgICAgICBjb25zdCBlcnJvcnMgPSBbXTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgWm9uZUF3YXJlUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9taXNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBwcm9taXNlc1tpXS50aGVuKHYgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbmlzaGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh2KTtcbiAgICAgICAgICAgICAgICAgICAgfSwgZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudC0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgQWdncmVnYXRlRXJyb3IoZXJyb3JzLCAnQWxsIHByb21pc2VzIHdlcmUgcmVqZWN0ZWQnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIDtcbiAgICAgICAgc3RhdGljIHJhY2UodmFsdWVzKSB7XG4gICAgICAgICAgICBsZXQgcmVzb2x2ZTtcbiAgICAgICAgICAgIGxldCByZWplY3Q7XG4gICAgICAgICAgICBsZXQgcHJvbWlzZSA9IG5ldyB0aGlzKChyZXMsIHJlaikgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUgPSByZXM7XG4gICAgICAgICAgICAgICAgcmVqZWN0ID0gcmVqO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmdW5jdGlvbiBvblJlc29sdmUodmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIG9uUmVqZWN0KGVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IHZhbHVlIG9mIHZhbHVlcykge1xuICAgICAgICAgICAgICAgIGlmICghaXNUaGVuYWJsZSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLnJlc29sdmUodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YWx1ZS50aGVuKG9uUmVzb2x2ZSwgb25SZWplY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGljIGFsbCh2YWx1ZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBab25lQXdhcmVQcm9taXNlLmFsbFdpdGhDYWxsYmFjayh2YWx1ZXMpO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRpYyBhbGxTZXR0bGVkKHZhbHVlcykge1xuICAgICAgICAgICAgY29uc3QgUCA9IHRoaXMgJiYgdGhpcy5wcm90b3R5cGUgaW5zdGFuY2VvZiBab25lQXdhcmVQcm9taXNlID8gdGhpcyA6IFpvbmVBd2FyZVByb21pc2U7XG4gICAgICAgICAgICByZXR1cm4gUC5hbGxXaXRoQ2FsbGJhY2sodmFsdWVzLCB7XG4gICAgICAgICAgICAgICAgdGhlbkNhbGxiYWNrOiAodmFsdWUpID0+ICh7IHN0YXR1czogJ2Z1bGZpbGxlZCcsIHZhbHVlIH0pLFxuICAgICAgICAgICAgICAgIGVycm9yQ2FsbGJhY2s6IChlcnIpID0+ICh7IHN0YXR1czogJ3JlamVjdGVkJywgcmVhc29uOiBlcnIgfSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRpYyBhbGxXaXRoQ2FsbGJhY2sodmFsdWVzLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgbGV0IHJlc29sdmU7XG4gICAgICAgICAgICBsZXQgcmVqZWN0O1xuICAgICAgICAgICAgbGV0IHByb21pc2UgPSBuZXcgdGhpcygocmVzLCByZWopID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlID0gcmVzO1xuICAgICAgICAgICAgICAgIHJlamVjdCA9IHJlajtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gU3RhcnQgYXQgMiB0byBwcmV2ZW50IHByZW1hdHVyZWx5IHJlc29sdmluZyBpZiAudGhlbiBpcyBjYWxsZWQgaW1tZWRpYXRlbHkuXG4gICAgICAgICAgICBsZXQgdW5yZXNvbHZlZENvdW50ID0gMjtcbiAgICAgICAgICAgIGxldCB2YWx1ZUluZGV4ID0gMDtcbiAgICAgICAgICAgIGNvbnN0IHJlc29sdmVkVmFsdWVzID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCB2YWx1ZSBvZiB2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWlzVGhlbmFibGUodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5yZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgY3VyVmFsdWVJbmRleCA9IHZhbHVlSW5kZXg7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUudGhlbigodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmVkVmFsdWVzW2N1clZhbHVlSW5kZXhdID0gY2FsbGJhY2sgPyBjYWxsYmFjay50aGVuQ2FsbGJhY2sodmFsdWUpIDogdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB1bnJlc29sdmVkQ291bnQtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1bnJlc29sdmVkQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc29sdmVkVmFsdWVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZWRWYWx1ZXNbY3VyVmFsdWVJbmRleF0gPSBjYWxsYmFjay5lcnJvckNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5yZXNvbHZlZENvdW50LS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVucmVzb2x2ZWRDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc29sdmVkVmFsdWVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAodGhlbkVycikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QodGhlbkVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHVucmVzb2x2ZWRDb3VudCsrO1xuICAgICAgICAgICAgICAgIHZhbHVlSW5kZXgrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIE1ha2UgdGhlIHVucmVzb2x2ZWRDb3VudCB6ZXJvLWJhc2VkIGFnYWluLlxuICAgICAgICAgICAgdW5yZXNvbHZlZENvdW50IC09IDI7XG4gICAgICAgICAgICBpZiAodW5yZXNvbHZlZENvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNvbHZlZFZhbHVlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdHJ1Y3RvcihleGVjdXRvcikge1xuICAgICAgICAgICAgY29uc3QgcHJvbWlzZSA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoIShwcm9taXNlIGluc3RhbmNlb2YgWm9uZUF3YXJlUHJvbWlzZSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ011c3QgYmUgYW4gaW5zdGFuY2VvZiBQcm9taXNlLicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvbWlzZVtzeW1ib2xTdGF0ZV0gPSBVTlJFU09MVkVEO1xuICAgICAgICAgICAgcHJvbWlzZVtzeW1ib2xWYWx1ZV0gPSBbXTsgLy8gcXVldWU7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9uY2VXcmFwcGVyID0gb25jZSgpO1xuICAgICAgICAgICAgICAgIGV4ZWN1dG9yICYmXG4gICAgICAgICAgICAgICAgICAgIGV4ZWN1dG9yKG9uY2VXcmFwcGVyKG1ha2VSZXNvbHZlcihwcm9taXNlLCBSRVNPTFZFRCkpLCBvbmNlV3JhcHBlcihtYWtlUmVzb2x2ZXIocHJvbWlzZSwgUkVKRUNURUQpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlUHJvbWlzZShwcm9taXNlLCBmYWxzZSwgZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHtcbiAgICAgICAgICAgIHJldHVybiAnUHJvbWlzZSc7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IFtTeW1ib2wuc3BlY2llc10oKSB7XG4gICAgICAgICAgICByZXR1cm4gWm9uZUF3YXJlUHJvbWlzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gICAgICAgICAgICAvLyBXZSBtdXN0IHJlYWQgYFN5bWJvbC5zcGVjaWVzYCBzYWZlbHkgYmVjYXVzZSBgdGhpc2AgbWF5IGJlIGFueXRoaW5nLiBGb3IgaW5zdGFuY2UsIGB0aGlzYFxuICAgICAgICAgICAgLy8gbWF5IGJlIGFuIG9iamVjdCB3aXRob3V0IGEgcHJvdG90eXBlIChjcmVhdGVkIHRocm91Z2ggYE9iamVjdC5jcmVhdGUobnVsbClgKTsgdGh1c1xuICAgICAgICAgICAgLy8gYHRoaXMuY29uc3RydWN0b3JgIHdpbGwgYmUgdW5kZWZpbmVkLiBPbmUgb2YgdGhlIHVzZSBjYXNlcyBpcyBTeXN0ZW1KUyBjcmVhdGluZ1xuICAgICAgICAgICAgLy8gcHJvdG90eXBlLWxlc3Mgb2JqZWN0cyAobW9kdWxlcykgdmlhIGBPYmplY3QuY3JlYXRlKG51bGwpYC4gVGhlIFN5c3RlbUpTIGNyZWF0ZXMgYW4gZW1wdHlcbiAgICAgICAgICAgIC8vIG9iamVjdCBhbmQgY29waWVzIHByb21pc2UgcHJvcGVydGllcyBpbnRvIHRoYXQgb2JqZWN0ICh3aXRoaW4gdGhlIGBnZXRPckNyZWF0ZUxvYWRgXG4gICAgICAgICAgICAvLyBmdW5jdGlvbikuIFRoZSB6b25lLmpzIHRoZW4gY2hlY2tzIGlmIHRoZSByZXNvbHZlZCB2YWx1ZSBoYXMgdGhlIGB0aGVuYCBtZXRob2QgYW5kIGludm9rZXNcbiAgICAgICAgICAgIC8vIGl0IHdpdGggdGhlIGB2YWx1ZWAgY29udGV4dC4gT3RoZXJ3aXNlLCB0aGlzIHdpbGwgdGhyb3cgYW4gZXJyb3I6IGBUeXBlRXJyb3I6IENhbm5vdCByZWFkXG4gICAgICAgICAgICAvLyBwcm9wZXJ0aWVzIG9mIHVuZGVmaW5lZCAocmVhZGluZyAnU3ltYm9sKFN5bWJvbC5zcGVjaWVzKScpYC5cbiAgICAgICAgICAgIGxldCBDID0gdGhpcy5jb25zdHJ1Y3Rvcj8uW1N5bWJvbC5zcGVjaWVzXTtcbiAgICAgICAgICAgIGlmICghQyB8fCB0eXBlb2YgQyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIEMgPSB0aGlzLmNvbnN0cnVjdG9yIHx8IFpvbmVBd2FyZVByb21pc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBjaGFpblByb21pc2UgPSBuZXcgQyhub29wKTtcbiAgICAgICAgICAgIGNvbnN0IHpvbmUgPSBab25lLmN1cnJlbnQ7XG4gICAgICAgICAgICBpZiAodGhpc1tzeW1ib2xTdGF0ZV0gPT0gVU5SRVNPTFZFRCkge1xuICAgICAgICAgICAgICAgIHRoaXNbc3ltYm9sVmFsdWVdLnB1c2goem9uZSwgY2hhaW5Qcm9taXNlLCBvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzY2hlZHVsZVJlc29sdmVPclJlamVjdCh0aGlzLCB6b25lLCBjaGFpblByb21pc2UsIG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjaGFpblByb21pc2U7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2gob25SZWplY3RlZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGVkKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5KG9uRmluYWxseSkge1xuICAgICAgICAgICAgLy8gU2VlIGNvbW1lbnQgb24gdGhlIGNhbGwgdG8gYHRoZW5gIGFib3V0IHdoeSB0aGVlIGBTeW1ib2wuc3BlY2llc2AgaXMgc2FmZWx5IGFjY2Vzc2VkLlxuICAgICAgICAgICAgbGV0IEMgPSB0aGlzLmNvbnN0cnVjdG9yPy5bU3ltYm9sLnNwZWNpZXNdO1xuICAgICAgICAgICAgaWYgKCFDIHx8IHR5cGVvZiBDICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgQyA9IFpvbmVBd2FyZVByb21pc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBjaGFpblByb21pc2UgPSBuZXcgQyhub29wKTtcbiAgICAgICAgICAgIGNoYWluUHJvbWlzZVtzeW1ib2xGaW5hbGx5XSA9IHN5bWJvbEZpbmFsbHk7XG4gICAgICAgICAgICBjb25zdCB6b25lID0gWm9uZS5jdXJyZW50O1xuICAgICAgICAgICAgaWYgKHRoaXNbc3ltYm9sU3RhdGVdID09IFVOUkVTT0xWRUQpIHtcbiAgICAgICAgICAgICAgICB0aGlzW3N5bWJvbFZhbHVlXS5wdXNoKHpvbmUsIGNoYWluUHJvbWlzZSwgb25GaW5hbGx5LCBvbkZpbmFsbHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc2NoZWR1bGVSZXNvbHZlT3JSZWplY3QodGhpcywgem9uZSwgY2hhaW5Qcm9taXNlLCBvbkZpbmFsbHksIG9uRmluYWxseSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2hhaW5Qcm9taXNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFByb3RlY3QgYWdhaW5zdCBhZ2dyZXNzaXZlIG9wdGltaXplcnMgZHJvcHBpbmcgc2VlbWluZ2x5IHVudXNlZCBwcm9wZXJ0aWVzLlxuICAgIC8vIEUuZy4gQ2xvc3VyZSBDb21waWxlciBpbiBhZHZhbmNlZCBtb2RlLlxuICAgIFpvbmVBd2FyZVByb21pc2VbJ3Jlc29sdmUnXSA9IFpvbmVBd2FyZVByb21pc2UucmVzb2x2ZTtcbiAgICBab25lQXdhcmVQcm9taXNlWydyZWplY3QnXSA9IFpvbmVBd2FyZVByb21pc2UucmVqZWN0O1xuICAgIFpvbmVBd2FyZVByb21pc2VbJ3JhY2UnXSA9IFpvbmVBd2FyZVByb21pc2UucmFjZTtcbiAgICBab25lQXdhcmVQcm9taXNlWydhbGwnXSA9IFpvbmVBd2FyZVByb21pc2UuYWxsO1xuICAgIGNvbnN0IE5hdGl2ZVByb21pc2UgPSBnbG9iYWxbc3ltYm9sUHJvbWlzZV0gPSBnbG9iYWxbJ1Byb21pc2UnXTtcbiAgICBnbG9iYWxbJ1Byb21pc2UnXSA9IFpvbmVBd2FyZVByb21pc2U7XG4gICAgY29uc3Qgc3ltYm9sVGhlblBhdGNoZWQgPSBfX3N5bWJvbF9fKCd0aGVuUGF0Y2hlZCcpO1xuICAgIGZ1bmN0aW9uIHBhdGNoVGhlbihDdG9yKSB7XG4gICAgICAgIGNvbnN0IHByb3RvID0gQ3Rvci5wcm90b3R5cGU7XG4gICAgICAgIGNvbnN0IHByb3AgPSBPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG8sICd0aGVuJyk7XG4gICAgICAgIGlmIChwcm9wICYmIChwcm9wLndyaXRhYmxlID09PSBmYWxzZSB8fCAhcHJvcC5jb25maWd1cmFibGUpKSB7XG4gICAgICAgICAgICAvLyBjaGVjayBDdG9yLnByb3RvdHlwZS50aGVuIHByb3BlcnR5RGVzY3JpcHRvciBpcyB3cml0YWJsZSBvciBub3RcbiAgICAgICAgICAgIC8vIGluIG1ldGVvciBlbnYsIHdyaXRhYmxlIGlzIGZhbHNlLCB3ZSBzaG91bGQgaWdub3JlIHN1Y2ggY2FzZVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9yaWdpbmFsVGhlbiA9IHByb3RvLnRoZW47XG4gICAgICAgIC8vIEtlZXAgYSByZWZlcmVuY2UgdG8gdGhlIG9yaWdpbmFsIG1ldGhvZC5cbiAgICAgICAgcHJvdG9bc3ltYm9sVGhlbl0gPSBvcmlnaW5hbFRoZW47XG4gICAgICAgIEN0b3IucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbiAob25SZXNvbHZlLCBvblJlamVjdCkge1xuICAgICAgICAgICAgY29uc3Qgd3JhcHBlZCA9IG5ldyBab25lQXdhcmVQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFRoZW4uY2FsbCh0aGlzLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gd3JhcHBlZC50aGVuKG9uUmVzb2x2ZSwgb25SZWplY3QpO1xuICAgICAgICB9O1xuICAgICAgICBDdG9yW3N5bWJvbFRoZW5QYXRjaGVkXSA9IHRydWU7XG4gICAgfVxuICAgIGFwaS5wYXRjaFRoZW4gPSBwYXRjaFRoZW47XG4gICAgZnVuY3Rpb24gem9uZWlmeShmbikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHNlbGYsIGFyZ3MpIHtcbiAgICAgICAgICAgIGxldCByZXN1bHRQcm9taXNlID0gZm4uYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICAgICAgICBpZiAocmVzdWx0UHJvbWlzZSBpbnN0YW5jZW9mIFpvbmVBd2FyZVByb21pc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0UHJvbWlzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBjdG9yID0gcmVzdWx0UHJvbWlzZS5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgIGlmICghY3RvcltzeW1ib2xUaGVuUGF0Y2hlZF0pIHtcbiAgICAgICAgICAgICAgICBwYXRjaFRoZW4oY3Rvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0UHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgaWYgKE5hdGl2ZVByb21pc2UpIHtcbiAgICAgICAgcGF0Y2hUaGVuKE5hdGl2ZVByb21pc2UpO1xuICAgICAgICBwYXRjaE1ldGhvZChnbG9iYWwsICdmZXRjaCcsIGRlbGVnYXRlID0+IHpvbmVpZnkoZGVsZWdhdGUpKTtcbiAgICB9XG4gICAgLy8gVGhpcyBpcyBub3QgcGFydCBvZiBwdWJsaWMgQVBJLCBidXQgaXQgaXMgdXNlZnVsIGZvciB0ZXN0cywgc28gd2UgZXhwb3NlIGl0LlxuICAgIFByb21pc2VbWm9uZS5fX3N5bWJvbF9fKCd1bmNhdWdodFByb21pc2VFcnJvcnMnKV0gPSBfdW5jYXVnaHRQcm9taXNlRXJyb3JzO1xuICAgIHJldHVybiBab25lQXdhcmVQcm9taXNlO1xufSk7XG5cbi8vIG92ZXJyaWRlIEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZyB0byBtYWtlIHpvbmUuanMgcGF0Y2hlZCBmdW5jdGlvblxuLy8gbG9vayBsaWtlIG5hdGl2ZSBmdW5jdGlvblxuWm9uZS5fX2xvYWRfcGF0Y2goJ3RvU3RyaW5nJywgKGdsb2JhbCkgPT4ge1xuICAgIC8vIHBhdGNoIEZ1bmMucHJvdG90eXBlLnRvU3RyaW5nIHRvIGxldCB0aGVtIGxvb2sgbGlrZSBuYXRpdmVcbiAgICBjb25zdCBvcmlnaW5hbEZ1bmN0aW9uVG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmc7XG4gICAgY29uc3QgT1JJR0lOQUxfREVMRUdBVEVfU1lNQk9MID0gem9uZVN5bWJvbCgnT3JpZ2luYWxEZWxlZ2F0ZScpO1xuICAgIGNvbnN0IFBST01JU0VfU1lNQk9MID0gem9uZVN5bWJvbCgnUHJvbWlzZScpO1xuICAgIGNvbnN0IEVSUk9SX1NZTUJPTCA9IHpvbmVTeW1ib2woJ0Vycm9yJyk7XG4gICAgY29uc3QgbmV3RnVuY3Rpb25Ub1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsRGVsZWdhdGUgPSB0aGlzW09SSUdJTkFMX0RFTEVHQVRFX1NZTUJPTF07XG4gICAgICAgICAgICBpZiAob3JpZ2luYWxEZWxlZ2F0ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3JpZ2luYWxEZWxlZ2F0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxGdW5jdGlvblRvU3RyaW5nLmNhbGwob3JpZ2luYWxEZWxlZ2F0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9yaWdpbmFsRGVsZWdhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzID09PSBQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmF0aXZlUHJvbWlzZSA9IGdsb2JhbFtQUk9NSVNFX1NZTUJPTF07XG4gICAgICAgICAgICAgICAgaWYgKG5hdGl2ZVByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsRnVuY3Rpb25Ub1N0cmluZy5jYWxsKG5hdGl2ZVByb21pc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzID09PSBFcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5hdGl2ZUVycm9yID0gZ2xvYmFsW0VSUk9SX1NZTUJPTF07XG4gICAgICAgICAgICAgICAgaWYgKG5hdGl2ZUVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEZ1bmN0aW9uVG9TdHJpbmcuY2FsbChuYXRpdmVFcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcmlnaW5hbEZ1bmN0aW9uVG9TdHJpbmcuY2FsbCh0aGlzKTtcbiAgICB9O1xuICAgIG5ld0Z1bmN0aW9uVG9TdHJpbmdbT1JJR0lOQUxfREVMRUdBVEVfU1lNQk9MXSA9IG9yaWdpbmFsRnVuY3Rpb25Ub1N0cmluZztcbiAgICBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmcgPSBuZXdGdW5jdGlvblRvU3RyaW5nO1xuICAgIC8vIHBhdGNoIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcgdG8gbGV0IHRoZW0gbG9vayBsaWtlIG5hdGl2ZVxuICAgIGNvbnN0IG9yaWdpbmFsT2JqZWN0VG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuICAgIGNvbnN0IFBST01JU0VfT0JKRUNUX1RPX1NUUklORyA9ICdbb2JqZWN0IFByb21pc2VdJztcbiAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodHlwZW9mIFByb21pc2UgPT09ICdmdW5jdGlvbicgJiYgdGhpcyBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBQUk9NSVNFX09CSkVDVF9UT19TVFJJTkc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsT2JqZWN0VG9TdHJpbmcuY2FsbCh0aGlzKTtcbiAgICB9O1xufSk7XG5cbi8qKlxuICogQGZpbGVvdmVydmlld1xuICogQHN1cHByZXNzIHttaXNzaW5nUmVxdWlyZX1cbiAqL1xubGV0IHBhc3NpdmVTdXBwb3J0ZWQgPSBmYWxzZTtcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdwYXNzaXZlJywge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcGFzc2l2ZVN1cHBvcnRlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBOb3RlOiBXZSBwYXNzIHRoZSBgb3B0aW9uc2Agb2JqZWN0IGFzIHRoZSBldmVudCBoYW5kbGVyIHRvby4gVGhpcyBpcyBub3QgY29tcGF0aWJsZSB3aXRoIHRoZVxuICAgICAgICAvLyBzaWduYXR1cmUgb2YgYGFkZEV2ZW50TGlzdGVuZXJgIG9yIGByZW1vdmVFdmVudExpc3RlbmVyYCBidXQgZW5hYmxlcyB1cyB0byByZW1vdmUgdGhlIGhhbmRsZXJcbiAgICAgICAgLy8gd2l0aG91dCBhbiBhY3R1YWwgaGFuZGxlci5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Rlc3QnLCBvcHRpb25zLCBvcHRpb25zKTtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Rlc3QnLCBvcHRpb25zLCBvcHRpb25zKTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgICBwYXNzaXZlU3VwcG9ydGVkID0gZmFsc2U7XG4gICAgfVxufVxuLy8gYW4gaWRlbnRpZmllciB0byB0ZWxsIFpvbmVUYXNrIGRvIG5vdCBjcmVhdGUgYSBuZXcgaW52b2tlIGNsb3N1cmVcbmNvbnN0IE9QVElNSVpFRF9aT05FX0VWRU5UX1RBU0tfREFUQSA9IHtcbiAgICB1c2VHOiB0cnVlXG59O1xuY29uc3Qgem9uZVN5bWJvbEV2ZW50TmFtZXMgPSB7fTtcbmNvbnN0IGdsb2JhbFNvdXJjZXMgPSB7fTtcbmNvbnN0IEVWRU5UX05BTUVfU1lNQk9MX1JFR1ggPSBuZXcgUmVnRXhwKCdeJyArIFpPTkVfU1lNQk9MX1BSRUZJWCArICcoXFxcXHcrKSh0cnVlfGZhbHNlKSQnKTtcbmNvbnN0IElNTUVESUFURV9QUk9QQUdBVElPTl9TWU1CT0wgPSB6b25lU3ltYm9sKCdwcm9wYWdhdGlvblN0b3BwZWQnKTtcbmZ1bmN0aW9uIHByZXBhcmVFdmVudE5hbWVzKGV2ZW50TmFtZSwgZXZlbnROYW1lVG9TdHJpbmcpIHtcbiAgICBjb25zdCBmYWxzZUV2ZW50TmFtZSA9IChldmVudE5hbWVUb1N0cmluZyA/IGV2ZW50TmFtZVRvU3RyaW5nKGV2ZW50TmFtZSkgOiBldmVudE5hbWUpICsgRkFMU0VfU1RSO1xuICAgIGNvbnN0IHRydWVFdmVudE5hbWUgPSAoZXZlbnROYW1lVG9TdHJpbmcgPyBldmVudE5hbWVUb1N0cmluZyhldmVudE5hbWUpIDogZXZlbnROYW1lKSArIFRSVUVfU1RSO1xuICAgIGNvbnN0IHN5bWJvbCA9IFpPTkVfU1lNQk9MX1BSRUZJWCArIGZhbHNlRXZlbnROYW1lO1xuICAgIGNvbnN0IHN5bWJvbENhcHR1cmUgPSBaT05FX1NZTUJPTF9QUkVGSVggKyB0cnVlRXZlbnROYW1lO1xuICAgIHpvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50TmFtZV0gPSB7fTtcbiAgICB6b25lU3ltYm9sRXZlbnROYW1lc1tldmVudE5hbWVdW0ZBTFNFX1NUUl0gPSBzeW1ib2w7XG4gICAgem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnROYW1lXVtUUlVFX1NUUl0gPSBzeW1ib2xDYXB0dXJlO1xufVxuZnVuY3Rpb24gcGF0Y2hFdmVudFRhcmdldChfZ2xvYmFsLCBhcGksIGFwaXMsIHBhdGNoT3B0aW9ucykge1xuICAgIGNvbnN0IEFERF9FVkVOVF9MSVNURU5FUiA9IChwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLmFkZCkgfHwgQUREX0VWRU5UX0xJU1RFTkVSX1NUUjtcbiAgICBjb25zdCBSRU1PVkVfRVZFTlRfTElTVEVORVIgPSAocGF0Y2hPcHRpb25zICYmIHBhdGNoT3B0aW9ucy5ybSkgfHwgUkVNT1ZFX0VWRU5UX0xJU1RFTkVSX1NUUjtcbiAgICBjb25zdCBMSVNURU5FUlNfRVZFTlRfTElTVEVORVIgPSAocGF0Y2hPcHRpb25zICYmIHBhdGNoT3B0aW9ucy5saXN0ZW5lcnMpIHx8ICdldmVudExpc3RlbmVycyc7XG4gICAgY29uc3QgUkVNT1ZFX0FMTF9MSVNURU5FUlNfRVZFTlRfTElTVEVORVIgPSAocGF0Y2hPcHRpb25zICYmIHBhdGNoT3B0aW9ucy5ybUFsbCkgfHwgJ3JlbW92ZUFsbExpc3RlbmVycyc7XG4gICAgY29uc3Qgem9uZVN5bWJvbEFkZEV2ZW50TGlzdGVuZXIgPSB6b25lU3ltYm9sKEFERF9FVkVOVF9MSVNURU5FUik7XG4gICAgY29uc3QgQUREX0VWRU5UX0xJU1RFTkVSX1NPVVJDRSA9ICcuJyArIEFERF9FVkVOVF9MSVNURU5FUiArICc6JztcbiAgICBjb25zdCBQUkVQRU5EX0VWRU5UX0xJU1RFTkVSID0gJ3ByZXBlbmRMaXN0ZW5lcic7XG4gICAgY29uc3QgUFJFUEVORF9FVkVOVF9MSVNURU5FUl9TT1VSQ0UgPSAnLicgKyBQUkVQRU5EX0VWRU5UX0xJU1RFTkVSICsgJzonO1xuICAgIGNvbnN0IGludm9rZVRhc2sgPSBmdW5jdGlvbiAodGFzaywgdGFyZ2V0LCBldmVudCkge1xuICAgICAgICAvLyBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlLCBjaGVjayBpc1JlbW92ZWQgd2hpY2ggaXMgc2V0XG4gICAgICAgIC8vIGJ5IHJlbW92ZUV2ZW50TGlzdGVuZXJcbiAgICAgICAgaWYgKHRhc2suaXNSZW1vdmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGVsZWdhdGUgPSB0YXNrLmNhbGxiYWNrO1xuICAgICAgICBpZiAodHlwZW9mIGRlbGVnYXRlID09PSAnb2JqZWN0JyAmJiBkZWxlZ2F0ZS5oYW5kbGVFdmVudCkge1xuICAgICAgICAgICAgLy8gY3JlYXRlIHRoZSBiaW5kIHZlcnNpb24gb2YgaGFuZGxlRXZlbnQgd2hlbiBpbnZva2VcbiAgICAgICAgICAgIHRhc2suY2FsbGJhY2sgPSAoZXZlbnQpID0+IGRlbGVnYXRlLmhhbmRsZUV2ZW50KGV2ZW50KTtcbiAgICAgICAgICAgIHRhc2sub3JpZ2luYWxEZWxlZ2F0ZSA9IGRlbGVnYXRlO1xuICAgICAgICB9XG4gICAgICAgIC8vIGludm9rZSBzdGF0aWMgdGFzay5pbnZva2VcbiAgICAgICAgLy8gbmVlZCB0byB0cnkvY2F0Y2ggZXJyb3IgaGVyZSwgb3RoZXJ3aXNlLCB0aGUgZXJyb3IgaW4gb25lIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgIC8vIHdpbGwgYnJlYWsgdGhlIGV4ZWN1dGlvbnMgb2YgdGhlIG90aGVyIGV2ZW50IGxpc3RlbmVycy4gQWxzbyBlcnJvciB3aWxsXG4gICAgICAgIC8vIG5vdCByZW1vdmUgdGhlIGV2ZW50IGxpc3RlbmVyIHdoZW4gYG9uY2VgIG9wdGlvbnMgaXMgdHJ1ZS5cbiAgICAgICAgbGV0IGVycm9yO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGFzay5pbnZva2UodGFzaywgdGFyZ2V0LCBbZXZlbnRdKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBlcnJvciA9IGVycjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvcHRpb25zID0gdGFzay5vcHRpb25zO1xuICAgICAgICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcgJiYgb3B0aW9ucy5vbmNlKSB7XG4gICAgICAgICAgICAvLyBpZiBvcHRpb25zLm9uY2UgaXMgdHJ1ZSwgYWZ0ZXIgaW52b2tlIG9uY2UgcmVtb3ZlIGxpc3RlbmVyIGhlcmVcbiAgICAgICAgICAgIC8vIG9ubHkgYnJvd3NlciBuZWVkIHRvIGRvIHRoaXMsIG5vZGVqcyBldmVudEVtaXR0ZXIgd2lsbCBjYWwgcmVtb3ZlTGlzdGVuZXJcbiAgICAgICAgICAgIC8vIGluc2lkZSBFdmVudEVtaXR0ZXIub25jZVxuICAgICAgICAgICAgY29uc3QgZGVsZWdhdGUgPSB0YXNrLm9yaWdpbmFsRGVsZWdhdGUgPyB0YXNrLm9yaWdpbmFsRGVsZWdhdGUgOiB0YXNrLmNhbGxiYWNrO1xuICAgICAgICAgICAgdGFyZ2V0W1JFTU9WRV9FVkVOVF9MSVNURU5FUl0uY2FsbCh0YXJnZXQsIGV2ZW50LnR5cGUsIGRlbGVnYXRlLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgfTtcbiAgICBmdW5jdGlvbiBnbG9iYWxDYWxsYmFjayhjb250ZXh0LCBldmVudCwgaXNDYXB0dXJlKSB7XG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL3pvbmUuanMvaXNzdWVzLzkxMSwgaW4gSUUsIHNvbWV0aW1lc1xuICAgICAgICAvLyBldmVudCB3aWxsIGJlIHVuZGVmaW5lZCwgc28gd2UgbmVlZCB0byB1c2Ugd2luZG93LmV2ZW50XG4gICAgICAgIGV2ZW50ID0gZXZlbnQgfHwgX2dsb2JhbC5ldmVudDtcbiAgICAgICAgaWYgKCFldmVudCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIGV2ZW50LnRhcmdldCBpcyBuZWVkZWQgZm9yIFNhbXN1bmcgVFYgYW5kIFNvdXJjZUJ1ZmZlclxuICAgICAgICAvLyB8fCBnbG9iYWwgaXMgbmVlZGVkIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL3pvbmUuanMvaXNzdWVzLzE5MFxuICAgICAgICBjb25zdCB0YXJnZXQgPSBjb250ZXh0IHx8IGV2ZW50LnRhcmdldCB8fCBfZ2xvYmFsO1xuICAgICAgICBjb25zdCB0YXNrcyA9IHRhcmdldFt6b25lU3ltYm9sRXZlbnROYW1lc1tldmVudC50eXBlXVtpc0NhcHR1cmUgPyBUUlVFX1NUUiA6IEZBTFNFX1NUUl1dO1xuICAgICAgICBpZiAodGFza3MpIHtcbiAgICAgICAgICAgIGNvbnN0IGVycm9ycyA9IFtdO1xuICAgICAgICAgICAgLy8gaW52b2tlIGFsbCB0YXNrcyB3aGljaCBhdHRhY2hlZCB0byBjdXJyZW50IHRhcmdldCB3aXRoIGdpdmVuIGV2ZW50LnR5cGUgYW5kIGNhcHR1cmUgPSBmYWxzZVxuICAgICAgICAgICAgLy8gZm9yIHBlcmZvcm1hbmNlIGNvbmNlcm4sIGlmIHRhc2subGVuZ3RoID09PSAxLCBqdXN0IGludm9rZVxuICAgICAgICAgICAgaWYgKHRhc2tzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVyciA9IGludm9rZVRhc2sodGFza3NbMF0sIHRhcmdldCwgZXZlbnQpO1xuICAgICAgICAgICAgICAgIGVyciAmJiBlcnJvcnMucHVzaChlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvem9uZS5qcy9pc3N1ZXMvODM2XG4gICAgICAgICAgICAgICAgLy8gY29weSB0aGUgdGFza3MgYXJyYXkgYmVmb3JlIGludm9rZSwgdG8gYXZvaWRcbiAgICAgICAgICAgICAgICAvLyB0aGUgY2FsbGJhY2sgd2lsbCByZW1vdmUgaXRzZWxmIG9yIG90aGVyIGxpc3RlbmVyXG4gICAgICAgICAgICAgICAgY29uc3QgY29weVRhc2tzID0gdGFza3Muc2xpY2UoKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvcHlUYXNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQgJiYgZXZlbnRbSU1NRURJQVRFX1BST1BBR0FUSU9OX1NZTUJPTF0gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVyciA9IGludm9rZVRhc2soY29weVRhc2tzW2ldLCB0YXJnZXQsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgZXJyICYmIGVycm9ycy5wdXNoKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gU2luY2UgdGhlcmUgaXMgb25seSBvbmUgZXJyb3IsIHdlIGRvbid0IG5lZWQgdG8gc2NoZWR1bGUgbWljcm9UYXNrXG4gICAgICAgICAgICAvLyB0byB0aHJvdyB0aGUgZXJyb3IuXG4gICAgICAgICAgICBpZiAoZXJyb3JzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHRocm93IGVycm9yc1swXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXJyb3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVyciA9IGVycm9yc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgYXBpLm5hdGl2ZVNjaGVkdWxlTWljcm9UYXNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIGdsb2JhbCBzaGFyZWQgem9uZUF3YXJlQ2FsbGJhY2sgdG8gaGFuZGxlIGFsbCBldmVudCBjYWxsYmFjayB3aXRoIGNhcHR1cmUgPSBmYWxzZVxuICAgIGNvbnN0IGdsb2JhbFpvbmVBd2FyZUNhbGxiYWNrID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHJldHVybiBnbG9iYWxDYWxsYmFjayh0aGlzLCBldmVudCwgZmFsc2UpO1xuICAgIH07XG4gICAgLy8gZ2xvYmFsIHNoYXJlZCB6b25lQXdhcmVDYWxsYmFjayB0byBoYW5kbGUgYWxsIGV2ZW50IGNhbGxiYWNrIHdpdGggY2FwdHVyZSA9IHRydWVcbiAgICBjb25zdCBnbG9iYWxab25lQXdhcmVDYXB0dXJlQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIGdsb2JhbENhbGxiYWNrKHRoaXMsIGV2ZW50LCB0cnVlKTtcbiAgICB9O1xuICAgIGZ1bmN0aW9uIHBhdGNoRXZlbnRUYXJnZXRNZXRob2RzKG9iaiwgcGF0Y2hPcHRpb25zKSB7XG4gICAgICAgIGlmICghb2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHVzZUdsb2JhbENhbGxiYWNrID0gdHJ1ZTtcbiAgICAgICAgaWYgKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMudXNlRyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB1c2VHbG9iYWxDYWxsYmFjayA9IHBhdGNoT3B0aW9ucy51c2VHO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHZhbGlkYXRlSGFuZGxlciA9IHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMudmg7XG4gICAgICAgIGxldCBjaGVja0R1cGxpY2F0ZSA9IHRydWU7XG4gICAgICAgIGlmIChwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLmNoa0R1cCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjaGVja0R1cGxpY2F0ZSA9IHBhdGNoT3B0aW9ucy5jaGtEdXA7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJldHVyblRhcmdldCA9IGZhbHNlO1xuICAgICAgICBpZiAocGF0Y2hPcHRpb25zICYmIHBhdGNoT3B0aW9ucy5ydCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm5UYXJnZXQgPSBwYXRjaE9wdGlvbnMucnQ7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHByb3RvID0gb2JqO1xuICAgICAgICB3aGlsZSAocHJvdG8gJiYgIXByb3RvLmhhc093blByb3BlcnR5KEFERF9FVkVOVF9MSVNURU5FUikpIHtcbiAgICAgICAgICAgIHByb3RvID0gT2JqZWN0R2V0UHJvdG90eXBlT2YocHJvdG8pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcHJvdG8gJiYgb2JqW0FERF9FVkVOVF9MSVNURU5FUl0pIHtcbiAgICAgICAgICAgIC8vIHNvbWVob3cgd2UgZGlkIG5vdCBmaW5kIGl0LCBidXQgd2UgY2FuIHNlZSBpdC4gVGhpcyBoYXBwZW5zIG9uIElFIGZvciBXaW5kb3cgcHJvcGVydGllcy5cbiAgICAgICAgICAgIHByb3RvID0gb2JqO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcHJvdG8pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvdG9bem9uZVN5bWJvbEFkZEV2ZW50TGlzdGVuZXJdKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZXZlbnROYW1lVG9TdHJpbmcgPSBwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLmV2ZW50TmFtZVRvU3RyaW5nO1xuICAgICAgICAvLyBhIHNoYXJlZCBnbG9iYWwgdGFza0RhdGEgdG8gcGFzcyBkYXRhIGZvciBzY2hlZHVsZUV2ZW50VGFza1xuICAgICAgICAvLyBzbyB3ZSBkbyBub3QgbmVlZCB0byBjcmVhdGUgYSBuZXcgb2JqZWN0IGp1c3QgZm9yIHBhc3Mgc29tZSBkYXRhXG4gICAgICAgIGNvbnN0IHRhc2tEYXRhID0ge307XG4gICAgICAgIGNvbnN0IG5hdGl2ZUFkZEV2ZW50TGlzdGVuZXIgPSBwcm90b1t6b25lU3ltYm9sQWRkRXZlbnRMaXN0ZW5lcl0gPSBwcm90b1tBRERfRVZFTlRfTElTVEVORVJdO1xuICAgICAgICBjb25zdCBuYXRpdmVSZW1vdmVFdmVudExpc3RlbmVyID0gcHJvdG9bem9uZVN5bWJvbChSRU1PVkVfRVZFTlRfTElTVEVORVIpXSA9XG4gICAgICAgICAgICBwcm90b1tSRU1PVkVfRVZFTlRfTElTVEVORVJdO1xuICAgICAgICBjb25zdCBuYXRpdmVMaXN0ZW5lcnMgPSBwcm90b1t6b25lU3ltYm9sKExJU1RFTkVSU19FVkVOVF9MSVNURU5FUildID1cbiAgICAgICAgICAgIHByb3RvW0xJU1RFTkVSU19FVkVOVF9MSVNURU5FUl07XG4gICAgICAgIGNvbnN0IG5hdGl2ZVJlbW92ZUFsbExpc3RlbmVycyA9IHByb3RvW3pvbmVTeW1ib2woUkVNT1ZFX0FMTF9MSVNURU5FUlNfRVZFTlRfTElTVEVORVIpXSA9XG4gICAgICAgICAgICBwcm90b1tSRU1PVkVfQUxMX0xJU1RFTkVSU19FVkVOVF9MSVNURU5FUl07XG4gICAgICAgIGxldCBuYXRpdmVQcmVwZW5kRXZlbnRMaXN0ZW5lcjtcbiAgICAgICAgaWYgKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMucHJlcGVuZCkge1xuICAgICAgICAgICAgbmF0aXZlUHJlcGVuZEV2ZW50TGlzdGVuZXIgPSBwcm90b1t6b25lU3ltYm9sKHBhdGNoT3B0aW9ucy5wcmVwZW5kKV0gPVxuICAgICAgICAgICAgICAgIHByb3RvW3BhdGNoT3B0aW9ucy5wcmVwZW5kXTtcbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogVGhpcyB1dGlsIGZ1bmN0aW9uIHdpbGwgYnVpbGQgYW4gb3B0aW9uIG9iamVjdCB3aXRoIHBhc3NpdmUgb3B0aW9uXG4gICAgICAgICAqIHRvIGhhbmRsZSBhbGwgcG9zc2libGUgaW5wdXQgZnJvbSB0aGUgdXNlci5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGJ1aWxkRXZlbnRMaXN0ZW5lck9wdGlvbnMob3B0aW9ucywgcGFzc2l2ZSkge1xuICAgICAgICAgICAgaWYgKCFwYXNzaXZlU3VwcG9ydGVkICYmIHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyAmJiBvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgLy8gZG9lc24ndCBzdXBwb3J0IHBhc3NpdmUgYnV0IHVzZXIgd2FudCB0byBwYXNzIGFuIG9iamVjdCBhcyBvcHRpb25zLlxuICAgICAgICAgICAgICAgIC8vIHRoaXMgd2lsbCBub3Qgd29yayBvbiBzb21lIG9sZCBicm93c2VyLCBzbyB3ZSBqdXN0IHBhc3MgYSBib29sZWFuXG4gICAgICAgICAgICAgICAgLy8gYXMgdXNlQ2FwdHVyZSBwYXJhbWV0ZXJcbiAgICAgICAgICAgICAgICByZXR1cm4gISFvcHRpb25zLmNhcHR1cmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXBhc3NpdmVTdXBwb3J0ZWQgfHwgIXBhc3NpdmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgY2FwdHVyZTogb3B0aW9ucywgcGFzc2l2ZTogdHJ1ZSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcGFzc2l2ZTogdHJ1ZSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyAmJiBvcHRpb25zLnBhc3NpdmUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgLi4ub3B0aW9ucywgcGFzc2l2ZTogdHJ1ZSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY3VzdG9tU2NoZWR1bGVHbG9iYWwgPSBmdW5jdGlvbiAodGFzaykge1xuICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgYWxyZWFkeSBhIHRhc2sgZm9yIHRoZSBldmVudE5hbWUgKyBjYXB0dXJlLFxuICAgICAgICAgICAgLy8ganVzdCByZXR1cm4sIGJlY2F1c2Ugd2UgdXNlIHRoZSBzaGFyZWQgZ2xvYmFsWm9uZUF3YXJlQ2FsbGJhY2sgaGVyZS5cbiAgICAgICAgICAgIGlmICh0YXNrRGF0YS5pc0V4aXN0aW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5hdGl2ZUFkZEV2ZW50TGlzdGVuZXIuY2FsbCh0YXNrRGF0YS50YXJnZXQsIHRhc2tEYXRhLmV2ZW50TmFtZSwgdGFza0RhdGEuY2FwdHVyZSA/IGdsb2JhbFpvbmVBd2FyZUNhcHR1cmVDYWxsYmFjayA6IGdsb2JhbFpvbmVBd2FyZUNhbGxiYWNrLCB0YXNrRGF0YS5vcHRpb25zKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY3VzdG9tQ2FuY2VsR2xvYmFsID0gZnVuY3Rpb24gKHRhc2spIHtcbiAgICAgICAgICAgIC8vIGlmIHRhc2sgaXMgbm90IG1hcmtlZCBhcyBpc1JlbW92ZWQsIHRoaXMgY2FsbCBpcyBkaXJlY3RseVxuICAgICAgICAgICAgLy8gZnJvbSBab25lLnByb3RvdHlwZS5jYW5jZWxUYXNrLCB3ZSBzaG91bGQgcmVtb3ZlIHRoZSB0YXNrXG4gICAgICAgICAgICAvLyBmcm9tIHRhc2tzTGlzdCBvZiB0YXJnZXQgZmlyc3RcbiAgICAgICAgICAgIGlmICghdGFzay5pc1JlbW92ZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzeW1ib2xFdmVudE5hbWVzID0gem9uZVN5bWJvbEV2ZW50TmFtZXNbdGFzay5ldmVudE5hbWVdO1xuICAgICAgICAgICAgICAgIGxldCBzeW1ib2xFdmVudE5hbWU7XG4gICAgICAgICAgICAgICAgaWYgKHN5bWJvbEV2ZW50TmFtZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sRXZlbnROYW1lID0gc3ltYm9sRXZlbnROYW1lc1t0YXNrLmNhcHR1cmUgPyBUUlVFX1NUUiA6IEZBTFNFX1NUUl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nVGFza3MgPSBzeW1ib2xFdmVudE5hbWUgJiYgdGFzay50YXJnZXRbc3ltYm9sRXZlbnROYW1lXTtcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RpbmdUYXNrcykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV4aXN0aW5nVGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nVGFzayA9IGV4aXN0aW5nVGFza3NbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RpbmdUYXNrID09PSB0YXNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmdUYXNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0IGlzUmVtb3ZlZCB0byBkYXRhIGZvciBmYXN0ZXIgaW52b2tlVGFzayBjaGVja1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2suaXNSZW1vdmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RpbmdUYXNrcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWxsIHRhc2tzIGZvciB0aGUgZXZlbnROYW1lICsgY2FwdHVyZSBoYXZlIGdvbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBnbG9iYWxab25lQXdhcmVDYWxsYmFjayBhbmQgcmVtb3ZlIHRoZSB0YXNrIGNhY2hlIGZyb20gdGFyZ2V0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2suYWxsUmVtb3ZlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2sudGFyZ2V0W3N5bWJvbEV2ZW50TmFtZV0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmIGFsbCB0YXNrcyBmb3IgdGhlIGV2ZW50TmFtZSArIGNhcHR1cmUgaGF2ZSBnb25lLFxuICAgICAgICAgICAgLy8gd2Ugd2lsbCByZWFsbHkgcmVtb3ZlIHRoZSBnbG9iYWwgZXZlbnQgY2FsbGJhY2ssXG4gICAgICAgICAgICAvLyBpZiBub3QsIHJldHVyblxuICAgICAgICAgICAgaWYgKCF0YXNrLmFsbFJlbW92ZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmF0aXZlUmVtb3ZlRXZlbnRMaXN0ZW5lci5jYWxsKHRhc2sudGFyZ2V0LCB0YXNrLmV2ZW50TmFtZSwgdGFzay5jYXB0dXJlID8gZ2xvYmFsWm9uZUF3YXJlQ2FwdHVyZUNhbGxiYWNrIDogZ2xvYmFsWm9uZUF3YXJlQ2FsbGJhY2ssIHRhc2sub3B0aW9ucyk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGN1c3RvbVNjaGVkdWxlTm9uR2xvYmFsID0gZnVuY3Rpb24gKHRhc2spIHtcbiAgICAgICAgICAgIHJldHVybiBuYXRpdmVBZGRFdmVudExpc3RlbmVyLmNhbGwodGFza0RhdGEudGFyZ2V0LCB0YXNrRGF0YS5ldmVudE5hbWUsIHRhc2suaW52b2tlLCB0YXNrRGF0YS5vcHRpb25zKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY3VzdG9tU2NoZWR1bGVQcmVwZW5kID0gZnVuY3Rpb24gKHRhc2spIHtcbiAgICAgICAgICAgIHJldHVybiBuYXRpdmVQcmVwZW5kRXZlbnRMaXN0ZW5lci5jYWxsKHRhc2tEYXRhLnRhcmdldCwgdGFza0RhdGEuZXZlbnROYW1lLCB0YXNrLmludm9rZSwgdGFza0RhdGEub3B0aW9ucyk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGN1c3RvbUNhbmNlbE5vbkdsb2JhbCA9IGZ1bmN0aW9uICh0YXNrKSB7XG4gICAgICAgICAgICByZXR1cm4gbmF0aXZlUmVtb3ZlRXZlbnRMaXN0ZW5lci5jYWxsKHRhc2sudGFyZ2V0LCB0YXNrLmV2ZW50TmFtZSwgdGFzay5pbnZva2UsIHRhc2sub3B0aW9ucyk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGN1c3RvbVNjaGVkdWxlID0gdXNlR2xvYmFsQ2FsbGJhY2sgPyBjdXN0b21TY2hlZHVsZUdsb2JhbCA6IGN1c3RvbVNjaGVkdWxlTm9uR2xvYmFsO1xuICAgICAgICBjb25zdCBjdXN0b21DYW5jZWwgPSB1c2VHbG9iYWxDYWxsYmFjayA/IGN1c3RvbUNhbmNlbEdsb2JhbCA6IGN1c3RvbUNhbmNlbE5vbkdsb2JhbDtcbiAgICAgICAgY29uc3QgY29tcGFyZVRhc2tDYWxsYmFja1ZzRGVsZWdhdGUgPSBmdW5jdGlvbiAodGFzaywgZGVsZWdhdGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGVPZkRlbGVnYXRlID0gdHlwZW9mIGRlbGVnYXRlO1xuICAgICAgICAgICAgcmV0dXJuICh0eXBlT2ZEZWxlZ2F0ZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0YXNrLmNhbGxiYWNrID09PSBkZWxlZ2F0ZSkgfHxcbiAgICAgICAgICAgICAgICAodHlwZU9mRGVsZWdhdGUgPT09ICdvYmplY3QnICYmIHRhc2sub3JpZ2luYWxEZWxlZ2F0ZSA9PT0gZGVsZWdhdGUpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjb21wYXJlID0gKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMuZGlmZikgPyBwYXRjaE9wdGlvbnMuZGlmZiA6IGNvbXBhcmVUYXNrQ2FsbGJhY2tWc0RlbGVnYXRlO1xuICAgICAgICBjb25zdCB1bnBhdGNoZWRFdmVudHMgPSBab25lW3pvbmVTeW1ib2woJ1VOUEFUQ0hFRF9FVkVOVFMnKV07XG4gICAgICAgIGNvbnN0IHBhc3NpdmVFdmVudHMgPSBfZ2xvYmFsW3pvbmVTeW1ib2woJ1BBU1NJVkVfRVZFTlRTJyldO1xuICAgICAgICBjb25zdCBtYWtlQWRkTGlzdGVuZXIgPSBmdW5jdGlvbiAobmF0aXZlTGlzdGVuZXIsIGFkZFNvdXJjZSwgY3VzdG9tU2NoZWR1bGVGbiwgY3VzdG9tQ2FuY2VsRm4sIHJldHVyblRhcmdldCA9IGZhbHNlLCBwcmVwZW5kID0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcyB8fCBfZ2xvYmFsO1xuICAgICAgICAgICAgICAgIGxldCBldmVudE5hbWUgPSBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICAgICAgaWYgKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMudHJhbnNmZXJFdmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnROYW1lID0gcGF0Y2hPcHRpb25zLnRyYW5zZmVyRXZlbnROYW1lKGV2ZW50TmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBkZWxlZ2F0ZSA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICAgICAgICBpZiAoIWRlbGVnYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuYXRpdmVMaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaXNOb2RlICYmIGV2ZW50TmFtZSA9PT0gJ3VuY2F1Z2h0RXhjZXB0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBkb24ndCBwYXRjaCB1bmNhdWdodEV4Y2VwdGlvbiBvZiBub2RlanMgdG8gcHJldmVudCBlbmRsZXNzIGxvb3BcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hdGl2ZUxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGRvbid0IGNyZWF0ZSB0aGUgYmluZCBkZWxlZ2F0ZSBmdW5jdGlvbiBmb3IgaGFuZGxlRXZlbnRcbiAgICAgICAgICAgICAgICAvLyBjYXNlIGhlcmUgdG8gaW1wcm92ZSBhZGRFdmVudExpc3RlbmVyIHBlcmZvcm1hbmNlXG4gICAgICAgICAgICAgICAgLy8gd2Ugd2lsbCBjcmVhdGUgdGhlIGJpbmQgZGVsZWdhdGUgd2hlbiBpbnZva2VcbiAgICAgICAgICAgICAgICBsZXQgaXNIYW5kbGVFdmVudCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZGVsZWdhdGUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkZWxlZ2F0ZS5oYW5kbGVFdmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hdGl2ZUxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaXNIYW5kbGVFdmVudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh2YWxpZGF0ZUhhbmRsZXIgJiYgIXZhbGlkYXRlSGFuZGxlcihuYXRpdmVMaXN0ZW5lciwgZGVsZWdhdGUsIHRhcmdldCwgYXJndW1lbnRzKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHBhc3NpdmUgPSBwYXNzaXZlU3VwcG9ydGVkICYmICEhcGFzc2l2ZUV2ZW50cyAmJiBwYXNzaXZlRXZlbnRzLmluZGV4T2YoZXZlbnROYW1lKSAhPT0gLTE7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IGJ1aWxkRXZlbnRMaXN0ZW5lck9wdGlvbnMoYXJndW1lbnRzWzJdLCBwYXNzaXZlKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzaWduYWwgPSBvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyAmJiBvcHRpb25zLnNpZ25hbCAmJlxuICAgICAgICAgICAgICAgICAgICB0eXBlb2Ygb3B0aW9ucy5zaWduYWwgPT09ICdvYmplY3QnID9cbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5zaWduYWwgOlxuICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgaWYgKHNpZ25hbD8uYWJvcnRlZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgc2lnbmFsIGlzIGFuIGFib3J0ZWQgb25lLCBqdXN0IHJldHVybiB3aXRob3V0IGF0dGFjaGluZyB0aGUgZXZlbnQgbGlzdGVuZXIuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHVucGF0Y2hlZEV2ZW50cykge1xuICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayB1bnBhdGNoZWQgbGlzdFxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHVucGF0Y2hlZEV2ZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50TmFtZSA9PT0gdW5wYXRjaGVkRXZlbnRzW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhc3NpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hdGl2ZUxpc3RlbmVyLmNhbGwodGFyZ2V0LCBldmVudE5hbWUsIGRlbGVnYXRlLCBvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuYXRpdmVMaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBjYXB0dXJlID0gIW9wdGlvbnMgPyBmYWxzZSA6IHR5cGVvZiBvcHRpb25zID09PSAnYm9vbGVhbicgPyB0cnVlIDogb3B0aW9ucy5jYXB0dXJlO1xuICAgICAgICAgICAgICAgIGNvbnN0IG9uY2UgPSBvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyA/IG9wdGlvbnMub25jZSA6IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbnN0IHpvbmUgPSBab25lLmN1cnJlbnQ7XG4gICAgICAgICAgICAgICAgbGV0IHN5bWJvbEV2ZW50TmFtZXMgPSB6b25lU3ltYm9sRXZlbnROYW1lc1tldmVudE5hbWVdO1xuICAgICAgICAgICAgICAgIGlmICghc3ltYm9sRXZlbnROYW1lcykge1xuICAgICAgICAgICAgICAgICAgICBwcmVwYXJlRXZlbnROYW1lcyhldmVudE5hbWUsIGV2ZW50TmFtZVRvU3RyaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sRXZlbnROYW1lcyA9IHpvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50TmFtZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHN5bWJvbEV2ZW50TmFtZSA9IHN5bWJvbEV2ZW50TmFtZXNbY2FwdHVyZSA/IFRSVUVfU1RSIDogRkFMU0VfU1RSXTtcbiAgICAgICAgICAgICAgICBsZXQgZXhpc3RpbmdUYXNrcyA9IHRhcmdldFtzeW1ib2xFdmVudE5hbWVdO1xuICAgICAgICAgICAgICAgIGxldCBpc0V4aXN0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0aW5nVGFza3MpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYWxyZWFkeSBoYXZlIHRhc2sgcmVnaXN0ZXJlZFxuICAgICAgICAgICAgICAgICAgICBpc0V4aXN0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrRHVwbGljYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV4aXN0aW5nVGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcGFyZShleGlzdGluZ1Rhc2tzW2ldLCBkZWxlZ2F0ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2FtZSBjYWxsYmFjaywgc2FtZSBjYXB0dXJlLCBzYW1lIGV2ZW50IG5hbWUsIGp1c3QgcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nVGFza3MgPSB0YXJnZXRbc3ltYm9sRXZlbnROYW1lXSA9IFtdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgc291cmNlO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnN0cnVjdG9yTmFtZSA9IHRhcmdldC5jb25zdHJ1Y3RvclsnbmFtZSddO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldFNvdXJjZSA9IGdsb2JhbFNvdXJjZXNbY29uc3RydWN0b3JOYW1lXTtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0U291cmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZSA9IHRhcmdldFNvdXJjZVtldmVudE5hbWVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXNvdXJjZSkge1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2UgPSBjb25zdHJ1Y3Rvck5hbWUgKyBhZGRTb3VyY2UgK1xuICAgICAgICAgICAgICAgICAgICAgICAgKGV2ZW50TmFtZVRvU3RyaW5nID8gZXZlbnROYW1lVG9TdHJpbmcoZXZlbnROYW1lKSA6IGV2ZW50TmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGRvIG5vdCBjcmVhdGUgYSBuZXcgb2JqZWN0IGFzIHRhc2suZGF0YSB0byBwYXNzIHRob3NlIHRoaW5nc1xuICAgICAgICAgICAgICAgIC8vIGp1c3QgdXNlIHRoZSBnbG9iYWwgc2hhcmVkIG9uZVxuICAgICAgICAgICAgICAgIHRhc2tEYXRhLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICAgICAgICAgIGlmIChvbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIGFkZEV2ZW50TGlzdGVuZXIgd2l0aCBvbmNlIG9wdGlvbnMsIHdlIGRvbid0IHBhc3MgaXQgdG9cbiAgICAgICAgICAgICAgICAgICAgLy8gbmF0aXZlIGFkZEV2ZW50TGlzdGVuZXIsIGluc3RlYWQgd2Uga2VlcCB0aGUgb25jZSBzZXR0aW5nXG4gICAgICAgICAgICAgICAgICAgIC8vIGFuZCBoYW5kbGUgb3Vyc2VsdmVzLlxuICAgICAgICAgICAgICAgICAgICB0YXNrRGF0YS5vcHRpb25zLm9uY2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGFza0RhdGEudGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICAgICAgICAgIHRhc2tEYXRhLmNhcHR1cmUgPSBjYXB0dXJlO1xuICAgICAgICAgICAgICAgIHRhc2tEYXRhLmV2ZW50TmFtZSA9IGV2ZW50TmFtZTtcbiAgICAgICAgICAgICAgICB0YXNrRGF0YS5pc0V4aXN0aW5nID0gaXNFeGlzdGluZztcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gdXNlR2xvYmFsQ2FsbGJhY2sgPyBPUFRJTUlaRURfWk9ORV9FVkVOVF9UQVNLX0RBVEEgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgLy8ga2VlcCB0YXNrRGF0YSBpbnRvIGRhdGEgdG8gYWxsb3cgb25TY2hlZHVsZUV2ZW50VGFzayB0byBhY2Nlc3MgdGhlIHRhc2sgaW5mb3JtYXRpb25cbiAgICAgICAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhLnRhc2tEYXRhID0gdGFza0RhdGE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzaWduYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgYWRkRXZlbnRMaXN0ZW5lciB3aXRoIHNpZ25hbCBvcHRpb25zLCB3ZSBkb24ndCBwYXNzIGl0IHRvXG4gICAgICAgICAgICAgICAgICAgIC8vIG5hdGl2ZSBhZGRFdmVudExpc3RlbmVyLCBpbnN0ZWFkIHdlIGtlZXAgdGhlIHNpZ25hbCBzZXR0aW5nXG4gICAgICAgICAgICAgICAgICAgIC8vIGFuZCBoYW5kbGUgb3Vyc2VsdmVzLlxuICAgICAgICAgICAgICAgICAgICB0YXNrRGF0YS5vcHRpb25zLnNpZ25hbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgdGFzayA9IHpvbmUuc2NoZWR1bGVFdmVudFRhc2soc291cmNlLCBkZWxlZ2F0ZSwgZGF0YSwgY3VzdG9tU2NoZWR1bGVGbiwgY3VzdG9tQ2FuY2VsRm4pO1xuICAgICAgICAgICAgICAgIGlmIChzaWduYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYWZ0ZXIgdGFzayBpcyBzY2hlZHVsZWQsIHdlIG5lZWQgdG8gc3RvcmUgdGhlIHNpZ25hbCBiYWNrIHRvIHRhc2sub3B0aW9uc1xuICAgICAgICAgICAgICAgICAgICB0YXNrRGF0YS5vcHRpb25zLnNpZ25hbCA9IHNpZ25hbDtcbiAgICAgICAgICAgICAgICAgICAgbmF0aXZlTGlzdGVuZXIuY2FsbChzaWduYWwsICdhYm9ydCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhc2suem9uZS5jYW5jZWxUYXNrKHRhc2spO1xuICAgICAgICAgICAgICAgICAgICB9LCB7IG9uY2U6IHRydWUgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHNob3VsZCBjbGVhciB0YXNrRGF0YS50YXJnZXQgdG8gYXZvaWQgbWVtb3J5IGxlYWtcbiAgICAgICAgICAgICAgICAvLyBpc3N1ZSwgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMjA0NDJcbiAgICAgICAgICAgICAgICB0YXNrRGF0YS50YXJnZXQgPSBudWxsO1xuICAgICAgICAgICAgICAgIC8vIG5lZWQgdG8gY2xlYXIgdXAgdGFza0RhdGEgYmVjYXVzZSBpdCBpcyBhIGdsb2JhbCBvYmplY3RcbiAgICAgICAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhLnRhc2tEYXRhID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gaGF2ZSB0byBzYXZlIHRob3NlIGluZm9ybWF0aW9uIHRvIHRhc2sgaW4gY2FzZVxuICAgICAgICAgICAgICAgIC8vIGFwcGxpY2F0aW9uIG1heSBjYWxsIHRhc2suem9uZS5jYW5jZWxUYXNrKCkgZGlyZWN0bHlcbiAgICAgICAgICAgICAgICBpZiAob25jZSkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm9uY2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoISghcGFzc2l2ZVN1cHBvcnRlZCAmJiB0eXBlb2YgdGFzay5vcHRpb25zID09PSAnYm9vbGVhbicpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIG5vdCBzdXBwb3J0IHBhc3NpdmUsIGFuZCB3ZSBwYXNzIGFuIG9wdGlvbiBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgLy8gdG8gYWRkRXZlbnRMaXN0ZW5lciwgd2Ugc2hvdWxkIHNhdmUgdGhlIG9wdGlvbnMgdG8gdGFza1xuICAgICAgICAgICAgICAgICAgICB0YXNrLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0YXNrLnRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgICAgICAgICB0YXNrLmNhcHR1cmUgPSBjYXB0dXJlO1xuICAgICAgICAgICAgICAgIHRhc2suZXZlbnROYW1lID0gZXZlbnROYW1lO1xuICAgICAgICAgICAgICAgIGlmIChpc0hhbmRsZUV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNhdmUgb3JpZ2luYWwgZGVsZWdhdGUgZm9yIGNvbXBhcmUgdG8gY2hlY2sgZHVwbGljYXRlXG4gICAgICAgICAgICAgICAgICAgIHRhc2sub3JpZ2luYWxEZWxlZ2F0ZSA9IGRlbGVnYXRlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXByZXBlbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmdUYXNrcy5wdXNoKHRhc2spO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmdUYXNrcy51bnNoaWZ0KHRhc2spO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmV0dXJuVGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICAgICAgcHJvdG9bQUREX0VWRU5UX0xJU1RFTkVSXSA9IG1ha2VBZGRMaXN0ZW5lcihuYXRpdmVBZGRFdmVudExpc3RlbmVyLCBBRERfRVZFTlRfTElTVEVORVJfU09VUkNFLCBjdXN0b21TY2hlZHVsZSwgY3VzdG9tQ2FuY2VsLCByZXR1cm5UYXJnZXQpO1xuICAgICAgICBpZiAobmF0aXZlUHJlcGVuZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHByb3RvW1BSRVBFTkRfRVZFTlRfTElTVEVORVJdID0gbWFrZUFkZExpc3RlbmVyKG5hdGl2ZVByZXBlbmRFdmVudExpc3RlbmVyLCBQUkVQRU5EX0VWRU5UX0xJU1RFTkVSX1NPVVJDRSwgY3VzdG9tU2NoZWR1bGVQcmVwZW5kLCBjdXN0b21DYW5jZWwsIHJldHVyblRhcmdldCwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdG9bUkVNT1ZFX0VWRU5UX0xJU1RFTkVSXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMgfHwgX2dsb2JhbDtcbiAgICAgICAgICAgIGxldCBldmVudE5hbWUgPSBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICBpZiAocGF0Y2hPcHRpb25zICYmIHBhdGNoT3B0aW9ucy50cmFuc2ZlckV2ZW50TmFtZSkge1xuICAgICAgICAgICAgICAgIGV2ZW50TmFtZSA9IHBhdGNoT3B0aW9ucy50cmFuc2ZlckV2ZW50TmFtZShldmVudE5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IGFyZ3VtZW50c1syXTtcbiAgICAgICAgICAgIGNvbnN0IGNhcHR1cmUgPSAhb3B0aW9ucyA/IGZhbHNlIDogdHlwZW9mIG9wdGlvbnMgPT09ICdib29sZWFuJyA/IHRydWUgOiBvcHRpb25zLmNhcHR1cmU7XG4gICAgICAgICAgICBjb25zdCBkZWxlZ2F0ZSA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICAgIGlmICghZGVsZWdhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmF0aXZlUmVtb3ZlRXZlbnRMaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHZhbGlkYXRlSGFuZGxlciAmJlxuICAgICAgICAgICAgICAgICF2YWxpZGF0ZUhhbmRsZXIobmF0aXZlUmVtb3ZlRXZlbnRMaXN0ZW5lciwgZGVsZWdhdGUsIHRhcmdldCwgYXJndW1lbnRzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHN5bWJvbEV2ZW50TmFtZXMgPSB6b25lU3ltYm9sRXZlbnROYW1lc1tldmVudE5hbWVdO1xuICAgICAgICAgICAgbGV0IHN5bWJvbEV2ZW50TmFtZTtcbiAgICAgICAgICAgIGlmIChzeW1ib2xFdmVudE5hbWVzKSB7XG4gICAgICAgICAgICAgICAgc3ltYm9sRXZlbnROYW1lID0gc3ltYm9sRXZlbnROYW1lc1tjYXB0dXJlID8gVFJVRV9TVFIgOiBGQUxTRV9TVFJdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdUYXNrcyA9IHN5bWJvbEV2ZW50TmFtZSAmJiB0YXJnZXRbc3ltYm9sRXZlbnROYW1lXTtcbiAgICAgICAgICAgIGlmIChleGlzdGluZ1Rhc2tzKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBleGlzdGluZ1Rhc2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nVGFzayA9IGV4aXN0aW5nVGFza3NbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wYXJlKGV4aXN0aW5nVGFzaywgZGVsZWdhdGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleGlzdGluZ1Rhc2tzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldCBpc1JlbW92ZWQgdG8gZGF0YSBmb3IgZmFzdGVyIGludm9rZVRhc2sgY2hlY2tcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nVGFzay5pc1JlbW92ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0aW5nVGFza3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWxsIHRhc2tzIGZvciB0aGUgZXZlbnROYW1lICsgY2FwdHVyZSBoYXZlIGdvbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGdsb2JhbFpvbmVBd2FyZUNhbGxiYWNrIGFuZCByZW1vdmUgdGhlIHRhc2sgY2FjaGUgZnJvbSB0YXJnZXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGlzdGluZ1Rhc2suYWxsUmVtb3ZlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W3N5bWJvbEV2ZW50TmFtZV0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGluIHRoZSB0YXJnZXQsIHdlIGhhdmUgYW4gZXZlbnQgbGlzdGVuZXIgd2hpY2ggaXMgYWRkZWQgYnkgb25fcHJvcGVydHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzdWNoIGFzIHRhcmdldC5vbmNsaWNrID0gZnVuY3Rpb24oKSB7fSwgc28gd2UgbmVlZCB0byBjbGVhciB0aGlzIGludGVybmFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcHJvcGVydHkgdG9vIGlmIGFsbCBkZWxlZ2F0ZXMgYWxsIHJlbW92ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGV2ZW50TmFtZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb25Qcm9wZXJ0eVN5bWJvbCA9IFpPTkVfU1lNQk9MX1BSRUZJWCArICdPTl9QUk9QRVJUWScgKyBldmVudE5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFtvblByb3BlcnR5U3ltYm9sXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmdUYXNrLnpvbmUuY2FuY2VsVGFzayhleGlzdGluZ1Rhc2spO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJldHVyblRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpc3N1ZSA5MzAsIGRpZG4ndCBmaW5kIHRoZSBldmVudCBuYW1lIG9yIGNhbGxiYWNrXG4gICAgICAgICAgICAvLyBmcm9tIHpvbmUga2VwdCBleGlzdGluZ1Rhc2tzLCB0aGUgY2FsbGJhY2sgbWF5YmVcbiAgICAgICAgICAgIC8vIGFkZGVkIG91dHNpZGUgb2Ygem9uZSwgd2UgbmVlZCB0byBjYWxsIG5hdGl2ZSByZW1vdmVFdmVudExpc3RlbmVyXG4gICAgICAgICAgICAvLyB0byB0cnkgdG8gcmVtb3ZlIGl0LlxuICAgICAgICAgICAgcmV0dXJuIG5hdGl2ZVJlbW92ZUV2ZW50TGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICAgICAgcHJvdG9bTElTVEVORVJTX0VWRU5UX0xJU1RFTkVSXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMgfHwgX2dsb2JhbDtcbiAgICAgICAgICAgIGxldCBldmVudE5hbWUgPSBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICBpZiAocGF0Y2hPcHRpb25zICYmIHBhdGNoT3B0aW9ucy50cmFuc2ZlckV2ZW50TmFtZSkge1xuICAgICAgICAgICAgICAgIGV2ZW50TmFtZSA9IHBhdGNoT3B0aW9ucy50cmFuc2ZlckV2ZW50TmFtZShldmVudE5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbGlzdGVuZXJzID0gW107XG4gICAgICAgICAgICBjb25zdCB0YXNrcyA9IGZpbmRFdmVudFRhc2tzKHRhcmdldCwgZXZlbnROYW1lVG9TdHJpbmcgPyBldmVudE5hbWVUb1N0cmluZyhldmVudE5hbWUpIDogZXZlbnROYW1lKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXNrID0gdGFza3NbaV07XG4gICAgICAgICAgICAgICAgbGV0IGRlbGVnYXRlID0gdGFzay5vcmlnaW5hbERlbGVnYXRlID8gdGFzay5vcmlnaW5hbERlbGVnYXRlIDogdGFzay5jYWxsYmFjaztcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnMucHVzaChkZWxlZ2F0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbGlzdGVuZXJzO1xuICAgICAgICB9O1xuICAgICAgICBwcm90b1tSRU1PVkVfQUxMX0xJU1RFTkVSU19FVkVOVF9MSVNURU5FUl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzIHx8IF9nbG9iYWw7XG4gICAgICAgICAgICBsZXQgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgaWYgKCFldmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXModGFyZ2V0KTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvcCA9IGtleXNbaV07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gRVZFTlRfTkFNRV9TWU1CT0xfUkVHWC5leGVjKHByb3ApO1xuICAgICAgICAgICAgICAgICAgICBsZXQgZXZ0TmFtZSA9IG1hdGNoICYmIG1hdGNoWzFdO1xuICAgICAgICAgICAgICAgICAgICAvLyBpbiBub2RlanMgRXZlbnRFbWl0dGVyLCByZW1vdmVMaXN0ZW5lciBldmVudCBpc1xuICAgICAgICAgICAgICAgICAgICAvLyB1c2VkIGZvciBtb25pdG9yaW5nIHRoZSByZW1vdmVMaXN0ZW5lciBjYWxsLFxuICAgICAgICAgICAgICAgICAgICAvLyBzbyBqdXN0IGtlZXAgcmVtb3ZlTGlzdGVuZXIgZXZlbnRMaXN0ZW5lciB1bnRpbFxuICAgICAgICAgICAgICAgICAgICAvLyBhbGwgb3RoZXIgZXZlbnRMaXN0ZW5lcnMgYXJlIHJlbW92ZWRcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2dE5hbWUgJiYgZXZ0TmFtZSAhPT0gJ3JlbW92ZUxpc3RlbmVyJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1tSRU1PVkVfQUxMX0xJU1RFTkVSU19FVkVOVF9MSVNURU5FUl0uY2FsbCh0aGlzLCBldnROYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgcmVtb3ZlTGlzdGVuZXIgbGlzdGVuZXIgZmluYWxseVxuICAgICAgICAgICAgICAgIHRoaXNbUkVNT1ZFX0FMTF9MSVNURU5FUlNfRVZFTlRfTElTVEVORVJdLmNhbGwodGhpcywgJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocGF0Y2hPcHRpb25zICYmIHBhdGNoT3B0aW9ucy50cmFuc2ZlckV2ZW50TmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBldmVudE5hbWUgPSBwYXRjaE9wdGlvbnMudHJhbnNmZXJFdmVudE5hbWUoZXZlbnROYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3Qgc3ltYm9sRXZlbnROYW1lcyA9IHpvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50TmFtZV07XG4gICAgICAgICAgICAgICAgaWYgKHN5bWJvbEV2ZW50TmFtZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3ltYm9sRXZlbnROYW1lID0gc3ltYm9sRXZlbnROYW1lc1tGQUxTRV9TVFJdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzeW1ib2xDYXB0dXJlRXZlbnROYW1lID0gc3ltYm9sRXZlbnROYW1lc1tUUlVFX1NUUl07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhc2tzID0gdGFyZ2V0W3N5bWJvbEV2ZW50TmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhcHR1cmVUYXNrcyA9IHRhcmdldFtzeW1ib2xDYXB0dXJlRXZlbnROYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhc2tzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZW1vdmVUYXNrcyA9IHRhc2tzLnNsaWNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlbW92ZVRhc2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFzayA9IHJlbW92ZVRhc2tzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkZWxlZ2F0ZSA9IHRhc2sub3JpZ2luYWxEZWxlZ2F0ZSA/IHRhc2sub3JpZ2luYWxEZWxlZ2F0ZSA6IHRhc2suY2FsbGJhY2s7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1tSRU1PVkVfRVZFTlRfTElTVEVORVJdLmNhbGwodGhpcywgZXZlbnROYW1lLCBkZWxlZ2F0ZSwgdGFzay5vcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoY2FwdHVyZVRhc2tzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZW1vdmVUYXNrcyA9IGNhcHR1cmVUYXNrcy5zbGljZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZW1vdmVUYXNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhc2sgPSByZW1vdmVUYXNrc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGVsZWdhdGUgPSB0YXNrLm9yaWdpbmFsRGVsZWdhdGUgPyB0YXNrLm9yaWdpbmFsRGVsZWdhdGUgOiB0YXNrLmNhbGxiYWNrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbUkVNT1ZFX0VWRU5UX0xJU1RFTkVSXS5jYWxsKHRoaXMsIGV2ZW50TmFtZSwgZGVsZWdhdGUsIHRhc2sub3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmV0dXJuVGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIC8vIGZvciBuYXRpdmUgdG9TdHJpbmcgcGF0Y2hcbiAgICAgICAgYXR0YWNoT3JpZ2luVG9QYXRjaGVkKHByb3RvW0FERF9FVkVOVF9MSVNURU5FUl0sIG5hdGl2ZUFkZEV2ZW50TGlzdGVuZXIpO1xuICAgICAgICBhdHRhY2hPcmlnaW5Ub1BhdGNoZWQocHJvdG9bUkVNT1ZFX0VWRU5UX0xJU1RFTkVSXSwgbmF0aXZlUmVtb3ZlRXZlbnRMaXN0ZW5lcik7XG4gICAgICAgIGlmIChuYXRpdmVSZW1vdmVBbGxMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGF0dGFjaE9yaWdpblRvUGF0Y2hlZChwcm90b1tSRU1PVkVfQUxMX0xJU1RFTkVSU19FVkVOVF9MSVNURU5FUl0sIG5hdGl2ZVJlbW92ZUFsbExpc3RlbmVycyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5hdGl2ZUxpc3RlbmVycykge1xuICAgICAgICAgICAgYXR0YWNoT3JpZ2luVG9QYXRjaGVkKHByb3RvW0xJU1RFTkVSU19FVkVOVF9MSVNURU5FUl0sIG5hdGl2ZUxpc3RlbmVycyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGxldCByZXN1bHRzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcGlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJlc3VsdHNbaV0gPSBwYXRjaEV2ZW50VGFyZ2V0TWV0aG9kcyhhcGlzW2ldLCBwYXRjaE9wdGlvbnMpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbn1cbmZ1bmN0aW9uIGZpbmRFdmVudFRhc2tzKHRhcmdldCwgZXZlbnROYW1lKSB7XG4gICAgaWYgKCFldmVudE5hbWUpIHtcbiAgICAgICAgY29uc3QgZm91bmRUYXNrcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBwcm9wIGluIHRhcmdldCkge1xuICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBFVkVOVF9OQU1FX1NZTUJPTF9SRUdYLmV4ZWMocHJvcCk7XG4gICAgICAgICAgICBsZXQgZXZ0TmFtZSA9IG1hdGNoICYmIG1hdGNoWzFdO1xuICAgICAgICAgICAgaWYgKGV2dE5hbWUgJiYgKCFldmVudE5hbWUgfHwgZXZ0TmFtZSA9PT0gZXZlbnROYW1lKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhc2tzID0gdGFyZ2V0W3Byb3BdO1xuICAgICAgICAgICAgICAgIGlmICh0YXNrcykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhc2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZFRhc2tzLnB1c2godGFza3NbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmb3VuZFRhc2tzO1xuICAgIH1cbiAgICBsZXQgc3ltYm9sRXZlbnROYW1lID0gem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnROYW1lXTtcbiAgICBpZiAoIXN5bWJvbEV2ZW50TmFtZSkge1xuICAgICAgICBwcmVwYXJlRXZlbnROYW1lcyhldmVudE5hbWUpO1xuICAgICAgICBzeW1ib2xFdmVudE5hbWUgPSB6b25lU3ltYm9sRXZlbnROYW1lc1tldmVudE5hbWVdO1xuICAgIH1cbiAgICBjb25zdCBjYXB0dXJlRmFsc2VUYXNrcyA9IHRhcmdldFtzeW1ib2xFdmVudE5hbWVbRkFMU0VfU1RSXV07XG4gICAgY29uc3QgY2FwdHVyZVRydWVUYXNrcyA9IHRhcmdldFtzeW1ib2xFdmVudE5hbWVbVFJVRV9TVFJdXTtcbiAgICBpZiAoIWNhcHR1cmVGYWxzZVRhc2tzKSB7XG4gICAgICAgIHJldHVybiBjYXB0dXJlVHJ1ZVRhc2tzID8gY2FwdHVyZVRydWVUYXNrcy5zbGljZSgpIDogW107XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gY2FwdHVyZVRydWVUYXNrcyA/IGNhcHR1cmVGYWxzZVRhc2tzLmNvbmNhdChjYXB0dXJlVHJ1ZVRhc2tzKSA6XG4gICAgICAgICAgICBjYXB0dXJlRmFsc2VUYXNrcy5zbGljZSgpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHBhdGNoRXZlbnRQcm90b3R5cGUoZ2xvYmFsLCBhcGkpIHtcbiAgICBjb25zdCBFdmVudCA9IGdsb2JhbFsnRXZlbnQnXTtcbiAgICBpZiAoRXZlbnQgJiYgRXZlbnQucHJvdG90eXBlKSB7XG4gICAgICAgIGFwaS5wYXRjaE1ldGhvZChFdmVudC5wcm90b3R5cGUsICdzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24nLCAoZGVsZWdhdGUpID0+IGZ1bmN0aW9uIChzZWxmLCBhcmdzKSB7XG4gICAgICAgICAgICBzZWxmW0lNTUVESUFURV9QUk9QQUdBVElPTl9TWU1CT0xdID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vIHdlIG5lZWQgdG8gY2FsbCB0aGUgbmF0aXZlIHN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvblxuICAgICAgICAgICAgLy8gaW4gY2FzZSBpbiBzb21lIGh5YnJpZCBhcHBsaWNhdGlvbiwgc29tZSBwYXJ0IG9mXG4gICAgICAgICAgICAvLyBhcHBsaWNhdGlvbiB3aWxsIGJlIGNvbnRyb2xsZWQgYnkgem9uZSwgc29tZSBhcmUgbm90XG4gICAgICAgICAgICBkZWxlZ2F0ZSAmJiBkZWxlZ2F0ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBwYXRjaENhbGxiYWNrcyhhcGksIHRhcmdldCwgdGFyZ2V0TmFtZSwgbWV0aG9kLCBjYWxsYmFja3MpIHtcbiAgICBjb25zdCBzeW1ib2wgPSBab25lLl9fc3ltYm9sX18obWV0aG9kKTtcbiAgICBpZiAodGFyZ2V0W3N5bWJvbF0pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBuYXRpdmVEZWxlZ2F0ZSA9IHRhcmdldFtzeW1ib2xdID0gdGFyZ2V0W21ldGhvZF07XG4gICAgdGFyZ2V0W21ldGhvZF0gPSBmdW5jdGlvbiAobmFtZSwgb3B0cywgb3B0aW9ucykge1xuICAgICAgICBpZiAob3B0cyAmJiBvcHRzLnByb3RvdHlwZSkge1xuICAgICAgICAgICAgY2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc291cmNlID0gYCR7dGFyZ2V0TmFtZX0uJHttZXRob2R9OjpgICsgY2FsbGJhY2s7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJvdG90eXBlID0gb3B0cy5wcm90b3R5cGU7XG4gICAgICAgICAgICAgICAgLy8gTm90ZTogdGhlIGBwYXRjaENhbGxiYWNrc2AgaXMgdXNlZCBmb3IgcGF0Y2hpbmcgdGhlIGBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnRgIGFuZFxuICAgICAgICAgICAgICAgIC8vIGBjdXN0b21FbGVtZW50cy5kZWZpbmVgLiBXZSBleHBsaWNpdGx5IHdyYXAgdGhlIHBhdGNoaW5nIGNvZGUgaW50byB0cnktY2F0Y2ggc2luY2VcbiAgICAgICAgICAgICAgICAvLyBjYWxsYmFja3MgbWF5IGJlIGFscmVhZHkgcGF0Y2hlZCBieSBvdGhlciB3ZWIgY29tcG9uZW50cyBmcmFtZXdvcmtzIChlLmcuIExXQyksIGFuZCB0aGV5XG4gICAgICAgICAgICAgICAgLy8gbWFrZSB0aG9zZSBwcm9wZXJ0aWVzIG5vbi13cml0YWJsZS4gVGhpcyBtZWFucyB0aGF0IHBhdGNoaW5nIGNhbGxiYWNrIHdpbGwgdGhyb3cgYW4gZXJyb3JcbiAgICAgICAgICAgICAgICAvLyBgY2Fubm90IGFzc2lnbiB0byByZWFkLW9ubHkgcHJvcGVydHlgLiBTZWUgdGhpcyBjb2RlIGFzIGFuIGV4YW1wbGU6XG4gICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3NhbGVzZm9yY2UvbHdjL2Jsb2IvbWFzdGVyL3BhY2thZ2VzL0Bsd2MvZW5naW5lLWNvcmUvc3JjL2ZyYW1ld29yay9iYXNlLWJyaWRnZS1lbGVtZW50LnRzI0wxODAtTDE4NlxuICAgICAgICAgICAgICAgIC8vIFdlIGRvbid0IHdhbnQgdG8gc3RvcCB0aGUgYXBwbGljYXRpb24gcmVuZGVyaW5nIGlmIHdlIGNvdWxkbid0IHBhdGNoIHNvbWVcbiAgICAgICAgICAgICAgICAvLyBjYWxsYmFjaywgZS5nLiBgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrYC5cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvdG90eXBlLmhhc093blByb3BlcnR5KGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVzY3JpcHRvciA9IGFwaS5PYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG90eXBlLCBjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVzY3JpcHRvciAmJiBkZXNjcmlwdG9yLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRvci52YWx1ZSA9IGFwaS53cmFwV2l0aEN1cnJlbnRab25lKGRlc2NyaXB0b3IudmFsdWUsIHNvdXJjZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBpLl9yZWRlZmluZVByb3BlcnR5KG9wdHMucHJvdG90eXBlLCBjYWxsYmFjaywgZGVzY3JpcHRvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChwcm90b3R5cGVbY2FsbGJhY2tdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvdG90eXBlW2NhbGxiYWNrXSA9IGFwaS53cmFwV2l0aEN1cnJlbnRab25lKHByb3RvdHlwZVtjYWxsYmFja10sIHNvdXJjZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocHJvdG90eXBlW2NhbGxiYWNrXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvdG90eXBlW2NhbGxiYWNrXSA9IGFwaS53cmFwV2l0aEN1cnJlbnRab25lKHByb3RvdHlwZVtjYWxsYmFja10sIHNvdXJjZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2gge1xuICAgICAgICAgICAgICAgICAgICAvLyBOb3RlOiB3ZSBsZWF2ZSB0aGUgY2F0Y2ggYmxvY2sgZW1wdHkgc2luY2UgdGhlcmUncyBubyB3YXkgdG8gaGFuZGxlIHRoZSBlcnJvciByZWxhdGVkXG4gICAgICAgICAgICAgICAgICAgIC8vIHRvIG5vbi13cml0YWJsZSBwcm9wZXJ0eS5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmF0aXZlRGVsZWdhdGUuY2FsbCh0YXJnZXQsIG5hbWUsIG9wdHMsIG9wdGlvbnMpO1xuICAgIH07XG4gICAgYXBpLmF0dGFjaE9yaWdpblRvUGF0Y2hlZCh0YXJnZXRbbWV0aG9kXSwgbmF0aXZlRGVsZWdhdGUpO1xufVxuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXdcbiAqIEBzdXBwcmVzcyB7Z2xvYmFsVGhpc31cbiAqL1xuZnVuY3Rpb24gZmlsdGVyUHJvcGVydGllcyh0YXJnZXQsIG9uUHJvcGVydGllcywgaWdub3JlUHJvcGVydGllcykge1xuICAgIGlmICghaWdub3JlUHJvcGVydGllcyB8fCBpZ25vcmVQcm9wZXJ0aWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gb25Qcm9wZXJ0aWVzO1xuICAgIH1cbiAgICBjb25zdCB0aXAgPSBpZ25vcmVQcm9wZXJ0aWVzLmZpbHRlcihpcCA9PiBpcC50YXJnZXQgPT09IHRhcmdldCk7XG4gICAgaWYgKCF0aXAgfHwgdGlwLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gb25Qcm9wZXJ0aWVzO1xuICAgIH1cbiAgICBjb25zdCB0YXJnZXRJZ25vcmVQcm9wZXJ0aWVzID0gdGlwWzBdLmlnbm9yZVByb3BlcnRpZXM7XG4gICAgcmV0dXJuIG9uUHJvcGVydGllcy5maWx0ZXIob3AgPT4gdGFyZ2V0SWdub3JlUHJvcGVydGllcy5pbmRleE9mKG9wKSA9PT0gLTEpO1xufVxuZnVuY3Rpb24gcGF0Y2hGaWx0ZXJlZFByb3BlcnRpZXModGFyZ2V0LCBvblByb3BlcnRpZXMsIGlnbm9yZVByb3BlcnRpZXMsIHByb3RvdHlwZSkge1xuICAgIC8vIGNoZWNrIHdoZXRoZXIgdGFyZ2V0IGlzIGF2YWlsYWJsZSwgc29tZXRpbWVzIHRhcmdldCB3aWxsIGJlIHVuZGVmaW5lZFxuICAgIC8vIGJlY2F1c2UgZGlmZmVyZW50IGJyb3dzZXIgb3Igc29tZSAzcmQgcGFydHkgcGx1Z2luLlxuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZmlsdGVyZWRQcm9wZXJ0aWVzID0gZmlsdGVyUHJvcGVydGllcyh0YXJnZXQsIG9uUHJvcGVydGllcywgaWdub3JlUHJvcGVydGllcyk7XG4gICAgcGF0Y2hPblByb3BlcnRpZXModGFyZ2V0LCBmaWx0ZXJlZFByb3BlcnRpZXMsIHByb3RvdHlwZSk7XG59XG4vKipcbiAqIEdldCBhbGwgZXZlbnQgbmFtZSBwcm9wZXJ0aWVzIHdoaWNoIHRoZSBldmVudCBuYW1lIHN0YXJ0c1dpdGggYG9uYFxuICogZnJvbSB0aGUgdGFyZ2V0IG9iamVjdCBpdHNlbGYsIGluaGVyaXRlZCBwcm9wZXJ0aWVzIGFyZSBub3QgY29uc2lkZXJlZC5cbiAqL1xuZnVuY3Rpb24gZ2V0T25FdmVudE5hbWVzKHRhcmdldCkge1xuICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0YXJnZXQpXG4gICAgICAgIC5maWx0ZXIobmFtZSA9PiBuYW1lLnN0YXJ0c1dpdGgoJ29uJykgJiYgbmFtZS5sZW5ndGggPiAyKVxuICAgICAgICAubWFwKG5hbWUgPT4gbmFtZS5zdWJzdHJpbmcoMikpO1xufVxuZnVuY3Rpb24gcHJvcGVydHlEZXNjcmlwdG9yUGF0Y2goYXBpLCBfZ2xvYmFsKSB7XG4gICAgaWYgKGlzTm9kZSAmJiAhaXNNaXgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoWm9uZVthcGkuc3ltYm9sKCdwYXRjaEV2ZW50cycpXSkge1xuICAgICAgICAvLyBldmVudHMgYXJlIGFscmVhZHkgYmVlbiBwYXRjaGVkIGJ5IGxlZ2FjeSBwYXRjaC5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpZ25vcmVQcm9wZXJ0aWVzID0gX2dsb2JhbFsnX19ab25lX2lnbm9yZV9vbl9wcm9wZXJ0aWVzJ107XG4gICAgLy8gZm9yIGJyb3dzZXJzIHRoYXQgd2UgY2FuIHBhdGNoIHRoZSBkZXNjcmlwdG9yOiAgQ2hyb21lICYgRmlyZWZveFxuICAgIGxldCBwYXRjaFRhcmdldHMgPSBbXTtcbiAgICBpZiAoaXNCcm93c2VyKSB7XG4gICAgICAgIGNvbnN0IGludGVybmFsV2luZG93ID0gd2luZG93O1xuICAgICAgICBwYXRjaFRhcmdldHMgPSBwYXRjaFRhcmdldHMuY29uY2F0KFtcbiAgICAgICAgICAgICdEb2N1bWVudCcsICdTVkdFbGVtZW50JywgJ0VsZW1lbnQnLCAnSFRNTEVsZW1lbnQnLCAnSFRNTEJvZHlFbGVtZW50JywgJ0hUTUxNZWRpYUVsZW1lbnQnLFxuICAgICAgICAgICAgJ0hUTUxGcmFtZVNldEVsZW1lbnQnLCAnSFRNTEZyYW1lRWxlbWVudCcsICdIVE1MSUZyYW1lRWxlbWVudCcsICdIVE1MTWFycXVlZUVsZW1lbnQnLCAnV29ya2VyJ1xuICAgICAgICBdKTtcbiAgICAgICAgY29uc3QgaWdub3JlRXJyb3JQcm9wZXJ0aWVzID0gaXNJRSgpID8gW3sgdGFyZ2V0OiBpbnRlcm5hbFdpbmRvdywgaWdub3JlUHJvcGVydGllczogWydlcnJvciddIH1dIDogW107XG4gICAgICAgIC8vIGluIElFL0VkZ2UsIG9uUHJvcCBub3QgZXhpc3QgaW4gd2luZG93IG9iamVjdCwgYnV0IGluIFdpbmRvd1Byb3RvdHlwZVxuICAgICAgICAvLyBzbyB3ZSBuZWVkIHRvIHBhc3MgV2luZG93UHJvdG90eXBlIHRvIGNoZWNrIG9uUHJvcCBleGlzdCBvciBub3RcbiAgICAgICAgcGF0Y2hGaWx0ZXJlZFByb3BlcnRpZXMoaW50ZXJuYWxXaW5kb3csIGdldE9uRXZlbnROYW1lcyhpbnRlcm5hbFdpbmRvdyksIGlnbm9yZVByb3BlcnRpZXMgPyBpZ25vcmVQcm9wZXJ0aWVzLmNvbmNhdChpZ25vcmVFcnJvclByb3BlcnRpZXMpIDogaWdub3JlUHJvcGVydGllcywgT2JqZWN0R2V0UHJvdG90eXBlT2YoaW50ZXJuYWxXaW5kb3cpKTtcbiAgICB9XG4gICAgcGF0Y2hUYXJnZXRzID0gcGF0Y2hUYXJnZXRzLmNvbmNhdChbXG4gICAgICAgICdYTUxIdHRwUmVxdWVzdCcsICdYTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0JywgJ0lEQkluZGV4JywgJ0lEQlJlcXVlc3QnLCAnSURCT3BlbkRCUmVxdWVzdCcsXG4gICAgICAgICdJREJEYXRhYmFzZScsICdJREJUcmFuc2FjdGlvbicsICdJREJDdXJzb3InLCAnV2ViU29ja2V0J1xuICAgIF0pO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGF0Y2hUYXJnZXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IF9nbG9iYWxbcGF0Y2hUYXJnZXRzW2ldXTtcbiAgICAgICAgdGFyZ2V0ICYmIHRhcmdldC5wcm90b3R5cGUgJiZcbiAgICAgICAgICAgIHBhdGNoRmlsdGVyZWRQcm9wZXJ0aWVzKHRhcmdldC5wcm90b3R5cGUsIGdldE9uRXZlbnROYW1lcyh0YXJnZXQucHJvdG90eXBlKSwgaWdub3JlUHJvcGVydGllcyk7XG4gICAgfVxufVxuXG5ab25lLl9fbG9hZF9wYXRjaCgndXRpbCcsIChnbG9iYWwsIFpvbmUsIGFwaSkgPT4ge1xuICAgIC8vIENvbGxlY3QgbmF0aXZlIGV2ZW50IG5hbWVzIGJ5IGxvb2tpbmcgYXQgcHJvcGVydGllc1xuICAgIC8vIG9uIHRoZSBnbG9iYWwgbmFtZXNwYWNlLCBlLmcuICdvbmNsaWNrJy5cbiAgICBjb25zdCBldmVudE5hbWVzID0gZ2V0T25FdmVudE5hbWVzKGdsb2JhbCk7XG4gICAgYXBpLnBhdGNoT25Qcm9wZXJ0aWVzID0gcGF0Y2hPblByb3BlcnRpZXM7XG4gICAgYXBpLnBhdGNoTWV0aG9kID0gcGF0Y2hNZXRob2Q7XG4gICAgYXBpLmJpbmRBcmd1bWVudHMgPSBiaW5kQXJndW1lbnRzO1xuICAgIGFwaS5wYXRjaE1hY3JvVGFzayA9IHBhdGNoTWFjcm9UYXNrO1xuICAgIC8vIEluIGVhcmxpZXIgdmVyc2lvbiBvZiB6b25lLmpzICg8MC45LjApLCB3ZSB1c2UgZW52IG5hbWUgYF9fem9uZV9zeW1ib2xfX0JMQUNLX0xJU1RFRF9FVkVOVFNgIHRvXG4gICAgLy8gZGVmaW5lIHdoaWNoIGV2ZW50cyB3aWxsIG5vdCBiZSBwYXRjaGVkIGJ5IGBab25lLmpzYC5cbiAgICAvLyBJbiBuZXdlciB2ZXJzaW9uICg+PTAuOS4wKSwgd2UgY2hhbmdlIHRoZSBlbnYgbmFtZSB0byBgX196b25lX3N5bWJvbF9fVU5QQVRDSEVEX0VWRU5UU2AgdG8ga2VlcFxuICAgIC8vIHRoZSBuYW1lIGNvbnNpc3RlbnQgd2l0aCBhbmd1bGFyIHJlcG8uXG4gICAgLy8gVGhlICBgX196b25lX3N5bWJvbF9fQkxBQ0tfTElTVEVEX0VWRU5UU2AgaXMgZGVwcmVjYXRlZCwgYnV0IGl0IGlzIHN0aWxsIGJlIHN1cHBvcnRlZCBmb3JcbiAgICAvLyBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS5cbiAgICBjb25zdCBTWU1CT0xfQkxBQ0tfTElTVEVEX0VWRU5UUyA9IFpvbmUuX19zeW1ib2xfXygnQkxBQ0tfTElTVEVEX0VWRU5UUycpO1xuICAgIGNvbnN0IFNZTUJPTF9VTlBBVENIRURfRVZFTlRTID0gWm9uZS5fX3N5bWJvbF9fKCdVTlBBVENIRURfRVZFTlRTJyk7XG4gICAgaWYgKGdsb2JhbFtTWU1CT0xfVU5QQVRDSEVEX0VWRU5UU10pIHtcbiAgICAgICAgZ2xvYmFsW1NZTUJPTF9CTEFDS19MSVNURURfRVZFTlRTXSA9IGdsb2JhbFtTWU1CT0xfVU5QQVRDSEVEX0VWRU5UU107XG4gICAgfVxuICAgIGlmIChnbG9iYWxbU1lNQk9MX0JMQUNLX0xJU1RFRF9FVkVOVFNdKSB7XG4gICAgICAgIFpvbmVbU1lNQk9MX0JMQUNLX0xJU1RFRF9FVkVOVFNdID0gWm9uZVtTWU1CT0xfVU5QQVRDSEVEX0VWRU5UU10gPVxuICAgICAgICAgICAgZ2xvYmFsW1NZTUJPTF9CTEFDS19MSVNURURfRVZFTlRTXTtcbiAgICB9XG4gICAgYXBpLnBhdGNoRXZlbnRQcm90b3R5cGUgPSBwYXRjaEV2ZW50UHJvdG90eXBlO1xuICAgIGFwaS5wYXRjaEV2ZW50VGFyZ2V0ID0gcGF0Y2hFdmVudFRhcmdldDtcbiAgICBhcGkuaXNJRU9yRWRnZSA9IGlzSUVPckVkZ2U7XG4gICAgYXBpLk9iamVjdERlZmluZVByb3BlcnR5ID0gT2JqZWN0RGVmaW5lUHJvcGVydHk7XG4gICAgYXBpLk9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgICBhcGkuT2JqZWN0Q3JlYXRlID0gT2JqZWN0Q3JlYXRlO1xuICAgIGFwaS5BcnJheVNsaWNlID0gQXJyYXlTbGljZTtcbiAgICBhcGkucGF0Y2hDbGFzcyA9IHBhdGNoQ2xhc3M7XG4gICAgYXBpLndyYXBXaXRoQ3VycmVudFpvbmUgPSB3cmFwV2l0aEN1cnJlbnRab25lO1xuICAgIGFwaS5maWx0ZXJQcm9wZXJ0aWVzID0gZmlsdGVyUHJvcGVydGllcztcbiAgICBhcGkuYXR0YWNoT3JpZ2luVG9QYXRjaGVkID0gYXR0YWNoT3JpZ2luVG9QYXRjaGVkO1xuICAgIGFwaS5fcmVkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbiAgICBhcGkucGF0Y2hDYWxsYmFja3MgPSBwYXRjaENhbGxiYWNrcztcbiAgICBhcGkuZ2V0R2xvYmFsT2JqZWN0cyA9ICgpID0+ICh7XG4gICAgICAgIGdsb2JhbFNvdXJjZXMsXG4gICAgICAgIHpvbmVTeW1ib2xFdmVudE5hbWVzLFxuICAgICAgICBldmVudE5hbWVzLFxuICAgICAgICBpc0Jyb3dzZXIsXG4gICAgICAgIGlzTWl4LFxuICAgICAgICBpc05vZGUsXG4gICAgICAgIFRSVUVfU1RSLFxuICAgICAgICBGQUxTRV9TVFIsXG4gICAgICAgIFpPTkVfU1lNQk9MX1BSRUZJWCxcbiAgICAgICAgQUREX0VWRU5UX0xJU1RFTkVSX1NUUixcbiAgICAgICAgUkVNT1ZFX0VWRU5UX0xJU1RFTkVSX1NUUlxuICAgIH0pO1xufSk7XG5cbi8qKlxuICogQGZpbGVvdmVydmlld1xuICogQHN1cHByZXNzIHttaXNzaW5nUmVxdWlyZX1cbiAqL1xuZnVuY3Rpb24gcGF0Y2hRdWV1ZU1pY3JvdGFzayhnbG9iYWwsIGFwaSkge1xuICAgIGFwaS5wYXRjaE1ldGhvZChnbG9iYWwsICdxdWV1ZU1pY3JvdGFzaycsIChkZWxlZ2F0ZSkgPT4ge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHNlbGYsIGFyZ3MpIHtcbiAgICAgICAgICAgIFpvbmUuY3VycmVudC5zY2hlZHVsZU1pY3JvVGFzaygncXVldWVNaWNyb3Rhc2snLCBhcmdzWzBdKTtcbiAgICAgICAgfTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3XG4gKiBAc3VwcHJlc3Mge21pc3NpbmdSZXF1aXJlfVxuICovXG5jb25zdCB0YXNrU3ltYm9sID0gem9uZVN5bWJvbCgnem9uZVRhc2snKTtcbmZ1bmN0aW9uIHBhdGNoVGltZXIod2luZG93LCBzZXROYW1lLCBjYW5jZWxOYW1lLCBuYW1lU3VmZml4KSB7XG4gICAgbGV0IHNldE5hdGl2ZSA9IG51bGw7XG4gICAgbGV0IGNsZWFyTmF0aXZlID0gbnVsbDtcbiAgICBzZXROYW1lICs9IG5hbWVTdWZmaXg7XG4gICAgY2FuY2VsTmFtZSArPSBuYW1lU3VmZml4O1xuICAgIGNvbnN0IHRhc2tzQnlIYW5kbGVJZCA9IHt9O1xuICAgIGZ1bmN0aW9uIHNjaGVkdWxlVGFzayh0YXNrKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0YXNrLmRhdGE7XG4gICAgICAgIGRhdGEuYXJnc1swXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0YXNrLmludm9rZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgICAgICBkYXRhLmhhbmRsZUlkID0gc2V0TmF0aXZlLmFwcGx5KHdpbmRvdywgZGF0YS5hcmdzKTtcbiAgICAgICAgcmV0dXJuIHRhc2s7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNsZWFyVGFzayh0YXNrKSB7XG4gICAgICAgIHJldHVybiBjbGVhck5hdGl2ZS5jYWxsKHdpbmRvdywgdGFzay5kYXRhLmhhbmRsZUlkKTtcbiAgICB9XG4gICAgc2V0TmF0aXZlID1cbiAgICAgICAgcGF0Y2hNZXRob2Qod2luZG93LCBzZXROYW1lLCAoZGVsZWdhdGUpID0+IGZ1bmN0aW9uIChzZWxmLCBhcmdzKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3NbMF0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBpc1BlcmlvZGljOiBuYW1lU3VmZml4ID09PSAnSW50ZXJ2YWwnLFxuICAgICAgICAgICAgICAgICAgICBkZWxheTogKG5hbWVTdWZmaXggPT09ICdUaW1lb3V0JyB8fCBuYW1lU3VmZml4ID09PSAnSW50ZXJ2YWwnKSA/IGFyZ3NbMV0gfHwgMCA6XG4gICAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IGFyZ3NcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gYXJnc1swXTtcbiAgICAgICAgICAgICAgICBhcmdzWzBdID0gZnVuY3Rpb24gdGltZXIoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlzc3VlLTkzNCwgdGFzayB3aWxsIGJlIGNhbmNlbGxlZFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXZlbiBpdCBpcyBhIHBlcmlvZGljIHRhc2sgc3VjaCBhc1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0SW50ZXJ2YWxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzQwMzg3XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDbGVhbnVwIHRhc2tzQnlIYW5kbGVJZCBzaG91bGQgYmUgaGFuZGxlZCBiZWZvcmUgc2NoZWR1bGVUYXNrXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTaW5jZSBzb21lIHpvbmVTcGVjIG1heSBpbnRlcmNlcHQgYW5kIGRvZXNuJ3QgdHJpZ2dlclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2NoZWR1bGVGbihzY2hlZHVsZVRhc2spIHByb3ZpZGVkIGhlcmUuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShvcHRpb25zLmlzUGVyaW9kaWMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmhhbmRsZUlkID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbiBub24tbm9kZWpzIGVudiwgd2UgcmVtb3ZlIHRpbWVySWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZnJvbSBsb2NhbCBjYWNoZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGFza3NCeUhhbmRsZUlkW29wdGlvbnMuaGFuZGxlSWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChvcHRpb25zLmhhbmRsZUlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vZGUgcmV0dXJucyBjb21wbGV4IG9iamVjdHMgYXMgaGFuZGxlSWRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIHJlbW92ZSB0YXNrIHJlZmVyZW5jZSBmcm9tIHRpbWVyIG9iamVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmhhbmRsZUlkW3Rhc2tTeW1ib2xdID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhc2sgPSBzY2hlZHVsZU1hY3JvVGFza1dpdGhDdXJyZW50Wm9uZShzZXROYW1lLCBhcmdzWzBdLCBvcHRpb25zLCBzY2hlZHVsZVRhc2ssIGNsZWFyVGFzayk7XG4gICAgICAgICAgICAgICAgaWYgKCF0YXNrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0YXNrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBOb2RlLmpzIG11c3QgYWRkaXRpb25hbGx5IHN1cHBvcnQgdGhlIHJlZiBhbmQgdW5yZWYgZnVuY3Rpb25zLlxuICAgICAgICAgICAgICAgIGNvbnN0IGhhbmRsZSA9IHRhc2suZGF0YS5oYW5kbGVJZDtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGhhbmRsZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZm9yIG5vbiBub2RlanMgZW52LCB3ZSBzYXZlIGhhbmRsZUlkOiB0YXNrXG4gICAgICAgICAgICAgICAgICAgIC8vIG1hcHBpbmcgaW4gbG9jYWwgY2FjaGUgZm9yIGNsZWFyVGltZW91dFxuICAgICAgICAgICAgICAgICAgICB0YXNrc0J5SGFuZGxlSWRbaGFuZGxlXSA9IHRhc2s7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGhhbmRsZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBmb3Igbm9kZWpzIGVudiwgd2Ugc2F2ZSB0YXNrXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlZmVyZW5jZSBpbiB0aW1lcklkIE9iamVjdCBmb3IgY2xlYXJUaW1lb3V0XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZVt0YXNrU3ltYm9sXSA9IHRhc2s7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGNoZWNrIHdoZXRoZXIgaGFuZGxlIGlzIG51bGwsIGJlY2F1c2Ugc29tZSBwb2x5ZmlsbCBvciBicm93c2VyXG4gICAgICAgICAgICAgICAgLy8gbWF5IHJldHVybiB1bmRlZmluZWQgZnJvbSBzZXRUaW1lb3V0L3NldEludGVydmFsL3NldEltbWVkaWF0ZS9yZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgICAgICAgICAgICAgICBpZiAoaGFuZGxlICYmIGhhbmRsZS5yZWYgJiYgaGFuZGxlLnVucmVmICYmIHR5cGVvZiBoYW5kbGUucmVmID09PSAnZnVuY3Rpb24nICYmXG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiBoYW5kbGUudW5yZWYgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFzay5yZWYgPSBoYW5kbGUucmVmLmJpbmQoaGFuZGxlKTtcbiAgICAgICAgICAgICAgICAgICAgdGFzay51bnJlZiA9IGhhbmRsZS51bnJlZi5iaW5kKGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaGFuZGxlID09PSAnbnVtYmVyJyB8fCBoYW5kbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhc2s7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBjYXVzZSBhbiBlcnJvciBieSBjYWxsaW5nIGl0IGRpcmVjdGx5LlxuICAgICAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5hcHBseSh3aW5kb3csIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICBjbGVhck5hdGl2ZSA9XG4gICAgICAgIHBhdGNoTWV0aG9kKHdpbmRvdywgY2FuY2VsTmFtZSwgKGRlbGVnYXRlKSA9PiBmdW5jdGlvbiAoc2VsZiwgYXJncykge1xuICAgICAgICAgICAgY29uc3QgaWQgPSBhcmdzWzBdO1xuICAgICAgICAgICAgbGV0IHRhc2s7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGlkID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIC8vIG5vbiBub2RlanMgZW52LlxuICAgICAgICAgICAgICAgIHRhc2sgPSB0YXNrc0J5SGFuZGxlSWRbaWRdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gbm9kZWpzIGVudi5cbiAgICAgICAgICAgICAgICB0YXNrID0gaWQgJiYgaWRbdGFza1N5bWJvbF07XG4gICAgICAgICAgICAgICAgLy8gb3RoZXIgZW52aXJvbm1lbnRzLlxuICAgICAgICAgICAgICAgIGlmICghdGFzaykge1xuICAgICAgICAgICAgICAgICAgICB0YXNrID0gaWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRhc2sgJiYgdHlwZW9mIHRhc2sudHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBpZiAodGFzay5zdGF0ZSAhPT0gJ25vdFNjaGVkdWxlZCcgJiZcbiAgICAgICAgICAgICAgICAgICAgKHRhc2suY2FuY2VsRm4gJiYgdGFzay5kYXRhLmlzUGVyaW9kaWMgfHwgdGFzay5ydW5Db3VudCA9PT0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpZCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0YXNrc0J5SGFuZGxlSWRbaWRdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZFt0YXNrU3ltYm9sXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gRG8gbm90IGNhbmNlbCBhbHJlYWR5IGNhbmNlbGVkIGZ1bmN0aW9uc1xuICAgICAgICAgICAgICAgICAgICB0YXNrLnpvbmUuY2FuY2VsVGFzayh0YXNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBjYXVzZSBhbiBlcnJvciBieSBjYWxsaW5nIGl0IGRpcmVjdGx5LlxuICAgICAgICAgICAgICAgIGRlbGVnYXRlLmFwcGx5KHdpbmRvdywgYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xufVxuXG5mdW5jdGlvbiBwYXRjaEN1c3RvbUVsZW1lbnRzKF9nbG9iYWwsIGFwaSkge1xuICAgIGNvbnN0IHsgaXNCcm93c2VyLCBpc01peCB9ID0gYXBpLmdldEdsb2JhbE9iamVjdHMoKTtcbiAgICBpZiAoKCFpc0Jyb3dzZXIgJiYgIWlzTWl4KSB8fCAhX2dsb2JhbFsnY3VzdG9tRWxlbWVudHMnXSB8fCAhKCdjdXN0b21FbGVtZW50cycgaW4gX2dsb2JhbCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9jdXN0b20tZWxlbWVudHMuaHRtbCNjb25jZXB0LWN1c3RvbS1lbGVtZW50LWRlZmluaXRpb24tbGlmZWN5Y2xlLWNhbGxiYWNrc1xuICAgIGNvbnN0IGNhbGxiYWNrcyA9IFtcbiAgICAgICAgJ2Nvbm5lY3RlZENhbGxiYWNrJywgJ2Rpc2Nvbm5lY3RlZENhbGxiYWNrJywgJ2Fkb3B0ZWRDYWxsYmFjaycsICdhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2snLFxuICAgICAgICAnZm9ybUFzc29jaWF0ZWRDYWxsYmFjaycsICdmb3JtRGlzYWJsZWRDYWxsYmFjaycsICdmb3JtUmVzZXRDYWxsYmFjaycsXG4gICAgICAgICdmb3JtU3RhdGVSZXN0b3JlQ2FsbGJhY2snXG4gICAgXTtcbiAgICBhcGkucGF0Y2hDYWxsYmFja3MoYXBpLCBfZ2xvYmFsLmN1c3RvbUVsZW1lbnRzLCAnY3VzdG9tRWxlbWVudHMnLCAnZGVmaW5lJywgY2FsbGJhY2tzKTtcbn1cblxuZnVuY3Rpb24gZXZlbnRUYXJnZXRQYXRjaChfZ2xvYmFsLCBhcGkpIHtcbiAgICBpZiAoWm9uZVthcGkuc3ltYm9sKCdwYXRjaEV2ZW50VGFyZ2V0JyldKSB7XG4gICAgICAgIC8vIEV2ZW50VGFyZ2V0IGlzIGFscmVhZHkgcGF0Y2hlZC5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB7IGV2ZW50TmFtZXMsIHpvbmVTeW1ib2xFdmVudE5hbWVzLCBUUlVFX1NUUiwgRkFMU0VfU1RSLCBaT05FX1NZTUJPTF9QUkVGSVggfSA9IGFwaS5nZXRHbG9iYWxPYmplY3RzKCk7XG4gICAgLy8gIHByZWRlZmluZSBhbGwgX196b25lX3N5bWJvbF9fICsgZXZlbnROYW1lICsgdHJ1ZS9mYWxzZSBzdHJpbmdcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50TmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZXZlbnROYW1lID0gZXZlbnROYW1lc1tpXTtcbiAgICAgICAgY29uc3QgZmFsc2VFdmVudE5hbWUgPSBldmVudE5hbWUgKyBGQUxTRV9TVFI7XG4gICAgICAgIGNvbnN0IHRydWVFdmVudE5hbWUgPSBldmVudE5hbWUgKyBUUlVFX1NUUjtcbiAgICAgICAgY29uc3Qgc3ltYm9sID0gWk9ORV9TWU1CT0xfUFJFRklYICsgZmFsc2VFdmVudE5hbWU7XG4gICAgICAgIGNvbnN0IHN5bWJvbENhcHR1cmUgPSBaT05FX1NZTUJPTF9QUkVGSVggKyB0cnVlRXZlbnROYW1lO1xuICAgICAgICB6b25lU3ltYm9sRXZlbnROYW1lc1tldmVudE5hbWVdID0ge307XG4gICAgICAgIHpvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50TmFtZV1bRkFMU0VfU1RSXSA9IHN5bWJvbDtcbiAgICAgICAgem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnROYW1lXVtUUlVFX1NUUl0gPSBzeW1ib2xDYXB0dXJlO1xuICAgIH1cbiAgICBjb25zdCBFVkVOVF9UQVJHRVQgPSBfZ2xvYmFsWydFdmVudFRhcmdldCddO1xuICAgIGlmICghRVZFTlRfVEFSR0VUIHx8ICFFVkVOVF9UQVJHRVQucHJvdG90eXBlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXBpLnBhdGNoRXZlbnRUYXJnZXQoX2dsb2JhbCwgYXBpLCBbRVZFTlRfVEFSR0VUICYmIEVWRU5UX1RBUkdFVC5wcm90b3R5cGVdKTtcbiAgICByZXR1cm4gdHJ1ZTtcbn1cbmZ1bmN0aW9uIHBhdGNoRXZlbnQoZ2xvYmFsLCBhcGkpIHtcbiAgICBhcGkucGF0Y2hFdmVudFByb3RvdHlwZShnbG9iYWwsIGFwaSk7XG59XG5cbi8qKlxuICogQGZpbGVvdmVydmlld1xuICogQHN1cHByZXNzIHttaXNzaW5nUmVxdWlyZX1cbiAqL1xuWm9uZS5fX2xvYWRfcGF0Y2goJ2xlZ2FjeScsIChnbG9iYWwpID0+IHtcbiAgICBjb25zdCBsZWdhY3lQYXRjaCA9IGdsb2JhbFtab25lLl9fc3ltYm9sX18oJ2xlZ2FjeVBhdGNoJyldO1xuICAgIGlmIChsZWdhY3lQYXRjaCkge1xuICAgICAgICBsZWdhY3lQYXRjaCgpO1xuICAgIH1cbn0pO1xuWm9uZS5fX2xvYWRfcGF0Y2goJ3RpbWVycycsIChnbG9iYWwpID0+IHtcbiAgICBjb25zdCBzZXQgPSAnc2V0JztcbiAgICBjb25zdCBjbGVhciA9ICdjbGVhcic7XG4gICAgcGF0Y2hUaW1lcihnbG9iYWwsIHNldCwgY2xlYXIsICdUaW1lb3V0Jyk7XG4gICAgcGF0Y2hUaW1lcihnbG9iYWwsIHNldCwgY2xlYXIsICdJbnRlcnZhbCcpO1xuICAgIHBhdGNoVGltZXIoZ2xvYmFsLCBzZXQsIGNsZWFyLCAnSW1tZWRpYXRlJyk7XG59KTtcblpvbmUuX19sb2FkX3BhdGNoKCdyZXF1ZXN0QW5pbWF0aW9uRnJhbWUnLCAoZ2xvYmFsKSA9PiB7XG4gICAgcGF0Y2hUaW1lcihnbG9iYWwsICdyZXF1ZXN0JywgJ2NhbmNlbCcsICdBbmltYXRpb25GcmFtZScpO1xuICAgIHBhdGNoVGltZXIoZ2xvYmFsLCAnbW96UmVxdWVzdCcsICdtb3pDYW5jZWwnLCAnQW5pbWF0aW9uRnJhbWUnKTtcbiAgICBwYXRjaFRpbWVyKGdsb2JhbCwgJ3dlYmtpdFJlcXVlc3QnLCAnd2Via2l0Q2FuY2VsJywgJ0FuaW1hdGlvbkZyYW1lJyk7XG59KTtcblpvbmUuX19sb2FkX3BhdGNoKCdibG9ja2luZycsIChnbG9iYWwsIFpvbmUpID0+IHtcbiAgICBjb25zdCBibG9ja2luZ01ldGhvZHMgPSBbJ2FsZXJ0JywgJ3Byb21wdCcsICdjb25maXJtJ107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9ja2luZ01ldGhvZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IGJsb2NraW5nTWV0aG9kc1tpXTtcbiAgICAgICAgcGF0Y2hNZXRob2QoZ2xvYmFsLCBuYW1lLCAoZGVsZWdhdGUsIHN5bWJvbCwgbmFtZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChzLCBhcmdzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFpvbmUuY3VycmVudC5ydW4oZGVsZWdhdGUsIGdsb2JhbCwgYXJncywgbmFtZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICB9XG59KTtcblpvbmUuX19sb2FkX3BhdGNoKCdFdmVudFRhcmdldCcsIChnbG9iYWwsIFpvbmUsIGFwaSkgPT4ge1xuICAgIHBhdGNoRXZlbnQoZ2xvYmFsLCBhcGkpO1xuICAgIGV2ZW50VGFyZ2V0UGF0Y2goZ2xvYmFsLCBhcGkpO1xuICAgIC8vIHBhdGNoIFhNTEh0dHBSZXF1ZXN0RXZlbnRUYXJnZXQncyBhZGRFdmVudExpc3RlbmVyL3JlbW92ZUV2ZW50TGlzdGVuZXJcbiAgICBjb25zdCBYTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0ID0gZ2xvYmFsWydYTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0J107XG4gICAgaWYgKFhNTEh0dHBSZXF1ZXN0RXZlbnRUYXJnZXQgJiYgWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldC5wcm90b3R5cGUpIHtcbiAgICAgICAgYXBpLnBhdGNoRXZlbnRUYXJnZXQoZ2xvYmFsLCBhcGksIFtYTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0LnByb3RvdHlwZV0pO1xuICAgIH1cbn0pO1xuWm9uZS5fX2xvYWRfcGF0Y2goJ011dGF0aW9uT2JzZXJ2ZXInLCAoZ2xvYmFsLCBab25lLCBhcGkpID0+IHtcbiAgICBwYXRjaENsYXNzKCdNdXRhdGlvbk9ic2VydmVyJyk7XG4gICAgcGF0Y2hDbGFzcygnV2ViS2l0TXV0YXRpb25PYnNlcnZlcicpO1xufSk7XG5ab25lLl9fbG9hZF9wYXRjaCgnSW50ZXJzZWN0aW9uT2JzZXJ2ZXInLCAoZ2xvYmFsLCBab25lLCBhcGkpID0+IHtcbiAgICBwYXRjaENsYXNzKCdJbnRlcnNlY3Rpb25PYnNlcnZlcicpO1xufSk7XG5ab25lLl9fbG9hZF9wYXRjaCgnRmlsZVJlYWRlcicsIChnbG9iYWwsIFpvbmUsIGFwaSkgPT4ge1xuICAgIHBhdGNoQ2xhc3MoJ0ZpbGVSZWFkZXInKTtcbn0pO1xuWm9uZS5fX2xvYWRfcGF0Y2goJ29uX3Byb3BlcnR5JywgKGdsb2JhbCwgWm9uZSwgYXBpKSA9PiB7XG4gICAgcHJvcGVydHlEZXNjcmlwdG9yUGF0Y2goYXBpLCBnbG9iYWwpO1xufSk7XG5ab25lLl9fbG9hZF9wYXRjaCgnY3VzdG9tRWxlbWVudHMnLCAoZ2xvYmFsLCBab25lLCBhcGkpID0+IHtcbiAgICBwYXRjaEN1c3RvbUVsZW1lbnRzKGdsb2JhbCwgYXBpKTtcbn0pO1xuWm9uZS5fX2xvYWRfcGF0Y2goJ1hIUicsIChnbG9iYWwsIFpvbmUpID0+IHtcbiAgICAvLyBUcmVhdCBYTUxIdHRwUmVxdWVzdCBhcyBhIG1hY3JvdGFzay5cbiAgICBwYXRjaFhIUihnbG9iYWwpO1xuICAgIGNvbnN0IFhIUl9UQVNLID0gem9uZVN5bWJvbCgneGhyVGFzaycpO1xuICAgIGNvbnN0IFhIUl9TWU5DID0gem9uZVN5bWJvbCgneGhyU3luYycpO1xuICAgIGNvbnN0IFhIUl9MSVNURU5FUiA9IHpvbmVTeW1ib2woJ3hockxpc3RlbmVyJyk7XG4gICAgY29uc3QgWEhSX1NDSEVEVUxFRCA9IHpvbmVTeW1ib2woJ3hoclNjaGVkdWxlZCcpO1xuICAgIGNvbnN0IFhIUl9VUkwgPSB6b25lU3ltYm9sKCd4aHJVUkwnKTtcbiAgICBjb25zdCBYSFJfRVJST1JfQkVGT1JFX1NDSEVEVUxFRCA9IHpvbmVTeW1ib2woJ3hockVycm9yQmVmb3JlU2NoZWR1bGVkJyk7XG4gICAgZnVuY3Rpb24gcGF0Y2hYSFIod2luZG93KSB7XG4gICAgICAgIGNvbnN0IFhNTEh0dHBSZXF1ZXN0ID0gd2luZG93WydYTUxIdHRwUmVxdWVzdCddO1xuICAgICAgICBpZiAoIVhNTEh0dHBSZXF1ZXN0KSB7XG4gICAgICAgICAgICAvLyBYTUxIdHRwUmVxdWVzdCBpcyBub3QgYXZhaWxhYmxlIGluIHNlcnZpY2Ugd29ya2VyXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgWE1MSHR0cFJlcXVlc3RQcm90b3R5cGUgPSBYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGU7XG4gICAgICAgIGZ1bmN0aW9uIGZpbmRQZW5kaW5nVGFzayh0YXJnZXQpIHtcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXRbWEhSX1RBU0tdO1xuICAgICAgICB9XG4gICAgICAgIGxldCBvcmlBZGRMaXN0ZW5lciA9IFhNTEh0dHBSZXF1ZXN0UHJvdG90eXBlW1pPTkVfU1lNQk9MX0FERF9FVkVOVF9MSVNURU5FUl07XG4gICAgICAgIGxldCBvcmlSZW1vdmVMaXN0ZW5lciA9IFhNTEh0dHBSZXF1ZXN0UHJvdG90eXBlW1pPTkVfU1lNQk9MX1JFTU9WRV9FVkVOVF9MSVNURU5FUl07XG4gICAgICAgIGlmICghb3JpQWRkTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IFhNTEh0dHBSZXF1ZXN0RXZlbnRUYXJnZXQgPSB3aW5kb3dbJ1hNTEh0dHBSZXF1ZXN0RXZlbnRUYXJnZXQnXTtcbiAgICAgICAgICAgIGlmIChYTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldFByb3RvdHlwZSA9IFhNTEh0dHBSZXF1ZXN0RXZlbnRUYXJnZXQucHJvdG90eXBlO1xuICAgICAgICAgICAgICAgIG9yaUFkZExpc3RlbmVyID0gWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldFByb3RvdHlwZVtaT05FX1NZTUJPTF9BRERfRVZFTlRfTElTVEVORVJdO1xuICAgICAgICAgICAgICAgIG9yaVJlbW92ZUxpc3RlbmVyID0gWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldFByb3RvdHlwZVtaT05FX1NZTUJPTF9SRU1PVkVfRVZFTlRfTElTVEVORVJdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IFJFQURZX1NUQVRFX0NIQU5HRSA9ICdyZWFkeXN0YXRlY2hhbmdlJztcbiAgICAgICAgY29uc3QgU0NIRURVTEVEID0gJ3NjaGVkdWxlZCc7XG4gICAgICAgIGZ1bmN0aW9uIHNjaGVkdWxlVGFzayh0YXNrKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gdGFzay5kYXRhO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZGF0YS50YXJnZXQ7XG4gICAgICAgICAgICB0YXJnZXRbWEhSX1NDSEVEVUxFRF0gPSBmYWxzZTtcbiAgICAgICAgICAgIHRhcmdldFtYSFJfRVJST1JfQkVGT1JFX1NDSEVEVUxFRF0gPSBmYWxzZTtcbiAgICAgICAgICAgIC8vIHJlbW92ZSBleGlzdGluZyBldmVudCBsaXN0ZW5lclxuICAgICAgICAgICAgY29uc3QgbGlzdGVuZXIgPSB0YXJnZXRbWEhSX0xJU1RFTkVSXTtcbiAgICAgICAgICAgIGlmICghb3JpQWRkTGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICBvcmlBZGRMaXN0ZW5lciA9IHRhcmdldFtaT05FX1NZTUJPTF9BRERfRVZFTlRfTElTVEVORVJdO1xuICAgICAgICAgICAgICAgIG9yaVJlbW92ZUxpc3RlbmVyID0gdGFyZ2V0W1pPTkVfU1lNQk9MX1JFTU9WRV9FVkVOVF9MSVNURU5FUl07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICBvcmlSZW1vdmVMaXN0ZW5lci5jYWxsKHRhcmdldCwgUkVBRFlfU1RBVEVfQ0hBTkdFLCBsaXN0ZW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBuZXdMaXN0ZW5lciA9IHRhcmdldFtYSFJfTElTVEVORVJdID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQucmVhZHlTdGF0ZSA9PT0gdGFyZ2V0LkRPTkUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gc29tZXRpbWVzIG9uIHNvbWUgYnJvd3NlcnMgWE1MSHR0cFJlcXVlc3Qgd2lsbCBmaXJlIG9ucmVhZHlzdGF0ZWNoYW5nZSB3aXRoXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlYWR5U3RhdGU9NCBtdWx0aXBsZSB0aW1lcywgc28gd2UgbmVlZCB0byBjaGVjayB0YXNrIHN0YXRlIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkYXRhLmFib3J0ZWQgJiYgdGFyZ2V0W1hIUl9TQ0hFRFVMRURdICYmIHRhc2suc3RhdGUgPT09IFNDSEVEVUxFRCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgd2hldGhlciB0aGUgeGhyIGhhcyByZWdpc3RlcmVkIG9ubG9hZCBsaXN0ZW5lclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhhdCBpcyB0aGUgY2FzZSwgdGhlIHRhc2sgc2hvdWxkIGludm9rZSBhZnRlciBhbGxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9ubG9hZCBsaXN0ZW5lcnMgZmluaXNoLlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWxzbyBpZiB0aGUgcmVxdWVzdCBmYWlsZWQgd2l0aG91dCByZXNwb25zZSAoc3RhdHVzID0gMCksIHRoZSBsb2FkIGV2ZW50IGhhbmRsZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdpbGwgbm90IGJlIHRyaWdnZXJlZCwgaW4gdGhhdCBjYXNlLCB3ZSBzaG91bGQgYWxzbyBpbnZva2UgdGhlIHBsYWNlaG9sZGVyIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0byBjbG9zZSB0aGUgWE1MSHR0cFJlcXVlc3Q6OnNlbmQgbWFjcm9UYXNrLlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMzg3OTVcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxvYWRUYXNrcyA9IHRhcmdldFtab25lLl9fc3ltYm9sX18oJ2xvYWRmYWxzZScpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXQuc3RhdHVzICE9PSAwICYmIGxvYWRUYXNrcyAmJiBsb2FkVGFza3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yaUludm9rZSA9IHRhc2suaW52b2tlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2suaW52b2tlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBuZWVkIHRvIGxvYWQgdGhlIHRhc2tzIGFnYWluLCBiZWNhdXNlIGluIG90aGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxvYWQgbGlzdGVuZXIsIHRoZXkgbWF5IHJlbW92ZSB0aGVtc2VsdmVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxvYWRUYXNrcyA9IHRhcmdldFtab25lLl9fc3ltYm9sX18oJ2xvYWRmYWxzZScpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb2FkVGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsb2FkVGFza3NbaV0gPT09IHRhc2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2FkVGFza3Muc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZGF0YS5hYm9ydGVkICYmIHRhc2suc3RhdGUgPT09IFNDSEVEVUxFRCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JpSW52b2tlLmNhbGwodGFzayk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRUYXNrcy5wdXNoKHRhc2spO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFzay5pbnZva2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICghZGF0YS5hYm9ydGVkICYmIHRhcmdldFtYSFJfU0NIRURVTEVEXSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVycm9yIG9jY3VycyB3aGVuIHhoci5zZW5kKClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFtYSFJfRVJST1JfQkVGT1JFX1NDSEVEVUxFRF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIG9yaUFkZExpc3RlbmVyLmNhbGwodGFyZ2V0LCBSRUFEWV9TVEFURV9DSEFOR0UsIG5ld0xpc3RlbmVyKTtcbiAgICAgICAgICAgIGNvbnN0IHN0b3JlZFRhc2sgPSB0YXJnZXRbWEhSX1RBU0tdO1xuICAgICAgICAgICAgaWYgKCFzdG9yZWRUYXNrKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W1hIUl9UQVNLXSA9IHRhc2s7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZW5kTmF0aXZlLmFwcGx5KHRhcmdldCwgZGF0YS5hcmdzKTtcbiAgICAgICAgICAgIHRhcmdldFtYSFJfU0NIRURVTEVEXSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gdGFzaztcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBwbGFjZWhvbGRlckNhbGxiYWNrKCkgeyB9XG4gICAgICAgIGZ1bmN0aW9uIGNsZWFyVGFzayh0YXNrKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gdGFzay5kYXRhO1xuICAgICAgICAgICAgLy8gTm90ZSAtIGlkZWFsbHksIHdlIHdvdWxkIGNhbGwgZGF0YS50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lciBoZXJlLCBidXQgaXQncyB0b28gbGF0ZVxuICAgICAgICAgICAgLy8gdG8gcHJldmVudCBpdCBmcm9tIGZpcmluZy4gU28gaW5zdGVhZCwgd2Ugc3RvcmUgaW5mbyBmb3IgdGhlIGV2ZW50IGxpc3RlbmVyLlxuICAgICAgICAgICAgZGF0YS5hYm9ydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBhYm9ydE5hdGl2ZS5hcHBseShkYXRhLnRhcmdldCwgZGF0YS5hcmdzKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvcGVuTmF0aXZlID0gcGF0Y2hNZXRob2QoWE1MSHR0cFJlcXVlc3RQcm90b3R5cGUsICdvcGVuJywgKCkgPT4gZnVuY3Rpb24gKHNlbGYsIGFyZ3MpIHtcbiAgICAgICAgICAgIHNlbGZbWEhSX1NZTkNdID0gYXJnc1syXSA9PSBmYWxzZTtcbiAgICAgICAgICAgIHNlbGZbWEhSX1VSTF0gPSBhcmdzWzFdO1xuICAgICAgICAgICAgcmV0dXJuIG9wZW5OYXRpdmUuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBYTUxIVFRQUkVRVUVTVF9TT1VSQ0UgPSAnWE1MSHR0cFJlcXVlc3Quc2VuZCc7XG4gICAgICAgIGNvbnN0IGZldGNoVGFza0Fib3J0aW5nID0gem9uZVN5bWJvbCgnZmV0Y2hUYXNrQWJvcnRpbmcnKTtcbiAgICAgICAgY29uc3QgZmV0Y2hUYXNrU2NoZWR1bGluZyA9IHpvbmVTeW1ib2woJ2ZldGNoVGFza1NjaGVkdWxpbmcnKTtcbiAgICAgICAgY29uc3Qgc2VuZE5hdGl2ZSA9IHBhdGNoTWV0aG9kKFhNTEh0dHBSZXF1ZXN0UHJvdG90eXBlLCAnc2VuZCcsICgpID0+IGZ1bmN0aW9uIChzZWxmLCBhcmdzKSB7XG4gICAgICAgICAgICBpZiAoWm9uZS5jdXJyZW50W2ZldGNoVGFza1NjaGVkdWxpbmddID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgLy8gYSBmZXRjaCBpcyBzY2hlZHVsaW5nLCBzbyB3ZSBhcmUgdXNpbmcgeGhyIHRvIHBvbHlmaWxsIGZldGNoXG4gICAgICAgICAgICAgICAgLy8gYW5kIGJlY2F1c2Ugd2UgYWxyZWFkeSBzY2hlZHVsZSBtYWNyb1Rhc2sgZm9yIGZldGNoLCB3ZSBzaG91bGRcbiAgICAgICAgICAgICAgICAvLyBub3Qgc2NoZWR1bGUgYSBtYWNyb1Rhc2sgZm9yIHhociBhZ2FpblxuICAgICAgICAgICAgICAgIHJldHVybiBzZW5kTmF0aXZlLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlbGZbWEhSX1NZTkNdKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIFhIUiBpcyBzeW5jIHRoZXJlIGlzIG5vIHRhc2sgdG8gc2NoZWR1bGUsIGp1c3QgZXhlY3V0ZSB0aGUgY29kZS5cbiAgICAgICAgICAgICAgICByZXR1cm4gc2VuZE5hdGl2ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7IHRhcmdldDogc2VsZiwgdXJsOiBzZWxmW1hIUl9VUkxdLCBpc1BlcmlvZGljOiBmYWxzZSwgYXJnczogYXJncywgYWJvcnRlZDogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXNrID0gc2NoZWR1bGVNYWNyb1Rhc2tXaXRoQ3VycmVudFpvbmUoWE1MSFRUUFJFUVVFU1RfU09VUkNFLCBwbGFjZWhvbGRlckNhbGxiYWNrLCBvcHRpb25zLCBzY2hlZHVsZVRhc2ssIGNsZWFyVGFzayk7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYgJiYgc2VsZltYSFJfRVJST1JfQkVGT1JFX1NDSEVEVUxFRF0gPT09IHRydWUgJiYgIW9wdGlvbnMuYWJvcnRlZCAmJlxuICAgICAgICAgICAgICAgICAgICB0YXNrLnN0YXRlID09PSBTQ0hFRFVMRUQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8geGhyIHJlcXVlc3QgdGhyb3cgZXJyb3Igd2hlbiBzZW5kXG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIHNob3VsZCBpbnZva2UgdGFzayBpbnN0ZWFkIG9mIGxlYXZpbmcgYSBzY2hlZHVsZWRcbiAgICAgICAgICAgICAgICAgICAgLy8gcGVuZGluZyBtYWNyb1Rhc2tcbiAgICAgICAgICAgICAgICAgICAgdGFzay5pbnZva2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBhYm9ydE5hdGl2ZSA9IHBhdGNoTWV0aG9kKFhNTEh0dHBSZXF1ZXN0UHJvdG90eXBlLCAnYWJvcnQnLCAoKSA9PiBmdW5jdGlvbiAoc2VsZiwgYXJncykge1xuICAgICAgICAgICAgY29uc3QgdGFzayA9IGZpbmRQZW5kaW5nVGFzayhzZWxmKTtcbiAgICAgICAgICAgIGlmICh0YXNrICYmIHR5cGVvZiB0YXNrLnR5cGUgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgWEhSIGhhcyBhbHJlYWR5IGNvbXBsZXRlZCwgZG8gbm90aGluZy5cbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgWEhSIGhhcyBhbHJlYWR5IGJlZW4gYWJvcnRlZCwgZG8gbm90aGluZy5cbiAgICAgICAgICAgICAgICAvLyBGaXggIzU2OSwgY2FsbCBhYm9ydCBtdWx0aXBsZSB0aW1lcyBiZWZvcmUgZG9uZSB3aWxsIGNhdXNlXG4gICAgICAgICAgICAgICAgLy8gbWFjcm9UYXNrIHRhc2sgY291bnQgYmUgbmVnYXRpdmUgbnVtYmVyXG4gICAgICAgICAgICAgICAgaWYgKHRhc2suY2FuY2VsRm4gPT0gbnVsbCB8fCAodGFzay5kYXRhICYmIHRhc2suZGF0YS5hYm9ydGVkKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRhc2suem9uZS5jYW5jZWxUYXNrKHRhc2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoWm9uZS5jdXJyZW50W2ZldGNoVGFza0Fib3J0aW5nXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIC8vIHRoZSBhYm9ydCBpcyBjYWxsZWQgZnJvbSBmZXRjaCBwb2x5ZmlsbCwgd2UgbmVlZCB0byBjYWxsIG5hdGl2ZSBhYm9ydCBvZiBYSFIuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFib3J0TmF0aXZlLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCB3ZSBhcmUgdHJ5aW5nIHRvIGFib3J0IGFuIFhIUiB3aGljaCBoYXMgbm90IHlldCBiZWVuIHNlbnQsIHNvIHRoZXJlIGlzIG5vXG4gICAgICAgICAgICAvLyB0YXNrXG4gICAgICAgICAgICAvLyB0byBjYW5jZWwuIERvIG5vdGhpbmcuXG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuWm9uZS5fX2xvYWRfcGF0Y2goJ2dlb2xvY2F0aW9uJywgKGdsb2JhbCkgPT4ge1xuICAgIC8vLyBHRU9fTE9DQVRJT05cbiAgICBpZiAoZ2xvYmFsWyduYXZpZ2F0b3InXSAmJiBnbG9iYWxbJ25hdmlnYXRvciddLmdlb2xvY2F0aW9uKSB7XG4gICAgICAgIHBhdGNoUHJvdG90eXBlKGdsb2JhbFsnbmF2aWdhdG9yJ10uZ2VvbG9jYXRpb24sIFsnZ2V0Q3VycmVudFBvc2l0aW9uJywgJ3dhdGNoUG9zaXRpb24nXSk7XG4gICAgfVxufSk7XG5ab25lLl9fbG9hZF9wYXRjaCgnUHJvbWlzZVJlamVjdGlvbkV2ZW50JywgKGdsb2JhbCwgWm9uZSkgPT4ge1xuICAgIC8vIGhhbmRsZSB1bmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb25cbiAgICBmdW5jdGlvbiBmaW5kUHJvbWlzZVJlamVjdGlvbkhhbmRsZXIoZXZ0TmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50VGFza3MgPSBmaW5kRXZlbnRUYXNrcyhnbG9iYWwsIGV2dE5hbWUpO1xuICAgICAgICAgICAgZXZlbnRUYXNrcy5mb3JFYWNoKGV2ZW50VGFzayA9PiB7XG4gICAgICAgICAgICAgICAgLy8gd2luZG93cyBoYXMgYWRkZWQgdW5oYW5kbGVkcmVqZWN0aW9uIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgICAgICAgICAgLy8gdHJpZ2dlciB0aGUgZXZlbnQgbGlzdGVuZXJcbiAgICAgICAgICAgICAgICBjb25zdCBQcm9taXNlUmVqZWN0aW9uRXZlbnQgPSBnbG9iYWxbJ1Byb21pc2VSZWplY3Rpb25FdmVudCddO1xuICAgICAgICAgICAgICAgIGlmIChQcm9taXNlUmVqZWN0aW9uRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXZ0ID0gbmV3IFByb21pc2VSZWplY3Rpb25FdmVudChldnROYW1lLCB7IHByb21pc2U6IGUucHJvbWlzZSwgcmVhc29uOiBlLnJlamVjdGlvbiB9KTtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRUYXNrLmludm9rZShldnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBpZiAoZ2xvYmFsWydQcm9taXNlUmVqZWN0aW9uRXZlbnQnXSkge1xuICAgICAgICBab25lW3pvbmVTeW1ib2woJ3VuaGFuZGxlZFByb21pc2VSZWplY3Rpb25IYW5kbGVyJyldID1cbiAgICAgICAgICAgIGZpbmRQcm9taXNlUmVqZWN0aW9uSGFuZGxlcigndW5oYW5kbGVkcmVqZWN0aW9uJyk7XG4gICAgICAgIFpvbmVbem9uZVN5bWJvbCgncmVqZWN0aW9uSGFuZGxlZEhhbmRsZXInKV0gPVxuICAgICAgICAgICAgZmluZFByb21pc2VSZWplY3Rpb25IYW5kbGVyKCdyZWplY3Rpb25oYW5kbGVkJyk7XG4gICAgfVxufSk7XG5ab25lLl9fbG9hZF9wYXRjaCgncXVldWVNaWNyb3Rhc2snLCAoZ2xvYmFsLCBab25lLCBhcGkpID0+IHtcbiAgICBwYXRjaFF1ZXVlTWljcm90YXNrKGdsb2JhbCwgYXBpKTtcbn0pO1xuIl0sIm1hcHBpbmdzIjoiO0NBT0MsU0FBVSxRQUFRO0FBQ2YsUUFBTSxjQUFjLE9BQU8sYUFBYTtBQUN4QyxXQUFTLEtBQUssTUFBTTtBQUNoQixtQkFBZSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sRUFBRSxJQUFJO0FBQUEsRUFDbEU7QUFDQSxXQUFTLG1CQUFtQixNQUFNLE9BQU87QUFDckMsbUJBQWUsWUFBWSxTQUFTLEtBQUssWUFBWSxTQUFTLEVBQUUsTUFBTSxLQUFLO0FBQUEsRUFDL0U7QUFDQSxPQUFLLE1BQU07QUFJWCxRQUFNLGVBQWUsT0FBTyxzQkFBc0IsS0FBSztBQUN2RCxXQUFTLFdBQVcsTUFBTTtBQUN0QixXQUFPLGVBQWU7QUFBQSxFQUMxQjtBQUNBLFFBQU0saUJBQWlCLE9BQU8sV0FBVyx5QkFBeUIsQ0FBQyxNQUFNO0FBQ3pFLE1BQUksT0FBTyxNQUFNLEdBQUc7QUFVaEIsUUFBSSxrQkFBa0IsT0FBTyxPQUFPLE1BQU0sRUFBRSxlQUFlLFlBQVk7QUFDbkUsWUFBTSxJQUFJLE1BQU0sc0JBQXNCO0FBQUEsSUFDMUMsT0FDSztBQUNELGFBQU8sT0FBTyxNQUFNO0FBQUEsSUFDeEI7QUFBQSxFQUNKO0FBQ0EsUUFBTSxRQUFOLE1BQU0sTUFBSztBQUFBLElBR1AsT0FBTyxvQkFBb0I7QUFDdkIsVUFBSSxPQUFPLFNBQVMsTUFBTSxRQUFRLGtCQUFrQixHQUFHO0FBQ25ELGNBQU0sSUFBSSxNQUFNLCtSQUkwQztBQUFBLE1BQzlEO0FBQUEsSUFDSjtBQUFBLElBQ0EsV0FBVyxPQUFPO0FBQ2QsVUFBSSxPQUFPLE1BQUs7QUFDaEIsYUFBTyxLQUFL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QU8sS0FBSyxRQUFRLFVBQVU7QUFLdEMsWUFBSSxLQUFLLFlBQVksUUFBUyxLQUFLLFFBQVEsS0FBSyxLQUFLLFNBQVU7QUFDM0Q7QUFBQSxRQUNKO0FBQ0EsYUFBSyxLQUFLLFdBQVcsSUFBSTtBQUFBLE1BQzdCLFdBQ1NELE1BQUssUUFBUSxpQkFBaUIsTUFBTSxNQUFNO0FBRS9DLGVBQU8sWUFBWSxNQUFNQyxPQUFNLElBQUk7QUFBQSxNQUN2QztBQUFBLElBSUosQ0FBQztBQUFBLEVBQ0w7QUFDSixDQUFDO0FBQ0QsS0FBSyxhQUFhLGVBQWUsQ0FBQyxXQUFXO0FBRXpDLE1BQUksT0FBTyxXQUFXLEtBQUssT0FBTyxXQUFXLEVBQUUsYUFBYTtBQUN4RCxtQkFBZSxPQUFPLFdBQVcsRUFBRSxhQUFhLENBQUMsc0JBQXNCLGVBQWUsQ0FBQztBQUFBLEVBQzNGO0FBQ0osQ0FBQztBQUNELEtBQUssYUFBYSx5QkFBeUIsQ0FBQyxRQUFRRCxVQUFTO0FBRXpELFdBQVMsNEJBQTRCLFNBQVM7QUFDMUMsV0FBTyxTQUFVLEdBQUc7QUFDaEIsWUFBTSxhQUFhLGVBQWUsUUFBUSxPQUFPO0FBQ2pELGlCQUFXLFFBQVEsZUFBYTtBQUc1QixjQUFNLHdCQUF3QixPQUFPLHVCQUF1QjtBQUM1RCxZQUFJLHVCQUF1QjtBQUN2QixnQkFBTSxNQUFNLElBQUksc0JBQXNCLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxRQUFRLEVBQUUsVUFBVSxDQUFDO0FBQzFGLG9CQUFVLE9BQU8sR0FBRztBQUFBLFFBQ3hCO0FBQUEsTUFDSixDQUFDO0FBQUEsSUFDTDtBQUFBLEVBQ0o7QUFDQSxNQUFJLE9BQU8sdUJBQXVCLEdBQUc7QUFDakMsSUFBQUEsTUFBSyxXQUFXLGtDQUFrQyxDQUFDLElBQy9DLDRCQUE0QixvQkFBb0I7QUFDcEQsSUFBQUEsTUFBSyxXQUFXLHlCQUF5QixDQUFDLElBQ3RDLDRCQUE0QixrQkFBa0I7QUFBQSxFQUN0RDtBQUNKLENBQUM7QUFDRCxLQUFLLGFBQWEsa0JBQWtCLENBQUMsUUFBUUEsT0FBTSxRQUFRO0FBQ3ZELHNCQUFvQixRQUFRLEdBQUc7QUFDbkMsQ0FBQzsiLCJuYW1lcyI6WyJab25lIiwic2VsZiIsImRlbGVnYXRlIiwicHJvcCIsIk9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvciIsIk9iamVjdERlZmluZVByb3BlcnR5IiwidmFsdWUiLCJfZ2xvYmFsIiwiZXZlbnQiLCJwYXRjaE9wdGlvbnMiLCJyZXR1cm5UYXJnZXQiLCJpbnRlcm5hbFdpbmRvdyIsIndpbmRvdyIsImlzQnJvd3NlciIsImlzTWl4Iiwiem9uZVN5bWJvbEV2ZW50TmFtZXMiLCJUUlVFX1NUUiIsIkZBTFNFX1NUUiIsIlpPTkVfU1lNQk9MX1BSRUZJWCIsIm5hbWUiLCJsb2FkVGFza3MiXSwieF9nb29nbGVfaWdub3JlTGlzdCI6WzBdfQ==
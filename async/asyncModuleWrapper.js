const asyncModule = require('./ayncModule');
const asyncModuleWrapper = module.exports;
asyncModuleWrapper.initialized = false;

// initializedState 异步完成之后状态
const initializedState = asyncModule;

// noeInitialize 异步完成之前的状态
let pending = [];
const notInitializeState = {
  initialize(callback) {
    asyncModule.initialize(function() {
      asyncModuleWrapper.initialized = true;
      activeState = initializedState;
      pending.forEach(({method, args}) => {
        activeState[method](...args);
      })
      pending = [];
      callback();
    })
  },
  tellMeSomething(...arguments) {
    pending.push({
      method: 'tellMeSomething',
      args: arguments,
    })
  }
}
let activeState = notInitializeState; // 储存当前状态

asyncModuleWrapper.initialize = (callback) => {
  activeState.initialize.apply(null, callback);
}

asyncModuleWrapper.tellMeSomething = (callback) => {
  activeState.tellMeSomething(callback);
}
asyncModuleWrapper.tellMeSomething;

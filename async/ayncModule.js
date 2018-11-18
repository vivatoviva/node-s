const asyncModule = module.exports;

asyncModule.initialized = false;
asyncModule.initialize = callback => {
  setTimeout(() => {
    asyncModule.initialized = true;
    callback();
  }, 1000);
}
asyncModule.tellMeSomething = (callback) => {
  console.log(callback)
  process.nextTick(() => {
    if(asyncModule.initialized) {
      callback(null, 'ok');
    } else {
      callback(new Error('can`t invoke, because no initialized'));
    }
  })
}
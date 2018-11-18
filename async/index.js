const asyncModule = require('./asyncModuleWrapper');
asyncModule.initialize();
asyncModule.tellMeSomething(function(err, text) {
  console.log(text);
})
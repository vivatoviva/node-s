// in the module.js
const db = require('db');
const findAllFactory = require('./findAll');
db.on('connected', function() {
  const findAll = findAllFactory(db);
})

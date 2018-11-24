setTimeout(() => console.log('setTimeout1'), 0);
setTimeout(() => {
  console.log('setTimeout2');
  setTimeout(() => console.log('setTimeout4'));
  setImmediate(() => console.log('immediate'));
}, 0);
setTimeout(() => console.log('setTimeout3'), 0);

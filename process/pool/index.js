const processFork = require('./processFork');
const fork = new processFork({ time: 10000 });
fork.start((error, sum) => {
  if (error) {
    console.log('Error:', error);
  } else {
    console.log(sum);
  }
})
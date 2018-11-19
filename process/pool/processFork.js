const ProcessPool = require('./processPool');
const os = require('os');
const { EventEmitter } = require('events');

const workers = new ProcessPool(__dirname + '/processWorker.js', os.cpus().length);
console.log(workers.acquire);
class SumFork extends EventEmitter {
  constructor({ time }) {
    super();
    this.time = time;
  }
  start(callback) {
    workers.acquire((err, worker) => {
      worker.send({ time: this.time });
      const onMessage = ({ event, sum, err }) => {
        if (event === 'match') {
          callback(null, sum)
        } else if(event === 'end') {
          worker.removeListener('message', onMessage);
          workers.release(worker);
        } else {
          worker.removeListener('message', onMessage);
          workers.release(worker);
          callback(err);
        }
      }
      worker.on('message', onMessage);
    })
  }
}
module.exports = SumFork;

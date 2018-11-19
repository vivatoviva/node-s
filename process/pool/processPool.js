const { fork } = require('child_process');
class Pool {
  constructor(file, poolMax) {
    console.log(file, poolMax)
    this.file = file;
    this.poolMax = poolMax;
    this.pool = []; // 闲置的进程
    this.active = []; // 正在运行的进程
    this.waiting = []; // 注册等待执行的任务
  }

  acquire(callback) {
    // 获取进程
    let worker;
    // 进程池中分配
    if(this.pool.length > 0) {
      worker = this.pool.pop();
      this.active.push(worker);
      return process.nextTick(callback.bind(null, null, worker));
    }

    // 堵塞
    if(this.active.length >= this.poolMax) {
      return this.waiting.push(callback);
    }

    // 新建
    try {
      worker = fork(this.file);
      this.active.push(worker);
      return process.nextTick(callback.bind(null,null, worker));
    } catch(error) {
      return process.nextTick(callback.bind(null, error));
    }
  }

  release(worker) {
    // 将一个进程放回进程池
    if (this.waiting.length > 0) {
      const callback = this.waiting.shift();
      callback.apply(null, null, worker);
    } else {
      this.active.filter(w => w !== worker);
      this.pool.push(worker);
    }
  }
}
module.exports = Pool;

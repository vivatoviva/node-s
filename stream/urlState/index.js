const fs = require('fs');
const split = require('split');
const stream = require('stream');

class ParallelStream extends stream.Transform {
  constructor(userTransform) {
    super({ objectMode: true });
    this.userTransform = userTransform;
    this.running = 0;
    this.terminateCallback = null;
    this.continueCallback = null;
    this.concurrency = 1; // 并行下载数量
  }

  _transform(chunk, enc, done) {
    this.running += 1;
    // 调用外部处理模块
    this.userTransform(
      chunk,
      enc,
      this.push.bind(this),
      this._onComplete.bind(this),
    );

    if (this.running > this.concurrency) {
      // 当前运行的处理程序大于最大限制
      this.continueCallback = done;
    } else {
      done();
    }
  }

  _flush(finish) {
    // 如果传输完成，但是处理模块没有完成
    if (this.running > 0) {
      this.terminateCallback = finish;
    } else {
      // 如果出阿里模块都是同步的话
      finish();
    }
  }

  _onComplete(error) {
    this.running -= 1;
    const { continueCallback } = this;
    this.continueCallback = null;
    // 判断程序有没有出错
    if (error) {
      return this.emit('error', error);
    }
    // 判断当前有没有阻塞的任务
    if (continueCallback) {
      continueCallback();
    }
    // 判断当前是否应该关闭流
    if (this.running === 0 && this.terminateCallback) {
      this.terminateCallback();
    }
    return undefined;
  }
}

fs.createReadStream('./test.md')
  .pipe(split())
  .pipe(new ParallelStream((chunk, enc, push, done) => {
    console.log(chunk);
    push(chunk);
    setTimeout(() => {
      done();
    }, 1000);
  }));

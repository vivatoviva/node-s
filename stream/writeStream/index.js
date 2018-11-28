const fs = require('fs');
const { Writable } = require('stream');

class Write extends Writable {
  constructor() {
    super({
      objectMode: true,
    });
  }

  _write(chunk, encoding, callback) {
    this.eventName = encoding;
    fs.open(chunk.path, 'w', Buffer.from(chunk.content), (e, fd) => {
      if (e) return callback(e);
      return fs.write(fd, chunk.content, 0, 'utf8', (error) => {
        if (error) throw error;
        fs.closeSync(fd);
        callback();
      });
    });
  }
}

const write = new Write();
write.write({
  path: './node1.txt',
  content: 'ligen',
});
write.write({
  path: './node2.txt',
  content: 'ligen',
});
write.write({
  path: './node3.txt',
  content: 'ligen',
});
write.write({
  path: './node4.txt',
  content: 'ligen',
});

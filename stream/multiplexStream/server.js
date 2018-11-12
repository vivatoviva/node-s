function demultiplexChannel(source, destinations) {
  let currentChannel = null;
  let currentLength = null;
  source.on('readable', () => {
    let chunk;
    // 解决类型
    if (currentChannel === null) {
      chunk = source.read(1);
      currentChannel = chunk && chunk.readUInt8(0);
    }
    if (currentLength === null) {
      chunk = source.read(4);
      currentLength = chunk && chunk.readUInt32BE(0);
      if (currentLength === null) {
        return;
      }
    }
    chunk = source.read(currentLength);
    if (chunk === null) {
      return;
    }
    console.log(`Received packet from: ${currentChannel}`);
    destinations[currentChannel].write(chunk);
    currentChannel = null;
    currentLength = null;
  }).on('end', () => {
    destinations.forEach(destination => destination.end());
    console.log('source channel closed');
  });
}
const fs = require('fs');
const net = require('net');


const server = net.createServer((socket) => {
  const logWrite = fs.createWriteStream('./log.txt');
  const errorWrite = fs.createWriteStream('./error.txt');
  demultiplexChannel(socket, [logWrite, errorWrite]);
});
server.listen(3000);

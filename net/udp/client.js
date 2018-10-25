const dgram = require('dgram');
const message = new Buffer('创建UDP客户端');
const client = dgram.createSocket('udp4');

client.send(message, 0, message.length, 4123, 'localhost', (err, bytes) => {
  client.close();
});

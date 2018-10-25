const net = require('net');
const server = net.createServer();

server.on('connection', (socket) => {
  socket.write('hello world');
  socket.end();
});
server.on('data', (data) => {
  console.log('服务端接受到消息', data.toString());
});
server.listen(8000);

const http = require('http');
const crypto = require('crypto');
const WebSocket = require('./dataHandler');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World');
});

server.on('upgrade', (req, socket, upgradeHead) => {
  // 建立连接
  const head = new Buffer(upgradeHead.length);
  upgradeHead.copy(head);
  let key = req.headers['sec-websocket-key'];
  const shasum = crypto.createHash('sha1');
  key = shasum.update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`).digest('base64');
  const headers = [
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    `Sec-WebSocket-Accept: ${key}`,
    'Sec-Socket-Protocol: chat',
  ];
  socket.setNoDelay(true);
  socket.write(headers.concat('', '').join('\r\n'));
  // 初始化websocket
  const websocket = new WebSocket(socket);
  websocket.sendCheckPing();
  // socket绑定事件
  socket
    .on('data', (buffer) => {
      websocket.getData(buffer, (s, data) => {
        let sendMsg = `server recieved message :${data}`;
        // 响应服务器的心跳检测
        if (data === 'ping') {
          console.log('get pinf')
          sendMsg = 'pong';
        }
        websocket.writeData(websocket.createData(sendMsg));
      });
    })
    .on('close', () => {
      console.log('socket close');
    })
    .on('end', () => {
      console.log('socket end');
    });
  websocket.writeData(websocket.createData('genluo'));
});

server.listen(10000);

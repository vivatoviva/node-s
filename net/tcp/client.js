const net = require('net');
const client = net.createConnection({ port: 8000 }, () => {
  console.log('连接成功');
});

client.on('data', (data) => {
  console.log('客户端接受到数据', data.toString());
});
// 关闭 Nagle 算法
client.setNoDelay(true);
client.write('客户端发送消息');

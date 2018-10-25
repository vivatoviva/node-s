const http = require('http');

const agent = new http.Agent({
  maxSockets: 10,
});

const option = {
  hostname: 'www.bilibili.com',
  port: 80,
  path: '/',
  method: 'GET',
  agent,
};

const req = http.request(option, (res) => {
  console.log(res);
});

req.on('scoket', () => {
  console.log('分配请求');
});

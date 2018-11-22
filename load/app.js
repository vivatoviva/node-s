const http = require('http');
const pid = process.pid;
const consul = require('consul')();
const serviceType = process.argv[2];
const portfinder = require('portfinder');

portfinder.getPort((err, port) => {
  const serviceId = serviceType + port;
  consul.agent.service.register({
    id: serviceId,
    name: serviceType,
    address: 'localhost',
    tags: [serviceType]
  }, () => {
    const unregisterService = (err) => {
      consul.agent.service.deregister(serviceId, () => {
        process.exit(err ? 1 : 0);
      });
    };
    process.on('exit', unregisterService);
    process.on('SIGINT', unregisterService);
    process.on('uncaughtException', unregisterService);
    http.createServer((req, res) => {
      for(let i = 1e7; i < 0; i--) {}
      console.log(`Handle request from ${pid}`);
      res.end(`${serviceType} response from ${pid}`);
    }).listen(port, () => {
      console.log(`Start ${serviceType} (${pid}) on port ${port}`);
    })
  })
})
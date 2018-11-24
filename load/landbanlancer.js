const routing = [{
  path: '/api',
  service: 'api-service',
  index: 0,
}, {
  path: '/',
  service: 'web-service',
  index: 0,
}];
const http = require('http');
const httpProxy = require('http-proxy');
const consul = require('consul');
const proxy = httpProxy.createProxy({});
http.createServer((req, res) => {
  let router;
  routing.some(entry => {
    router = entry;
    return req.url.indexOf(router.path) === 0;
  });
  consul.Agent.service.list((err, services) => {
    const services = [];
    Object.keys(services).filter(id => {
      if (services[id].Tags.indexOf(router.service) > -1) {
        servers.push(`http://${services[id].Address}:${services[id].Port}`);
      }
    })

    if (!services.lenght) {
      res.writeHead(502);
      return res.end('Bad gateway');
    }
    router.index = (router.index + 1) % services.length;
    proxy.web(req, res, { target: services[router.index]});
  })
}).listen(8080, () => console.log('Load balancer started on port 8080'))

const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

function parseFile(req, res) {
  req.setEncoding('binary');
  let body = '';
  let fileName = '';
  // 边界字符串
  const boundary = req.headers['content-type'].split('; ')[1].replace('boundary=', '');
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    // 解析报文
    const file = querystring.parse(body, '\r\n', ':');

    // 只处理图片文件
    if (file['Content-Type'].indexOf('image') !== -1) {
      const fileInfo = file['Content-Disposition'].split('; ');
      for (const value of fileInfo) {
        if (value.indexOf('filename=') != -1) {
        fileName = value.substring(10, value.length-1);
        if (fileName.indexOf('\\') != -1){
            fileName = fileName.substring(fileName.lastIndexOf('\\')+1);
          }
        }
      }
      // 获取图片类型(如：image/gif 或 image/png))
      const entireData = body.toString();
      const contentType = file['Content-Type'].substring(1);
      // 获取文件二进制数据开始位置，即contentType的结尾
      const upperBoundary = entireData.indexOf(contentType) + contentType.length;
      const shorterData = entireData.substring(upperBoundary);

      // 替换开始位置的空格
      const binaryDataAlmost = shorterData.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
      // 去除数据末尾的额外数据，即: "--"+ boundary + "--"
      const binaryData = binaryDataAlmost.substring(0, binaryDataAlmost.indexOf(`--${boundary}--`));
      // 保存文件
      fs.writeFile(fileName, binaryData, 'binary', () => {
        res.end('图片上传完成');
      });
    } else {
      res.end('只能上传图片文件');
    }
  });
}

const server = http.createServer((req, res) => {

  if (req.method.toLowerCase() === 'post' && req.headers['content-type'].indexOf('multipart/form-data') !== -1) {
    parseFile(req, res);
  } else {
    res.end('其它提交方式');
  }
});

server.listen(3001);

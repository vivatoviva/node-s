const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

function BinaryToUtf8(str) {
  return Buffer.from(str, 'binary').toString('utf-8');
}
/**
 * 将传入的二进制保存，并返回存放的文件名称
 *
 * @param  binary data
 * @returns { file: fileName }
 */
function parseFile(data) {
  // 解析报文
  const file = querystring.parse(data, '\r\n', ':');
  let fileName = '';
  // 处理图片是上传
  if (file['Content-Type']) {
    const fileInfo = file['Content-Disposition'].split('; ');
    fileInfo.forEach((value) => {
      if (value.indexOf('filename=') !== -1) {
        fileName = value.substring(10, value.length - 1);
        if (fileName.indexOf('\\') !== -1) {
          fileName = fileName.substring(fileName.lastIndexOf('\\') + 1);
        }
      }
    });
    // 进行转码，防止中文名称
    fileName = BinaryToUtf8(fileName);
    const entireData = data.toString();
    const contentType = file['Content-Type'].substring(1);
    // 获取文件二进制数据开始位置，即contentType的结尾
    const upperBoundary = entireData.indexOf(contentType) + contentType.length;
    const shorterData = entireData.substring(upperBoundary);
    // 替换开始位置的空格
    const binaryData = shorterData.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    fs.writeFileSync(fileName, binaryData, 'binary');
    return { file: fileName };
  }
  return {};
}

/**
 * 提取传进的二进制中的表单数据
 * apiurl: http://nodejs.cn/api/querystring.html#querystring_querystring_parse_str_sep_eq_options
 *
 * @param binary data
 * @returns { name: value }
 */
function parseData(data) {
  const formDataList = querystring.parse(data, '\r\n', ':');
  const name = BinaryToUtf8(querystring.parse(formDataList['Content-Disposition'], '; ', '=').name.replace(/"/g, ''));
  const value = BinaryToUtf8(data.split('\r\n')[data.split('\r\n').length - 2]);
  return { [name]: value };
}

/**
 * 传入req，解析表单中的数据
 *
 * @param {http 中 request} req
 * @returns Promise
 */
function parseForm(req) {
  // 不是表单数据直接返回
  if (!req.headers['content-type'].includes('multipart/form-data')) return {};
  req.setEncoding('binary');
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  return new Promise((resolve) => {
    req.on('end', () => {
      let result = {};
      // 获取边界字符串
      const boundary = req.headers['content-type'].split('; ')[1].replace('boundary=', '');
      // 按照边界字符串进行分割
      const formDataList = body.split(`--${boundary}`);
      if (formDataList.length === 0) return resolve({});
      formDataList.shift(); // 删除第一项
      formDataList.pop(); // 删除最后一项
      // 遍历每一项数据，提取相关表单数据
      formDataList.forEach((item) => {
        const file = querystring.parse(item, '\r\n', ':');
        if (file['Content-Type']) {
          result = Object.assign(result, parseFile(item));
        } else {
          result = Object.assign(result, parseData(item));
        }
      });
      // 将提取的表单数据 return
      return resolve(result);
    });
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method.toLowerCase() === 'post' && req.headers['content-type'].indexOf('multipart/form-data') !== -1) {
    const result = await parseForm(req);
    res.end('提交完成');
  } else {
    res.end('其它提交方式');
  }
});

server.listen(3001);

// 通过 multipiple 实现聚合错误处理
const combine = require('multipipe');
const zlib = require('zlib');
const crypto = require('crypto');
const fs = require('fs');

// 组合流
function compressAndEncrypt(password) {
  return combine(zlib.createGzip(), crypto.createCipher('aes192', password));
}
function decryptAndDecompress(password) {
  return combine(crypto.createDecipher('aes192', password));
}
// 复制流
const inputStream = fs.createReadStream();
const writeStream1 = fs.createWriteStream();
const writeStream2 = fs.createReadStream();
inputStream.pipe(writeStream1);
inputStream.pipe(writeStream2);

/*

* inputStream结束会是的writeStream1和writeStream2结束，除非设置 { end: false }
* 复制两个流时候回接收相同的数据，所以我们对数据进行某种操作的时候务必非常小心，因为有可能回影响我们复制的每一个流中的数据
* 背压整体上存在的，inputStream中数据流传递的速度取决与传输最慢的复制流

*/
// 合并流
const inputStream1 = fs.createReadStream();
const inputStream2 = fs.createReadStream();
const writeStream = fs.createWriteStream();
inputStream1.pipe(writeStream);
inputStream2.pipe(writeStream);
// 需要设置{ end: fasle } 因为只有当所有的来源合并到目标流时候才会调用end方法

// 复用和分解

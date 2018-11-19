const cache = {};
const getList = require('./getList.js');

module.exports = function(item) {
  if (cache[item]) {
    return cache[item]
  } else {
    cache[item] = getList(item)
                    .then((data) => {
                      setTimeout(() => {
                        delete cache[item];
                        // 定时缓存，3秒之后删除缓存
                      }, 1000 * 3);
                      return data;
                    })
                    .catch(error => {
                      delete cache[item];
                      throw error;
                    })
  }
  return cache[item];
}
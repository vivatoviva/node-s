// 中间件管理
class Manage {
  use(...funs) {
    for (let fun of funs) {
      if (typeof fun !== 'function') throw new Error('params must is midleWare function');
    }
  
    return function(ctx) {
      // let index = 0;
      // 创建next的函数，迭代创建
      // const createNext = (i) => {
      //   if (i < index) throw new Error('next() just invoke once');
      //   index++;
      //   if(index >= funs.length) {
      //     return () => ctx;
      //   }
      //   return function() {
      //     try {
      //       return Promise.resolve(funs[i + 1](ctx, createNext(i + 1)));
      //     } catch(error) {
      //       return Promise.reject(error);
      //     }
      //   }
      // }
      // return funs[index](ctx, createNext(0));
      let index = -1; // callback index
      const dispatch = (i) => {
        if(i <= index) return Promise.reject(new Error('next() just invoke once'));
        index = i;
        const fn = funs[i];
        if(!fn) return Promise.resolve();
        try {
          return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)));
        } catch(error) {
          return Promise.reject(error);
        }
      }
      return dispatch(0);
    }
  }
}



async function midleOne(ctx, next) {
  ctx.one = 'cahnge';
  console.log(1);
  await next();
  console.log(1);
  console.log('midleware one', ctx);
}

async function midleTwo(ctx, next) {
  ctx.two = 'change two';
  console.log(2);
  await next();
  console.log(2);
}

async function midleThree(ctx, next) {
  ctx.three = 'three';
  console.log(3);
  await next();
  console.log(3)
}

const midleMange = new Manage();
const midleFun = midleMange.use(midleOne, midleTwo, midleThree);
midleFun({}).then((data) => {
  console.log(data);
  console.log('midleWare over')
});

// koa中封装的洋葱模型

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}

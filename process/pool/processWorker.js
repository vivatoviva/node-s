// 创建进程的文件
function cpuBoundTask(time) {
  const sum = (time) => {
    if (time === 1) {
      return time;
    } else {
      return sum(time - 1);
    }
  }
  return sum(time);
}

process.on('message', ({ time }) => {
  let timeSUm;
  try {
    timeSUm = cpuBoundTask(time);
    process.send({
      event: 'match',
      sum: timeSUm,
    })
    process.send({
      event: 'end',
    })
  } catch(error) {
    process.send({
      event: 'Error',
      err: error,
    })
  }
})
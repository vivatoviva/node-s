function multiplexChannels(sources, destination) {
  let sourcesLength = sources.length;
  sources.forEach((source, index) => {
    source.on('readable', () => {
      let chunk;
      while ((chunk = source.read()) !== null) {
        const outBuffer = Buffer.alloc(1 + 4 + chunk.length);
        outBuffer.writeUInt8(index, 0);
        outBuffer.writeUInt32BE(chunk.length, 1);
        chunk.copy(outBuffer, 5);
        destination.write(outBuffer);
      }
    })
      .on('end', () => {
        sourcesLength -= 1;
        if (sourcesLength === 0) {
          destination.end();
        }
      });
  });
}

const net = require('net');
const { fork } = require('child_process');

const socket = net.connect(3000, () => {
  const child = fork(
    process.argv[2],
    process.argv.slice(3),
    { silent: true },
  );
  multiplexChannels([child.stdout, child.stderr], socket);
});

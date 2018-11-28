const Chance = require('chance');
const stream = require('stream');
const chance = new Chance();

class Read extends stream.Readable {
  _read() {
    const string = chance.animal();
    this.push(string, 'utf-8');
    if (chance.bool({
      likelihood: 5,
    })) {
      this.push(null);
    }
  }
}
const read = new Read();

read.on('readable', () => {
  let chunk;
  while ((chunk = read.read()) !== null) {
    console.log('get chunk', chunk.toString());
  }
});

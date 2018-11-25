const { Transform } = require('stream');
const { createReadStream } = require('fs');

class ReplaceStream extends Transform {
  constructor(searchString, replaceString) {
    super({});
    this.searchString = searchString;
    this.replaceString = replaceString;
    this.tailPiece = '';
  }

  _transform(chunk, encoding, callback) {
    const pieces = (this.tailPiece + chunk).split(this.searchString);
    const lastpiece = pieces[pieces.length - 1];
    const tailPieceLength = this.searchString.length;
    this.tailPiece = lastpiece.slice(-tailPieceLength);
    pieces[pieces.length - 1] = lastpiece.split(0, -tailPieceLength);
    this.push(pieces.join(this.replaceString));
    callback();
  }

  _flush(callback) {
    this.push(this.tailPiece);
    callback();
  }
}
const replaceStream = new ReplaceStream('ligen', ' change ');

const stream = createReadStream('./text.txt')
  .pipe(replaceStream);

stream.on('readable', () => {
  let chunk;
  while ((chunk = stream.read()) !== null) {
    chunk.length = 1;
  }
});

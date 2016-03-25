import fs from 'fs';
import request from 'request';

export default function downloadCsv (opts, dest, cb) {
  const req = request(opts);
  const writable = fs.createWriteStream(dest);
  req.on('response', (res) => {
    res.pipe(writable, {end: false});
    res.on('end', () => writable.write('\n', () => writable.end()));
  });
  writable.on('close', cb);
  req.on('error', cb);
  req.end();
}

import request from 'request';
import {W_OK, accessSync, createWriteStream} from 'fs';
import {dirname} from 'path';
import {sync as mkdirpSync} from 'mkdirp';

export default function downloadCsv (opts, dest, cb) {
  const req = request(opts);
  try {accessSync(dirname(dest), W_OK);}
  catch (err) {mkdirpSync(dirname(dest));}
  const writable = createWriteStream(dest);
  req.on('response', (res) => {
    res.pipe(writable, {end: false});
    res.on('end', () => writable.write('\n', () => writable.end()));
  });
  writable.on('close', cb);
  req.on('error', cb);
  req.end();
}

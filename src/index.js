import async from 'async';
import auth from './lib/auth';
import dotenv from 'dotenv';
import downloadCsv from './lib/download-csv';
import {drive} from 'googleapis';
import {R_OK, accessSync} from 'fs';

export default function downloadGoogleSpreadsheet (sheets, ...args) {

  // setup opts and cb
  if (args.length === 1) args.unshift({});
  let [opts, cb] = args;
  if (!sheets.length || typeof(opts) !== 'object')
    throw new Error('Invalid arguments');
  if (Object.keys(opts).length === 0) {
    try {
      accessSync('.env', R_OK);
      dotenv.config();
    } catch (err) {
      if (['ENOENT', 'EACCES'].indexOf(err.code) !== -1) throw err;
    }
    opts.id = process.env['DGSS_CLIENT_ID'];
    opts.secret = process.env['DGSS_CLIENT_SECRET'];
    opts.redirect = process.env['DGSS_REDIRECT_URL'] || 'http://localhost:3477/';
  }
  if (!opts.id || !opts.secret)
    throw new Error('Invalid arguments');

  // main logics
  auth(opts.id, opts.secret, opts.redirect, '.dgsstoken', (err, auth) => {
    if (err) return cb(err);
    const gdrive = drive({version: 'v2', auth});
    const headers = {Authorization: `Bearer ${auth.credentials.access_token}`};
    const createTask = ({dest, fileId, gid}) => (cb) => {
      // get meta data and download
      gdrive.files.get({fileId}, (err, file) => {
        if (err) return cb(err);
        const url = `${file.exportLinks['text/csv']}&gid=${gid}`;
        downloadCsv({headers, url}, (dest || `./${gid}.csv`), cb);
      });
    }
    async.waterfall(sheets.map(createTask), cb);
  });

  // continue
  cb(null);
}

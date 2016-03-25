import {R_OK, accessSync} from 'fs';
import dotenv from 'dotenv';

export default function downloadGoogleSpreadsheet (sheets, ...args) {

  // setup opts and cb
  if (args.length === 1) args.unshift({});
  let [opts, cb] = args;
  if (!opts || Object.keys(opts).length === 0) {
    try {
      accessSync('.env', R_OK);
      dotenv.config();
    } catch (err) {}
    opts = process.env;
  }

  // main logics
  console.log('Hello world!');

  // continue
  cb(null);
}

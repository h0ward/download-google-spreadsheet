#!/usr/bin/env node
import downloadGoogleSpreadsheet from '../index';

const argv = process.argv.slice(2);

downloadGoogleSpreadsheet.call(null, ...argv.map(JSON.parse), (err) => {
  if (err) throw err;
});

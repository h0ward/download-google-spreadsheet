'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = downloadCsv;

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _fs = require('fs');

var _path = require('path');

var _mkdirp = require('mkdirp');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function downloadCsv(opts, dest, cb) {
  var req = (0, _request2.default)(opts);
  try {
    (0, _fs.accessSync)((0, _path.dirname)(dest), _fs.W_OK);
  } catch (err) {
    (0, _mkdirp.sync)((0, _path.dirname)(dest));
  }
  var writable = (0, _fs.createWriteStream)(dest);
  req.on('response', function (res) {
    res.pipe(writable, { end: false });
    res.on('end', function () {
      return writable.write('\n', function () {
        return writable.end();
      });
    });
  });
  writable.on('close', cb);
  req.on('error', cb);
  req.end();
}
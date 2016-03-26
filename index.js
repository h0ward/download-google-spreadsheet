'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = downloadGoogleSpreadsheet;

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _auth = require('./lib/auth');

var _auth2 = _interopRequireDefault(_auth);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _downloadCsv = require('./lib/download-csv');

var _downloadCsv2 = _interopRequireDefault(_downloadCsv);

var _googleapis = require('googleapis');

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function downloadGoogleSpreadsheet(sheets) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  // setup opts and cb
  if (args.length === 1) args.unshift({});
  var opts = args[0];
  var cb = args[1];

  if (!sheets.length || (typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) !== 'object') throw new Error('Invalid arguments');
  if (Object.keys(opts).length === 0) {
    try {
      (0, _fs.accessSync)('.env', _fs.R_OK);
      _dotenv2.default.config();
    } catch (err) {
      if (['ENOENT', 'EACCES'].indexOf(err.code) !== -1) throw err;
    }
    opts.id = process.env['DGSS_CLIENT_ID'];
    opts.secret = process.env['DGSS_CLIENT_SECRET'];
    opts.redirect = process.env['DGSS_REDIRECT_URL'] || 'http://localhost:3477/';
  }
  if (!opts.id || !opts.secret) throw new Error('Invalid arguments');

  // main logics
  (0, _auth2.default)(opts.id, opts.secret, opts.redirect, '.dgsstoken', function (err, auth) {
    if (err) return cb(err);
    var gdrive = (0, _googleapis.drive)({ version: 'v2', auth: auth });
    var headers = { Authorization: 'Bearer ' + auth.credentials.access_token };
    var createTask = function createTask(_ref) {
      var dest = _ref.dest;
      var fileId = _ref.fileId;
      var gid = _ref.gid;
      return function (cb) {
        // get meta data and download
        gdrive.files.get({ fileId: fileId }, function (err, file) {
          if (err) return cb(err);
          var url = file.exportLinks['text/csv'] + '&gid=' + gid;
          (0, _downloadCsv2.default)({ headers: headers, url: url }, dest || './' + gid + '.csv', cb);
        });
      };
    };
    _async2.default.waterfall(sheets.map(createTask), cb);
  });

  // continue
  cb(null);
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = auth;

var _googleapis = require('googleapis');

var _googleapis2 = _interopRequireDefault(_googleapis);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _open = require('open');

var _open2 = _interopRequireDefault(_open);

var _url = require('url');

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getAuthCode = function getAuthCode(redirect, cb) {
  var _parse = (0, _url.parse)(redirect);

  var hostname = _parse.hostname;
  var port = _parse.port;

  var server = _http2.default.createServer(function (req, resp) {
    resp.end();
    req.connection.destroy();
    server.close();
    cb(req.url.substr(7));
  });
  server.maxConnections = 1;
  server.listen(port, hostname);
};

function auth(id, secret, redirect, cache, cb) {
  var auth = new _googleapis2.default.auth.OAuth2(id, secret, redirect);
  var url = auth.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.readonly']
  });
  // try to use cached token
  if (cache) try {
    var tokens = JSON.parse((0, _fs.readFileSync)(cache));
    if (tokens.expiry_date && new Date().getTime() < tokens.expiry_date) {
      auth.setCredentials(tokens);
      return cb(null, auth);
    }
  } catch (err) {}
  (0, _open2.default)(url);
  getAuthCode(redirect, function (code) {
    auth.getToken(code, function (err, tokens) {
      if (err) return cb(err);
      if (cache) try {
        (0, _fs.writeFileSync)(cache, JSON.stringify(tokens, null, 2));
      } catch (err) {}
      auth.setCredentials(tokens);
      cb(null, auth);
    });
  });
};
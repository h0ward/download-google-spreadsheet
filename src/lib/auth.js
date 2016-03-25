import gapi from 'googleapis';
import http from 'http';
import open from 'open';
import {parse} from 'url';

const getAuthCode = (redirect, cb) => {
  const {hostname, port} = parse(redirect);
  const server = http.createServer((req, resp) => {
    resp.end();
    req.connection.destroy();
    server.close();
    cb(req.url.substr(7));
  });
  server.maxConnections = 1;
  server.listen(port, hostname);
};

export default function auth (id, secret, redirect, cb) {
  const auth = new gapi.auth.OAuth2(id, secret, redirect);
  const url = auth.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.readonly']
  });
  open(url);
  getAuthCode(redirect, (code) => {
    auth.getToken(code, (err, tokens) => {
      if (err) return cb(err);
      auth.setCredentials(tokens);
      cb(null, auth);
    });
  });
};

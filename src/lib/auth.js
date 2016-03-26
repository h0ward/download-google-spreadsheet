import gapi from 'googleapis';
import http from 'http';
import open from 'open';
import {parse} from 'url';
import {readFileSync, writeFileSync} from 'fs';

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

export default function auth (id, secret, redirect, cache, cb) {
  const auth = new gapi.auth.OAuth2(id, secret, redirect);
  const url = auth.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.readonly']
  });
  // try to use cached token
  if (cache) try {
    const tokens = JSON.parse(readFileSync(cache));
    if (tokens.expiry_date && new Date().getTime() < tokens.expiry_date) {
      auth.setCredentials(tokens);
      return cb(null, auth);
    }
  } catch (err) {}
  open(url);
  getAuthCode(redirect, (code) => {
    auth.getToken(code, (err, tokens) => {
      if (err) return cb(err);
      if (cache)
        try {writeFileSync(cache, JSON.stringify(tokens, null, 2));}
        catch (err) {}
      auth.setCredentials(tokens);
      cb(null, auth);
    });
  });
};

download-google-spreadsheet 0.1.1
=================================

> Download your Google Spreadsheets with Node.js.

Usage
-----

Get the API key:

1. Visit [Google Developers Console][1.1] and create a project
*  Go to `Overview` then get into `Drive API` and `Enable`
*  Then `API Manager / Credentials / Create credentials / OAuth client ID`
*  Set `Application type` to `Web application`
*  Set `Authorized redirect URIs` to `http://localhost:3477/` or your own value
*  Continue to `Create` and save your new credential

Then export to environment variables: `DGSS_CLIENT_ID`, `DGSS_CLIENT_SECRET` and `DGSS_REDIRECT_URL`. Or save them into [`.env`](./.env.example) under the working directory if you want, then:

```sh
$(npm bin)/download-google-spreadsheet '[{"fileId":"11KmsfhX7M0q3dwLSYiUAIIbov8qHvvhLcxqJzv9o1Pw","gid":"0"}]'
```

If no cached token `.dgsstoken` can be found under current directory, you will be prompted to a Google OAuth page for you to authorize your API key to access the spreadsheets. The token will then be cached and you will not be prompted again until the expiration.

After that, the [test spreadsheet][1.2] will be downloaded into current working directory as `0.csv`. The CSV file will be named as `gid` by default if there is no `dest` attribute defined for that sheet.

You can find the `fileId` and `gid` attributes from the link to your spreadsheet:
`https://docs.google.com/spreadsheets/d/11KmsfhX7M0q3dwLSYiUAIIbov8qHvvhLcxqJzv9o1Pw/edit#gid=0`

### API

```js
var downloadGoogleSpreadsheet = require('download-google-spreadsheet');

var sheets = [{
  dest: './somedir/test.csv',
  fileId: '11KmsfhX7M0q3dwLSYiUAIIbov8qHvvhLcxqJzv9o1Pw',
  gid: '0',
}];

var opts = {
  id: '686354652584-fule4tvfhelci96apnb368bsu3d1st9c.apps.googleusercontent.com',
  redirect: 'http://localhost:3477/',
  secret: 'OeBRLzWNkwMOdjDe5HyHqIiZ',
};

downloadGoogleSpreadsheet(sheets, opts, function (err) {
  if (err) throw err;
  console.log('Done.');
});
```

### Options

* `id` Google OAuth client ID
* `redirect` Must be one of the `Authorized redirect URIs` in credential settings
* `secret` Google OAuth client secret

Development
-----------

`npm run dev`, code [`./src/**/*.js`](./src), then `./bin/download-google-spreadsheet.js` to try.

Releases
--------

| Date       | Version | Description     |
|------------|---------|-----------------|
| 2016-03-28 | 0.1.1   | Fix callback    |
| 2016-03-27 | 0.1.0   | Initial release |

TODOs
-----
* Support `stdin` and pipe
* Support CLI-only environment
* Show feedbacks to screen
* Expose more options
* Update build script to produce readable scripts
* Update readme
* Cache multiple tokens for multiple spreadsheets
* Code linting
* Test

[1.1]: https://console.developers.google.com
[1.2]: https://docs.google.com/spreadsheets/d/11KmsfhX7M0q3dwLSYiUAIIbov8qHvvhLcxqJzv9o1Pw/edit#gid=0

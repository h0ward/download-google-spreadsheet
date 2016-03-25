download-google-spreadsheet
===========================

> Download your Google Spreadsheets with Node.js.

Getting the API key:

1. Visit [Google Developers Console][1.1] and create a project
*  Go to `Overview` then get into `Drive API` and `Enable`
*  Then `API Manager / Credentials / Create credentials / OAuth client ID`
*  Set `Application type` to `Web application`
*  Set `Authorized redirect URIs` to `http://localhost:3477/` or your own value
*  Continue to `Create` and save your new credential

You may save the credential to a [`.env`](./.env.example) file under current directory and assign the values to `DGSS_CLIENT_ID`, `DGSS_CLIENT_SECRET` and `DGSS_REDIRECT_URL` accordingly, then:
```sh
${npm bin}/download-google-spreadsheet '[{"fileId":"11KmsfhX7M0q3dwLSYiUAIIbov8qHvvhLcxqJzv9o1Pw","gid":"0"}]'
```

And you will find the [test spreadsheet][1.2] has been downloaded as `0.csv` under the current directory.

The `fileId` and `gid` attributes can be found in the link to your spreadsheet:
`https://docs.google.com/spreadsheets/d/11KmsfhX7M0q3dwLSYiUAIIbov8qHvvhLcxqJzv9o1Pw/edit#gid=0`

Also, by default, if there is no `dest` attribute defined for the sheet, then `gid` will be used as the file name.

The token will be cached as `.dgss_token` under currently working directory.

TODOs
-----
* Options to configure cache
* Make it works under CLI-only environment
* Show more feedbacks to screen
* Support `stdin` and pipe
* Update docs
* Update build script to produce readable scripts

[1.1]: https://console.developers.google.com
[1.2]: https://docs.google.com/spreadsheets/d/11KmsfhX7M0q3dwLSYiUAIIbov8qHvvhLcxqJzv9o1Pw/edit#gid=0

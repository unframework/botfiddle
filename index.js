var express = require('express');

var WebHookRouter = require('./lib/WebHookRouter');

function fail(msg) {
    throw new Error(msg);
}

var appSecret = process.env.APP_SECRET || fail('missing app secret');

var fbInputStream = new WebHookRouter('mytokenisgoodya', appSecret);
fbInputStream.on('data', function (data) {
    console.log(data);
});

var app = express();

app.use('/fb-webhook', fbInputStream.router);

app.listen(process.env.PORT || 3000, function () {
    console.log('started');
});

var express = require('express');

var FBInputStream = require('./lib/FBInputStream');
var FBUserOutputStream = require('./lib/FBUserOutputStream');

function fail(msg) {
    throw new Error(msg);
}

var appSecret = process.env.APP_SECRET || fail('missing app secret');
var pageToken = process.env.PAGE_TOKEN || fail('missing page token');

var fbInputStream = new FBInputStream('mytokenisgoodya', appSecret);
fbInputStream.on('data', function (data) {
    console.log(data);

    var senderId = data.sender.id;

    var outputStream = new FBUserOutputStream(pageToken, senderId);
    outputStream.write({ text: 'Hi there!' });
});

var app = express();

app.use('/fb-webhook', fbInputStream.webhookRouter);

app.listen(process.env.PORT || 3000, function () {
    console.log('started');
});

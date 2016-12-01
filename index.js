var express = require('express');

var WebHookRouter = require('./lib/WebHookRouter');

function fail(msg) {
    throw new Error(msg);
}

var appSecret = process.env.APP_SECRET || fail('missing app secret');

var app = express();

app.use('/fb-webhook', new WebHookRouter('mytokenisgoodya', appSecret, function (senderId, text) {
    console.log(senderId, 'text', text);
}, function (senderId, payload) {
    console.log(senderId, 'payload', payload);
}));

app.listen(process.env.PORT || 3000, function () {
    console.log('started');
});

var Readable = require('stream').Readable;
var express = require('express');
var RemoteControl = require('remote-control');

var FBInputStream = require('./lib/FBInputStream');
var FBUserOutputStream = require('./lib/FBUserOutputStream');
var ClientConnection = require('./lib/ClientConnection');

function fail(msg) {
    throw new Error(msg);
}

var appId = process.env.APP_ID || fail('missing app id');
var appSecret = process.env.APP_SECRET || fail('missing app secret');
var pageToken = process.env.PAGE_TOKEN || fail('missing page token');
var messengerId = process.env.MESSENGER_ID || fail('missing messenger ID');

var userMessageReadableMap = Object.create(null);

var fbInputStream = new FBInputStream('mytokenisgoodya', appSecret);
fbInputStream.on('data', function (data) {
    console.log(data);

    var senderId = data.sender.id;

    if (data.optin) {
        // signal EOF to any incoming messages for existing stream (which triggers cleanup)
        if (userMessageReadableMap[senderId]) {
            userMessageReadableMap[senderId].push(null);
            delete userMessageReadableMap[senderId];
        }

        // connect output stream to the new session
        var connection = ClientConnection.activeConnectionMap[data.optin.ref];

        if (connection) {
            var inputStream = new Readable({ objectMode: true });
            inputStream._read = function () {}; // no-op

            userMessageReadableMap[senderId] = inputStream;

            var outputStream = new FBUserOutputStream(pageToken, senderId);

            connection.connect(
                inputStream,
                outputStream
            );

            // cut off user output when done with this connection
            inputStream.on('end', function () {
                outputStream.end();
            })

            console.log('got opt-in for', senderId, 'session ID is', connection._id);
        }
    }

    // @todo this
    // var outputStream = new FBUserOutputStream(pageToken, senderId);
    // outputStream.write({ text: 'Hi there!' });
});

ClientConnection.setFBAppId(appId);
ClientConnection.setFBMessengerId(messengerId);

var app = express();

app.use('/fb-webhook', fbInputStream.webhookRouter);

app.listen(process.env.PORT || 3000, function () {
    console.log('started');
});

var rc = new RemoteControl(ClientConnection, './client.js', 9966);

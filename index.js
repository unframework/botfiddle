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

var senderConnectionMap = Object.create(null);

var fbInputStream = new FBInputStream('mytokenisgoodya', appSecret);
fbInputStream.on('data', function (data) {
    console.log(data);

    var senderId = data.sender.id;

    if (data.optin) {
        // stop existing message stream from a previous session
        if (senderConnectionMap[senderId]) {
            senderConnectionMap[senderId].disconnect();
            delete senderConnectionMap[senderId];
        }

        // connect output stream to the new session
        var connection = ClientConnection.activeConnectionMap[data.optin.ref];

        if (connection) {
            connection.connect(
                new Readable(),
                new FBUserOutputStream(pageToken, senderId)
            );

            senderConnectionMap[senderId] = connection;

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

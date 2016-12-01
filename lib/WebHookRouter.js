var express = require('express');
var xhub = require('express-x-hub');

function WebHookRouter(webHookVerifyToken, appSecret, messageCallback, postbackCallback) {
    var fbWebHookApp = new express.Router();

    fbWebHookApp.get('/', function (req, res) {
        if (req.query['hub.verify_token'] === webHookVerifyToken) {
            res.send(req.query['hub.challenge']);
            return;
        }

        res.status(400).send('Wrong validation token');
    });

    fbWebHookApp.post('/', xhub({
        algorithm: 'sha1',
        secret: appSecret
    }), function (req, res) {
        if (!req.isXHub) {
            return res.status(401).send('not xhub');
        }

        if (!req.isXHubValid()) {
            return res.status(401).send('not matching sig');
        }

        res.sendStatus(200);

        var messaging_events = req.body.entry[0].messaging;

        for (i = 0; i < messaging_events.length; i++) {
            var event = req.body.entry[0].messaging[i];
            var sender = event.sender.id;

            if (event.message && event.message.text) {
                var text = event.message.text;

                messageCallback(sender, text);
            }

            if (event.postback) {
                var payload = null;

                // wrap only parsing in the try/catch
                try {
                    payload = JSON.parse(event.postback.payload);
                } catch (e) {
                    // no-op, since data is untrusted anyway
                }

                postbackCallback(sender, payload);
            }
        }
    });

    return fbWebHookApp;
}

module.exports = WebHookRouter;

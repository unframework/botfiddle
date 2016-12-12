var Readable = require('stream').Readable;
var Writable = require('stream').Writable;
var React = require('react');
var ReactDOM = require('react-dom');

var Workspace = require('./lib/workspace/Workspace');
var MessengerSession = require('./lib/workspace/MessengerSession');
var ACEEditorWidget = require('./lib/ACEEditorWidget');

var Server = require('__server');

var SCRIPT = 'input.on(\'data\', function (data) {\n    console.log(data);\n    output.write({ text: \'Hi from BotFiddle browser!\' });\n});\n';

// FB SDK
(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

var whenFBLoaded = new Promise(function (resolve) {
    window.fbAsyncInit = function () {
        resolve();
    };
});

(function () {
    var server = new Server();
    var editorWidget = null;

    var scriptInputStream = null;
    var scriptOutputStream = null;

    function runScript() {
        // disconnect old script plumbing
        if (scriptInputStream) {
            scriptInputStream.push(null);
        }

        if (scriptOutputStream) {
            scriptOutputStream.end();
        }

        // new script plumbing
        scriptInputStream = new Readable({ objectMode: true });
        scriptInputStream._read = function () {
            // no-op
        };

        scriptOutputStream = new Writable({ objectMode: true });
        scriptOutputStream._write = function (scriptMessageData, encoding, callback) {
            // send without waiting for response
            // @todo wait before callback to avoid draining too fast?
            server.sendMessage(scriptMessageData);

            messengerSession.logSentData(scriptMessageData);

            callback();
        };

        var scriptText = editorWidget.getText();

        // @todo sandbox on domain, etc
        var scriptBody = new Function('input', 'output', scriptText); // @todo catch?

        scriptBody(
            scriptInputStream,
            scriptOutputStream
        );
    };

    var whenOptInInfoLoaded = server.getInfo().then(function (info) {
        return whenFBLoaded.then(function () {
            window.FB.init({
                appId: info.fbAppId,
                xfbml: false, // no parsing needed yet
                version: "v2.6"
            });

            return {
                fbAppId: info.fbAppId,
                fbMessengerId: info.fbMessengerId,
                id: info.id
            };
        });
    });

    var whenEventsLoaded = server.getEvents();

    whenEventsLoaded.then(function (emitter) {
        emitter.on('data', function (data) {
            // skip initial marker packet
            if (Object.keys(data).length < 1) {
                return;
            }

            if (scriptInputStream) {
                scriptInputStream.push(data);
            }
        });
    });

    var messengerSession = null;

    var root = document.createElement('div');
    document.body.appendChild(root);

    ReactDOM.render(<Workspace
        editorWidget={<ACEEditorWidget
            initialScript={SCRIPT}
            ref={(ew) => {
                editorWidget = ew;
            }}
        />}
        goButton={<button onClick={() => runScript()}>Go!</button>}
        messengerSession={<MessengerSession
            whenOptInInfoLoaded={whenOptInInfoLoaded}
            whenEventsLoaded={whenEventsLoaded}
            ref={(node) => {
                messengerSession = node;
            }}
        />}
    />, root);
})();

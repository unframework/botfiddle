var Readable = require('stream').Readable;
var Writable = require('stream').Writable;
var Redux = require('redux');
var Provider = require('react-redux').Provider;
var React = require('react');
var ReactDOM = require('react-dom');

var Workspace = require('./lib/workspace/Workspace');
var ScriptRunButton = require('./lib/workspace/ScriptRunButton');
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
    var store = Redux.createStore((state = {}, action) => {
        return {
            scriptRunState: getScriptRunState(state.scriptRunState, action)
        };
    });

    var server = new Server();

    function getScriptRunState(scriptRunState = null, action) {
        if (action.type !== 'SCRIPT_RUN') {
            return scriptRunState;
        }

        // disconnect old script plumbing
        if (scriptRunState) {
            scriptRunState.inputStream.push(null);
            scriptRunState.outputStream.end();
        };

        // new script plumbing
        var scriptInputStream = new Readable({ objectMode: true });
        scriptInputStream._read = function () {
            // no-op
        };

        var scriptOutputStream = new Writable({ objectMode: true });
        scriptOutputStream._write = function (scriptMessageData, encoding, callback) {
            // send without waiting for response
            // @todo wait before callback to avoid draining too fast?
            server.sendMessage(scriptMessageData);

            messengerSession.logSentData(scriptMessageData);

            callback();
        };

        var scriptText = action.scriptText;

        // @todo sandbox on domain, etc
        var scriptBody = new Function('input', 'output', scriptText); // @todo catch?

        // @todo check errors
        scriptBody(
            scriptInputStream,
            scriptOutputStream
        );

        return {
            inputStream: scriptInputStream,
            outputStream: scriptOutputStream
        };
    }

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

            // push event to current script
            var scriptRunState = store.getState().scriptRunState;

            if (scriptRunState !== null && scriptRunState.inputStream) {
                scriptRunState.inputStream.push(data);
            }
        });
    });

    var messengerSession = null;
    var editorWidget = null;

    function getEditorText() {
        return editorWidget.getText();
    }

    var root = document.createElement('div');
    document.body.appendChild(root);

    ReactDOM.render(<Provider store={store}><Workspace
        editorWidget={<ACEEditorWidget
            initialScript={SCRIPT}
            ref={(ew) => {
                editorWidget = ew;
            }}
        />}
        goButton={<ScriptRunButton getEditorText={getEditorText} />}
        messengerSession={<MessengerSession
            whenOptInInfoLoaded={whenOptInInfoLoaded}
            whenEventsLoaded={whenEventsLoaded}
            ref={(node) => {
                messengerSession = node;
            }}
        />}
    /></Provider>, root);
})();

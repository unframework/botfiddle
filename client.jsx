var Writable = require('stream').Writable;
var Redux = require('redux');
var Provider = require('react-redux').Provider;
var React = require('react');
var ReactDOM = require('react-dom');

var Workspace = require('./lib/workspace/Workspace.jsx');
var ScriptRunButton = require('./lib/workspace/ScriptRunButton.jsx');
var MessengerSession = require('./lib/workspace/MessengerSession.jsx');
var ACEEditorWidget = require('./lib/ACEEditorWidget.jsx');
var editor = require('./lib/editor');
var optInInfo = require('./lib/optInInfo');
var session = require('./lib/session');
var scriptRunState = require('./lib/scriptRunState');

document.title = 'BotFiddle';

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
            editor: editor(state.editor, action),
            optInInfo: optInInfo(state.optInInfo, action),
            session: session(state.session, action),
            scriptRunState: scriptRunState(state.scriptRunState, action)
        };
    });

    var server = new Server();

    server.getInfo().then(function (info) {
        return whenFBLoaded.then(function () {
            window.FB.init({
                appId: info.fbAppId,
                xfbml: false, // no parsing needed yet
                version: "v2.6"
            });

            store.dispatch({
                type: 'OPT_IN_INFO_SET',
                fbAppId: info.fbAppId,
                fbMessengerId: info.fbMessengerId,
                payload: info.id
            });
        });
    });

    server.getEvents().then(function (emitter) {
        var sessionOutputStream = new Writable({ objectMode: true });
        sessionOutputStream._write = function (scriptMessageData, encoding, callback) {
            // send without waiting for response
            server.sendMessage(scriptMessageData);

            store.dispatch({
                type: 'SESSION_EVENT',
                data: scriptMessageData,
                isSent: true
            });

            callback();
        };

        emitter.on('data', function (data) {
            // initial marker packet
            if (Object.keys(data).length === 0) {
                store.dispatch({
                    type: 'SESSION_START',
                    outputStream: sessionOutputStream
                });

                return;
            }

            store.dispatch({
                type: 'SESSION_EVENT',
                data: data,
                isSent: false
            });

            // push event to current script
            var scriptRunState = store.getState().scriptRunState;

            if (scriptRunState !== null && scriptRunState.inputStream) {
                scriptRunState.inputStream.push(data);
            }
        });

        emitter.on('end', function () {
            store.dispatch({
                type: 'SESSION_END'
            });
        }.bind(this));
    });

    var root = document.createElement('div');
    document.body.appendChild(root);

    ReactDOM.render(<Provider store={store}><Workspace
        editorWidget={<ACEEditorWidget initialScript={SCRIPT} />}
        goButton={<ScriptRunButton />}
        messengerSession={<MessengerSession />}
    /></Provider>, root);
})();

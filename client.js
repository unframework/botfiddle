var Redux = require('redux');
var Provider = require('react-redux').Provider;
var React = require('react');
var ReactDOM = require('react-dom');

var Workspace = require('./lib/workspace/Workspace');
var ScriptRunButton = require('./lib/workspace/ScriptRunButton');
var MessengerSession = require('./lib/workspace/MessengerSession');
var ACEEditorWidget = require('./lib/ACEEditorWidget');
var optInInfo = require('./lib/optInInfo');
var scriptRunState = require('./lib/scriptRunState');

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
            optInInfo: optInInfo(state.optInInfo, action),
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
            whenEventsLoaded={whenEventsLoaded}
            ref={(node) => {
                messengerSession = node;
            }}
        />}
    /></Provider>, root);
})();

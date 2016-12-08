var Readable = require('stream').Readable;
var Writable = require('stream').Writable;
var vdomLive = require('vdom-live');

var Workspace = require('./lib/workspace/Workspace');
var MessengerSession = require('./lib/workspace/MessengerSession');
var FBOptInWidget = require('./lib/FBOptInWidget');
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

vdomLive(function (renderLive, h) {
    var server = new Server();
    var editorWidget = new ACEEditorWidget(SCRIPT);

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

    var whenOptInWidgetLoaded = server.getInfo().then(function (info) {
        return whenFBLoaded.then(function () {
            window.FB.init({
                appId: info.fbAppId,
                xfbml: false, // no parsing needed yet
                version: "v2.6"
            });

            return new FBOptInWidget(info.fbAppId, info.fbMessengerId, info.id);
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

    var workspace = new Workspace();
    var messengerSession = new MessengerSession(whenOptInWidgetLoaded, whenEventsLoaded);

    document.body.appendChild(renderLive(function () {
        return workspace.render(
            h,
            editorWidget,
            h('button', { onclick: function () { runScript(); } }, 'Go!'),
            messengerSession.render(h)
        );
    }));
});

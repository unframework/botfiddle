var Readable = require('stream').Readable;
var Writable = require('stream').Writable;
var vdomLive = require('vdom-live');

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
    var optInStatus = false;
    var optInWidget = null;
    var editorWidget = new ACEEditorWidget(SCRIPT);
    var eventLog = [];

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

    server.getInfo().then(function (info) {
        whenFBLoaded.then(function () {
            FB.init({
                appId: info.fbAppId,
                xfbml: false, // no parsing needed yet
                version: "v2.6"
            });

            optInWidget = new FBOptInWidget(info.fbAppId, info.fbMessengerId, info.id);
        });
    });

    server.getEvents().then(function (emitter) {
        emitter.on('data', function (data) {
            optInStatus = true;

            // skip initial marker packet
            if (Object.keys(data).length < 1) {
                return;
            }

            // @todo this better
            eventLog.unshift(JSON.stringify(data));

            if (scriptInputStream) {
                scriptInputStream.push(data);
            }
        });
    });

    document.body.appendChild(renderLive(function () {
        return h('div', [
            editorWidget, // optInStatus ? editorWidget : null,
            h('button', { onclick: function () { runScript(); } }, 'Go!'),
            optInStatus ? 'Opted in!' : (
                optInWidget ? [ 'Start new session: ', optInWidget ] : 'Loading...'
            ),
            h('ul', { style: { border: '1px solid #eee' } }, eventLog.map(function (entry) {
                return h('li', entry);
            }))
        ]);
    }));
});

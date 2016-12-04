var Readable = require('stream').Readable;
var Writable = require('stream').Writable;
var vdomLive = require('vdom-live');

var Workspace = require('./lib/workspace/Workspace');
var MessengerSession = require('./lib/workspace/MessengerSession');
var ACEEditorWidget = require('./lib/ACEEditorWidget');

var Server = require('__server');

var SCRIPT = 'input.on(\'data\', function (data) {\n    console.log(data);\n    output.write({ text: \'Hi from BotFiddle browser!\' });\n});\n';

vdomLive(function (renderLive, h) {
    var server = new Server();
    var messengerSession = new MessengerSession();
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
        messengerSession.initialize(info.fbAppId, info.fbMessengerId, info.id);
    });

    server.getEvents().then(function (emitter) {
        emitter.on('data', function (data) {
            messengerSession.logIncomingData(data);

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

    var workspace = new Workspace();

    document.body.appendChild(renderLive(function () {
        return workspace.render(
            h,
            editorWidget,
            h('button', { onclick: function () { runScript(); } }, 'Go!'),
            messengerSession.render(h),
            h('ul', { style: { border: '1px solid #eee' } }, eventLog.map(function (entry) {
                return h('li', entry);
            }))
        );
    }));
});

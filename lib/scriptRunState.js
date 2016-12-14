var Readable = require('stream').Readable;
var Writable = require('stream').Writable;

module.exports = function getScriptRunState(scriptRunState = null, action) {
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

        // @todo this is not working yet
        store.dispatch({
            type: 'SESSION_EVENT',
            data: scriptMessageData,
            isSent: true
        });

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

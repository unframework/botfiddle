var React = require('react');
var connect = require('react-redux').connect;

function ScriptRunButton({ editor, outputStream, onGoClick }) {
    return <button
        disabled={!editor || !outputStream}
        onClick={() => onGoClick(editor.getValue(), outputStream)}
    >
        Go!
    </button>;
}

function createScriptRunAction(scriptText, outputStream) {
    return {
        type: 'SCRIPT_RUN',
        scriptText: scriptText,
        outputStream: outputStream
    };
}

module.exports = connect((state) => ({
    editor: state.editor,
    outputStream: state.session && state.session.outputStream
}), (dispatch) => ({
    onGoClick: (scriptText, outputStream) => {
        dispatch(createScriptRunAction(scriptText, outputStream));
    }
}))(ScriptRunButton);

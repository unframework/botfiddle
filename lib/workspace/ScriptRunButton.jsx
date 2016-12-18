var React = require('react');
var connect = require('react-redux').connect;

function ScriptRunButton({ editor, outputStream, onGoClick }) {
    var isDisabled = !editor || !outputStream;

    return <button
        disabled={isDisabled}
        onClick={() => onGoClick(editor.getValue(), outputStream)}
        style={{
            display: 'block',
            margin: 0,
            border: 0,
            padding: '10px 20px',
            lineHeight: '16px',
            verticalAlign: 'middle',
            background: isDisabled ? '#c0e0f0' : '#80c0d0',
            cursor: isDisabled ? 'auto' : 'pointer',
            borderRadius: '3px',
            color: '#fff'
        }}
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

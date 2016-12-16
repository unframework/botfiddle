var React = require('react');
var connect = require('react-redux').connect;

function ScriptRunButton({ editor, onGoClick, onScriptMessageData }) {
    return <button
        disabled={!editor}
        onClick={() => onGoClick(editor.getValue(), onScriptMessageData)}
    >
        Go!
    </button>;
}

function createScriptRunAction(scriptText, onScriptMessageData) {
    return {
        type: 'SCRIPT_RUN',
        scriptText: scriptText,
        onScriptMessageData: onScriptMessageData
    };
}

module.exports = connect((state) => ({
    editor: state.editor
}), (dispatch) => ({
    onGoClick: (scriptText, onScriptMessageData) => {
        dispatch(createScriptRunAction(scriptText, onScriptMessageData));
    }
}))(ScriptRunButton);

var React = require('react');
var connect = require('react-redux').connect;

function ScriptRunButton({ editor, onScriptMessageData, onGoClick }) {
    return <button
        disabled={!editor || !onScriptMessageData}
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
    editor: state.editor,
    onScriptMessageData: state.session && state.session.onScriptMessageData
}), (dispatch) => ({
    onGoClick: (scriptText, onScriptMessageData) => {
        dispatch(createScriptRunAction(scriptText, onScriptMessageData));
    }
}))(ScriptRunButton);

var React = require('react');
var connect = require('react-redux').connect;

function ScriptRunButton({ getEditorText, onGoClick, onScriptMessageData }) {
    return <button onClick={() => onGoClick(getEditorText(), onScriptMessageData)}>
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

module.exports = connect(null, (dispatch) => ({
    onGoClick: (scriptText, onScriptMessageData) => {
        dispatch(createScriptRunAction(scriptText, onScriptMessageData));
    }
}))(ScriptRunButton);

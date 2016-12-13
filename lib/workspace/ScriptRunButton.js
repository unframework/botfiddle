var React = require('react');
var connect = require('react-redux').connect;

function ScriptRunButton({ getEditorText, onGoClick }) {
    return <button onClick={() => onGoClick(getEditorText())}>
        Go!
    </button>;
}

function createScriptRunAction(scriptText) {
    return {
        type: 'SCRIPT_RUN',
        scriptText: scriptText
    };
}

module.exports = connect(null, (dispatch) => ({
    onGoClick: (scriptText) => {
        dispatch(createScriptRunAction(scriptText));
    }
}))(ScriptRunButton);

var React = require('react');
var connect = require('react-redux').connect;

class ScriptRunButton extends React.Component {
    constructor() {
        super();

        this.state = {
            reactionTimeoutId: null
        };
    }

    onClick() {
        // set up reaction timeout
        var timeoutId = setTimeout(() => {
            // ignore if stale timeout
            if (this.state.reactionTimeoutId !== timeoutId) {
                return;
            }

            this.setState({ reactionTimeoutId: null });
        }, 300);

        this.setState({ reactionTimeoutId: timeoutId });

        this.props.onGoClick(this.props.editor.getValue(), this.props.outputStream);
    }

    render() {
        var isDisabled = this.state.reactionTimeoutId !== null || !this.props.editor || !this.props.outputStream;

        return <button
            disabled={isDisabled}
            onClick={() => this.onClick()}
            style={{
                display: 'block',
                margin: 0,
                border: 0,
                padding: '10px 20px',
                lineHeight: '16px',
                verticalAlign: 'middle',
                width: '80px',
                background: isDisabled ? '#c0e0f0' : '#80c0d0',
                cursor: isDisabled ? 'auto' : 'pointer',
                borderRadius: '3px',
                textAlign: 'center',
                color: '#fff'
            }}
        >
            { this.state.reactionTimeoutId !== null ? '😍' : 'Go!' }
        </button>;
    }
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

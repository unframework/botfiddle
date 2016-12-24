var React = require('react');
var connect = require('react-redux').connect;

var Hover = require('../Hover');
var SubmittableAction = require('../SubmittableAction');

class ScriptRunButton extends React.Component {
    constructor() {
        super();

        this.state = {
            isHovering: false
        };
    }

    render() {
        const style = {
            display: 'block',
            margin: 0,
            border: 0,
            padding: '10px 20px',
            lineHeight: '16px',
            verticalAlign: 'middle',
            width: '80px',
            background: this.state.isHovering ? '#90d0e0' : '#80c0d0',
            cursor: 'pointer',
            borderRadius: '3px',
            textAlign: 'center',
            color: '#fff'
        };

        return <Hover onStart={(hoverState) => {
            this.setState({ isHovering: true });

            hoverState.whenEnded.then(() => {
                this.setState({ isHovering: false });
            });
        }}><SubmittableAction onSubmit={() => {
            this.props.onGoClick(this.props.editor.getValue(), this.props.outputStream);
        }} prompt={(actionState) => {
            const isDisabled = !this.props.editor || !this.props.outputStream;

            return <button
                disabled={isDisabled}
                onClick={() => actionState.submit()}
                style={Object.assign({}, style, {
                    background: isDisabled ? '#c0e0f0' : style.background,
                    cursor: isDisabled ? 'auto' : 'pointer'
                })}
            >Go!</button>;
        }} notify={(successValue, restart) => {
            setTimeout(() => {
                restart();
            }, 300);

            return <button style={style}>😍</button>;
        }} /></Hover>;
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

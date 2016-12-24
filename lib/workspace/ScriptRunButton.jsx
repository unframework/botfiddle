var React = require('react');
var connect = require('react-redux').connect;

var Hover = require('../Hover');
var Linger = require('../Linger');
var Submit = require('../Submit');

class ScriptRunButton extends React.PureComponent {
    render() {
        const style = {
            display: 'block',
            margin: 0,
            border: 0,
            padding: '10px 20px',
            lineHeight: '16px',
            verticalAlign: 'middle',
            width: '80px',
            cursor: 'pointer',
            borderRadius: '3px',
            textAlign: 'center',
            color: '#fff'
        };

        return <Hover contents={(hoverState) =>
            <Linger delayMs={500} active={!!hoverState} contents={(lingerState) =>
                <Submit action={() => {
                    this.props.onGoClick(this.props.editor.getValue(), this.props.outputStream);
                }} prompt={(invoke, error) => {
                    const isDisabled = !this.props.editor || !this.props.outputStream;

                    return <button
                        disabled={isDisabled}
                        onClick={() => invoke()}
                        style={Object.assign({}, style, {
                            background: isDisabled ? '#c0e0f0' : (hoverState ? '#90d0e0' : '#80c0d0'),
                            cursor: isDisabled ? 'auto' : 'pointer'
                        })}
                    >Go!{lingerState ? '!!!!!' : ''}</button>;
                }} notify={(successValue, restart) => {
                    setTimeout(() => {
                        restart();
                    }, 300);

                    return <button
                        style={Object.assign({}, style, {
                            background: hoverState ? '#90d0e0' : '#80c0d0'
                        })}
                    >😍</button>;
                }} />
            } />
        } />;
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

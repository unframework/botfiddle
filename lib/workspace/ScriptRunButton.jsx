var React = require('react');
var connect = require('react-redux').connect;

var Hover = require('../Hover');

class ActionState {
    constructor(onSubmit) {
        this._onSubmit = onSubmit;
        this._resolveSuccess = null;

        this.isPending = false;
        this.error = null;

        this.isComplete = false;
        this.whenComplete = new Promise((resolve) => {
            this._resolveSuccess = resolve;
        });
    }

    submit() {
        if (this.isComplete) {
            throw new Error('action already complete');
        }

        if (this.isPending) {
            throw new Error('action already pending');
        }

        this.isPending = true;

        // wrap any possible outcome in promise
        const result = new Promise((resolve) => {
            resolve(this._onSubmit());
        });

        // allow a re-do on error
        result.catch((e) => {
            this.isPending = false;
            this.error = e;
        });

        // on success, keep pending status but notify hook
        result.then((v) => {
            this.isPending = false;
            this.isComplete = true;
            this._resolveSuccess(v);
        });
    }
}

class SubmittableAction extends React.Component {
    constructor() {
        super();

        this.state = {
            actionState: this._createActionState(),
            successValue: null
        };
    }

    _createActionState() {
        const actionState = new ActionState(() => {
            return this.props.onSubmit();
        });

        actionState.whenComplete.then((v) => {
            this.setState({
                actionState: null,
                successValue: v
            });
        });

        return actionState;
    }

    _reset() {
        this.setState({
            actionState: this._createActionState(),
            successValue: null
        });
    }

    render() {
        return this.state.actionState
            ? this.props.prompt(this.state.actionState)
            : this.props.notify(this.state.successValue, () => this._reset());
    }
}

class ScriptRunButton extends React.Component {
    constructor() {
        super();

        this.state = {
            isHovering: false,
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

    // render() {
    //     var isDisabled = this.state.reactionTimeoutId !== null || !this.props.editor || !this.props.outputStream;

    //     return <Hover onStart={(hoverState) => {
    //         this.setState({ isHovering: true });

    //         hoverState.whenEnded.then(() => {
    //             this.setState({ isHovering: false });
    //         });
    //     }}><button
    //         disabled={isDisabled}
    //         onClick={() => this.onClick()}
    //         style={{
    //             display: 'block',
    //             margin: 0,
    //             border: 0,
    //             padding: '10px 20px',
    //             lineHeight: '16px',
    //             verticalAlign: 'middle',
    //             width: '80px',
    //             background: isDisabled ? '#c0e0f0' : (this.state.isHovering ? '#90d0e0' : '#80c0d0'),
    //             cursor: isDisabled ? 'auto' : 'pointer',
    //             borderRadius: '3px',
    //             textAlign: 'center',
    //             color: '#fff'
    //         }}
    //     >
    //         { this.state.reactionTimeoutId !== null ? '😍' : 'Go!' }
    //     </button></Hover>;
    // }

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

        return <SubmittableAction onSubmit={() => {
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
        }} />;
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

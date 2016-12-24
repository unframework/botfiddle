var React = require('react');

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

module.exports = SubmittableAction;

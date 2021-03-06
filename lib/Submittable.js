var React = require('react');

class Submittable extends React.Component {
    constructor() {
        super();

        this.state = {
            isComplete: false,
            currentAction: null,
            errorValue: null,
            successValue: null
        };
    }

    _invoke() {
        // @todo throw if already pending? hard to get it to be atomic
        const result = new Promise((resolve) => {
            resolve(this.props.action());
        });

        this.setState({
            currentAction: result
        });

        // allow a re-do on error
        result.catch((e) => {
            this.setState((state) => (state.currentAction === result ? {
                currentAction: null,
                errorValue: e
            } : {}));
        });

        // on success, switch to notify mode
        result.then((v) => {
            this.setState((state) => (state.currentAction === result ? {
                isComplete: true,
                currentAction: null,
                errorValue: null,
                successValue: v
            } : {}));
        });
    }

    _reset() {
        this.setState({
            isComplete: false
        });
    }

    render() {
        return !this.state.isComplete
            ? this.props.prompt(
                (this.state.currentAction ? null : () => this._invoke()),
                this.state.errorValue
            )
            : this.props.notify(this.state.successValue, () => this._reset());
    }
}

module.exports = Submittable;

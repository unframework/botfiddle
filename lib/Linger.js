const React = require('react');

class Linger extends React.Component {
    constructor(props) {
        super();

        this._activeTimeoutId = null;

        this.state = {
            lingerState: null
        };
    }

    componentWillUnmount() {
        this._activeTimeoutId = null;
    }

    _createTimeout() {
        const timeoutId = setTimeout(() => {
            if (this._activeTimeoutId !== timeoutId) {
                return;
            }

            this.setState({ lingerState: true });
        }, this.props.delayMs);

        return timeoutId;
    }

    render() {
        if (this.props.active) {
            if (!this._activeTimeoutId) {
                this._activeTimeoutId = this._createTimeout();
            }
        } else {
            if (this._activeTimeoutId) {
                this._activeTimeoutId = null;
                this.setState({ lingerState: null });
            }
        }

        return this.props.contents(this.state.lingerState);
    }
}

module.exports = Linger;

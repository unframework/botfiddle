const React = require('react');
const ReactDOM = require('react-dom');

class HoverState {
    constructor(domNode, whenEnded) {
        this.domNode = domNode;
        this.whenEnded = whenEnded;
    }
}

class Hover extends React.PureComponent {
    constructor(props) {
        super();

        this._enterListener = null;
        this._triggerLeave = null;
    }

    onMouseEnter(domNode) {
        if (this._triggerLeave) {
            this._triggerLeave();
        }

        const whenEnded = new Promise((resolve) => {
            const onLeave = this._triggerLeave = () => {
                domNode.removeEventListener('mouseleave', onLeave);
                this._triggerLeave = null;

                resolve();
            };

            domNode.addEventListener('mouseleave', onLeave, false);
        });

        this.props.onStart(new HoverState(domNode, whenEnded));
    }

    componentDidMount() {
        const domNode = ReactDOM.findDOMNode(this);

        if (!domNode) {
            throw new Error('must attach hover to regular DOM element');
        }

        this._enterListener = this.onMouseEnter.bind(this, domNode);
        domNode.addEventListener('mouseenter', this._enterListener, false);
    }

    componentWillUnmount() {
        if (this._triggerLeave) {
            this._triggerLeave();
        }

        domNode.removeEventListener('mouseenter', this._enterListener);
    }

    render() {
        return React.Children.only(this.props.children);
    }
}

module.exports = Hover;

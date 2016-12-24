const React = require('react');
const ReactDOM = require('react-dom');

class HoverState {
    constructor(domNode, whenCompleteBody) {
        this.domNode = domNode;
        this.whenComplete = new Promise(whenCompleteBody);
    }
}

class Hoverable extends React.Component {
    constructor(props) {
        super();

        this._enterListener = null;

        this.state = {
            hoverState: null
        };
    }

    onMouseEnter(domNode) {
        var onLeave = null;

        const hoverState = new HoverState(domNode, (resolve) => {
            onLeave = () => { resolve(); }
        });

        domNode.addEventListener('mouseleave', onLeave, false);
        this.setState({ hoverState: hoverState });

        hoverState.whenComplete.then(() => {
            domNode.removeEventListener('mouseleave', onLeave);
            this.setState((state) => (state.hoverState === hoverState ? { hoverState: null } : {}));
        });
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
        domNode.removeEventListener('mouseenter', this._enterListener);
    }

    render() {
        return this.props.contents(this.state.hoverState);
    }
}

module.exports = Hoverable;

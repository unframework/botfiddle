// ACE editor
var scriptNode = document.createElement('script');
scriptNode.src = 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.5/ace.js';
document.body.appendChild(scriptNode);

function whenACELoaded() {
    return new Promise(function (resolve) {
        if (window.ace) {
            resolve(window.ace);
            return;
        }

        var aceLoadIntervalId = setInterval(function () {
            if (window.ace) {
                clearTimeout(aceLoadIntervalId);
                resolve(window.ace);
            }
        }, 30);
    });
}

var React = require('react');

class ACEEditorWidget extends React.PureComponent {
    constructor({ initialScript }) {
        super();

        this._initialScript = initialScript;
        this._editor = null;
    }

    getText() {
        return this._editor ? this._editor.getValue() : this._initialScript;
    }

    _initEditorDOM(dom) {
        if (this._editor) {
            throw new Error('already initialized');
        }

        whenACELoaded().then(() => {
            var editor = ace.edit(dom);

            editor.setTheme("ace/theme/monokai");
            editor.getSession().setMode("ace/mode/javascript");
            editor.setValue(this._initialScript);
            editor.clearSelection();

            this._editor = editor;
        });
    }

    render() {
        return <div style={{
            display: 'inline-block',
            border: '#eee',
            width: '100%',
            height: '100%'
        }} ref={(dom) => {
            dom && this._initEditorDOM(dom);
        }}></div>;
    }
}

module.exports = ACEEditorWidget;

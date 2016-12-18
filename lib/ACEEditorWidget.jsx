var React = require('react');
var connect = require('react-redux').connect;

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

class ACEEditorWidget extends React.PureComponent {
    _initEditorDOM(dom) {
        if (this._editor) {
            throw new Error('already initialized');
        }

        whenACELoaded().then(() => {
            var editor = ace.edit(dom);

            editor.setTheme("ace/theme/monokai");
            editor.getSession().setMode("ace/mode/javascript");
            editor.setValue(this.props.initialScript);
            editor.clearSelection();

            this.props.onACEEditorLoaded(editor);
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

module.exports = connect(null, (dispatch) => ({
    onACEEditorLoaded: (aceEditor) => dispatch({ type: 'EDITOR_SET', aceEditor: aceEditor })
}))(ACEEditorWidget);

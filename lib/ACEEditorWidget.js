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

function ACEEditorWidget() {
}

ACEEditorWidget.prototype.type = 'Widget';

ACEEditorWidget.prototype.init = function () {
    var dom = document.createElement('div');
    dom.style.display = 'inline-block';
    dom.style.border = '#eee';
    dom.style.width = '640px';
    dom.style.height = '640px';

    whenACELoaded().then(function () {
        setTimeout(function () {
            var editor = ace.edit(dom);
            editor.setTheme("ace/theme/monokai");
            editor.getSession().setMode("ace/mode/javascript");
        }, 0);
    });

    return dom;
};

ACEEditorWidget.prototype.update = function (prev, dom) {
    // no-op
};

module.exports = ACEEditorWidget;

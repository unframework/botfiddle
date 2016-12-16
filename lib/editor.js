module.exports = function editor(editor = null, action) {
    if (action.type !== 'EDITOR_SET') {
        return editor;
    }

    if (editor) {
        throw new Error('editor already set');
    };

    var aceEditor = action.aceEditor;

    return {
        getValue: () => aceEditor.getValue()
    };
}

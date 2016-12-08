function Workspace() {
}

Workspace.prototype.render = function (h, editorWidget, goButton, messengerSession) {
    var headerHeightPx = 48;
    var editorWidthPct = 55;

    var header = h('div', { style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: headerHeightPx + 'px',
        background: '#eee',
        lineHeight: headerHeightPx + 'px',
        fontFamily: 'Arial, Helvetica',
        fontSize: '18px',
        paddingLeft: '20px'
    } }, [
        'BotFiddle',
        ' ',
        goButton
    ]);

    return h('div', { style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    } }, [
        header,

        h('div', { style: {
            position: 'absolute',
            top: headerHeightPx + 'px',
            left: 0,
            right: (100 - editorWidthPct) + '%',
            bottom: 0,
            background: '#a0a0a0'
        } }, [
            h('div', { style: {
                position: 'absolute',
                zIndex: 1,
                top: '20px',
                right: '20px',
                fontFamily: 'Arial, Helvetica',
                fontSize: '18px',
                color: '#f0f0f0',
                textShadow: '0px 0px 3px #000',
                opacity: 0.5
            } }, [ 'JavaScript' ]),
            editorWidget
        ]),

        h('div', { style: {
            position: 'absolute',
            top: headerHeightPx + 'px',
            left: editorWidthPct + '%',
            right: 0,
            bottom: 0
        } }, [
            h('div', { style: {
                position: 'absolute',
                top: '20px',
                right: '20px',
                fontFamily: 'Arial, Helvetica',
                fontSize: '18px',
                color: '#444',
                opacity: 0.5
            } }, [ 'Messenger Data Stream' ]),
            messengerSession
        ])
    ]);
};

module.exports = Workspace;

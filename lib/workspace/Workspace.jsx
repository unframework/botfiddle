var React = require('react');

function Workspace({ editorWidget, goButton, messengerSession }) {
    var headerHeightPx = 48;
    var editorWidthPct = 55;

    var header = <div style={{
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: headerHeightPx + 'px',
        background: '#eee',
        lineHeight: headerHeightPx + 'px'
    }}>
        <span style={{
            height: headerHeightPx + 'px',
            lineHeight: headerHeightPx + 'px',
            padding: '0 20px',
            fontFamily: 'Arial, Helvetica',
            fontSize: '18px'
        }}>BotFiddle</span>
        <span style={{
        }}>{goButton}</span>
    </div>;

    return <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }}>
        {header}

        <div style={{
            position: 'absolute',
            top: headerHeightPx + 'px',
            left: 0,
            right: (100 - editorWidthPct) + '%',
            bottom: 0,
            background: '#272822' // match default theme background
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                padding: '0 5px',
                lineHeight: '24px',
                fontFamily: 'Arial, Helvetica',
                fontSize: '18px',
                color: '#808080',
                textShadow: '0px 0px 3px #000'
            }}>
                JavaScript
            </div>
            <div style={{
                position: 'absolute',
                top: '24px',
                left: 0,
                right: 0,
                bottom: 0
            }}>
                {editorWidget}
            </div>
        </div>

        <div style={{
            position: 'absolute',
            top: headerHeightPx + 'px',
            left: editorWidthPct + '%',
            right: 0,
            bottom: 0
        }}>
            <div style={{
                position: 'absolute',
                zIndex: 1,
                top: 0,
                right: 0,
                padding: '0 5px',
                lineHeight: '24px',
                fontFamily: 'Arial, Helvetica',
                fontSize: '18px',
                color: '#444',
                opacity: 0.5
            }}>
                Messenger Data Stream
            </div>

            {messengerSession}
        </div>

        <div style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            fontFamily: 'Arial, Helvetica',
            fontSize: '14px'
        }}>
            <a href={'http://unframework.com'}>by @unframework</a>
        </div>
    </div>;
}

module.exports = Workspace;

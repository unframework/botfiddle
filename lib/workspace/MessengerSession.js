var moment = require('moment');

var DATE_FORMAT = 'YYYY-MM-DD';
var TIME_FORMAT = 'HH:mm:ss';

function MessengerSession(whenOptInWidgetLoaded, whenEventsLoaded) {
    this._optInStatus = false;
    this._optInWidget = null;
    this._isFinished = false;

    this._eventLog = [];

    whenOptInWidgetLoaded.then(function (optInWidget) {
        this._optInWidget = optInWidget;
    }.bind(this));

    whenEventsLoaded.then(function (emitter) {
        emitter.on('data', function (data) {
            this._optInStatus = true;

            // skip initial marker packet
            if (Object.keys(data).length < 1) {
                return;
            }

            this._eventLog.unshift([
                moment().format(DATE_FORMAT),
                moment().format(TIME_FORMAT),
                JSON.stringify(data, null, 2),
                false
            ]);
        }.bind(this));

        emitter.on('end', function () {
            this._isFinished = true;
        }.bind(this));
    }.bind(this));
}

MessengerSession.prototype.logSentData = function (data) {
    this._eventLog.unshift([
        moment().format(DATE_FORMAT),
        moment().format(TIME_FORMAT),
        JSON.stringify(data, null, 2),
        true
    ]);
};

MessengerSession.prototype.render = function (h) {
    return h('div', { style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#f0f0f0',
        fontFamily: 'Arial, Helvetica',
        fontSize: '18px',
        padding: '20px',
        overflowY: 'scroll'
    } }, [
        this._optInStatus
            ? [
                'Log: Sent / Received ',
                h('b', this._isFinished ? '(disconnected)' : '(connected)'),
                h('ul', { style: {
                    border: '1px solid #eee',
                    listStyle: 'none',
                    margin: '10px 0 0 0',
                    padding: 0,
                    fontSize: '14px',
                    opacity: this._isFinished ? 0.5 : 1
                } }, this._eventLog.map(function (entry) {
                    var date = entry[0];
                    var time = entry[1];
                    var text = entry[2];
                    var isSent = entry[3];
                    return h('li', { style: {
                        position: 'relative',
                        listStyleType: 'none',
                        margin: 0,
                        borderTop: '1px solid #ccc',
                        padding: '10px 10px 10px 8em',
                        background: isSent ? '#e8e8ff' : '#f0f0f0'
                    } }, [
                        h('var', { style: {
                            position: 'absolute',
                            top: '1.1em',
                            left: 0,
                            padding: '10px',
                            color: '#888',
                            fontStyle: 'normal'
                        } }, date),
                        h('var', { style: {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            padding: '10px',
                            color: '#444',
                            fontStyle: 'normal',
                            fontWeight: 'bold'
                        } }, time),
                        h('div', { style: {
                            whiteSpace: 'pre',
                            fontFamily: '\'Courier New\', mono',
                            overflow: 'auto'
                        } }, text)
                    ]);
                }))
            ]
            : (
                this._optInWidget
                    ? h('div', { style: {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginLeft: '-8em',
                        marginTop: (-(40 + this._optInWidget.heightPx) / 2) + 'px',
                        width: '16em',
                        height: (40 + this._optInWidget.heightPx) + 'px',
                        lineHeight: '40px',
                        textAlign: 'center',
                        fontFamily: 'Arial, Helvetica',
                        fontSize: '18px',
                        color: '#444'
                    } }, [ 'Click to connect Messenger session', h('br'), this._optInWidget ])
                    : h('div', { style: {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginLeft: '-8em',
                        marginTop: '-24px',
                        width: '16em',
                        height: '48px',
                        lineHeight: '48px',
                        textAlign: 'center',
                        fontFamily: 'Arial, Helvetica',
                        fontSize: '18px',
                        color: '#444'
                    } }, 'Initializing Messenger plugin...')
            )
    ]);
};

module.exports = MessengerSession;

var moment = require('moment');
var React = require('react');

var FBOptInWidget = require('./../FBOptInWidget');

var DATE_FORMAT = 'YYYY-MM-DD';
var TIME_FORMAT = 'HH:mm:ss';

class MessengerSession extends React.PureComponent {
    constructor({ whenOptInInfoLoaded, whenEventsLoaded }) {
        super();

        this._optInStatus = false;
        this._optInInfo = null;
        this._isFinished = false;

        this._eventLog = [];

        whenOptInInfoLoaded.then(function (optInInfo) {
            this._optInInfo = optInInfo;

            this.forceUpdate(); // @todo this better
        }.bind(this));

        whenEventsLoaded.then(function (emitter) {
            emitter.on('data', function (data) {
                this._optInStatus = true;

                // skip initial marker packet
                if (Object.keys(data).length < 1) {
                    this.forceUpdate(); // @todo this better
                    return;
                }

                this._eventLog.unshift([
                    moment().format(DATE_FORMAT),
                    moment().format(TIME_FORMAT),
                    JSON.stringify(data, null, 2),
                    false,
                    this._eventLog.length // id
                ]);

                this.forceUpdate(); // @todo this better
            }.bind(this));

            emitter.on('end', function () {
                this._isFinished = true;

                this.forceUpdate(); // @todo this better
            }.bind(this));
        }.bind(this));
    }

    logSentData(data) {
        this._eventLog.unshift([
            moment().format(DATE_FORMAT),
            moment().format(TIME_FORMAT),
            JSON.stringify(data, null, 2),
            true,
            this._eventLog.length // id
        ]);

        this.forceUpdate(); // @todo this better
    }

    render() {
        return <div style={{
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
        }}>{
            this._optInStatus
                ? <div>
                    Log: Sent / Received &nbsp;
                    <b>{this._isFinished ? '(disconnected)' : '(connected)'}</b>
                    <ul style={{
                        border: '1px solid #eee',
                        listStyle: 'none',
                        margin: '10px 0 0 0',
                        padding: 0,
                        fontSize: '14px',
                        opacity: this._isFinished ? 0.5 : 1
                    }}>{
                        this._eventLog.map(function (entry) {
                            var date = entry[0];
                            var time = entry[1];
                            var text = entry[2];
                            var isSent = entry[3];
                            var entryId = entry[4];

                            return <li key={entryId} style={{
                                position: 'relative',
                                listStyleType: 'none',
                                margin: 0,
                                borderTop: '1px solid #ccc',
                                padding: '10px 10px 10px 8em',
                                background: isSent ? '#e8e8ff' : '#f0f0f0'
                            }}>
                                <var style={{
                                    position: 'absolute',
                                    top: '1.1em',
                                    left: 0,
                                    padding: '10px',
                                    color: '#888',
                                    fontStyle: 'normal'
                                }}>{date}</var>
                                <var style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    padding: '10px',
                                    color: '#444',
                                    fontStyle: 'normal',
                                    fontWeight: 'bold'
                                }}>{time}</var>
                                <div style={{
                                    whiteSpace: 'pre',
                                    fontFamily: '\'Courier New\', mono',
                                    overflow: 'auto'
                                }}>{text}</div>
                            </li>;
                        })
                    }</ul>
                </div>
                : (this._optInInfo
                    ? <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginLeft: '-8em',
                        marginTop: (-(40 + FBOptInWidget.heightPx) / 2) + 'px',
                        width: '16em',
                        height: (40 + FBOptInWidget.heightPx) + 'px',
                        lineHeight: '40px',
                        textAlign: 'center',
                        fontFamily: 'Arial, Helvetica',
                        fontSize: '18px',
                        color: '#444'
                    }}>
                        Click to connect Messenger session
                        <br />
                        <FBOptInWidget
                            fbAppId={this._optInInfo.fbAppId}
                            fbMessengerId={this._optInInfo.fbMessengerId}
                            payload={this._optInInfo.id}
                        />
                    </div>
                    : <div style={{
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
                    }}>Initializing Messenger plugin...</div>)
        }</div>;
    }
}

module.exports = MessengerSession;

var React = require('react');
var connect = require('react-redux').connect;

var FBOptInWidget = require('./../FBOptInWidget.jsx');

// @todo convert to pure function
class MessengerSession extends React.PureComponent {
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
            this.props.optInStatus
                ? <div>
                    Log: Sent / Received &nbsp;
                    <b>{this.props.isFinished ? '(disconnected)' : '(connected)'}</b>
                    <ul style={{
                        border: '1px solid #eee',
                        listStyle: 'none',
                        margin: '10px 0 0 0',
                        padding: 0,
                        fontSize: '14px',
                        opacity: this.props.isFinished ? 0.5 : 1
                    }}>{
                        this.props.eventLog.map(function (entry, index) {
                            var date = entry[0];
                            var time = entry[1];
                            var text = entry[2];
                            var isSent = entry[3];
                            var entryId = this.props.eventLog.length - index;

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
                        }.bind(this))
                    }</ul>
                </div>
                : (this.props.optInInfo
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
                            fbAppId={this.props.optInInfo.fbAppId}
                            fbMessengerId={this.props.optInInfo.fbMessengerId}
                            payload={this.props.optInInfo.payload}
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

module.exports = connect((state) => ({
    optInInfo: state.optInInfo,
    optInStatus: state.session !== null,
    eventLog: state.session !== null && state.session.eventLog,
    isFinished: state.session !== null && state.session.isFinished
}), (dispatch) => ({
}))(MessengerSession);

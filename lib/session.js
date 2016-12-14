var moment = require('moment');

var DATE_FORMAT = 'YYYY-MM-DD';
var TIME_FORMAT = 'HH:mm:ss';

module.exports = function getSession(session = null, action) {
    if (action.type === 'SESSION_START') {
        if (session) {
            throw new Error('session already started');
        }

        return {
            isFinished: false,
            eventLog: []
        };
    } else if (action.type === 'SESSION_EVENT') {
        if (session.isFinished) {
            throw new Error('session already finished');
        }

        var eventLogEntry = [
            moment().format(DATE_FORMAT),
            moment().format(TIME_FORMAT),
            JSON.stringify(action.data, null, 2),
            action.isSent
        ];

        // @todo performance concerns for large logs
        return {
            isFinished: false,
            eventLog: [ eventLogEntry ].concat(session.eventLog)
        };
    } else if (action.type === 'SESSION_END') {
        if (session.isFinished) {
            throw new Error('session already finished');
        }

        return {
            isFinished: true,
            eventLog: session.eventLog
        };
    }

    return session;
}

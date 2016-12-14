module.exports = function getSession(session = null, action) {
    if (action.type === 'SESSION_START') {
        if (session) {
            throw new Error('session already started');
        }

        return {
            isFinished: false
        };
    } else if (action.type === 'SESSION_END') {
        if (session.isFinished) {
            throw new Error('session already finished');
        }

        return {
            isFinished: true
        };
    }

    return session;
}

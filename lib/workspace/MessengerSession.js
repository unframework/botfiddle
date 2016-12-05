function MessengerSession(whenOptInWidgetLoaded, whenEventsLoaded) {
    this._optInStatus = false;
    this._optInWidget = null;

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

            // @todo this better
            this._eventLog.unshift(JSON.stringify(data));
        }.bind(this));
    }.bind(this));
}

MessengerSession.prototype.render = function (h) {
    return h('div', { style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#f0f0f0'
    } }, [
        this._optInStatus
            ? [
                'Opted in!',
                h('ul', { style: { border: '1px solid #eee' } }, this._eventLog.map(function (entry) {
                    return h('li', entry);
                }))
            ]
            : (
                this._optInWidget
                    ? [ 'Start new session: ', this._optInWidget ]
                    : 'Loading...'
            )
    ]);
};

module.exports = MessengerSession;

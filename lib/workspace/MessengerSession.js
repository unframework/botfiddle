function MessengerSession(whenOptInWidgetLoaded, whenEventsLoaded) {
    this._optInStatus = false;
    this._optInWidget = null;

    whenOptInWidgetLoaded.then(function (optInWidget) {
        this._optInWidget = optInWidget;
    }.bind(this));

    whenEventsLoaded.then(function (emitter) {
        emitter.on('data', function (data) {
            this._optInStatus = true;
        }.bind(this));
    }.bind(this));
}

MessengerSession.prototype.render = function (h) {
    return this._optInStatus ? 'Opted in!' : (
        this._optInWidget ? [ 'Start new session: ', this._optInWidget ] : 'Loading...'
    );
};

module.exports = MessengerSession;

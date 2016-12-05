function MessengerSession(whenOptInWidgetLoaded) {
    this._optInStatus = false;
    this._optInWidget = null;

    whenOptInWidgetLoaded.then(function (optInWidget) {
        this._optInWidget = optInWidget;
    }.bind(this));
}

MessengerSession.prototype.logIncomingData = function (data) {
    this._optInStatus = true;
};

MessengerSession.prototype.render = function (h) {
    return this._optInStatus ? 'Opted in!' : (
        this._optInWidget ? [ 'Start new session: ', this._optInWidget ] : 'Loading...'
    );
};

module.exports = MessengerSession;

var FBOptInWidget = require('./../FBOptInWidget');

// FB SDK
(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

var whenFBLoaded = new Promise(function (resolve) {
    window.fbAsyncInit = function () {
        resolve();
    };
});

function MessengerSession() {
    this._initialized = false;
    this._optInStatus = false;
    this._optInWidget = null;
}

MessengerSession.prototype.initialize = function (fbAppId, fbMessengerId, clientId) {
    if (this._initialized) {
        throw new Error('already initialized');
    }

    whenFBLoaded.then(function () {
        window.FB.init({
            appId: fbAppId,
            xfbml: false, // no parsing needed yet
            version: "v2.6"
        });

        this._optInWidget = new FBOptInWidget(fbAppId, fbMessengerId, clientId);
    }.bind(this));
};

MessengerSession.prototype.logIncomingData = function (data) {
    this._optInStatus = true;
};

MessengerSession.prototype.render = function (h) {
    return this._optInStatus ? 'Opted in!' : (
        this._optInWidget ? [ 'Start new session: ', this._optInWidget ] : 'Loading...'
    );
};

module.exports = MessengerSession;

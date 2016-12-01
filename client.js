var vdomLive = require('vdom-live');

var FBOptInWidget = require('./lib/FBOptInWidget');

var Server = require('__server');

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

vdomLive(function (renderLive, h) {
    var server = new Server();
    var optInStatus = false;
    var optInWidget = null;

    server.getInfo().then(function (info) {
        whenFBLoaded.then(function () {
            FB.init({
                appId: info.fbAppId,
                xfbml: false, // no parsing needed yet
                version: "v2.6"
            });

            optInWidget = new FBOptInWidget(info.fbAppId, info.fbMessengerId, info.id);
        });
    });

    document.body.appendChild(renderLive(function () {
        return h('div', [
            optInStatus ? 'Opted in!' : (
                optInWidget ? [ 'Start new session: ', optInWidget ] : 'Loading...'
            )
        ]);
    }));
});

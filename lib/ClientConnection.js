var fbAppId = null; // to be filled in on startup
var fbMessengerId = null; // to be filled in on startup

function ClientConnection() {
    this._id = Math.random() + '';

    console.log('client connected!', this._id);
}

ClientConnection.prototype.getInfo = function () {
    return {
        id: this._id,
        fbAppId: fbAppId,
        fbMessengerId: fbMessengerId
    };
};

ClientConnection.setFBAppId = function (id) {
    fbAppId = id;
};

ClientConnection.setFBMessengerId = function (id) {
    fbMessengerId = id;
};

module.exports = ClientConnection;

var fbAppId = null; // to be filled in on startup
var fbMessengerId = null; // to be filled in on startup

function ClientConnection() {
    this._id = Math.random() + '';

    ClientConnection.activeConnectionMap[this._id] = this; // @todo check for uniqueness?

    console.log('client connected!', this._id);
}

ClientConnection.activeConnectionMap = Object.create(null);

ClientConnection.prototype.getInfo = function () {
    return {
        id: this._id,
        fbAppId: fbAppId,
        fbMessengerId: fbMessengerId
    };
};

ClientConnection.prototype.connect = function (inputStream, outputStream) {
    // @todo this
    outputStream.write({ text: 'Started new development session (ID = ' + this._id + ')' });
};

ClientConnection.prototype.disconnect = function () {
    // @todo
};

ClientConnection.setFBAppId = function (id) {
    fbAppId = id;
};

ClientConnection.setFBMessengerId = function (id) {
    fbMessengerId = id;
};

module.exports = ClientConnection;

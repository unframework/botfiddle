var EventEmitter = require('events').EventEmitter;

var fbAppId = null; // to be filled in on startup
var fbMessengerId = null; // to be filled in on startup

function ClientConnection() {
    this._id = Math.random() + '';
    this._emitter = new EventEmitter();
    this._outputStream = null;

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

ClientConnection.prototype.getEvents = function () {
    return this._emitter;
};

ClientConnection.prototype.connect = function (inputStream, outputStream) {
    if (this._outputStream) {
        throw new Error('already connected');
    }

    this._outputStream = outputStream;

    // @todo this
    this._outputStream.write({ text: 'Started new development session (ID = ' + this._id + ')' });

    // signal first message
    this._emitter.emit('data', {});

    // forward the events
    inputStream.on('data', function (data) {
        this._emitter.emit('data', data);
    }.bind(this));
};

ClientConnection.prototype.sendMessage = function (data) {
    // @todo throttle, of course!!!!
    // @todo filter, of course!!!!
    this._outputStream.write(data);
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

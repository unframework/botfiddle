var Readable = require('stream').Readable;

var fbAppId = null; // to be filled in on startup
var fbMessengerId = null; // to be filled in on startup

function ClientConnection() {
    this._id = Math.random() + '';
    this._outputStream = null;

    this._dataEvents = new Readable({ objectMode: true });
    this._dataEvents._read = function () {}; // no-op

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
    return this._dataEvents;
};

ClientConnection.prototype.connect = function (inputStream, outputStream) {
    if (this._outputStream) {
        throw new Error('already connected');
    }

    this._outputStream = outputStream;

    // @todo this
    this._outputStream.write({ text: 'Started new development session (ID = ' + this._id + ')' });

    // signal first message
    this._dataEvents.push({});

    // forward the events (pipe does not work readable-to-readable)
    inputStream.on('data', function (data) {
        this._dataEvents.push(data);
    }.bind(this));

    inputStream.on('end', function () {
        this._dataEvents.push(null);
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

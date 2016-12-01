function ClientConnection() {
    this._id = Math.random() + '';

    console.log('client connected!', this._id);
}

module.exports = ClientConnection;

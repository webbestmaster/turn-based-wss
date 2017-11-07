class RoomConnection {
    /**
     *
     * @constructor
     * @param {Object} options - options for new room's connection
     *      @param {String} options.socketId - socket's id
     *      @param {String} options.userId - user's id
     */
    constructor(options) {
        const roomConnection = this;

        roomConnection._attr = { // eslint-disable-line no-underscore-dangle, id-match
            socketId: options.socketId,
            userId: options.userId
        };
    }

    getUserId() {
        const roomConnection = this;

        return roomConnection.getAttr().userId;
    }

    setSocketId(socketId) {
        const roomConnection = this;

        roomConnection.getAttr().socketId = socketId;
    }

    getAttr() {
        return this._attr; // eslint-disable-line no-underscore-dangle
    }
}

module.exports.RoomConnection = RoomConnection;

const userConnectionMaster = require('./master').userConnectionMaster;

class UserConnection {
    /**
     *
     * @param {Object} options - options for new TBW
     *      @param {string} options.id - user's id
     *      @param {string} options.socketId - socket io connection
     */
    constructor(options) {
        const userConnection = this;

        userConnection._attr = { // eslint-disable-line no-underscore-dangle, id-match
            id: options.id,
            socketId: options.socketId
        };

        userConnectionMaster.push(userConnection);
    }

    getId() {
        return this.getAttr().id;
    }

    getSocketId() {
        return this.getAttr().socketId;
    }

    getAttr() {
        return this._attr; // eslint-disable-line no-underscore-dangle
    }
}

module.exports.UserConnection = UserConnection;

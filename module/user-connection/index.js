const userConnectionMaster = require('./master').userConnectionMaster;

class UserConnection {
    /**
     *
     * @param {Object} options - options for new TBW
     *      @param {string} options.id - user's id
     *      @param {object} options.socket - socket io connection
     */
    constructor(options) {
        const userConnection = this;

        userConnection._attr = { // eslint-disable-line no-underscore-dangle, id-match
            id: options.id,
            socket: options.socket
        };

        userConnectionMaster.push(userConnection);
    }

    getId() {
        return this.getAttr().id;
    }

    getSocket() {
        return this.getAttr().socket;
    }

    getAttr() {
        return this._attr; // eslint-disable-line no-underscore-dangle
    }
}

module.exports.UserConnection = UserConnection;

class UserConnectionMaster {
    constructor() {
        const userConnectionMaster = this;

        userConnectionMaster._attr = { // eslint-disable-line no-underscore-dangle, id-match
            userConnections: []
        };
    }

    push(userConnection) {
        const userConnectionMaster = this;
        const userConnections = userConnectionMaster.getUserConnections();

        userConnections.push(userConnection);
    }

    getUserConnections() {
        return this.getAttr().userConnections;
    }

    getAttr() {
        return this._attr; // eslint-disable-line no-underscore-dangle, id-match
    }

    destroy() {
        const userConnectionMaster = this;

        userConnectionMaster.getAttr().userConnections = [];
    }
}

module.exports.UserConnectionMaster = UserConnectionMaster;
module.exports.userConnectionMaster = new UserConnectionMaster();

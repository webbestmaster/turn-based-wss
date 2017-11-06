const roomMaster = require('./master').roomMaster;
let roomId = 0;

class Room {
    constructor() {
        const room = this;

        roomId += 1;

        room._attr = { // eslint-disable-line no-underscore-dangle, id-match
            id: roomId.toString()
        };

        roomMaster.push(room);
    }

    getId() {
        return this.getAttr().id;
    }

    getAttr() {
        return this._attr; // eslint-disable-line no-underscore-dangle
    }
}

module.exports.Room = Room;

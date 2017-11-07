const find = require('lodash/find');

class RoomMaster {
    constructor() {
        const roomMaster = this;

        roomMaster._attr = { // eslint-disable-line no-underscore-dangle, id-match
            rooms: []
        };
    }

    push(room) {
        const roomMaster = this;
        const rooms = roomMaster.getRooms();

        rooms.push(room);
    }

    getRoomById(roomId) {
        const roomMaster = this;
        const rooms = roomMaster.getRooms();

        return find(rooms, room => room.getId() === roomId);
    }

    getRoomIds() {
        const roomMaster = this;
        const rooms = roomMaster.getRooms();

        return rooms.map(room => room.getId());
    }

    getRooms() {
        return this.getAttr().rooms;
    }

    getAttr() {
        return this._attr; // eslint-disable-line no-underscore-dangle, id-match
    }

    destroy() {
        const roomMaster = this;

        roomMaster.getAttr().rooms = [];
    }
}

module.exports.RoomMaster = RoomMaster;
module.exports.roomMaster = new RoomMaster();

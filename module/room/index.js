const roomMaster = require('./master').roomMaster;
const RoomConnection = require('./room-connection').RoomConnection;
const find = require('lodash/find');
let roomId = 0;

class Room {
    constructor() {
        const room = this;

        roomId += 1;

        room._attr = { // eslint-disable-line no-underscore-dangle, id-match
            connections: [],
            id: roomId.toString(),
            activeUserId: null
        };

        roomMaster.push(room);
    }

    giveTurn(userId) {
        const room = this;
        const activeUserId = room.getAttr().activeUserId;

        if (activeUserId === null) {
            room.getAttr().activeUserId = userId;
            return userId;
        }

        return activeUserId;
    }

    takeAwayTurn(userId) {
        const room = this;
        const activeUserId = room.getAttr().activeUserId;

        if (activeUserId === userId) {
            room.getAttr().activeUserId = null;
            return null;
        }

        return activeUserId;
    }

    join(roomConnectionOptions) {
        const room = this;
        const connections = room.getConnections();
        const userId = roomConnectionOptions.userId;

        const existRoomConnection = find(connections, connection => connection.getUserId() === userId);

        if (existRoomConnection) {
            existRoomConnection.setSocketId(roomConnectionOptions.socketId);
            return;
        }

        const newRoomConnection = new RoomConnection({
            socketId: roomConnectionOptions.socketId,
            userId: roomConnectionOptions.userId
        });

        connections.push(newRoomConnection);
    }

    leave(userId) {
        const room = this;
        const connections = room.getConnections();

        const existRoomConnection = find(connections, connection => connection.getUserId() === userId);

        if (!existRoomConnection) {
            console.log('user with id', userId, 'is not exists in room');
            return;
        }

        connections.splice(connections.indexOf(existRoomConnection), 1);
    }

    getConnections() {
        return this.getAttr().connections;
    }

    getId() {
        return this.getAttr().id;
    }

    getAttr() {
        return this._attr; // eslint-disable-line no-underscore-dangle
    }
}

module.exports.Room = Room;

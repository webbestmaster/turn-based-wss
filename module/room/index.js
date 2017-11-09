const roomMaster = require('./master').roomMaster;
const RoomConnection = require('./room-connection').RoomConnection;
const find = require('lodash/find');
const sha1 = require('sha1');
let roomId = 0;

class Room {
    constructor() {
        const room = this;

        roomId += 1;

        room._attr = { // eslint-disable-line no-underscore-dangle, id-match
            connections: [],
            id: 'room-id-' + roomId,
            activeUserId: null,
            states: []
        };

        roomMaster.push(room);
    }

    giveTurn(userId) {
        const room = this;
        const activeUserId = room.getAttr().activeUserId;

        const userConnection = room.getRoomConnectionByUserId(userId);

        if (userConnection === null) {
            return activeUserId;
        }

        if (activeUserId === null) {
            room.getAttr().activeUserId = userId;
            return userId;
        }

        return activeUserId;
    }

    dropTurn(userId) {
        const room = this;
        const activeUserId = room.getAttr().activeUserId;

        if (activeUserId !== userId) {
            return activeUserId;
        }

        const nextRoomConnection = room.getNextRoomConnectionByUserId(userId);

        const nextActiveUserId = nextRoomConnection.getUserId();

        room.getAttr().activeUserId = nextActiveUserId;

        return nextActiveUserId;
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

        room.dropTurn(userId);

        connections.splice(connections.indexOf(existRoomConnection), 1);
    }

    pushState(userId, state) {
        const room = this;
        const states = room.getStates();

        const activeUserId = room.getAttr().activeUserId;

        if (activeUserId !== userId) {
            return null;
        }

        const order = states.length;
        const timestamp = Date.now();

        Object.assign(state, {
            meta: {
                order,
                timestamp,
                hash: sha1(order + '/' + timestamp)
            }
        });

        states.push(state);
        return states.length;
    }

    getRoomConnectionByUserId(userId) {
        const room = this;
        const connections = room.getConnections();

        return find(connections, connection => connection.getUserId() === userId) || null;
    }

    getNextRoomConnectionByUserId(userId) {
        const room = this;
        const roomConnection = room.getRoomConnectionByUserId(userId);

        if (roomConnection === null) {
            return null;
        }

        const connections = room.getConnections();
        const nextRoomConnectionOrder = connections.indexOf(roomConnection) + 1;

        if (nextRoomConnectionOrder === connections.length) {
            return connections[0];
        }

        return connections[nextRoomConnectionOrder];
    }

    getConnections() {
        return this.getAttr().connections;
    }

    getStates() {
        return this.getAttr().states;
    }

    getId() {
        return this.getAttr().id;
    }

    getAttr() {
        return this._attr; // eslint-disable-line no-underscore-dangle
    }
}

module.exports.Room = Room;

const roomMaster = require('./master').roomMaster;
const RoomConnection = require('./room-connection').RoomConnection;
const find = require('lodash/find');
const sha1 = require('sha1');
const messageConst = require('./message.json');
let roomId = 0;

class Room {
    constructor(options) {
        const room = this;

        roomId += 1;

        room._attr = { // eslint-disable-line no-underscore-dangle, id-match
            connections: [],
            id: 'room-id-' + roomId,
            activeUserId: null,
            states: [],
            settings: {},
            server: options.server
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
            userId: roomConnectionOptions.userId,
            socketId: roomConnectionOptions.socketId
        });

        connections.push(newRoomConnection);

        room.pushStateForce({
            type: messageConst.type.joinIntoRoom,
            roomId: room.getId(),
            userId: roomConnectionOptions.userId,
            socketId: roomConnectionOptions.socketId
        });
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
        const activeUserId = room.getAttr().activeUserId;

        if (activeUserId !== userId) {
            return null;
        }

        return this.pushStateForce(state);
    }

    pushStateForce(state) {
        const room = this;
        const states = room.getStates();
        const order = states.length;
        const timestamp = Date.now();

        Object.assign(state, {
            type: state.type || messageConst.type.pushState,
            meta: {
                order,
                timestamp,
                hash: sha1(order + '/' + timestamp)
            }
        });

        states.push(state);

        room.emit({
            type: state.type,
            roomId: room.getId(),
            states: {
                last: state,
                length: room.getStates().length
            }
        });

        return state;
    }

    emit(data) {
        const room = this;
        const connections = room.getConnections();
        const server = room.getServer();
        const socketIoServer = server.getSocketIoServer();

        connections.forEach(connection => {
            socketIoServer.to(connection.getAttr().socketId).emit('message', data);
        });
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

    getStateByHash(hash) {
        const room = this;
        const states = room.getStates();

        return find(states, state => state.meta.hash === hash) || null;
    }

    getStatesFromHash(hash) {
        const room = this;

        const startState = room.getStateByHash(hash);

        if (startState === null) {
            return null;
        }

        const states = room.getStates();

        const startIndex = states.indexOf(startState);

        return states.slice(startIndex + 1);
    }

    getConnections() {
        return this.getAttr().connections;
    }

    getStates() {
        return this.getAttr().states;
    }

    getLastStates(count) {
        const room = this;
        const states = room.getStates();
        const statesLength = states.length;

        return states.slice(statesLength - count, statesLength);
    }

    getId() {
        return this.getAttr().id;
    }

    getSettings() {
        return this.getAttr().settings;
    }

    getSetting(key) {
        return this.getAttr().settings[key];
    }

    setSettings(settings) {
        const room = this;

        room.getAttr().settings = settings;

        return room;
    }

    setSetting(addedSettings) {
        const room = this;

        const settings = room.getSettings();

        Object.assign(settings, addedSettings);

        return room;
    }

    getServer() {
        return this.getAttr().server;
    }

    getAttr() {
        return this._attr; // eslint-disable-line no-underscore-dangle
    }
}

module.exports.Room = Room;

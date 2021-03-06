const messageConst = require('./../message.json');
const roomConfig = require('./../config.json');
const Stopwatch = require('timer-stopwatch');

class RoomConnection {
    /**
     *
     * @constructor
     * @param {Object} options - options for new room's connection
     *      @param {String} options.type - bot | human
     *      @param {String} options.socketId - socket's id
     *      @param {String} options.userId - user's id
     *      @param {Object} options.room - parent room
     */
    constructor(options) {
        const roomConnection = this;

        roomConnection._attr = { // eslint-disable-line no-underscore-dangle, id-match
            socketId: options.socketId,
            userId: options.userId,
            room: options.room,
            type: options.type, // 'bot' | 'human'
            timers: {
                onDisconnect: null
            }
        };
    }

    bindEventListeners() {
        const roomConnection = this;
        const socketId = roomConnection.getSocketId();
        const socket = roomConnection.getSocket();

        if (roomConnection.getType() === 'bot') {
            return;
        }

        if (socket === null) {
            console.error('--- ERROR ---> bindEventListeners: Can not find socket with id:', socketId);
            return;
        }

        socket.on('disconnect', () => roomConnection.onDisconnect());
    }

    unBindEventListeners() {
        const roomConnection = this;
        const socketId = roomConnection.getSocketId();
        const socket = roomConnection.getSocket();
        const timers = roomConnection.getTimers();

        if (timers.onDisconnect !== null) {
            timers.onDisconnect.stop();
        }

        if (roomConnection.getType() === 'bot') {
            return;
        }

        if (socket === null) {
            // if socket has been disconnected from client, socket missing from socketIoServer
            console.warn('WARN: unBindEventListeners: Can not find socket with id:', socketId);
            return;
        }

        socket.removeAllListeners();
    }

    onDisconnect() {
        const roomConnection = this;
        const room = roomConnection.getRoom();

        room.pushStateForce({
            type: messageConst.type.userDisconnected,
            roomId: room.getId(),
            userId: roomConnection.getUserId()
        });

        const timer = new Stopwatch(roomConfig.timers.onUserDisconnect.time);

        timer.start();

        timer.onDone(() => {
            timer.stop();
            room.leave(roomConnection.getUserId());
        });
    }

    destroy() {
        const roomConnection = this;

        roomConnection.unBindEventListeners();
    }

    getUserId() {
        const roomConnection = this;

        return roomConnection.getAttr().userId;
    }

    setSocketId(socketId) {
        const roomConnection = this;

        roomConnection.getAttr().socketId = socketId;
    }

    getSocketId() {
        return this.getAttr().socketId;
    }

    getSocket() {
        const roomConnection = this;
        const socketId = roomConnection.getSocketId();
        const server = roomConnection.getServer();
        const socketIoServer = server.getSocketIoServer();

        return socketIoServer.sockets.connected[socketId] || null;
    }

    getTimers() {
        return this.getAttr().timers;
    }

    getServer() {
        return this.getRoom().getServer();
    }

    getRoom() {
        return this.getAttr().room;
    }

    getAttr() {
        return this._attr; // eslint-disable-line no-underscore-dangle
    }

    getType() {
        return this.getAttr().type;
    }
}

module.exports.RoomConnection = RoomConnection;

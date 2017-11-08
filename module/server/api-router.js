const Room = require('./../room').Room;

// const UserConnection = require('./../user-connection').UserConnection;
const roomMaster = require('./../room/master').roomMaster;
const bodyParser = require('body-parser');

module.exports.apiRouter = {
    bindRoutes: server => {
        const expressApp = server.getExpressApp();

        // fix CORS
        expressApp.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });

        expressApp.use(bodyParser.urlencoded({extended: false}));
        expressApp.use(bodyParser.json());

        /**
         * return {
         *      roomId: {number} - room's id
         * }
         */
        expressApp.get('/api/room/create', (req, res) => {
            const room = new Room();

            res.json({roomId: room.getId()});
        });

        /**
         * return {
         *      roomIds: {string[]} - list of room's ids, example: ['1', '2', '11']
         * }
         */
        expressApp.get('/api/room/get-ids', (req, res) => {
            res.json({roomIds: roomMaster.getRoomIds()});
        });

        /**
         * join to room
         */
        expressApp.get('/api/room/join/:roomId/:userId/:socketId', (req, res) => {
            const {params} = req;
            const {roomId, userId, socketId} = params;

            if (!roomId || !userId || !socketId) {
                res.json({
                    error: {
                        message: 'Can not join to room by url: /api/room/join/' + roomId + '/' + userId + '/' + socketId
                    }
                });
                return;
            }

            const room = roomMaster.getRoomById(roomId);

            if (!room) {
                res.json({
                    error: {
                        message: 'Room not found, room id: ' + roomId
                    }
                });
                return;
            }

            room.join({
                userId,
                socketId
            });

            res.json({roomId, userId, socketId});
        });

        /**
         * leave to room
         */
        expressApp.get('/api/room/leave/:roomId/:userId', (req, res) => {
            const {params} = req;
            const {roomId, userId} = params;

            if (!roomId || !userId) {
                res.json({
                    error: {
                        message: 'Can not leave a room by url: /api/room/join/' + roomId + '/' + userId
                    }
                });
                return;
            }

            const room = roomMaster.getRoomById(roomId);

            if (!room) {
                res.json({
                    error: {
                        message: 'Room not found, room id: ' + roomId
                    }
                });
                return;
            }

            room.leave(userId);

            res.json({roomId, userId});
        });

        /**
         * take a turn
         */
        expressApp.get('/api/room/take-turn/:roomId/:userId', (req, res) => {
            const {params} = req;
            const {roomId, userId} = params;

            if (!roomId || !userId) {
                res.json({
                    error: {
                        message: 'Can not take turn by url: /api/room/take-turn/' + roomId + '/' + userId
                    }
                });
                return;
            }

            const room = roomMaster.getRoomById(roomId);

            if (!room) {
                res.json({
                    error: {
                        message: 'Room not found, room id: ' + roomId
                    }
                });
                return;
            }

            const activeUserId = room.giveTurn(userId);

            res.json({
                roomId,
                activeUserId
            });
        });

        /**
         * leave a turn
         */
        expressApp.get('/api/room/leave-turn/:roomId/:userId', (req, res) => {
            const {params} = req;
            const {roomId, userId} = params;

            if (!roomId || !userId) {
                res.json({
                    error: {
                        message: 'Can not take turn by url: /api/room/take-turn/' + roomId + '/' + userId
                    }
                });
                return;
            }

            const room = roomMaster.getRoomById(roomId);

            if (!room) {
                res.json({
                    error: {
                        message: 'Room not found, room id: ' + roomId
                    }
                });
                return;
            }

            const activeUserId = room.takeAwayTurn(userId);

            res.json({
                roomId,
                activeUserId
            });
        });
    }
};

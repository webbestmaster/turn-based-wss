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

        /*
                /!**
                 * return {
                 *      empty object
                 * }
                 *!/
                expressApp.post('/api/register-user-connection', (req, res) => {
                    // create/resolve new user connection here
                    const userConnection = new UserConnection({
                        socketId: req.body.socketId,
                        id: req.body.userConnectionId
                    });

                    res.json({
                        userConnection: {
                            id: userConnection.getId(),
                            socketId: userConnection.getSocketId()
                        }
                    });
                });
        */


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
    }
};

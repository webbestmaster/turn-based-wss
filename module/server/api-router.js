const bodyParser = require('body-parser');

const apiRoomCreate = require('./api/room/create');
const apiRoomGetIds = require('./api/room/get-ids');

const apiRoomJoin = require('./api/room/join');
const apiRoomLeave = require('./api/room/leave');

const apiRoomDropTurn = require('./api/room/drop-turn');
const apiRoomTakeTurn = require('./api/room/take-turn');

const apiRoomGetUsers = require('./api/room/get-users');
const apiRoomPushState = require('./api/room/push-state');
const apiGetStates = require('./api/room/get-states');

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
        expressApp.get('/api/room/create', apiRoomCreate);

        /**
         * return {
         *      roomIds: {string[]} - list of room's ids, example: ['1', '2', '11']
         * }
         */
        expressApp.get('/api/room/get-ids', apiRoomGetIds);

        /**
         * join to room
         */
        expressApp.get('/api/room/join/:roomId/:userId/:socketId', apiRoomJoin);

        /**
         * leave to room
         */
        expressApp.get('/api/room/leave/:roomId/:userId', apiRoomLeave);

        /**
         * take a turn
         */
        expressApp.get('/api/room/take-turn/:roomId/:userId', apiRoomTakeTurn);

        /**
         * leave a turn
         */
        expressApp.get('/api/room/drop-turn/:roomId/:userId', apiRoomDropTurn);

        /**
         * get users
         */
        expressApp.get('/api/room/get-users/:roomId', apiRoomGetUsers);

        /**
         * push a state
         */
        expressApp.post('/api/room/push-state/:roomId/:userId', apiRoomPushState);

        /**
         * get states
         */
        expressApp.get('/api/room/get-states/:roomId/:count', apiGetStates);
    }
};

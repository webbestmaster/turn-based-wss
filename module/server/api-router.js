const Room = require('./../room').Room;
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
        expressApp.get('/api/create-room', (req, res) => {
            const room = new Room();

            res.json({roomId: room.getId()});
        });

        /**
         * return {
         *      roomIds: {string[]} - list of room's ids, example: ['1', '2', '11']
         * }
         */
        expressApp.get('/api/get-room-ids', (req, res) => {
            res.json({roomIds: roomMaster.getRoomIds()});
        });

        /**
         * return {
         *      empty object
         * }
         */
        expressApp.post('/api/register-user-connection', (req, res) => {
            // create/resolve new user connection here
            res.json({});
        });
    }
};

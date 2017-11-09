/* global describe, it, before, after, beforeEach, afterEach */
const assert = require('chai').assert;
const Server = require('./../../../module/server').Server;
const util = require('./../../util');
const path = require('path');

const serverOptions = {
    port: 3080,
    'static': 'static' // optional parameter here
};

const url = 'http://localhost:' + serverOptions.port;

describe('/api/room/drop-turn', () => {
    let server = null;

    beforeEach(() => {
        server = new Server(serverOptions);
        return server.run();
    });

    afterEach(() => server.destroy());

    it('drop turn for SINGLE player', async () => {
        const user = util.createUser();

        const createRoomResult = await util.getAsJson(url + '/api/room/create');
        const {roomId} = createRoomResult;

        // join to room
        await util.getAsJson(url + path.join('/api/room/join/', roomId, user.userId, user.socketId));

        // drop turn
        let dropTurnResult = await util.getAsJson(url + path.join('/api/room/drop-turn/', roomId, user.userId));

        assert(dropTurnResult.activeUserId === null); // has no active user

        // take turn
        const takeTurnResult = await util.getAsJson(url + path.join('/api/room/take-turn/', roomId, user.userId));

        assert(takeTurnResult.activeUserId === user.userId);

        // drop turn again
        dropTurnResult = await util.getAsJson(url + path.join('/api/room/drop-turn/', roomId, user.userId));

        // for single player should be the same active user id
        assert(dropTurnResult.activeUserId === user.userId);
    });

    it('drop turn for TWO players', async () => {
        const userA = util.createUser();
        const userB = util.createUser();

        const createRoomResult = await util.getAsJson(url + '/api/room/create');
        const {roomId} = createRoomResult;

        // join to room
        await util.getAsJson(url + path.join('/api/room/join/', roomId, userA.userId, userA.socketId));
        await util.getAsJson(url + path.join('/api/room/join/', roomId, userB.userId, userA.socketId));

        // drop turn
        let dropTurnResult = await util.getAsJson(url + path.join('/api/room/drop-turn/', roomId, userA.userId));

        assert(dropTurnResult.activeUserId === null); // has no active user

        // take turn
        const takeTurnResult = await util.getAsJson(url + path.join('/api/room/take-turn/', roomId, userA.userId));

        assert(takeTurnResult.activeUserId === userA.userId);

        // drop turn by userB
        dropTurnResult = await util.getAsJson(url + path.join('/api/room/drop-turn/', roomId, userB.userId));
        assert(dropTurnResult.activeUserId === userA.userId);

        // drop turn by userA
        dropTurnResult = await util.getAsJson(url + path.join('/api/room/drop-turn/', roomId, userA.userId));
        assert(dropTurnResult.activeUserId === userB.userId);

        // drop turn by userA again
        dropTurnResult = await util.getAsJson(url + path.join('/api/room/drop-turn/', roomId, userA.userId));
        assert(dropTurnResult.activeUserId === userB.userId);
    });

    it('drop turn by non exists player', async () => {
        const userA = util.createUser();
        const userB = util.createUser();
        const zeroUser = util.createUser();

        const createRoomResult = await util.getAsJson(url + '/api/room/create');
        const {roomId} = createRoomResult;

        // join to room
        await util.getAsJson(url + path.join('/api/room/join/', roomId, userA.userId, userA.socketId));
        await util.getAsJson(url + path.join('/api/room/join/', roomId, userB.userId, userA.socketId));

        // drop turn by zero user
        let dropTurnZeroUserResult = await util
            .getAsJson(url + path.join('/api/room/drop-turn/', roomId, zeroUser.userId));

        assert(dropTurnZeroUserResult.activeUserId === null); // has no active user

        // take turn by userA
        await util.getAsJson(url + path.join('/api/room/take-turn/', roomId, userA.userId));

        // drop turn by zero user again
        dropTurnZeroUserResult = await util
            .getAsJson(url + path.join('/api/room/drop-turn/', roomId, zeroUser.userId));

        assert(dropTurnZeroUserResult.activeUserId === userA.userId); // has no active user
    });
});

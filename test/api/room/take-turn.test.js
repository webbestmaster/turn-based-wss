/* global describe, it, before, after, beforeEach, afterEach */
const assert = require('chai').assert;
const Server = require('./../../../module/server').Server;
const util = require('./../../util');
const path = require('path');

const serverOptions = util.getServerOptions();

const url = 'http://localhost:' + serverOptions.port;

describe('/api/room/take-turn', () => {
    let server = null;

    beforeEach(() => {
        server = new Server(serverOptions);
        return server.run();
    });

    afterEach(() => server.destroy());

    it('take turn by non exists player', async () => { // eslint-disable-line max-statements
        const user = util.createUser();
        const userNotExists = util.createUser();

        const createRoomResult = await util.getAsJson(url + '/api/room/create');
        const {roomId} = createRoomResult;

        // join to room
        await util.getAsJson(url + path.join('/api/room/join/', roomId, user.userId, user.socketId));

        // take turn
        let takeTurnResult = await util
            .getAsJson(url + path.join('/api/room/take-turn/', roomId, userNotExists.userId));

        assert(takeTurnResult.roomId === roomId);
        assert(takeTurnResult.activeUserId === null);

        // take again
        takeTurnResult = await util
            .getAsJson(url + path.join('/api/room/take-turn/', roomId, userNotExists.userId));

        assert(takeTurnResult.roomId === roomId);
        assert(takeTurnResult.activeUserId === null);
    });

    it('take turn SINGLE player', async () => { // eslint-disable-line max-statements
        const user = util.createUser();

        const createRoomResult = await util.getAsJson(url + '/api/room/create');
        const {roomId} = createRoomResult;

        // join to room
        await util.getAsJson(url + path.join('/api/room/join/', roomId, user.userId, user.socketId));

        // take turn
        let takeTurnResult = await util
            .getAsJson(url + path.join('/api/room/take-turn/', roomId, user.userId));

        assert(takeTurnResult.roomId === roomId);
        assert(takeTurnResult.activeUserId === user.userId);

        // take again
        takeTurnResult = await util
            .getAsJson(url + path.join('/api/room/take-turn/', roomId, user.userId));

        assert(takeTurnResult.roomId === roomId);
        assert(takeTurnResult.activeUserId === user.userId);
    });

    it('take turn TWO players', async () => { // eslint-disable-line max-statements
        const userA = util.createUser();
        const userB = util.createUser();

        const createRoomResult = await util.getAsJson(url + '/api/room/create');
        const {roomId} = createRoomResult;

        // join to room as userA
        await util.getAsJson(url + path.join('/api/room/join/', roomId, userA.userId, userA.socketId));
        await util.getAsJson(url + path.join('/api/room/join/', roomId, userB.userId, userB.socketId));

        // take turn as userA
        const takeTurnUserAResult = await util
            .getAsJson(url + path.join('/api/room/take-turn/', roomId, userA.userId));

        assert(takeTurnUserAResult.roomId === roomId);
        assert(takeTurnUserAResult.activeUserId === userA.userId);

        // take as userA again
        const takeTurnUserAResultAgain = await util
            .getAsJson(url + path.join('/api/room/take-turn/', roomId, userA.userId));

        assert(takeTurnUserAResultAgain.roomId === roomId);
        assert(takeTurnUserAResultAgain.activeUserId === userA.userId);

        // take as userB
        const takeTurnUserBResult = await util
            .getAsJson(url + path.join('/api/room/take-turn/', roomId, userB.userId));

        // turn should be belongs to userA
        assert(takeTurnUserBResult.roomId === roomId);
        assert(takeTurnUserBResult.activeUserId === userA.userId);
    });
});

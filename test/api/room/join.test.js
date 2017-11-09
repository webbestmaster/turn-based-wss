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

describe('/api/room/join', () => {
    let server = null;

    beforeEach(() => {
        server = new Server(serverOptions);
        return server.run();
    });

    afterEach(() => server.destroy());

    it('join', async () => { // eslint-disable-line max-statements
        const userA = util.createUser();
        const userB = util.createUser();

        const createRoomResult = await util.getAsJson(url + '/api/room/create');
        const {roomId} = createRoomResult;

        // join to room as userA
        let joinUserAResult = await util
            .getAsJson(url + path.join('/api/room/join/', roomId, userA.userId, userA.socketId));

        assert(joinUserAResult.userId === userA.userId);
        assert(joinUserAResult.socketId === userA.socketId);
        assert(joinUserAResult.roomId === roomId);

        // join to room as userB
        let joinUserBResult = await util
            .getAsJson(url + path.join('/api/room/join/', roomId, userB.userId, userB.socketId));

        assert(joinUserBResult.userId === userB.userId);
        assert(joinUserBResult.socketId === userB.socketId);
        assert(joinUserBResult.roomId === roomId);

        // check users exists - should be 2 users
        let getUsersResult = await util
            .getAsJson(url + path.join('/api/room/get-users/', roomId));

        assert.deepEqual(getUsersResult.users, [userA, userB]);

        // try to rejoin
        // join to room as userA
        joinUserAResult = await util
            .getAsJson(url + path.join('/api/room/join/', roomId, userA.userId, userA.socketId));

        assert(joinUserAResult.userId === userA.userId);
        assert(joinUserAResult.socketId === userA.socketId);
        assert(joinUserAResult.roomId === roomId);

        // join to room as userB
        joinUserBResult = await util
            .getAsJson(url + path.join('/api/room/join/', roomId, userB.userId, userB.socketId));

        assert(joinUserBResult.userId === userB.userId);
        assert(joinUserBResult.socketId === userB.socketId);
        assert(joinUserBResult.roomId === roomId);

        // check users exists - should be 2 users
        getUsersResult = await util
            .getAsJson(url + path.join('/api/room/get-users/', roomId));

        assert.deepEqual(getUsersResult.users, [userA, userB]);
    });
});

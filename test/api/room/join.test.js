/* global describe, it, before, after, beforeEach, afterEach */
const assert = require('chai').assert;
const Server = require('./../../../module/server').Server;
const util = require('./../../util');
const path = require('path');
const error = require('./../../../module/server/api/error.json');

const serverOptions = util.getServerOptions();

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

    it('join to not exists room', async () => {
        const user = util.createUser();
        const notExistsRoomId = String(Math.random());

        await util.getAsJson(url + '/api/room/create');

        // join to not exists room
        const joinUserResult = await util
            .getAsJson(url + path.join('/api/room/join/', notExistsRoomId, user.userId, user.socketId));

        assert(joinUserResult.error.id === error.ROOM_NOT_FOUND.id);
        assert(joinUserResult.error.message === error.ROOM_NOT_FOUND.message.replace('{{roomId}}', notExistsRoomId));
    });
});

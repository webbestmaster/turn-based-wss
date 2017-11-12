/* global describe, it, before, after, beforeEach, afterEach */
const assert = require('chai').assert;
const Server = require('./../../../module/server').Server;
const util = require('./../../util');
const path = require('path');

const serverOptions = util.getServerOptions();

const url = 'http://localhost:' + serverOptions.port;

describe('/api/room/leave', () => {
    let server = null;

    beforeEach(() => {
        server = new Server(serverOptions);
        return server.run();
    });

    afterEach(() => server.destroy());

    it('leave', async () => { // eslint-disable-line max-statements
        const userA = await util.createUser();
        const userB = await util.createUser();

        const createRoomResult = await util.getAsJson(url + '/api/room/create');
        const {roomId} = createRoomResult;

        // join to room as userA
        await util.getAsJson(url + path.join('/api/room/join/', roomId, userA.userId, userA.socket.id));

        // join to room as userB
        await util.getAsJson(url + path.join('/api/room/join/', roomId, userB.userId, userB.socket.id));

        // leave from room as userA
        const leaveUserAResult = await util.getAsJson(url + path.join('/api/room/leave/', roomId, userA.userId));

        assert(leaveUserAResult.userId === userA.userId);
        assert(leaveUserAResult.roomId === roomId);

        let getUsersResult = await util
            .getAsJson(url + path.join('/api/room/get-users/', roomId));

        assert.deepEqual(getUsersResult.users, [{userId: userB.userId, socketId: userB.socket.id}]);

        // leave from room as userB
        const leaveUserBResult = await util.getAsJson(url + path.join('/api/room/leave/', roomId, userB.userId));

        assert(leaveUserBResult.userId === userB.userId);
        assert(leaveUserBResult.roomId === roomId);

        getUsersResult = await util
            .getAsJson(url + path.join('/api/room/get-users/', roomId));

        assert.deepEqual(getUsersResult.users, []);

        // leave from room as userB again
        const leaveUserBResultAgain = await util.getAsJson(url + path.join('/api/room/leave/', roomId, userB.userId));

        assert(leaveUserBResultAgain.userId === userB.userId);
        assert(leaveUserBResultAgain.roomId === roomId);

        getUsersResult = await util
            .getAsJson(url + path.join('/api/room/get-users/', roomId));

        assert.deepEqual(getUsersResult.users, []);

        userA.socket.disconnect();
        userB.socket.disconnect();
    });
});

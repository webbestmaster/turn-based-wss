/* global describe, it, before, after, beforeEach, afterEach */
const assert = require('chai').assert;
const Server = require('./../module/server').Server;
const util = require('./util');

const serverOptions = {
    port: 3080,
    'static': 'static' // optional parameter here
};

const url = 'http://localhost:' + serverOptions.port;

describe('/api/room/create|get-ids', () => {
    let server = null;

    beforeEach(() => {
        server = new Server(serverOptions);
        return server.run();
    });

    afterEach(() => server.destroy());

    it('create a room', async () => {
        const createRoomResult = await util.getAsJson(url + '/api/room/create');

        assert(createRoomResult.hasOwnProperty('roomId'));
    });

    it('get room ids', async () => {
        await util.getAsJson(url + '/api/room/create');
        await util.getAsJson(url + '/api/room/create');
        await util.getAsJson(url + '/api/room/create');
        await util.getAsJson(url + '/api/room/create');
        await util.getAsJson(url + '/api/room/create');

        const roomsIdsData = await util.getAsJson(url + '/api/room/get-ids');

        const roomIds = roomsIdsData.roomIds;

        assert(roomIds.length === 5); // see above - exact 5 rooms
        assert(roomIds.every(roomId => typeof roomId === 'string'));
    });
});

describe('/api/room/*', () => {
    let server = null;
    const roomData = {
        roomId: null
    };
    const userData = {
        userId: String(Math.random())
    };

    before(() => {
        server = new Server(serverOptions);
        return server.run();
    });

    after(() => server.destroy());

    it('create a room', async () => {
        const createRoomResult = await util.getAsJson(url + '/api/room/create');

        assert(typeof createRoomResult.roomId === 'string');

        roomData.roomId = createRoomResult.roomId;
    });

    it('join to room', async () => {
        const joinRoomResult = await util
            .getAsJson(url + '/api/room/join/' + roomData.roomId + '/' + userData.userId + '/some-socket-id');

        assert(typeof joinRoomResult.roomId === 'string');
        assert(typeof joinRoomResult.userId === 'string');
        assert(typeof joinRoomResult.socketId === 'string');
    });

    it('take turn of room', async () => {
        const takeTurnRoomResult = await util
            .getAsJson(url + '/api/room/take-turn/' + roomData.roomId + '/' + userData.userId);

        assert(typeof takeTurnRoomResult.roomId === 'string');
        assert(typeof takeTurnRoomResult.activeUserId === 'string');
    });

    it('drop turn of room', async () => {
        const leaveTurnResult = await util
            .getAsJson(url + '/api/room/drop-turn/' + roomData.roomId + '/' + userData.userId);

        assert(typeof leaveTurnResult.roomId === 'string');
        assert(leaveTurnResult.activeUserId === null);
    });

    it('get users', async () => {
        const getUsersResult = await util
            .getAsJson(url + '/api/room/get-users/' + roomData.roomId);

        assert(typeof getUsersResult.roomId === 'string');
        assert(getUsersResult.users[0].userId === userData.userId);
    });

    it('leave room', async () => {
        const leaveRoomResult = await util
            .getAsJson(url + '/api/room/leave/' + roomData.roomId + '/' + userData.userId);

        assert(typeof leaveRoomResult.roomId === 'string');
        assert(typeof leaveRoomResult.userId === 'string');
    });
});

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
        const createRoomResult = await util.get(url + '/api/room/create');

        assert(JSON.parse(createRoomResult).hasOwnProperty('roomId'));
    });

    it('get room ids', async () => {
        await util.get(url + '/api/room/create');
        await util.get(url + '/api/room/create');
        await util.get(url + '/api/room/create');
        await util.get(url + '/api/room/create');
        await util.get(url + '/api/room/create');

        const roomsIdsData = await util.get(url + '/api/room/get-ids');

        const roomIds = JSON.parse(roomsIdsData).roomIds;

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
        const createRoomResultRaw = await util.get(url + '/api/room/create');
        const createRoomResult = JSON.parse(createRoomResultRaw);

        assert(typeof createRoomResult.roomId === 'string');

        roomData.roomId = createRoomResult.roomId;
    });

    it('join to room', async () => {
        const joinRoomResultRaw = await util
            .get(url + '/api/room/join/' + roomData.roomId + '/' + userData.userId + '/some-socket-id');
        const joinRoomResult = JSON.parse(joinRoomResultRaw);

        assert(typeof joinRoomResult.roomId === 'string');
        assert(typeof joinRoomResult.userId === 'string');
        assert(typeof joinRoomResult.socketId === 'string');
    });

    it('take turn of room', async () => {
        const takeTurnRoomResultRaw = await util
            .get(url + '/api/room/take-turn/' + roomData.roomId + '/' + userData.userId);
        const takeTurnRoomResult = JSON.parse(takeTurnRoomResultRaw);

        assert(typeof takeTurnRoomResult.roomId === 'string');
        assert(typeof takeTurnRoomResult.activeUserId === 'string');
    });

    it('leave turn of room', async () => {
        const leaveTurnResultRaw = await util
            .get(url + '/api/room/leave-turn/' + roomData.roomId + '/' + userData.userId);
        const leaveTurnResult = JSON.parse(leaveTurnResultRaw);

        assert(typeof leaveTurnResult.roomId === 'string');
        assert(leaveTurnResult.activeUserId === null);
    });

    it('leave room', async () => {
        const leaveRoomResultRaw = await util
            .get(url + '/api/room/leave/' + roomData.roomId + '/' + userData.userId);

        const leaveRoomResult = JSON.parse(leaveRoomResultRaw);

        assert(typeof leaveRoomResult.roomId === 'string');
        assert(typeof leaveRoomResult.userId === 'string');
    });
});

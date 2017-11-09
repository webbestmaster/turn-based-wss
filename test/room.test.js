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
        const socketId = 'some-socket-id';
        const joinRoomResult = await util
            .getAsJson(url + '/api/room/join/' + roomData.roomId + '/' + userData.userId + '/' + socketId);

        assert(joinRoomResult.roomId === roomData.roomId);
        assert(joinRoomResult.userId === userData.userId);
        assert(joinRoomResult.socketId === socketId);
    });

    it('take turn of room', async () => {
        const takeTurnRoomResult = await util
            .getAsJson(url + '/api/room/take-turn/' + roomData.roomId + '/' + userData.userId);

        assert(takeTurnRoomResult.roomId === roomData.roomId);
        assert(typeof takeTurnRoomResult.activeUserId === 'string');
    });

    it('drop turn of room', async () => {
        const leaveTurnResult = await util
            .getAsJson(url + '/api/room/drop-turn/' + roomData.roomId + '/' + userData.userId);

        assert(leaveTurnResult.roomId === roomData.roomId);
        assert(leaveTurnResult.activeUserId === userData.userId);
    });

    it('get users', async () => {
        const getUsersResult = await util
            .getAsJson(url + '/api/room/get-users/' + roomData.roomId);

        assert(getUsersResult.roomId === roomData.roomId);
        assert(getUsersResult.users[0].userId === userData.userId);
    });

    it('leave room', async () => {
        const leaveRoomResult = await util
            .getAsJson(url + '/api/room/leave/' + roomData.roomId + '/' + userData.userId);

        assert(leaveRoomResult.roomId === roomData.roomId);
        assert(leaveRoomResult.userId === userData.userId);
    });

    it('room push/get states', async () => {
        const lastStatesCount = 4;

        await util.postAsJson(url + '/api/room/push-state/' + roomData.roomId, {state: '0'});
        await util.postAsJson(url + '/api/room/push-state/' + roomData.roomId, {state: '1'});
        await util.postAsJson(url + '/api/room/push-state/' + roomData.roomId, {state: '2'});
        await util.postAsJson(url + '/api/room/push-state/' + roomData.roomId, {state: '3'});
        await util.postAsJson(url + '/api/room/push-state/' + roomData.roomId, {state: '4'});
        await util.postAsJson(url + '/api/room/push-state/' + roomData.roomId, {state: '5'});
        await util.postAsJson(url + '/api/room/push-state/' + roomData.roomId, {state: '6'});
        await util.postAsJson(url + '/api/room/push-state/' + roomData.roomId, {state: '7'});

        const pushStateResult = await util.postAsJson(url + '/api/room/push-state/' + roomData.roomId, {state: '8'});

        assert(pushStateResult.roomId === roomData.roomId);
        assert(pushStateResult.states.length === 9);

        const getStatesResult = await util
            .getAsJson(url + '/api/room/get-states/' + roomData.roomId + '/' + lastStatesCount);

        assert.deepEqual(getStatesResult, {
            roomId: roomData.roomId,
            states: [
                {state: '5'},
                {state: '6'},
                {state: '7'},
                {state: '8'}
            ]
        });

        const getStatesResultBig = await util
            .getAsJson(url + '/api/room/get-states/' + roomData.roomId + '/' + 1000);

        assert.deepEqual(getStatesResultBig, {
            roomId: roomData.roomId,
            states: [
                {state: '0'},
                {state: '1'},
                {state: '2'},
                {state: '3'},
                {state: '4'},
                {state: '5'},
                {state: '6'},
                {state: '7'},
                {state: '8'}
            ]
        });
    });
});

/* global describe, it, before, after, beforeEach, afterEach */
const chai = require('chai');

chai.use(require('chai-json-schema'));
const assert = chai.assert;

const Server = require('./../../../module/server').Server;
const util = require('./../../util');
const path = require('path');

const stateArraySchema = util.stateArraySchema;

const serverOptions = util.getServerOptions();

const url = 'http://localhost:' + serverOptions.port;

describe('/api/room/get-all-states', () => {
    let server = null;

    beforeEach(() => {
        server = new Server(serverOptions);
        return server.run();
    });

    afterEach(() => server.destroy());

    it('get all states', async () => {
        const userA = await util.createUser();

        const createRoomResult = await util.getAsJson(url + '/api/room/create');
        const {roomId} = createRoomResult;

        // join to room
        await util.getAsJson(url + path.join('/api/room/join/', roomId, userA.userId, userA.socket.id));

        // take turn
        await util.getAsJson(url + path.join('/api/room/take-turn/', roomId, userA.userId));

        // get all states
        let getAllStatesResult = await util.getAsJson(url + path.join('/api/room/get-all-states/', roomId));

        assert.deepEqual(getAllStatesResult, {roomId, states: []});

        // push states by userA
        await util.postAsJson(url + path.join('/api/room/push-state/', roomId, userA.userId), {state: 'state-1'});
        await util.postAsJson(url + path.join('/api/room/push-state/', roomId, userA.userId), {state: 'state-2'});
        await util.postAsJson(url + path.join('/api/room/push-state/', roomId, userA.userId), {state: 'state-3'});
        await util.postAsJson(url + path.join('/api/room/push-state/', roomId, userA.userId), {state: 'state-4'});

        // get all states again
        getAllStatesResult = await util.getAsJson(url + path.join('/api/room/get-all-states/', roomId));
        assert(getAllStatesResult.roomId, roomId);
        assert(getAllStatesResult.states.length === 4);
        assert.jsonSchema(getAllStatesResult.states, stateArraySchema);

        userA.socket.disconnect();
    });
});

/* global describe, it, before, after, beforeEach, afterEach */
const chai = require('chai');

chai.use(require('chai-json-schema'));
const assert = chai.assert;

const Server = require('./../../../module/server').Server;
const util = require('./../../util');
const path = require('path');

const pushStateResultSchema = util.pushStateResultSchema;

const serverOptions = {
    port: 3080,
    'static': 'static' // optional parameter here
};

const url = 'http://localhost:' + serverOptions.port;

describe('/api/room/get-last-states', () => {
    let server = null;

    beforeEach(() => {
        server = new Server(serverOptions);
        return server.run();
    });

    afterEach(() => server.destroy());

    it('get last states', async () => {
        const userA = util.createUser();

        const createRoomResult = await util.getAsJson(url + '/api/room/create');
        const {roomId} = createRoomResult;

        // join to room
        await util.getAsJson(url + path.join('/api/room/join/', roomId, userA.userId, userA.socketId));

        // take turn
        await util.getAsJson(url + path.join('/api/room/take-turn/', roomId, userA.userId));

        // push state by userA
        let pushStateResult = await util
            .postAsJson(url + path.join('/api/room/push-state/', roomId, userA.userId), {state: 'state-1'});

        assert(pushStateResult.states.length === 1);

        let getStatesResult = await util
            .getAsJson(url + path.join('/api/room/get-last-states/', roomId, '/' + 1));

        assert(getStatesResult.states[0].state === 'state-1');
        assert.jsonSchema(getStatesResult.states, pushStateResultSchema);

        // push state by userA again
        pushStateResult = await util
            .postAsJson(url + path.join('/api/room/push-state/', roomId, userA.userId), {state: 'state-2'});
        assert(pushStateResult.states.length === 2);

        getStatesResult = await util
            .getAsJson(url + path.join('/api/room/get-last-states/', roomId, '/' + 2));

        assert(getStatesResult.states[0].state, 'state-1');
        assert(getStatesResult.states[1].state, 'state-2');
        assert.jsonSchema(getStatesResult.states, pushStateResultSchema);

        getStatesResult = await util
            .getAsJson(url + path.join('/api/room/get-last-states/', roomId, '/' + 1000));

        assert(getStatesResult.states[0].state, 'state-1');
        assert(getStatesResult.states[1].state, 'state-2');
        assert.jsonSchema(getStatesResult.states, pushStateResultSchema);
    });
});

/* global describe, it, before, after, beforeEach, afterEach */
const chai = require('chai');

chai.use(require('chai-json-schema'));
const assert = chai.assert;

const Server = require('./../../../module/server').Server;
const util = require('./../../util');
const path = require('path');

const pushStateResultSchema = util.pushStateResultSchema;

const serverOptions = util.getServerOptions();

const url = 'http://localhost:' + serverOptions.port;

describe('/api/room/push-state', () => {
    let server = null;

    beforeEach(() => {
        server = new Server(serverOptions);
        return server.run();
    });

    afterEach(() => server.destroy());

    it('push state', async () => { // eslint-disable-line max-statements
        const userA = await util.createUser();
        const userB = await util.createUser();

        const createRoomResult = await util.getAsJson(url + '/api/room/create');
        const {roomId} = createRoomResult;

        // join to room
        await util.getAsJson(url + path.join('/api/room/join/', roomId, userA.userId, userA.socket.id));
        await util.getAsJson(url + path.join('/api/room/join/', roomId, userB.userId, userB.socket.id));

        // push state by userA before take turn
        let pushStateResult = await util
            .postAsJson(url + path.join('/api/room/push-state/', roomId, userA.userId), {state: 'state-1'});

        assert(pushStateResult.states === null);

        // take turn
        await util.getAsJson(url + path.join('/api/room/take-turn/', roomId, userA.userId));

        // push state by userA
        pushStateResult = await util
            .postAsJson(url + path.join('/api/room/push-state/', roomId, userA.userId), {state: 'state-1'});
        assert(pushStateResult.states.length === 1);
        assert.jsonSchema([pushStateResult.states.last], pushStateResultSchema);

        let getStatesResult = await util
            .getAsJson(url + path.join('/api/room/get-last-states/', roomId, '/' + 1));

        assert(getStatesResult.states[0].state === 'state-1');
        assert(pushStateResult.roomId === roomId);
        assert.jsonSchema(getStatesResult.states, pushStateResultSchema);

        // push state by userB without turn
        pushStateResult = await util
            .postAsJson(url + path.join('/api/room/push-state/', roomId, userB.userId), {state: 'state-2'});
        assert(pushStateResult.roomId === roomId);
        assert(pushStateResult.states === null);

        // check state did not push
        getStatesResult = await util
            .getAsJson(url + path.join('/api/room/get-last-states/', roomId, '/' + 1));

        assert(getStatesResult.states[0].state === 'state-1');
        assert.jsonSchema(getStatesResult.states, pushStateResultSchema);

        // leave turn by userA
        await util.getAsJson(url + path.join('/api/room/drop-turn/', roomId, userA.userId));

        // push state by userB with turn
        pushStateResult = await util
            .postAsJson(url + path.join('/api/room/push-state/', roomId, userB.userId), {state: 'state-2'});
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
        assert(getStatesResult.states.length === 2);
        assert.jsonSchema(getStatesResult.states, pushStateResultSchema);

        userA.socket.disconnect();
        userB.socket.disconnect();
    });
});

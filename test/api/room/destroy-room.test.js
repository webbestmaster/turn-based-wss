/* global describe, it, before, after, beforeEach, afterEach */
const chai = require('chai');
const assert = chai.assert;
const Server = require('./../../../module/server').Server;
const util = require('./../../util');
const serverOptions = util.getServerOptions();
const url = 'http://localhost:' + serverOptions.port;

chai.use(require('chai-json-schema'));

// self variables
const path = require('path');
const roomConfig = require('./../../../module/room/config.json');

describe('destroy room', () => {
    let server = null;

    beforeEach(() => {
        server = new Server(serverOptions);
        return server.run();
    });

    afterEach(() => server.destroy());

    it('destroy room by timer if just created room has no players', async () => {
        const user = await util.createUser();

        await util.getAsJson(url + '/api/room/create');
        await util.getAsJson(url + '/api/room/create');
        await util.getAsJson(url + '/api/room/create');

        let roomsIdsData = await util.getAsJson(url + '/api/room/get-ids');

        assert(roomsIdsData.roomIds.length === 3);

        const roomId = roomsIdsData.roomIds[1];

        await util
            .getAsJson(url + path.join('/api/room/join/', roomId, user.userId, user.socket.id));

        await util.sleep(roomConfig.timers.onCreateRoom.time + 1e3);

        roomsIdsData = await util.getAsJson(url + '/api/room/get-ids');

        assert.deepEqual(roomsIdsData.roomIds, [roomId]);

        user.socket.disconnect();
    }).timeout(roomConfig.timers.onCreateRoom.time * 3);

    it('destroy room on LEAVE all players (imminently)', async () => {

    });

    it('destroy room on DISCONNECT all players (by timing)', async () => {

    });
});

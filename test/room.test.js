/* global describe, it, beforeEach, afterEach */
const assert = require('chai').assert;
const Server = require('./../module/server').Server;
const util = require('./util');

const serverOptions = {
    port: 3080
};

const url = 'http://localhost:' + serverOptions.port;

describe('api/room', () => {
    let server = null;

    beforeEach(() => {
        server = new Server(serverOptions);
        return server.run();
    });

    afterEach(() => server.destroy());

    it('create room', async () => {
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

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
const dropTurnSchema = require('./../../schema').dropTurn;
const dropTurnMessageSchema = require('./../../schema').dropTurnMessage;
const takeTurnMessageSchema = require('./../../schema').takeTurnMessage;
const messageConst = require('./../../../module/room/message.json');
const error = require('./../../../module/server/api/error.json');

describe('onDisconnect', () => {
    let server = null;

    beforeEach(() => {
        server = new Server(serverOptions);
        return server.run();
    });

    afterEach(() => server.destroy());

    // TODO: send other users message - user is disconnect, that is all
    it('on user disconnect', async () => { // eslint-disable-line max-statements
        const userA = await util.createUser();
        const userB = await util.createUser();

        const createRoomResult = await util.getAsJson(url + '/api/room/create');
        const {roomId} = createRoomResult;

        // join to room
        await util.getAsJson(url + path.join('/api/room/join/', roomId, userA.userId, userA.socket.id));
        await util.getAsJson(url + path.join('/api/room/join/', roomId, userB.userId, userB.socket.id));

        userA.socket.disconnect();
        userB.socket.disconnect();
    });
});

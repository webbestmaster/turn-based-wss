/* global describe, it, before, after, beforeEach, afterEach */
const chai = require('chai');
const assert = chai.assert;
const Server = require('./../../../module/server').Server;
const util = require('./../../util');
const serverOptions = util.getServerOptions();
const url = 'http://localhost:' + serverOptions.port;

chai.use(require('chai-json-schema'));

// self variables

describe('destroy room', () => {
    let server = null;

    beforeEach(() => {
        server = new Server(serverOptions);
        return server.run();
    });

    afterEach(() => server.destroy());

    it('destroy room by timer if just created room has no players', async () => {

    });

    it('destroy room on LEAVE all players (imminently)', async () => {

    });

    it('destroy room on DISCONNECT all players (by timing)', async () => {

    });
});

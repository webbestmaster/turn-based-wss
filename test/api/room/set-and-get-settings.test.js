/* global describe, it, before, after, beforeEach, afterEach */
const assert = require('chai').assert;
const Server = require('./../../../module/server').Server;
const util = require('./../../util');
const path = require('path');

const serverOptions = {
    port: 3080,
    'static': 'static' // optional parameter here
};

const url = 'http://localhost:' + serverOptions.port;

describe('/api/room/(set-setting|set-all-settings|get-setting|get-all-settings)', () => {
    let server = null;

    beforeEach(() => {
        server = new Server(serverOptions);
        return server.run();
    });

    afterEach(() => server.destroy());

    it('set setting(s)', async () => {
        const createRoomResult = await util.getAsJson(url + '/api/room/create');

        const {roomId} = createRoomResult;

        const allSettings = {
            allFoo: 'allBar'
        };

        const settingKey = 'foo';
        const setting = {
            [settingKey]: 'bar'
        };

        const setSettingResult = await util
            .postAsJson(url + path.join('/api/room/set-setting/', roomId), setting);

        assert(setSettingResult.roomId === roomId);

        const getSettingResult = await util
            .getAsJson(url + path.join('/api/room/get-setting/', roomId, settingKey));

        assert(getSettingResult.roomId === roomId);
        assert(getSettingResult.value === setting[settingKey]);

        const setAllSettingsResult = await util
            .postAsJson(url + path.join('/api/room/set-all-settings/', roomId), allSettings);

        assert(setAllSettingsResult.roomId === roomId);

        const getAllSettingsResult = await util
            .getAsJson(url + path.join('/api/room/get-all-settings/', roomId));

        assert(getAllSettingsResult.roomId === roomId);
        assert.deepEqual(getAllSettingsResult.settings, allSettings);
    });
});

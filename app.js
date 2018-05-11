// @flow

// create TBW
const {Server} = require('./dist/module/server/index');
const appOptions = require('./app-setting.js');

const server = new Server({
    port: appOptions.serverOptions.port,
    'static': appOptions.serverOptions.static
});

server.run();

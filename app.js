// create TBW
const Server = require('./module/server/index').Server;
const appOptions = require('./app.json');
const server = new Server({
    port: appOptions.serverOptions.port,
    'static': appOptions.serverOptions.static
});

server.run();

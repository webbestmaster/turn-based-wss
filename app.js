// create TBW
const Server = require('./module/server/index').Server;
const server = new Server({
    port: 3000,
    'static': 'front'
});

server.run();

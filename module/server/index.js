/* global __dirname */
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const serverDefaultOptions = {
    port: 3000
};

/**
 *
 * @param {Object} options - options for new TBW
 *      @param {number} options.port - port to lister
 */
module.exports = class Server {
    constructor(options) {
        const server = this;

        const attr = {
            options: Object.assign(serverDefaultOptions, options),
            expressApp: null,
            httpServer: null,
            socketIoServer: null
        };

        const expressApp = express();
        const httpServer = http.Server(expressApp); // eslint-disable-line new-cap
        const socketIoServer = socketIo(httpServer);

        Object.assign(attr, {
            expressApp,
            httpServer,
            socketIoServer
        });

        server._attr = attr; // eslint-disable-line no-underscore-dangle, id-match

        console.log('TBW was created.');
    }

    run() {
        return new Promise((resolve, reject) => {
            const server = this;
            const expressApp = server.getExpressApp();
            const httpServer = server.getHttpServer();
            const socketIoServer = server.getSocketIoServer();
            const options = server.getOptions();

            console.log('TBW has bean run.');

            expressApp.get('/', (req, res) => {
                res.sendFile(path.join(__dirname, '/front/index.html'));
            });

            httpServer.listen(options.port, () => {
                console.log('listening on *:' + options.port);
                resolve();
            });

            socketIoServer.on('connection', socket => {
                socket.on('disconnect', () => {
                    console.log('user disconnected');
                });

                socket.on('chat message', msg => {
                    // socket.broadcast.emit('chat message', msg); // for every one, except me
                    socketIoServer.emit('chat message', msg); // every one and me too
                });
                console.log('a user connected');
            });
        });
    }

    getAttr() {
        return this._attr; // eslint-disable-line no-underscore-dangle
    }

    getExpressApp() {
        return this.getAttr().expressApp;
    }

    getHttpServer() {
        return this.getAttr().httpServer;
    }

    getSocketIoServer() {
        return this.getAttr().socketIoServer;
    }

    getOptions() {
        return this.getAttr().options;
    }
};

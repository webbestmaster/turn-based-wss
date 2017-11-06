/* global __dirname */
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const apiRouter = require('./api-router').apiRouter;
const roomMaster = require('./../room/master').roomMaster;
const serverDefaultOptions = {
    port: 3000
};

class Server {
    /**
     *
     * @param {Object} options - options for new TBW
     *      @param {number} options.port - port to lister
     */
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
            const httpServer = server.getHttpServer();
            const socketIoServer = server.getSocketIoServer();
            const options = server.getOptions();

            // console.log('TBW has bean run.');

            apiRouter.bindRoutes(server);

            httpServer.listen(options.port, () => {
                console.log('listening on *:' + options.port);
                resolve();
            });

            socketIoServer.on('connection', socket => {
                console.log(`Client connected [id=${socket.id}]`);

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

    destroy() {
        const server = this;
        const expressApp = server.getExpressApp();
        const httpServer = server.getHttpServer();
        const socketIoServer = server.getSocketIoServer();

        roomMaster.destroy();

        return Promise.all([
            new Promise((resolve, reject) => socketIoServer.close(resolve)),
            new Promise((resolve, reject) => httpServer.close(resolve))
        ]);
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
}

module.exports.Server = Server;

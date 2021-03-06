/* global __dirname */
const ip = require('ip'); // eslint-disable-line id-length
const express = require('express');
const spa = require('express-spa');
const http = require('http');
const socketIo = require('socket.io');
const apiRouter = require('./api-router').apiRouter;
const roomMaster = require('./../room/master').roomMaster;

const serverDefaultOptions = {
    port: 3000,
    'static': 'static'
};

class Server {
    /**
     *
     * @param {Object} options - options for new TBW
     *      @param {number} options.port - port to lister
     *      @param {string} options.static - path to static files
     */
    constructor(options) {
        const server = this;

        const expressApp = express();
        const httpServer = http.Server(expressApp); // eslint-disable-line new-cap
        const socketIoServer = socketIo(httpServer);

        server._attr = { // eslint-disable-line no-underscore-dangle, id-match
            options: Object.assign(serverDefaultOptions, options),
            expressApp,
            httpServer,
            socketIoServer
        };
    }

    run() {
        return new Promise((resolve, reject) => {
            const server = this;
            const httpServer = server.getHttpServer();
            const options = server.getOptions();
            const expressApp = server.getExpressApp();

            apiRouter.bindRoutes(server);

            expressApp.use(express.static(options.static));
            expressApp.use(spa(options.static + '/index.html'));

            httpServer.listen(options.port, () => {
                console.log('TBW listening on ' + ip.address() + ':' + options.port);
                resolve();
            });

            /*
            // just debug info
            const socketIoServer = server.getSocketIoServer();
            socketIoServer.on('connection', socket => {
                console.log(`Client connected [id=${socket.id}]`);

                socket.on('disconnect', () => {
                    console.log(`Client disconnected [id=${socket.id}]`);
                });
            });
            */
        });
    }

    destroy() {
        const server = this;
        const httpServer = server.getHttpServer();
        const socketIoServer = server.getSocketIoServer();
        const port = server.getOptions().port;

        // const expressApp = server.getExpressApp();

        roomMaster.destroy();

        return Promise
            .all([
                new Promise((resolve, reject) => socketIoServer.close(resolve)),
                new Promise((resolve, reject) => httpServer.close(resolve))
            ])
            .then(() => {
                console.log('TBW stop listen ' + ip.address() + ':' + port);
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
}

module.exports.Server = Server;

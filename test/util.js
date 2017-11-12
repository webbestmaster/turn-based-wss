const request = require('request');
const socketIoClient = require('socket.io-client');

module.exports.getAsJson = url =>
    new Promise((resolve, reject) =>
        request(url, (error, response, body) => error ? reject(error) : resolve(JSON.parse(body))));

module.exports.postAsJson = (url, params) =>
    new Promise((resolve, reject) =>
        request.post(
            {
                url,
                form: params
            },
            (error, response, body) => error ? reject(error) : resolve(JSON.parse(body))));

module.exports.createUser = () => {
    const clientData = {
        userId: 'user-id-' + String(Math.random()).slice(2),
        socket: null,
        messages: []
    };

    return new Promise((resolve, reject) => {
        const options = {
            transports: ['websocket'],
            'force new connection': true
        };

        const socket = socketIoClient.connect('http://localhost:' + getServerOptions().port, options);

        socket.on('message', message => clientData.messages.push(message));

        socket.on('connect', () => {
            Object.assign(clientData, {socket});
            resolve(clientData);
        });
    });
};

module.exports.pushStateResultSchema = {
    title: 'push state schema v1',
    type: 'array',
    uniqueItems: true,
    items: {
        type: 'object',
        required: ['state', 'meta'],
        properties: {
            state: {
                type: 'string' // user's type
            },
            meta: {
                type: 'object',
                required: ['order', 'timestamp', 'hash'],
                properties: {
                    order: {
                        type: 'number'
                    },
                    timestamp: {
                        type: 'number'
                    },
                    hash: {
                        type: 'string'
                    }
                }
            }
        }
    }
};

function getServerOptions() {
    return {
        port: 3080,
        'static': 'static' // optional parameter here
    };
}

module.exports.getServerOptions = getServerOptions;

const request = require('request');

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

module.exports.createUser = () => ({
    userId: 'user-id-' + String(Math.random()).slice(2),
    socketId: 'socket-id-' + String(Math.random()).slice(2)
});

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

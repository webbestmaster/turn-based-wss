const request = require('request');

module.exports.get = url =>
    new Promise((resolve, reject) =>
        request(url, (error, response, body) => error ? reject(error) : resolve(body, response)));

module.exports.post = (url, params) =>
    new Promise((resolve, reject) =>
        request.post(
            {
                url,
                form: JSON.stringify(params)
            },
            (error, response, body) => error ? reject(error) : resolve(body, response)));

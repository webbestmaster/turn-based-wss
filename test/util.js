const request = require('request');

module.exports.getAsJson = url =>
    new Promise((resolve, reject) =>
        request(url, (error, response, body) => error ? reject(error) : resolve(JSON.parse(body))));

module.exports.postAsJson = (url, params) =>
    new Promise((resolve, reject) =>
        request.post(
            {
                url,
                form: JSON.stringify(params)
            },
            (error, response, body) => error ? reject(error) : resolve(JSON.parse(body))));

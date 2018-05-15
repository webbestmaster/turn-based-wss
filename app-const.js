/* global process */
module.exports = {
    serverOptions: {
        port: process.env.PORT || 3001, // eslint-disable-line no-process-env
        'static': 'front'
    }
};

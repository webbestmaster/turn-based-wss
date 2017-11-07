/* global window, localStorage, jQuery, io */
class UserConnection {
    constructor() {
        const userConnection = this;

        userConnection._attr = { // eslint-disable-line no-underscore-dangle, id-match
            id: null,
            socket: null,
            connectUrl: null
        };
    }

    /**
     *
     * @param {string} connectUrl - url to connect
     * @return {Promise} - will resolve on connection
     */
    connect(connectUrl) {
        return new Promise((resolve, reject) => {
            const userConnection = this;

            // define user's id
            let userId = localStorage.getItem('user-id');

            if (!userId) {
                userId = String(Math.random());
                localStorage.setItem('user-id', userId);
            }

            userConnection.getAttr().id = userId;
            userConnection.getAttr().connectUrl = connectUrl;

            // setup connection
            const socket = io(userConnection.getConnectUrl());

            userConnection.getAttr().socket = socket;

            socket.on('connect', () => {
                jQuery
                    .post(
                        userConnection.getConnectUrl() + '/api/register-user-connection',
                        {
                            userConnectionId: userConnection.getId(),
                            socketId: userConnection.getSocket().id
                        }
                    )
                    .done(resolve);
            });
        });
    }

    getId() {
        return this.getAttr().id;
    }

    getSocket() {
        return this.getAttr().socket;
    }

    getConnectUrl() {
        return this.getAttr().connectUrl;
    }

    getAttr() {
        return this._attr; // eslint-disable-line no-underscore-dangle
    }
}

window.UserConnection = UserConnection;

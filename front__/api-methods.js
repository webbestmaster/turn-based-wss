/* global window, fetch */
(() => {
    const win = window;
    const api = {};
    const url = 'http://localhost:3000';

    api.makeRoom = () =>
        fetch(url + '/api/create-room')
            .then(data => data.json());

    Promise
        .all([
            api.makeRoom(),
            api.makeRoom(),
            api.makeRoom(),
            api.makeRoom(),
            api.makeRoom()
        ])
        .then(roomsData => {
            console.log(roomsData);

            fetch(url + '/api/get-room-ids').then(data => data.json()).then(roomIds => console.log(roomIds));
        });
})();

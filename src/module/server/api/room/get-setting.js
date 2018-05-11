// @flow

const {roomMaster} = require('../../../room/master');
const error = require('../error.js');

module.exports = (req, res) => {
    const {params} = req;
    const {roomId, key} = params;

    const room = roomMaster.getRoomById(roomId);

    if (!room) {
        res.json({
            error: {
                id: error.ROOM_NOT_FOUND.id,
                message: error.ROOM_NOT_FOUND.message.replace('{{roomId}}', roomId)
            }
        });
        return;
    }


    res.json({
        roomId,
        value: room.getSetting(key)
    });
};

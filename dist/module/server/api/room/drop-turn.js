// 

const {roomMaster} = require('../../../room/master');
const error = require('../error.js');
const messageConst = require('../../../room/message.js');

module.exports = (req, res) => {
    const {params} = req;
    const {roomId, userId} = params;

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


    const activeUserId = room.dropTurn(userId);

    res.json({
        type: messageConst.type.dropTurn,
        roomId,
        activeUserId
    });
};

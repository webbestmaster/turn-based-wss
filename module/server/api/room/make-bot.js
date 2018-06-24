const roomMaster = require('./../../../room/master').roomMaster;
const error = require('./../error.json');
const messageConst = require('./../../../room/message.json');

module.exports = (req, res) => {
    const {params} = req;
    const {roomId} = params;

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

    const bot = room.makeBot();

    res.json({
        type: messageConst.type.joinIntoRoom,
        roomId,
        userId: bot.userId,
        socketId: bot.socketId
    });
};

const roomMaster = require('./../../../room/master').roomMaster;

module.exports = (req, res) => {
    const {params} = req;
    const {roomId, userId} = params;

    if (!roomId || !userId) {
        res.json({
            error: {
                message: 'Can not take turn by url: /api/room/leave-turn/' + roomId + '/' + userId
            }
        });
        return;
    }

    const room = roomMaster.getRoomById(roomId);

    if (!room) {
        res.json({
            error: {
                message: 'Room not found, room id: ' + roomId
            }
        });
        return;
    }

    const activeUserId = room.dropTurn(userId);

    res.json({
        roomId,
        activeUserId
    });
};

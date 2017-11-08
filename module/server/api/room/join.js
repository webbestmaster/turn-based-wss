const roomMaster = require('./../../../room/master').roomMaster;

module.exports = (req, res) => {
    const {params} = req;
    const {roomId, userId, socketId} = params;

    if (!roomId || !userId || !socketId) {
        res.json({
            error: {
                message: 'Can not join to room by url: /api/room/join/' + roomId + '/' + userId + '/' + socketId
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

    room.join({
        userId,
        socketId
    });

    res.json({roomId, userId, socketId});
};

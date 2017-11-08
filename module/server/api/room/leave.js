const roomMaster = require('./../../../room/master').roomMaster;

module.exports = (req, res) => {
    const {params} = req;
    const {roomId, userId} = params;

    if (!roomId || !userId) {
        res.json({
            error: {
                message: 'Can not leave a room by url: /api/room/join/' + roomId + '/' + userId
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

    room.leave(userId);

    res.json({roomId, userId});
};

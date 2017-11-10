const roomMaster = require('./../../../room/master').roomMaster;

module.exports = (req, res) => {
    const {params} = req;
    const {roomId, key} = params;

    if (!roomId) {
        res.json({
            error: {
                message: 'Can not find to room by url: /api/room/join/' + roomId
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

    res.json({
        roomId,
        value: room.getSetting(key)
    });
};

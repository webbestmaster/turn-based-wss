const roomMaster = require('./../../../room/master').roomMaster;

module.exports = (req, res) => {
    const {params} = req;
    const {roomId} = params;

    if (!roomId) {
        res.json({
            error: {
                message: 'Can not join to room by url: /api/room/get-users/' + roomId
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
        users: room.getConnections().map(connection => connection.getAttr())
    });
};

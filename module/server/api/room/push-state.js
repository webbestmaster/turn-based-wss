const roomMaster = require('./../../../room/master').roomMaster;

module.exports = (req, res) => {
    const {params, body} = req;
    const {roomId, userId} = params;

    if (!roomId || !userId) {
        res.json({
            error: {
                message: 'Can not join to room by url: /api/room/join/' + roomId + '/' + userId
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

    const pushStateResult = room.pushState(userId, body);

    if (pushStateResult === null) {
        res.json({
            roomId,
            states: null
        });
        return;
    }

    res.json({
        roomId,
        states: {
            length: room.getStates().length
        }
    });
};

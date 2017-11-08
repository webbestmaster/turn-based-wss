const roomMaster = require('./../../../room/master').roomMaster;

module.exports = (req, res) => {
    const {params, body} = req;
    const {roomId} = params;

    if (!roomId) {
        res.json({
            error: {
                message: 'Can not join to room by url: /api/room/join/' + roomId
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

    room.pushState(body);

    res.json({
        roomId,
        states: {
            length: room.getStates().length
        }
    });
};

const roomMaster = require('./../../../room/master').roomMaster;

module.exports = (req, res) => {
    const {params} = req;
    const {roomId} = params;

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

    const states = room.getStates();
    const statesLength = states.length;

    res.json({
        roomId,
        states: states.slice(statesLength - count, statesLength)
    });
};

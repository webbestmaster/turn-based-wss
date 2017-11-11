const roomMaster = require('./../../../room/master').roomMaster;
const error = require('./../error.json');

module.exports = (req, res) => {
    const {params, body} = req;
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


    const lastState = room.pushState(userId, body);

    if (lastState === null) {
        res.json({
            roomId,
            states: null
        });
        return;
    }

    res.json({
        roomId,
        states: {
            last: lastState,
            length: room.getStates().length
        }
    });
};

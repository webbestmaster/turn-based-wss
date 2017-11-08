const Room = require('./../../../room').Room;

module.exports = (req, res) => {
    const room = new Room();

    res.json({roomId: room.getId()});
};

// 

const {Room} = require('../../../room/index');

module.exports = (req, res, server) => {
    const room = new Room({server});

    res.json({roomId: room.getId()});
};

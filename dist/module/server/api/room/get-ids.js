// 

const {roomMaster} = require('../../../room/master');

module.exports = (req, res) => {
    res.json({roomIds: roomMaster.getRoomIds()});
};

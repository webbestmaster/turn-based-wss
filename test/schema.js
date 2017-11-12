const messageConst = require('./../module/room/message.json');

const meta = {
    type: 'object',
    required: ['order', 'timestamp', 'hash'],
    properties: {
        order: {
            type: 'number'
        },
        timestamp: {
            type: 'number'
        },
        hash: {
            type: 'string'
        }
    }
};

module.exports.meta = meta;

const createRoom = {
    type: 'object',
    required: ['roomId'],
    properties: {
        roomId: {
            type: 'string'
        }
    }
};

module.exports.createRoom = createRoom;


const getRoomIds = {
    type: 'object',
    required: ['roomIds'],
    properties: {
        roomIds: {
            type: 'array',
            uniqueItems: true,
            items: {
                type: 'string'
            }
        }
    }
};

module.exports.getRoomIds = getRoomIds;


const joinIntoRoom = {
    type: 'object',
    required: ['type', 'roomId', 'userId', 'socketId'],
    properties: {
        type: {
            'enum': [messageConst.type.joinIntoRoom]
        },
        roomId: {
            type: 'string'
        },
        userId: {
            type: 'string'
        },
        socketId: {
            type: 'string'
        }
    }
};

module.exports.joinIntoRoom = joinIntoRoom;


const joinIntoRoomMessage = {
    type: 'object',
    required: ['type', 'roomId', 'states'],
    properties: {
        type: {
            'enum': [messageConst.type.joinIntoRoom]
        },
        roomId: {
            type: 'string'
        },
        states: {
            type: 'object',
            required: ['last', 'length'],
            properties: {
                last: {
                    type: 'object',
                    required: joinIntoRoom.required.concat('meta'),
                    properties: Object.assign({},
                        {properties: joinIntoRoom.properties},
                        {meta}
                    )
                },
                length: {
                    type: 'number'
                }
            }
        }
    }
};

module.exports.joinIntoRoomMessage = joinIntoRoomMessage;


const stateSchema = {
    type: 'object',
    required: ['state', 'meta'],
    properties: {
        state: {
            type: 'string' // user's type
        },
        meta
    }
};

const stateArraySchema = {
    type: 'array',
    uniqueItems: true,
    items: stateSchema
};

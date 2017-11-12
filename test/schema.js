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
    type: 'array',
    uniqueItems: true,
    items: {
        type: 'string'
    }
};

module.exports.getRoomIds = getRoomIds;


const joinIntoRoom = {
    type: 'object',
    required: ['type', 'roomId', 'userId', 'socketId'],
    properties: {
        type: {
            type: 'string'
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

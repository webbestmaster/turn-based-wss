##API


####Create a room.

> GET /api/room/create

Request body: empty

Response: 
@type: json
    @property: roomId
    @type: string


####Join into thr room.

> GET /api/room/join/:roomId/:userId/:socketId

Request body: empty

Response: 
@type: json
    @property: roomId
    @type: string
    @property: userId
    @type: string
    @property: socketId
    @type: string

##API


####Create a room.
> GET /api/room/create

Request body: empty

Response: 
@type: json
    @property: roomId
    @type: string


####Get room ids.
> GET /api/room/get-ids

Request body: empty

Response: 
@type: json
    @property: roomIds
    @type: array
        @items:
            @type: string


####Join into the room.
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


####Leave the room.
> GET /api/room/leave/:roomId/:userId

Request body: empty

Response: 
@type: json
    @property: roomId
    @type: string
    @property: userId
    @type: string


####Take a turn.
> GET /api/room/take-turn/:roomId/:userId

Request body: empty

Response: 
@type: json
    @property: roomId
    @type: string
    @property: activeUserId
    @type: string


####Drop the turn.
> GET /api/room/drop-turn/:roomId/:userId

Request body: empty

Response: 
@type: json
    @property: roomId
    @type: string
    @property: activeUserId
    @type: string


####Get users.
> GET /api/room/get-users/:roomId

Request body: empty

Response: 
@type: json
    @property: roomId
    @type: string
    @property: users
    @type: array
        @items:
            @type: object
                @property: userId
                @type: string
                @property: socketId
                @type: string


// TODO: document IT!
/api/room/push-state/:roomId/:userId
/api/room/get-last-states/:roomId/:count
/api/room/get-all-states/:roomId
/api/room/get-states-from-hash/:roomId/:hash
/api/room/get-all-settings/:roomId
/api/room/get-setting/:roomId/:key
/api/room/set-all-settings/:roomId
/api/room/set-setting/:roomId


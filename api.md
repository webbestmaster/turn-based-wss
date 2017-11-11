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


####Push state.
> POST /api/room/push-state/:roomId/:userId

Request body:
@type: object
    @property: *
    @type: string

Response (success): 
@type: json
    @property: roomId
    @type: string
    @property: states
    @type: object
        @property: last
        @type: object<your pushed state>
        @property: length
        @type: number

Response (fail): 
@type: json
    @property: roomId
    @type: string
    @property: states
    @type: object
    @value: null


####Get last states
> GET /api/room/get-last-states/:roomId/:count

####Get states from hash
> GET /api/room/get-states-from-hash/:roomId/:hash

####Get all states
> GET /api/room/get-all-states/:roomId

Request body: empty

Response: 
@type: json
    @property: roomId
    @type: string
    @property: states
    @type: array
        @items:
            @type: object<pushed states>


####Get all settings
> GET /api/room/get-all-settings/:roomId

Request body: empty

Response: 
@type: json
    @property: roomId
    @type: string
    @property: settings
    @type: object<your settings>


####Get setting
> GET /api/room/get-setting/:roomId/:key

Request body: empty

Response: 
@type: json
    @property: roomId
    @type: string
    @property: value
    @type: <value of setting>


// TODO: document IT!
/api/room/set-all-settings/:roomId
/api/room/set-setting/:roomId


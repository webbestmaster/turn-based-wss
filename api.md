##API


####Create a room.
> GET /api/room/create

Request: empty
Response: see schema - createRoom
Socket: nothing


####Get room ids.
> GET /api/room/get-ids

Request: empty
Response: see schema - getRoomIds
Socket: nothing


####Join into the room.
> GET /api/room/join/:roomId/:userId/:socketId

Request body: empty
Response: see schema - joinIntoRoom
Socket: see schema - joinIntoRoomMessage


####Leave the room.
> GET /api/room/leave/:roomId/:userId

Request body: empty
Response: see schema - leaveFromRoom
Socket: see schema - leaveFromRoomMessage, all except leaved user


####Take a turn.
> GET /api/room/take-turn/:roomId/:userId

Request body: empty
Response (success): see schema - takeTurn
Socket (success): see schema - takeTurnMessage

Response (fail): see schema - takeTurn
Socket (fail): nothing

In case your take your own turn (double taking)
Response: see schema - takeTurn
Socket: nothing


####Drop the turn.
> GET /api/room/drop-turn/:roomId/:userId

Request body: empty
Response (success): see schema - dropTurn
Socket (success): see schema - dropTurnMessage

Response (fail): see schema - dropTurn
Socket (fail): nothing

In case your drop your own turn (double dropping)
Response: see schema - dropTurn
Socket: nothing


####Get users.
> GET /api/room/get-users/:roomId

Request body: empty
Response: {{userId: 'string', socketId: 'string'}[]}
Socket: nothing


####Push state.
> POST /api/room/push-state/:roomId/:userId

Request body: <your-state>
Response (success): see schema - pushState
Socket (success): see schema - pushStateMessage

Response (fail): see schema - pushStateFail
Socket (fail): nothing

















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


####Set all settings
> GET /api/room/set-all-settings/:roomId

Request body: object<your settings>

Response: 
@type: json
    @property: roomId
        @type: string


####Set one setting
> GET /api/room/set-setting/:roomId

Request body: object<your setting>

Response: 
@type: json
    @property: roomId
        @type: string

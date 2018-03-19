##API

Schemas are here: ./test/schema.js


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

Request: empty
Response: see schema - joinIntoRoom
Socket: see schema - joinIntoRoomMessage


####Leave the room.
> GET /api/room/leave/:roomId/:userId

Request: empty
Response: see schema - leaveFromRoom
Socket: see schema - leaveFromRoomMessage, all except leaved user


####Take a turn.
> GET /api/room/take-turn/:roomId/:userId

Request: empty
Response (success): see schema - takeTurn
Socket (success): see schema - takeTurnMessage

Response (fail): see schema - takeTurn
Socket (fail): nothing

In case your take your own turn (double taking)
Response: see schema - takeTurn
Socket: nothing


####Drop the turn.
> GET /api/room/drop-turn/:roomId/:userId

Request: empty
Response (success): see schema - dropTurn
Socket (success): see schema - dropTurnMessage

Response (fail): see schema - dropTurn
Socket (fail): nothing

In case your drop your own turn (double dropping)
Response: see schema - dropTurn
Socket: nothing


####Get users.
> GET /api/room/get-users/:roomId

Request: empty
Response: {{userId: 'string', socketId: 'string'}[]}
Socket: nothing


####Push state.
> POST /api/room/push-state/:roomId/:userId

Request: <your-state>
Response (success): see schema - pushState
Socket (success): see schema - pushStateMessage

Response (fail): see schema - pushStateFail
Socket (fail): nothing


####Get last states
> GET /api/room/get-last-states/:roomId/:count

see: Get all states


####Get states from hash
> GET /api/room/get-states-from-hash/:roomId/:hash

see: Get all states


####Get all states
> GET /api/room/get-all-states/:roomId

Request: empty
Response: see schema - getStates
Socket: nothing


####Get all settings
> GET /api/room/get-all-settings/:roomId

Request: empty
Response: {{roomId: 'string', settings: 'any'}}
Socket: nothing


####Get setting
> GET /api/room/get-setting/:roomId/:key

Request: empty
Response: {{roomId: 'string', value: 'any'}}
Socket: nothing


####Set all settings
> POST /api/room/set-all-settings/:roomId

WARNING: remove previous settings
Request: <your-settings> ({key1: value1, key2: value2})
Response: {{roomId: 'string'}}
Socket: nothing


####Set one setting
> GET /api/room/set-setting/:roomId

Request: <your-settings> ({key: value})
Response: {{roomId: 'string'}}
Socket: nothing


Events:
### User disconnect
When user missed connect other users get message
Socket: see schema - userDisconnectedFromRoomMessage

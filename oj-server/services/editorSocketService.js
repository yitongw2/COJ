var redisClient = require('../module/redisClient');
const TIMEOUT_IN_SECONDS = 3600;

module.exports = function(io) {
    var sessionPath = '/temp_sessions';

    // collaboration sessions
    var collaborations = {};

    // map from socketId to sessionId
    var socketIdToSessionId = {};

    io.on('connection', (socket) => {
        let sessionId = socket.handshake.query['sessionId'];

        socketIdToSessionId[socket.id] = sessionId;

        // if (!(sessionId in collaborations)) {
        //     collaborations[sessionId] = {
        //         'participants': []
        //     };
        // }

        if (sessionId in collaborations) {
            collaborations[sessionId]['participants'].push(socket.id);

            let participants = collaborations[sessionId]['participants'];
            for (let i = 0; i < participants.length; i++) {
                io.to(participants[i]).emit("userchange", participants);
            }
        } else {
            // not in memory, check in redis
            redisClient.get(sessionPath + '/' + sessionId, function(data) {
                if (data) {
                    console.log("session terminated previously, get back from redis");

                    collaborations[sessionId] = {
                        'cachedInstructions': JSON.parse(data),
                        'participants': []
                    }
                } else {
                    console.log("creating new session");
                    collaborations[sessionId] = {
                        'cachedInstructions': [],
                        'participants': []
                    }
                }
                io.to(socket.id).emit("userchange", socket.id);
            })
        }

        // socket event listeners
        socket.on('change', delta => {
            console.log("change " + socketIdToSessionId[socket.id] + " " + delta);
            let sessionId = socketIdToSessionId[socket.id];
            if (sessionId in collaborations) {
                collaborations[sessionId]['cachedInstructions'].push(["change", delta, Date.now()]);
            }

            if (sessionId in collaborations) {
                let participants = collaborations[sessionId]['participants'];
                for (let i = 0; i < participants.length; i++) {
                    if (socket.id != participants[i]) {
                        io.to(participants[i]).emit("change", delta);
                    }
                }
            } else {
                console.log("could not tie socket id to any collaboration");
            }
        });

        socket.on('restoreBuffer', () => {
            let sessionId = socketIdToSessionId[socket.id];
            console.log("restore buffer for session" + sessionId, "socket id: " + socket.id);

            if (sessionId in collaborations) {
                let instructions = collaborations[sessionId]['cachedInstructions'];

                for (let i = 0; i < instructions.length; i++) {
                    socket.emit(instructions[i][0], instructions[i][1]);
                }
            } else {
                console.log("could not find any collcation for the session");
            }
        });

        socket.on('disconnect', function() {
            let sessionId = socketIdToSessionId[socket.id];
            console.log("disconnect session" + sessionId, "socket id: " + socket.id);

            let foundAndRemoved = false;

            if (sessionId in collaborations) {
                let participants = collaborations[sessionId]['participants'];

                let index = participants.indexOf(socket.id);

                if (index >= 0) {
                    participants.splice(index, 1);
                    foundAndRemoved = true;

                    if (participants.length == 0) {
                        console.log("last participant in collaboration, committing to redis and remove from memory");
                        let key = sessionPath + "/" + sessionId;
                        let value = JSON.stringify(collaborations[sessionId]['cachedInstructions']);

                        redisClient.set(key, value, redisClient.redisPrint);

                        redisClient.expire(key, TIMEOUT_IN_SECONDS);

                        delete collaborations[sessionId];
                    }
                }
                for (let i = 0; i < participants.length; i++) {
                    io.to(participants[i]).emit("userchange", participants);
                }
            }

            if(!foundAndRemoved) {
                console.log("warning: could not find the socket.id in collaboration");
            }
        })
    })
}

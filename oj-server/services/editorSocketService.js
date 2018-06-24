var redisClient=require('../modules/redisClient');
const TIMEOUT_IN_SECONDS=3600;

module.exports = function(io) {
  // redis session
  var sessionPath = '/session';

  // collaboration sessions
  var collaborations = {};

  // map from socketId to sessionId
  var socketIdToSessionId = {};

  // map from socketId to nickname
  var socketIdToNickname = {};

  io.on('connection', socket => {
    // session is problem id
    let sessionId = socket.handshake.query['sessionId'];
    let nickname = socket.handshake.query['nickname'];

    // map socket id to session id and nickname
    socketIdToSessionId[socket.id] = sessionId;
    socketIdToNickname[socket.id] = nickname;;

    if (sessionId in collaborations) {
      //log
      console.log('session exists');

      // add this user into participants
      collaborations[sessionId]['participants'].push(socket.id);
      let participants = collaborations[sessionId]['participants'];
      // get nicknames
      let names = participants.map(x => socketIdToNickname[x]);

      // boardcast to all active users
      for (let i = 0; i < participants.length; i++) {
        io.to(participants[i]).emit("userchange", names);
      }

      // log currently active users
      console.log(collaborations[sessionId]['participants']);
    } else {
      // check redis for previous session
      redisClient.get(sessionPath + '/' + sessionId, data => {
        if (data) {
          console.log('session in Redis cache');
          let buffer = JSON.parse(data);
          collaborations[sessionId] = {
            'history': buffer['history'],
            'lang': buffer['lang'],
            'participants': [socket.id]
          };
        } else {
          console.log("creating new session");
          collaborations[sessionId] = {
            'history': [],
            'lang': 'Java',
            'participants': [socket.id]
          }
        }
        // send userchange to the only user
        io.to(socket.id).emit("userchange", [nickname]);
      });
    }

    // restore session from redis
    socket.on('restoreBuffer', () => {
      let sessionId = socketIdToSessionId[socket.id];
      if (sessionId in collaborations) {
        let history = collaborations[sessionId]['history'];
        // emit the changes of the history to whoever requested it
        for (let i = 0; i < history.length; ++i) {
          socket.emit('change', history[i][0]);
        }
        // emit the lang to whoever requested it
        socket.emit('change-lang', collaborations[sessionId]['lang']);
      }
    });

    // disconnect
    socket.on('disconnect', () => {
      console.log('user disconnected');
      let sessionId = socketIdToSessionId[socket.id];
      if (sessionId in collaborations) {
        let participants = collaborations[sessionId]['participants'];
        let index = participants.indexOf(socket.id);

        if (index >= 0) {
          // delete the socket id from participants
          participants.splice(index, 1);
          if (participants.length == 0) {
            var key = sessionPath + '/' + sessionId;
            var val = {
              'history': collaborations[sessionId]['history'],
              'lang': collaborations[sessionId]['lang']
            };
            // store session into redis cache
            redisClient.set(key,
              JSON.stringify(val),
              redisClient.redisPrint);
            // set expire time
            redisClient.expire(key, TIMEOUT_IN_SECONDS);

            console.log('clear session in memory');
            // delete session from collaborations
            delete collaborations[sessionId];
            // delete socketId mapping to sessionId
            delete socketIdToSessionId[socket.id];
            // delete socketId mapping to Nickname
            delete socketIdToNickname[socket.id];
          }
        }

        let names = participants.map(x => socketIdToNickname[x]);
        // send user changes to all other users
        for (let i = 0; i < participants.length; i++) {
          io.to(participants[i]).emit("userchange", names);
        }
       // log
        console.log(socket.id + ' disconnect from [' + participants + ']')
      }
    });

    // change
    socket.on('change', delta => {
      // log
      console.log("change " + socketIdToSessionId[socket.id] + " " + delta);

      let sessionId = socketIdToSessionId[socket.id];
      // push this change to the history in memory
      collaborations[sessionId]['history'].push([delta, Date.now()]);

      if (sessionId in collaborations) {
        let participants = collaborations[sessionId]['participants'];
        // send content changes to all other users
        for (let i = 0; i < participants.length; i++) {
          if (socket.id != participants[i]) {
            io.to(participants[i]).emit("change", delta);
          }
        }
      }
    });

    // chang language
    socket.on('change-lang', lang => {
      console.log('change lang to ' + lang);
      let sessionId = socketIdToSessionId[socket.id];
      if (sessionId in collaborations) {
        collaborations[sessionId]['lang'] = lang;
        let participants = collaborations[sessionId]['participants'];
        // send lang change to all participants
        for (let i = 0; i < participants.length; i++) {
          if (socket.id != participants[i]) {
            io.to(participants[i]).emit("change-lang", lang);
          }
        }
      }
    });
  });
}

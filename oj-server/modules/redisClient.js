const redis = require('redis');

const client = redis.createClient('6379', 'redis');

const set = function(key, value, callback) {
  client.set(key, value, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    callback(res);
  });  
}

const get = function(key, callback) {
  client.get(key, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    callback(res);
  });
}

const expire = function(key, timeInSeconds) {
  client.expire(key, timeInSeconds);
}

const quit = function() {
  client.quit();
} 

module.exports = {
  get: get,
  set: set,
  expire: expire,
  quit: quit,
  redisPrint: redis.print
}

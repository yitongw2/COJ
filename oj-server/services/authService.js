// auth0
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const request = require('request');
const config = require('../config/auth0-config.json');

// We are going to implement a JWT middleware that will ensure the validity of our token. We'll require each protected route to have a valid access_token sent in the Authorization header
const authCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: config.JWKSURI
  }),
  audience: config.AUDIENCE,
  issuer: config.DOMAIN,
  algorithms: ['RS256']
});

const getAccessToken = function() {
  var options = { method: 'POST',
    url: config.TOKEN_URL,
    headers: { 'content-type': 'application/json' },
    body: {
      grant_type: 'client_credentials',
      client_id: 't-h5ghIxq-uUnGPMXmWIjgVPVDe5xgKN',
      client_secret: config.APP_SECRET,
      audience: config.AUDIENCE
    },
    json: true
  };

  request(options, (error, response, body) => {
    if (error)
      throw new Error(error);

    console.log(body);
  });
};

module.exports = {
  authCheck: authCheck,
  getAccessToken: getAccessToken
};

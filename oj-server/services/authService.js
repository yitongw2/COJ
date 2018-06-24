// auth0
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const request = require('request');

// We are going to implement a JWT middleware that will ensure the validity of our token. We'll require each protected route to have a valid access_token sent in the Authorization header
const authCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://yitongw2.auth0.com/.well-known/jwks.json"
  }),
  audience: process.env.AUDIENCE,
  issuer: "https://yitongw2.auth0.com/",
  algorithms: ['RS256']
});

const getAccessToken = function() {
  var options = { method: 'POST',
    url: 'https://yitongw2.auth0.com/oauth/token',
    headers: { 'content-type': 'application/json' },
    body: {
      grant_type: 'client_credentials',
      client_id: 't-h5ghIxq-uUnGPMXmWIjgVPVDe5xgKN',
      client_secret: process.env.APP_SECRET,
      audience: 'http://localhost:3000'
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

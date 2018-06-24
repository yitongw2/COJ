const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// declare executor server url
const EXECUTOR_SERVER_URL = "http://executor-server:5000/execution";

// create node restful api client
const nodeRestClient = require('node-rest-client').Client;
const restClient = new nodeRestClient();

// register client methods
restClient.registerMethod('execute', EXECUTOR_SERVER_URL, 'POST')

router.post('', jsonParser, (req, res) => {
  let data = {
    'code': req.body.code,
    'lang': req.body.lang,
  };

  let headers = {
    'Content-Type': 'application/json'
  };

  if (req.body.sessionId) {
    data['sessionId'] = req.body.sessionId;
  }

  restClient.methods.execute(
    {
      data: data,
      headers: headers
    },
    (data, response) => {
      res.json(data);
    }
  );
});

module.exports = router;

const express = require('express')
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()

const problemService = require('../services/problemService');
const authService= require('../services/authService');

router.get('/access-token', (req, res) => {
  authService.getAccessToken();
  res.send('hello');
});

router.get('/problems', (req, res) => {
  problemService.getProblems().then(problems => res.json(problems));
});

router.get('/problems/:id', (req, res) => {
  const id = req.params.id;
  problemService.getProblem(+id)
    .then(problem => {
      res.json(problem);
    },
    error => {
      res.status(400).send("Problem doesn't exists");
    });
});

router.post('/problems', jsonParser, (req, res) => {
  problemService.addProblem(req.body)
    .then(problem => {
      res.json(problem);
    },
    error => {
      res.status(400).send("Problem name already exists");
    });
});

router.put('/problems', authService.authCheck, jsonParser, (req, res) => {
  problemService.changeProblem(req.body)
    .then(problem => {
      res.json(problem);
    },
    error => {
      res.status(400).send('Problem name does not exist');
    });
});

module.exports = router;

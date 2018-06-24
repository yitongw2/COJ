const express = require('express');
const router = express.Router();

const searchService = require('../services/searchService');

router.get('', (req, res) => {
  searchService.searchProblems(req.query)
    .then(data => {
      res.json(data);
    },
    err => {
      res.status(404).send('cant search anything');
    });
});

module.exports = router;

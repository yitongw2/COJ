const ProblemModel = require('../models/problemModel');

const searchProblems = function(query) {
  console.log(query);
  let condition = {};
  if (query.name) {
    condition['name'] = query.name;
  }
  if (query.difficulty) {
    condition['difficulty'] = query.difficulty;
  }
  return new Promise((res, rej) => {
    ProblemModel.find(condition, (err, data) => {
      if (err) {
        rej(err);
      } else {
        res(data);
      }
    });
  });
};

module.exports = {
  searchProblems: searchProblems
};

const ProblemModel = require('../models/problemModel');

const searchProblems = function(query) {
  console.log(query);
  var conditions = {};
  if (query.id) 
    conditions['id'] = query.id;
  if (query.name)
    conditions['name'] = query.name;
  if (query.difficulty)
    conditions['difficulty'] = query.difficulty;

  return new Promise((resolve, reject) => {
    ProblemModel.find(conditions, (err, data) => {
        if (data) {
          resolve(data);
        } else {
          reject('Cant find anything');
        }
      });  
  });
};

module.exports = {
  searchProblems: searchProblems
};


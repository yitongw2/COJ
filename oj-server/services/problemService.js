const ProblemModel = require('../models/problemModel');

const getProblems = function() {
  // since we will store problems in database later // we need promise to handle asynchronous call 
  return new Promise((res, rej) => {
    ProblemModel.find({}, (err, data) => {
      if (err) {
        rej(err);
      } else {
        res(data);
      }
    });
  });
}

const getProblem = function(id) {
  return new Promise((res, rej) => {
    ProblemModel.findOne({id: id}, (err, data) => {
      if (err) {
        rej(err);
      } else {
        res(data);
      }
    });
  });
}

const addProblem = function(newProblem){
  return new Promise((res, rej) => {
    ProblemModel.findOne({name: newProblem.name}, (err, data) => {
      if (data) {
        rej("Problem name already exists");
      } else {
        ProblemModel.count({}, (err, data) =>{
          newProblem.id = data + 1;
          let problem = new ProblemModel(newProblem);
          problem.save();
          res(problem);
        });
      }
    });     
  });
}

const changeProblem = function(newProblem) {
  return new Promise((res, rej) => {
    ProblemModel.findOneAndUpdate({name: newProblem.name}
      , {'name': newProblem.name, 'desc': newProblem.desc, 'difficulty': newProblem.difficulty}
      , (err, data) => {
      if (err) {
        rej('Problem name does not exist');
      } else {
        res(data);
      }
    });
  });
}

module.exports = {
  getProblems: getProblems,
  getProblem: getProblem,
  addProblem: addProblem,
  changeProblem: changeProblem
};

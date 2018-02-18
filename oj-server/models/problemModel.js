const mongoose = require('mongoose');
const problemSchema = mongoose.Schema({
    id: Number,
    name: String,
    desc: String,
    difficulty: String
});

const ProblemModel = mongoose.model('ProblemModel', problemSchema);
module.exports = ProblemModel;
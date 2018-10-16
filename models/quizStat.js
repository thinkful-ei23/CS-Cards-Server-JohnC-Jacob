const mongoose = require('mongoose');

const quizStatSchema = new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId, ref:'User',required:true},
    recuringCorrect: {type: Number},
    totalQuestions :{type: Number},
    questions:{type:Array},
    quizStat: {type: Object}
});

quizStatSchema.set('toObject', {
    virtuals: true,     // include built-in virtual `id`
    versionKey: false,  // remove `__v` version key
    transform: (doc, ret) => {
        delete ret._id; // delete `_id`
    }
});

module.exports = mongoose.model('QuizStat', quizStatSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
var DateOnly = require('mongoose-dateonly')(mongoose);


var studentgradeSchema = new Schema({
    score:  {
        type: Number,
        min: 0,
        required: true
    },
    student:  {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'  
    }
}, {
    timestamps: true
});

const exerciseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    MaxGrade: {
        type: Number,
        default: 100
    },
    duedate: {
        type: Date
    },
    studentgrade:[studentgradeSchema]
}, {
    timestamps: true
});

var Exercises = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercises;
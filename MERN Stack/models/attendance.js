const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
var DateOnly = require('mongoose-dateonly')(mongoose);


var studentattendanceSchema = new Schema({
   
        absent: {
            type: Boolean
        },
        late: {
            type: Boolean
        },
        ontime: {
            type: Boolean
        },
   
    student:  {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'  
    }
}, {
    timestamps: true
});

const attendanceSchema = new Schema({
    classdate: {
        type: Date,
        default: Date.now
    },
    studentattendance:[studentattendanceSchema]
}, {
    timestamps: true
});

var Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
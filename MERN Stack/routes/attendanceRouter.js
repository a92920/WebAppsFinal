const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Attendance = require('../models/attendance');

const attendanceRouter = express.Router();

attendanceRouter.use(bodyParser.json());

attendanceRouter.route('/')
.get((req,res,next) => {
    Attendance.find({})
    .populate('studentattendance.student' )
    .then((attendance) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(attendance);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Attendance.create(req.body)
    .then((attendance) => {
        console.log('Attendance Created ', attendance);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(attendance);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /attendance');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Attendance.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

attendanceRouter.route('/:attendanceId')
.get((req,res,next) => {
    Attendance.findById(req.params.attendanceId)
    .populate('studentattendance.student' )
    .then((attendance) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(attendance);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /attendance/'+ req.params.attendanceId);
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Attendance.findByIdAndUpdate(req.params.attendanceId, {
        $set: req.body
    }, { new: true })
    .then((attendance) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(attendance);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Attendance.findByIdAndRemove(req.params.attendanceId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

attendanceRouter.route('/:attendanceId/alo')
.get((req,res,next) => {
    Attendance.findById(req.params.attendanceId)
    .populate('studentattendance.student')
    .then((attendance) => {
        if (attendance != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(attendance.studentattendance);
        }
        else {
            err = new Error('Attendance ' + req.params.attendanceId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Attendance.findById(req.params.attendanceId)
    .then((attendance) => {
        if (attendance != null) {
            req.body.student = req.user._id; 
            attendance.studentattendance.push(req.body);
            attendance.save()
            .then((attendance) => {
                Attendance.findById(attendance._id)
                    .populate('studentattendance.student')
                    .then((attendance) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(attendance);
                    })                
            }, (err) => next(err));
        }
        else {
            err = new Error('Attendance ' + req.params.attendanceId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /attendance/'
        + req.params.attendanceId + '/alo');     
})

.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
Attendance.findById(req.params.attendanceId)
.then((attendance) => {
    if (attendance != null) {
        for (var i = (attendance.studentattendance.length -1); i >= 0; i--) {
            attendance.studentattendance.id(attendance.studentattendance[i]._id).remove();
        }
        attendance.save()
        .then((attendance) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(attendance);                
        }, (err) => next(err));
    }
    else {
        err = new Error('Attendance ' + req.params.attendanceId + ' not found');
        err.status = 404;
        return next(err);
    }
}, (err) => next(err))
.catch((err) => next(err));    
});

attendanceRouter.route('/:attendanceId/alo/:aloId')
.get((req,res,next) => {
    Attendance.findById(req.params.attendanceId)
    .populate('studentattendance.student' )
    .then((attendance) => {
        if (attendance != null && attendance.studentattendance.id(req.params.aloId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(attendance.studentattendance.id(req.params.aloId));
        }
        else if (attendance == null) {
            err = new Error('Attendance ' + req.params.attendanceId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('ALO ' + req.params.aloId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /attendance/'+ req.params.attendanceId
        + '/alo/' + req.params.aloId);
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Attendance.findById(req.params.attendanceId)
    .then((attendance) => {
        if (attendance != null && attendance.studentattendance.id(req.params.aloId) != null 
        //&& attenndance.studentattendance.id(req.params.aloId).student.equals(req.user._id)
        ){
        if (req.body.absent) {
            attendance.studentattendance.id(req.params.aloId).absent = req.body.absent;
        }
        if (req.body.late) {
            attendance.studentattendance.id(req.params.aloId).late = req.body.late;
        }
        if (req.body.ontime) {
            attendance.studentattendance.id(req.params.aloId).ontime = req.body.ontime;
        }
        
        attendance.save()
        .then((attendance) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(attendance);                
        }, (err) => next(err));
    }
    else if (attendance == null) {
        err = new Error('attendances ' + req.params.attendanceId + ' not found');
        err.status = 404;
        return next(err);
    }
    else if (attendance.studentattendance.id(req.params.aloId) == null) {
        err = new Error('alo ' + req.params.aloId + ' not found');
        err.status = 404;
        return next(err);            
    }
    else {
        err = new Error('you are not authorized to update your ALO info!');
        err.status = 403;
        return next(err);  
    }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Attendance.findById(req.params.attendanceId)
    .then((attendance) => {
        if (attendance != null && attendance.studentattendance.id(req.params.aloId) != null
            && attendance.studentattendance.id(req.params.aloId).student.equals(req.user._id)) {
            attendance.studentattendance.id(req.params.aloId).remove();
            attendance.save()
            .then((attendance) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(attendance);                
            }, (err) => next(err));
        }
        else if (attendance == null) {
            err = new Error('Attendance ' + req.params.attendanceId + ' not found');
            err.status = 404;
            return next(err);
        }
        else if (attendance.studentattendance.id(req.params.aloId) == null) {
            err = new Error('ALO ' + req.params.aloId + ' not found');
            err.status = 404;
            return next(err);            
        }
        else {
            err = new Error('you are not authorized to delete this ALO info!');
            err.status = 403;
            return next(err);  
        }

    }, (err) => next(err))
    .catch((err) => next(err));
});
module.exports = attendanceRouter;

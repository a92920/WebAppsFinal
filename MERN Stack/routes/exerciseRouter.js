const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Exercises = require('../models/exercises');

const exerciseRouter = express.Router();

exerciseRouter.use(bodyParser.json());

exerciseRouter.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
    Exercises.find({})
    .populate('studentgrade.student' )
    .then((exercises) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(exercises);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Exercises.create(req.body)
    .then((exercise) => {
        console.log('Exercise created ', exercise);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(exercise);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /exercises');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Exercises.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

exerciseRouter.route('/:exerciseId')
.get(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    Exercises.findById(req.params.exerciseId)
    .populate('studentgrade.student' )
    .then((exercise) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(exercise);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /exercises/'+ req.params.exerciseId);
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Exercises.findByIdAndUpdate(req.params.exerciseId, {
        $set: req.body
    }, { new: true })
    .then((exercise) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(exercise);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Exercises.findByIdAndRemove(req.params.exerciseId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

exerciseRouter.route('/:exerciseId/grades')
.get(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    Exercises.findById(req.params.exerciseId)
    .populate('studentgrade.student')
    .then((exercise) => {
        if (exercise != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(exercise.studentgrade);
        }
        else {
            err = new Error('Exercise ' + req.params.exerciseId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Exercises.findById(req.params.exerciseId)
    .then((exercise) => {
        if (exercise != null) {
            req.body.student = req.body.user_id; 
            exercise.studentgrade.push(req.body);
            exercise.save()
            .then((exercise) => {
                Exercises.findById(exercise._id)
                    .populate('studentgrade.student')
                    .then((exercise) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(exercise);
                    })                
            }, (err) => next(err));
        }
        else {
            err = new Error('Exercise ' + req.params.exerciseId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /exercises/'
        + req.params.exerciseId + '/grades');     
})

.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
Exercises.findById(req.params.exerciseId)
.then((exercise) => {
    if (exercise != null) {
        for (var i = (exercise.studentgrade.length -1); i >= 0; i--) {
            exercise.studentgrade.id(exercise.studentgrade[i]._id).remove();
        }
        exercise.save()
        .then((exercise) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(exercise);                
        }, (err) => next(err));
    }
    else {
        err = new Error('Exercise ' + req.params.exerciseId + ' not found');
        err.status = 404;
        return next(err);
    }
}, (err) => next(err))
.catch((err) => next(err));    
});

exerciseRouter.route('/:exerciseId/grades/:gradeId')
.get(authenticate.verifyUser,(req,res,next) => {
    Exercises.findById(req.params.exerciseId)
    .populate('studentgrade.student' )
    .then((exercise) => {
        if (exercise != null && exercise.studentgrade.id(req.params.gradeId) != null
        && exercise.studentgrade.id(req.params.gradeId).student.equals(req.user._id)
        ) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(exercise.studentgrade.id(req.params.gradeId));
        }
        else if (exercise == null) {
            err = new Error('Exercise ' + req.params.exerciseId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('grade ' + req.params.gradeId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /exercises/'+ req.params.exerciseId
        + '/grades/' + req.params.gradeId);
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Exercises.findById(req.params.exerciseId)
    .then((exercise) => {
        if (exercise != null && exercise.studentgrade.id(req.params.gradeId) != null 
        //&& exercise.studentgrade.id(req.params.gradeId).student.equals(req.user._id)
        ){
        if (req.body.score) {
            exercise.studentgrade.id(req.params.gradeId).score = req.body.score;
        }
        
        exercise.save()
        .then((exercise) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(exercise);                
        }, (err) => next(err));
    }
    else if (exercise == null) {
        err = new Error('exercises ' + req.params.exerciseId + ' not found');
        err.status = 404;
        return next(err);
    }
    else if (exercise.studentgrade.id(req.params.gradeId) == null) {
        err = new Error('grades ' + req.params.gradeId + ' not found');
        err.status = 404;
        return next(err);            
    }
    else {
        err = new Error('you are not authorized to update this Grade!');
        err.status = 403;
        return next(err);  
    }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Exercises.findById(req.params.exerciseId)
    .then((exercise) => {
        if (exercise != null && exercise.studentgrade.id(req.params.gradeId) != null
           // && exercise.studentgrade.id(req.params.gradeId).student.equals(req.user._id)
           ) {
            exercise.studentgrade.id(req.params.gradeId).remove();
            exercise.save()
            .then((exercise) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(exercise);                
            }, (err) => next(err));
        }
        else if (exercise == null) {
            err = new Error('Exercise ' + req.params.exerciseId + ' not found');
            err.status = 404;
            return next(err);
        }
        else if (exercise.studentgrade.id(req.params.gradeId) == null) {
            err = new Error('Grade ' + req.params.gradeId + ' not found');
            err.status = 404;
            return next(err);            
        }
        else {
            err = new Error('you are not authorized to delete this Grade!');
            err.status = 403;
            return next(err);  
        }

    }, (err) => next(err))
    .catch((err) => next(err));
});
module.exports = exerciseRouter;

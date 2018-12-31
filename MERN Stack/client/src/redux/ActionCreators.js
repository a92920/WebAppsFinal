import * as ActionTypes from './ActionTypes';
import { exercises } from '../shared/exercises';
import { attendances } from '../shared/attendances';
import { baseUrl } from '../shared/baseUrl';

export const addgrade = (grade) => ({
    type: ActionTypes.ADD_grade,
    payload: grade
});

export const postgrade = (exerciseId, grade, studentname) => (dispatch) => {

    const newgrade = {
        exerciseId: exerciseId,
        grade: grade,
        studentname: studentname,
        
    };
    newgrade.date = new Date().toISOString();

    return fetch(baseUrl + 'grades', {
        method: "POST",
        body: JSON.stringify(newgrade),
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "same-origin"
        })
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
        error => {
            throw error;
        })
        .then(response => response.json())
        .then(response => dispatch(addgrade(response)))
        .catch(error =>  { console.log('Post grades', error.message);
            alert('Your grade could not be posted\nError: '+error.message); });
};

export const fetchexercises = () => (dispatch) => {
    dispatch(exercisesLoading(true));

    return fetch(baseUrl + 'exercises')
        .then(response => {
            if(response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(exercises => dispatch(addExercises(exercises)))
        .catch(error => dispatch(exercisesFailed(error.message)));
}

export const exercisesLoading = () => ({
    type: ActionTypes.exercises_LOADING
});

export const exercisesFailed = (errmess) => ({
    type: ActionTypes.exercises_FAILED,
    payload: errmess
});

export const addExercises = (exercises) => ({
    type: ActionTypes.ADD_exercises,
    payload: exercises
});

export const fetchgrades = () => (dispatch) => {
    return fetch(baseUrl + 'grades')
        .then(response => {
            if(response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(grades => dispatch(addgrades(grades)))
        .catch(error => dispatch(gradesFailed(error.message)));
};

export const gradesFailed = (errmess) => ({
    type: ActionTypes.grades_FAILED,
    payload: errmess
});

export const addgrades = (grades) => ({
    type: ActionTypes.ADD_grades,
    payload: grades
});


export const addalo = (alo) => ({
    type: ActionTypes.ADD_alo,
    payload: alo
});

export const postalo = (attendanceId, grade, studentname, alo) => (dispatch) => {

    const newalo = {
        attendanceId: attendanceId,
        grade: grade,
        studentname: studentname,
        alo: alo
    };
    newalo.date = new Date().toISOString();

    return fetch(baseUrl + 'alos', {
        method: "POST",
        body: JSON.stringify(newalo),
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "same-origin"
        })
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
        error => {
            throw error;
        })
        .then(response => response.json())
        .then(response => dispatch(addalo(response)))
        .catch(error =>  { console.log('Post alos', error.message);
            alert('Your alo could not be posted\nError: '+error.message); });
};

export const fetchattendances = () => (dispatch) => {
    dispatch(attendancesLoading(true));

    return fetch(baseUrl + 'attendances')
        .then(response => {
            if(response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(attendances => dispatch(addattendances(attendances)))
        .catch(error => dispatch(attendancesFailed(error.message)));
}

export const attendancesLoading = () => ({
    type: ActionTypes.attendances_LOADING
});

export const attendancesFailed = (errmess) => ({
    type: ActionTypes.attendances_FAILED,
    payload: errmess
});

export const addattendances = (attendances) => ({
    type: ActionTypes.ADD_attendances,
    payload: attendances
});

export const fetchalos = () => (dispatch) => {
    return fetch(baseUrl + 'alos')
        .then(response => {
            if(response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(alos => dispatch(addalos(alos)))
        .catch(error => dispatch(alosFailed(error.message)));
};

export const alosFailed = (errmess) => ({
    type: ActionTypes.alos_FAILED,
    payload: errmess
});

export const addalos = (alos) => ({
    type: ActionTypes.ADD_alos,
    payload: alos
});


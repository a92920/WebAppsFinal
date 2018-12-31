import * as ActionTypes from './ActionTypes';

export const Grades = (state = { errMess: null, grades:[]}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_GRADES:
            return {...state, errMess: null, grades: action.payload};

        case ActionTypes.GRADES_FAILED:
            return {...state, errMess: action.payload};

        case ActionTypes.ADD_GRADE:
            var grade = action.payload;
            return {...state, grades: state.grades.concat(grade)};

        default:
            return state;
            
    }
};


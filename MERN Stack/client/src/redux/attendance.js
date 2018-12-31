import * as ActionTypes from './ActionTypes';

export const Attendance = (state = {
    isLoading: true,
    errMess: null,
    attendance:[]}, action) => {

    switch (action.type) {

      case ActionTypes.ADD_ATTENDANCES:
        return {...state, isLoading: false, errMess: null, attendance: action.payload};
      case ActionTypes.ATTENDANCES_LOADING:
        return {...state, isLoading: true, errMess: null, attendance: []}
      case ActionTypes.ATTENDANCES_FAILED:
        return {...state, isLoading: false, errMess: action.payload};


        default:
            return state;
    }
};

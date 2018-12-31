import * as ActionTypes from './ActionTypes';

export const Alos = (state = { errMess: null, alos:[]}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_ALOS:
            return {...state, errMess: null, alos: action.payload};

        case ActionTypes.ALOS_FAILED:
            return {...state, errMess: action.payload};

        case ActionTypes.ADD_ALO:
            var alo = action.payload;
            return {...state, alos: state.alos.concat(alo)};

        default:
            return state;
            
    }
};


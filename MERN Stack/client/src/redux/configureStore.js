import {createStore, combineReducers, applyMiddleware } from 'redux';
import { createForms } from 'react-redux-form';
import { Exercises } from './exercises';
import { Grades } from './grades';
import { Alos } from './alos';
import { Attendance } from './attendance';

import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { InitialFeedback } from './forms';
import { Exercises } from './exercises';
import { Alos } from './alos';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            exercises: Exercises,
            grades: Grades,
            attendance: Attendance,
            alos: Alos,
            
            ...createForms({
                feedback: InitialFeedback
            })
            
        }),
        applyMiddleware(thunk, logger)
    );

    return store;
}

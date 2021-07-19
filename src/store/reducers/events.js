import * as actionTypes from '../actions/types';

const initialState = {
    
};

export const eventsReducer = (state = initialState, action) => {
    switch ( action.type ) {
        case actionTypes.ADD_EVENT: {
            return {...state }
        }
        default:
            return state;
    }
};
import * as actionTypes from '../actions/types';

const initialState = {
    
};

export const eventsReducer = (state = initialState, action) => {
    switch ( action.type ) {
        case actionTypes.ADD_EVENT: {
            return state[action.contractName] ? {...state, 
                [action.contractName] : {
                    ...state[action.contractName],
                    [action.eventName]: state[action.contractName][action.eventName] ? {
                        ...state[action.contractName][action.eventName],
                        events: [...state[action.contractName][action.eventName].events, action.eventObj]
                    } : {
                        events: [action.eventObj]
                    }
                }
            } : {
                ...state,
                [action.contractName] : {
                    [action.eventName]: {
                        events: [action.eventObj]
                    }
                }
            }
        }
        default:
            return state;
    }
};
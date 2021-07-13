import { unionBy } from 'lodash';
import * as actionTypes from '../actions/types';

const initialState = {
    positions: null,
    liquidities: null
};

const setData = (state, {view, data, isUpdate}) => {
    if(isUpdate) {
        const txExist = state[view]?.some((event)=> event.transactionHash === data.transactionHash);
        return txExist ? state : {
            ...state,
            [view]: [data, ...state[view] ?? []]
        }
    }

    if(state[view]) {
        return { 
            ...state,
            [view]: unionBy(state[view], data, 'transactionHash').sort((a, b) => (b.timestamp < a.timestamp) ? -1 : 1)
        }
    }

    return { 
        ...state,
        [view]: data
    }
}

export const walletReducer = (state = initialState, action) => {
    switch ( action.type ) {
        case actionTypes.SET_DATA: return setData(state, action)
        default:
            return state;
    }
};
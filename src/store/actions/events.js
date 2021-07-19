import * as actionTypes from '../actions/types';

export const addEvent = (contractName, eventName, eventObj) => ({
    type: actionTypes.ADD_EVENT,
    contractName, eventName, eventObj
});
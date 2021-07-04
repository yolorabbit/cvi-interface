import * as actionTypes from '../actions/types';

export const addAlert = ({id, eventName, alertType, message}) => ({
  type: actionTypes.ADD_ALERT,
  payload: {
    id,
    eventName,
    alertType,
    message,
  }
});

export const removeAlert = ({id = null}) => ({
  type: actionTypes.REMOVE_ALERT,
  payload: {
    id,
  }
});

export const setSelectNetwork = (selectedNetwork) => ({
  type: actionTypes.SET_SELECT_NETWORK, 
  selectedNetwork
});

export const setNetworkStatus = (status) => ({
  type: actionTypes.SET_NETWORK_STATUS, 
  status
});
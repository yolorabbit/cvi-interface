import * as actionTypes from '../actions/types';

export const setData = (view, data, isUpdate = false) => ({
  type: actionTypes.SET_DATA, view, data, isUpdate
});

export const setUnfulfilledRequests = (data, isUpdate = false) => ({
  type: actionTypes.SET_UNFULFILLED_REQUEST, data, isUpdate
});

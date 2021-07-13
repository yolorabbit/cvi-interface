import * as actionTypes from '../actions/types';

export const setData = (view, data, isUpdate = false) => ({
  type: actionTypes.SET_DATA, view, data, isUpdate
});

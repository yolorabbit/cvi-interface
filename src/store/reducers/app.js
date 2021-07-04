import { uniqueId } from 'lodash';
import { track } from 'shared/analytics';
import * as actionTypes from '../actions/types';
import { chainNames } from 'connectors';
import config from 'config/config';

const initialState = {
    alerts: [],
    selectedNetwork: chainNames[localStorage.getItem('selectedNetwork')] || chainNames.Ethereum,
    networkStatus: 'disconnected'
};

export const appReducer = (state = initialState, action) => {
    switch ( action.type ) {
        case actionTypes.ADD_ALERT: {
            if(action.payload.eventName)  {
                track(action.payload.eventName);
            }
            return {...state, alerts: [...state.alerts, {...action.payload, id: uniqueId(`${action.payload.id}-`)}]}
        }
        case actionTypes.REMOVE_ALERT: {
            return {...state, alerts: state.alerts.filter(alert => alert.id !== action.payload.id)};
        }
        case actionTypes.SET_SELECT_NETWORK: {
            if(!chainNames[action.selectedNetwork]) return state; 
            localStorage.setItem('selectedNetwork', action.selectedNetwork);
            return { ...state, selectedNetwork: action.selectedNetwork}
        }
        case actionTypes.SET_NETWORK_STATUS: {
            if(!config.networkStatuses[action.status]) return state;
            return { ...state, networkStatus: action.status}
        }
        default:
            return state;
    }
};
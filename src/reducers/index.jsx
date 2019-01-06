import { combineReducers } from 'redux';
import popups from './popups';

export default function(reducers) {
    return combineReducers({
        popups,
        ...reducers
    });
}

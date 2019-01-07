import { combineReducers } from 'redux';
import popups from './popups';
import { connectRouter } from 'connected-react-router';

export default function(reducers) {
    return combineReducers({
        popups,
        router: connectRouter(history),
        ...reducers
    });
}

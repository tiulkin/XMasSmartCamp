import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from 'reducers';
import thunk from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';

export default function configureStore(initialState, history) {
    let devtools;

    if (typeof window.__REDUX_DEVTOOLS_EXTENSION__ === 'function' && process.env.NODE_ENV === 'development') {
        devtools = compose(
            applyMiddleware(thunk, routerMiddleware(history)),
            window.__REDUX_DEVTOOLS_EXTENSION__({ maxAge: 5000 })
        );
    } else {
        devtools = applyMiddleware(thunk, routerMiddleware(history));
    }
    const store = createStore(connectRouter(history)(rootReducer({})), initialState, devtools);

    if (module.hot) {
        module.hot.accept('reducers', () => {
            const nextRootReducer = require('reducers');

            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}

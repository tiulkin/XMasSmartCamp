import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'connected-react-router';
import Main from './containers/Main';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { createBrowserHistory } from 'history';
import { BaseHREF } from 'constants/settings';

const history = createBrowserHistory({
    basename: BaseHREF
});

export const store = configureStore({}, history);

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Main />
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
);

/* eslint-disable react/no-multi-comp */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
// import MainPage from './MainPage.jsx';
// import SomePage1 from './SomePage1.jsx';
// import SomePage2 from './SomePage2.jsx';

import Loadable from 'react-loadable';
import ReactLoading from 'react-loading-overlay';

const MainPage = Loadable({
    loader: () => import(/* webpackChunkName: "MainPage"*/ './MainPage.jsx'),
    loading: ReactLoading
});

const SomePage1 = Loadable({
    loader: () => import(/* webpackChunkName: "SomePage1"*/ './SomePage1.jsx'),
    loading: ReactLoading
});
const SomePage2 = Loadable({
    loader: () => import(/* webpackChunkName: "SomePage2"*/ './SomePage2.jsx'),
    loading: ReactLoading
});

export default function getRoutes() {
    return (
        <Switch>
            <Route path='/' component={MainPage} exact />;
            <Route path='/page1' component={SomePage1} exact />;
            <Route path='/page2' component={SomePage2} exact />;
        </Switch>
    );
}

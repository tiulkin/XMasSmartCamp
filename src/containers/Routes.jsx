/* eslint-disable react/no-multi-comp */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import ReactLoading from 'react-loading';

const MainPage = Loadable({
    loader: () => import(/* webpackChunkName: "Application"*/ './MainPage.jsx'),
    loading: ReactLoading
});

const SomePage1 = Loadable({
    loader: () => import(/* webpackChunkName: "Application"*/ './SomePage1.jsx'),
    loading: ReactLoading
});
const SomePage2 = Loadable({
    loader: () => import(/* webpackChunkName: "Application"*/ './SomePage2.jsx'),
    loading: ReactLoading
});

export default function getRoutes() {
    return (
        <Switch>
            <Route path='/' component={MainPage} exact />;
            <Route path='/page1' component={SomePage1} exact />;
            <Route path='/page2' component={SomePage2} exact />;
            <Route path='/' component={MainPage} />;
        </Switch>
    );
}

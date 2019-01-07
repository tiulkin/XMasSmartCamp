import React from 'react';
import { withRouter } from 'react-router-dom';
import '../styles/app.styl';
import { hot } from 'react-hot-loader';

import getRoutes from './Routes';

class Main extends React.Component {
    render() {
        return <div id='wrapper'>{getRoutes()}</div>;
    }
}

export default hot(module)(withRouter(Main));

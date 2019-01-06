import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';
import { withRouter } from 'react-router-dom';
import '../styles/app.styl';

import getRoutes from './Routes';
import { openPopup } from 'actions/popups';
import { connectToStore } from 'shared/libs';

class Main extends React.Component {
    render() {
        return <div id='wrapper'>{getRoutes()}</div>;
    }
}

Main.propTypes = {
    user: PropTypes.object,
    global: PropTypes.object,
    device: PropTypes.object,
    location: PropTypes.object,
    actions: PropTypes.object
};

const Component = connectToStore({
    mapStateToProps: state => ({
        user: state.user,
        global: state.global,
        device: state.device
    }),
    actions: {
        openPopup
    },
    component: Main
});

export default hot(module)(withRouter(Component));

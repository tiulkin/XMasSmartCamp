import React from 'react';
import PropTypes from 'prop-types';

class Loader extends React.Component {
    componentDidMount() {
        document.getElementById('topLine').classList.remove('topLine-hide');
    }
    componentWillUnmount() {
        document.getElementById('topLine').classList.add('topLine-hide');
    }
    render() {
        return <div />;
    }
}

Loader.propTypes = {
    children: PropTypes.node
};
Loader.defaultProps = {};

export default Loader;

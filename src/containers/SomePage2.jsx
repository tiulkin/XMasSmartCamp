/* eslint-disable react/no-multi-comp */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
class SomePage1 extends Component {
    render() {
        return <div>test</div>;
    }
}

SomePage1.propTypes = {
    location: PropTypes.any
};

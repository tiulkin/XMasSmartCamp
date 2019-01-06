/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

class MainPage extends Component {
    render() {
        return (
            <div className='page'>
                <NavLink to='/'>
                    <h1>Страница 1</h1>
                </NavLink>
                <h2>версия 123</h2>
                <br />
                <br />
                <div className='row'>
                    <NavLink to='/page1' className='btn btn-theme col-xs-6'>
                        Страница 1
                    </NavLink>
                    <NavLink to='/page2' className='btn btn-success col-xs-6'>
                        Страница 2
                    </NavLink>
                </div>
            </div>
        );
    }
}
export default MainPage;
MainPage.propTypes = {
    location: PropTypes.any
};

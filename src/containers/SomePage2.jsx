/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import Switch from 'react-switch';
import cookie from 'react-cookies';

class MainPage extends Component {
    state = {
        freezeVersion: cookie.load('versionIsFrozen') === 'true'
    };
    handleChange = checked => {
        this.setState({ freezeVersion: checked });
        cookie.save('versionIsFrozen', checked);
    };
    render() {
        return (
            <div className='page'>
                <NavLink to='/'>
                    <h1>Страница 2</h1>
                </NavLink>
                <h2>версия {cookie.load('currentVersion')}</h2>
                <div style={{ display: 'flex', flexDirection: 'row', writingMode: 'horizontal-tb' }}>
                    <h3>заморозить версию</h3>
                    <Switch id='normal-switch' checked={this.state.freezeVersion} onChange={this.handleChange} />
                </div>
                <br />
                <br />
                <div className='row'>
                    <NavLink to='/page1' className='btn btn-theme col-xs-6'>
                        Страница 1
                    </NavLink>
                    <NavLink to='/' className='btn btn-success col-xs-6'>
                        Главная
                    </NavLink>
                </div>
            </div>
        );
    }
}
export default withRouter(MainPage);

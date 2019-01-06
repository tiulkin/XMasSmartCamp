import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './index.styl';
import { closePopup } from 'actions/popups';
import { connectToStore } from 'shared/libs';

function getActivePopup(list) {
    return list[list.length - 1];
}

export const popupsContainerId = 'popups-container';

class Popups extends PureComponent {
    state = {
        activePopup: getActivePopup(this.props.popups)
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        const newActivePopup = getActivePopup(nextProps.popups.list);

        if (newActivePopup !== prevState.activePopup) {
            return {
                activePopup: newActivePopup
            };
        }

        return null;
    }

    componentDidUpdate(prevProps) {
        const { list, scrollTop } = this.props.popups;
        const { list: oldList } = prevProps.popups;

        if (!list.length && oldList.length) window.scrollTo(0, scrollTop);
    }

    handleClose = e => {
        if (e.target !== this.popupsWrapper || this.state.activePopup.isLight) return;
        this.props.actions.closePopup();
    };

    render() {
        const { list, visible, scrollTop, oldModalActive } = this.props.popups;
        const available = list.length && visible;

        const styles = available
            ? {
                  position: 'fixed',
                  top: -scrollTop
              }
            : {
                  position: 'static',
                  top: 'auto'
              };

        const popups = list.map((item, index) => {
            const popupClasses = classNames(
                'popups-container__popup',
                item === this.state.activePopup && 'popups-container__popup--active'
            );

            return (
                <div key={item.id || index} className={popupClasses}>
                    <item.popup {...item.props} id={item.id} />
                </div>
            );
        });

        const classes = classNames(
            'popups-container',
            this.state.activePopup && this.state.activePopup.isLight && 'popups-container--light',
            !oldModalActive && 'popups-container--content-priority',
            this.state.activePopup && this.state.activePopup.globalClassName
        );

        return (
            <div className={classes} style={styles} id={popupsContainerId}>
                {this.props.children}
                {!!available && (
                    <div onClick={this.handleClose} className='popups-container__content' ref={el => (this.popupsWrapper = el)}>
                        {popups}
                    </div>
                )}
                <div id='modal' />
            </div>
        );
    }
}

Popups.propTypes = {
    children: PropTypes.any,
    popups: PropTypes.object,
    actions: PropTypes.object
};

export default connectToStore({
    mapStateToProps: state => ({
        popups: state.popups
    }),
    actions: { closePopup },
    component: Popups
});

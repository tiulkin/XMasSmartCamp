import POPUPS from 'constants/popups';

import { store } from '../Index';

function handleClosePopup(e) {
    if (e.keyCode === 27) store.dispatch(closePopup());
}

export function openPopup(popupData, replace) {
    const popups = store.getState().popups;
    const oldList = popups.list;

    function getId() {
        const id = (Math.random() * 1000).toFixed(0);

        return oldList.every(item => item.id !== id) ? id : getId();
    }

    const list = [
        ...oldList,
        {
            popup: popupData.popup,
            props: popupData.props || {},
            id: popupData.id || getId(),
            isLight: popupData.isLight,
            globalClassName: popupData.globalClassName,
            noClosable: !!popupData.noClosable,
            closeCallback: popupData.closeCallback
        }
    ];

    let scrollTop = popups.scrollTop;

    if (!oldList.length) {
        document.addEventListener('keyup', handleClosePopup);
        scrollTop = window.pageYOffset;
    }

    if (replace) list.splice(-2, 1);

    return dispatch => {
        dispatch({
            type: POPUPS.CHANGE_LIST,
            payload: {
                list,
                scrollTop
            }
        });
        dispatch(toggleOldModalActive(false));
    };
}

export function setOptions(id, options) {
    const list = store.getState().popups.list.map(item => {
        if (item.id === id) {
            return {
                ...item,
                ...options
            };
        }

        return item;
    });

    return {
        type: POPUPS.CHANGE_LIST,
        payload: { list }
    };
}

export function closePopup(id) {
    const { list } = store.getState().popups;
    let targetPopup = list[list.length - 1];
    let nextList = list.slice(0, list.length - 1);

    if (id) {
        nextList = list.filter(item => {
            if (item.id === id) {
                targetPopup = item;
                return false;
            }

            return true;
        });
    }

    if (!targetPopup.noClosable) {
        if (typeof targetPopup.closeCallback === 'function') targetPopup.closeCallback();
        if (!nextList.length) document.removeEventListener('keyup', handleClosePopup);
    }

    return {
        type: POPUPS.CHANGE_LIST,
        payload: {
            list: targetPopup.noClosable ? list : nextList
        }
    };
}

export function toggleOldModalActive(state) {
    return {
        type: POPUPS.OLD_MODAL_ACTIVE,
        payload: {
            state
        }
    };
}

export function toggleHiddingPopups(state) {
    return {
        type: POPUPS.TOGGLE_VISIBLE,
        payload: {
            state
        }
    };
}

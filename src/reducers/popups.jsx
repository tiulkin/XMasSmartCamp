import POPUPS from 'constants/popups';

const initialState = {
    list: [],
    scrollTop: 0,
    visible: true,
    oldModalActive: true
};

export default function popups(state = initialState, action = {}) {
    switch (action.type) {
        case POPUPS.CHANGE_LIST: {
            return {
                ...state,
                scrollTop: action.payload.scrollTop === undefined ? state.scrollTop : action.payload.scrollTop,
                list: action.payload.list
            };
        }

        case POPUPS.TOGGLE_VISIBLE: {
            return {
                ...state,
                visible: action.payload.state === undefined ? !state.visible : action.payload.state
            };
        }

        case POPUPS.OLD_MODAL_ACTIVE: {
            return {
                ...state,
                oldModalActive: action.payload.state
            };
        }

        default:
            return state;
    }
}

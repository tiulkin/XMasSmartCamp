/* eslint-disable no-param-reassign,no-nested-ternary */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cookie from 'react-cookies';
import moment from 'moment';

export function bindAll(_this, array) {
    for (let i = 0; i < array.length; i++) {
        _this[array[i]] = _this[array[i]].bind(_this);
    }
}
export function printr(arr, level = 0) {
    let printredtext = '';
    let levelpadding = '';

    for (let j = 0; j < level + 1; j++) levelpadding += '    ';
    if (typeof arr === 'object') {
        // eslint-disable-next-line guard-for-in
        for (const item in arr) {
            if (arr.hasOwnProperty(item)) {
                const value = arr[item];

                if (typeof value === 'object') {
                    printredtext += `${levelpadding}'${item}' :\n`;
                    printredtext += printr(value, level + 1);
                } else {
                    printredtext += `${levelpadding}'${item}' => "${value}"\n`;
                }
            }
        }
    } else printredtext = `===>${arr}<===(${typeof arr})`;
    return printredtext;
}
export function u(check) {
    return !(typeof check === 'undefined');
}

export function uString(check) {
    return u(check) ? check : '';
}

export function getOffsetRect(elem) {
    const box = elem.getBoundingClientRect();

    const body = document.body;
    const docElem = document.documentElement;

    const scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    const scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

    const clientTop = docElem.clientTop || body.clientTop || 0;
    const clientLeft = docElem.clientLeft || body.clientLeft || 0;

    const top = Math.round(box.top + scrollTop - clientTop);
    const left = Math.round(box.left + scrollLeft - clientLeft);

    return { top, left };
}
export function isEmpty(object) {
    for (const prop in object) {
        if (object.hasOwnProperty(prop)) return false;
    }
    return true;
}

export function consoleColor(val, color) {
    switch (color) {
        case 'error':
            return [`%c${val}`, 'background:#f00;color: #fff;border-radius: 5px;padding: 2px 5px;'];
        case 'success':
            return [`%c${val}`, 'background:#0f0;color: #fff;border-radius: 5px;padding: 2px 5px;'];
        default:
            return '';
    }
}
export function isEmailAdress(str) {
    const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;

    return pattern.test(str);
}

export function consoleColor2(color, ...args) {
    switch (color) {
        case 'error':
            console.log(`%c${args[0]}`, 'background:#f00;color: #fff;border-radius: 5px;padding: 2px 5px;', ...args);
            break;
        case 'success':
            console.log(`%c${args[0]}`, 'background:#0f0;color: #fff;border-radius: 5px;padding: 2px 5px;', ...args);
            break;
        default:
            console.log(typeof args, args);
    }
}

export function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function toCaseCount(number, numberCase = 0) {
    const titles = [['', 'у'][numberCase], 'а', 'ов'];
    const cases = [2, 0, 1, 1, 1, 2];
    const roundedNumber = Math.ceil(number);

    return titles[roundedNumber % 100 > 4 && roundedNumber % 100 < 20 ? 2 : cases[Math.min(roundedNumber % 10, 5)]];
}

export function arrayToObject(array, keyField) {
    return array.reduce((obj, item) => {
        obj[item[keyField]] = item;
        return obj;
    }, {});
}

export function connectToStore({ mapStateToProps = null, actions = {}, component }) {
    function mapDispatchToProps(dispatch) {
        return {
            actions: bindActionCreators(actions, dispatch)
        };
    }

    if (!component)
        return WComponent =>
            connect(
                mapStateToProps,
                mapDispatchToProps
            )(WComponent);

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(component);
}

export function sortAsInt(a, b) {
    return a === b ? 0 : parseInt(a, 10) > parseInt(b, 10) ? 1 : -1;
}

export function getLeadZero(a) {
    return parseInt(a, 10) < 10 ? '0' : '';
}

export function TConsole(name = '', toggle = true) {
    this.moduleName = '';
    this.toggle = toggle;
    if (name !== '') {
        this.moduleName = name;
    }
    this.log = (...args) => {
        if (this.toggle) {
            console.log(
                ...(this.moduleName !== ''
                    ? [`%c${this.moduleName}`, 'background:#0f0;color: #fff;border-radius: 5px;padding: 2px 5px;']
                    : []),
                ...args
            );
        }
    };
    this.error = (...args) => {
        if (this.toggle) {
            console.error(
                ...(this.moduleName !== ''
                    ? [`%c${this.moduleName}`, 'background:#f00;color: #fff;border-radius: 5px;padding: 2px 5px;']
                    : []),
                ...args
            );
        }
    };
    this.info = (...args) => {
        if (this.toggle) {
            console.info(
                ...(this.moduleName !== ''
                    ? [`%c${this.moduleName}`, 'background:#00f;color: #fff;border-radius: 5px;padding: 2px 5px;']
                    : []),
                ...args
            );
        }
    };
}

// saves or refreshes if exists
export function changeCookie(cookieName, value = null, lifetime = 28) {
    if (!cookieName) return null;
    const cookieValue = value ? value : cookie.load(cookieName);

    if (cookieValue) {
        cookie.save(cookieName, cookieValue, { path: '/', expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * lifetime) });
    }
    return cookieValue;
}

export function arrayEqual(a, b) {
    return a.length === b.length
        ? a.every((el, i) => {
              return el === b[i];
          }, b)
        : false;
}

export function array2object(array) {
    const newArray = array;

    return newArray.reduce((acc, cur, i) => {
        const currentAcc = acc;

        currentAcc[i] = cur;
        return acc;
    }, {});
}

export function getTimezone() {
    return moment()
        .format('Z')
        .replace(':', '');
}

export function formatTimeSpan(timeSpan) {
    if (timeSpan < 0) {
        return '00:00:00';
    }
    let hours = Math.floor((timeSpan % (1000 * 60 * 60 * 60)) / (1000 * 60 * 60));
    let minutes = Math.floor((timeSpan % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeSpan % (1000 * 60)) / 1000);

    if (seconds < 10) {
        seconds = '0'.concat(seconds);
    }
    if (minutes < 10) {
        minutes = '0'.concat(minutes);
    }
    if (hours < 10) {
        hours = '0'.concat(hours);
    }
    return hours.toString().concat(':', minutes, ':', seconds);
}

export function deepHasOwn(object, ...args) {
    const property = args.shift();

    if (args.length > 0 && object.hasOwnProperty(property)) {
        return deepHasOwn(object[property], ...args);
    }
    return object.hasOwnProperty(property);
}

import axios from 'axios';
import { BaseHREF } from './constants/settings';

const loadBuild = () => {
    axios({
        method: 'GET',
        url: `${BaseHREF}builds.json?${Math.random()}`
    }).then(buildRes => {
        if (buildRes.status === 200) {
            const script = document.createElement('script');
            const css = document.createElement('link');

            script.onload = () => {
                alert('loaded');
            };
            script.src = `${BaseHREF}${buildRes.data[0].entryPointJS}`;
            css.href = `${BaseHREF}${buildRes.data[0].entryPointCSS}`;

            document.body.appendChild(script);
        }
    });
};
loadBuild();

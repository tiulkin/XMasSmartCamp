import axios from 'axios';
import { BaseHREF } from './constants/settings';
import cookie from 'react-cookies';
import { changeCookie } from './shared/libs';

const loadVersion = build => {
    build.entryPointsJS.forEach(fileName => {
        const script = document.createElement('script');

        script.src = `${BaseHREF}${fileName}`;
        document.head.appendChild(script);
    });
    build.entryPointsCSS.forEach(fileName => {
        const css = document.createElement('link');

        css.setAttribute('rel', 'stylesheet');
        css.setAttribute('href', `${BaseHREF}${fileName}`);
        document.head.appendChild(css);
    });
};

const loadBuild = (currentVersion, versionIsFrozen) => {
    axios({
        method: 'GET',
        url: `${BaseHREF}builds.json?${Math.random()}`
    }).then(buildRes => {
        if (buildRes.status === 200) {
            if (currentVersion && versionIsFrozen) {
                const buildData = buildRes.data.filter(build1 => build1.version === currentVersion && !build1.disabled);

                if (buildData && buildData[0]) loadVersion(buildData[0]);
            } else {
                const buildData = buildRes.data.filter(build2 => !build2.disabled);

                if (buildData) {
                    const build3 = buildData[buildData.length - 1];

                    loadVersion(build3);
                    changeCookie('currentVersion', build3.version);
                    changeCookie('versionIsFrozen', false);
                }
            }
        }
    });
};
const currentVersion = cookie.load('currentVersion');
const versionIsFrozen = cookie.load('versionIsFrozen') === 'true';

loadBuild(currentVersion, versionIsFrozen);

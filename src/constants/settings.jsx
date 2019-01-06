import VersionJSON from './version.json';

const API = {
    VERSION: process.env.APIVersion !== void 0 ? process.env.APIVersion : VersionJSON.version_api
};

export const BaseHREF = process.env.BaseHREF;

export default API;

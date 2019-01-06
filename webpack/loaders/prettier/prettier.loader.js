const prettier = require('prettier');
// const loaderUtils = require('loader-utils');
const fs = require('fs');
const path = require('path');
const configResolve = path.resolve('.prettierrc');

function prettierLoader(source, map) {
    const callback = this.async();

    this.cacheable();
    prettier.resolveConfig(configResolve).then(options => {
        const prettierSource = prettier.format(source, {
            ...options,
            parser: 'babylon'
        });

        if (prettierSource !== source) {
            fs.writeFile(this.resourcePath, prettierSource, error => {
                if (error) return callback(error);
                return callback(null, prettierSource, map);
            });
        } else {
            return callback(null, prettierSource, map);
        }
    });
}

module.exports = prettierLoader;

const postcss = require('postcss');

const urlRe = /(url\([',"]?)(.*?\))/g;

module.exports = postcss.plugin('postcss-baseurl', opts => {
    console.log('postcss-baseurl');
    const { base } = opts || {};
    const callback = rule => {
        rule.walkDecls(decl => {
            const value = decl.value;

            if (value.indexOf('url(') !== -1) {
                const ms = value.match(urlRe);

                if (ms === null) return;
                decl.value = value.replace(urlRe, `$1${base}$2`);
            }
        });
    };

    return root => {
        if (!base) return;
        root.walkRules(callback);
        root.walkAtRules('font-face', callback);
    };
});

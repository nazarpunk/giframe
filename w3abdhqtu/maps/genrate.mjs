import fs from 'fs';

/**
 * @param {string} name
 * @param {string[]} singleline
 */
const gen = (name, singleline) => {
    let common = fs
        .readFileSync(`${name}/common.txt`, {encoding: 'utf8'})
        .replace(/constant\s+[a-z]+\s+[A-Z]+_[A-Z]+_/g, '');

    common += '\n' + fs
        .readFileSync(`${name}/common_add.txt`, {encoding: 'utf8'});

    let out = '';

    for (const match of common.matchAll(/([a-z_0-9]+)\s+=\s+([a-z_0-9]+)\('([a-z_0-9]+)'\)/gi)) {
        const [, name, type, id] = match;
        let t, ts = '', l = '', ls = '', ss = '';

        const single = singleline.indexOf(id) >= 0;

        console.log(id, single);

        if (type.indexOf('Integer') > 0) {
            t = 0;
            ts = ', integer';
        }
        if (type.indexOf('Boolean') > 0) {
            t = 0;
            ts = ', boolean';
        }
        if (type.indexOf('Real') > 0) {
            t = 1;
            ts = ', real';
        }
        if (single || type.indexOf('String') > 0) {
            t = 3;
            ts = ', string';
            if (single) ss = ', singleline: true';
        }

        if (type.indexOf('LevelField') > 0) {
            l = ', level: true';
            ls = ', multilevel';
        }

        out += `${id} : {type: ${t}, name: '${name}${ts}${ls}'${l}${ss} },\n`;
    }

    out = `/** @type {Object.<string, W3ABDHQTUTOMLMapProperty>} */\nconst map = \{\n${out}\n\};\nexport default map;`;
    fs.writeFileSync(`${name}/${name.toUpperCase()}TOMLMap.mjs`, out, {flag: 'w+'});

};

gen('w3a', ['arac', 'areq', 'arqa', 'aoro', 'aorf', 'aoru', 'aord', 'Ncl6', 'abuf', 'aeff', 'atar']);




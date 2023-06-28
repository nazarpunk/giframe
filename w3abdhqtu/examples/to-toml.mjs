import fs from 'fs';
import {W3A} from '../W3A.mjs';
import {W3B} from '../W3B.mjs';
import {W3D} from '../W3D.mjs';
import {W3U} from '../W3U.mjs';

const convert = (name, dir) => {
    const file = fs.readFileSync(`${dir}/${name}.${dir}`);

    /** @type {W3A|W3B|W3D|W3U} */
    let w3;
    switch (dir) {
        case 'w3a':
            w3 = new W3A(file);
            break;
        case 'w3b':
            w3 = new W3B(file);
            break;
        case 'w3d':
            w3 = new W3D(file);
            break;
        case 'w3u':
            w3 = new W3U(file);
            break;
        default:
            throw new Error(`Missing converter: ${dir}`);
    }
    w3.read();

    if (w3.errors.length) {
        console.log('⚠️', w3.errors);
    } else {
        fs.writeFileSync(`${dir}/${name}.toml`, w3.toTOML(), {flag: 'w+'});
    }
};

convert('wa', 'w3a');

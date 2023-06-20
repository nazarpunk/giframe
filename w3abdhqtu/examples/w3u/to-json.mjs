import fs from 'fs';
import {W3U} from '../../W3U.mjs';

const name = [
    'war3map8.w3u',
    'war3map.w3u',
][0];

const w3a = new W3U(fs.readFileSync(name));
w3a.read();

console.log('🏁 W3U: start');

if (w3a.errors.length) {
    console.log('⚠️', w3a.errors);
} else {
    console.log('🏆 W3U`: end');
    const f2 = `${name}.json`;
    fs.writeFileSync(f2, JSON.stringify(w3a, null, 2), {flag: 'w+'});
}
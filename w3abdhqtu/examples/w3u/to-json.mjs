import fs from 'fs';
import {W3U} from '../../W3U.mjs';

const ext = 'w3u';
const name = [
    'wa',
][0];

const w3u = new W3U(fs.readFileSync(`${name}.${ext}`));
w3u.read();

console.log('🏁 W3U: start');

if (w3u.errors.length) {
    console.log('⚠️', w3u.errors);
} else {
    console.log('🏆 W3U`: end');
    fs.writeFileSync(`${name}.json`, JSON.stringify(w3u, null, 2), {flag: 'w+'});
}
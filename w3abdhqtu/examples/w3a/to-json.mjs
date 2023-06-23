import fs from 'fs';
import {W3A} from '../../W3A.mjs';

const name = [
    'wa.w3a',
    'war3map.w3a',
][0];

const w3a = new W3A(fs.readFileSync(name));
w3a.read();

console.log('🏁 W3A: start');

if (w3a.errors.length) {
    console.log('⚠️', w3a.errors);
} else {
    console.log('🏆 W3A`: end');
    const f2 = `${name}.json`;
    fs.writeFileSync(f2, JSON.stringify(w3a, null, 2), {flag: 'w+'});
}
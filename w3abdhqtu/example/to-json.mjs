import fs from 'fs';
import {W3ABDHQTU} from '../W3ABDHQTU.mjs';
import path from 'path';

const name = [
    'millenium.w3a',
    'war3map.w3b',
    'war3map.w3a',

][0];

const adq = ['.w3a', '.w3d', '.w3q'].indexOf(path.extname(name)) >= 0;

const w3a = new W3ABDHQTU(fs.readFileSync(name), adq);
w3a.read();

console.log('🏁 Read: start');

if (w3a.errors.length) {
    console.log('⚠️', w3a.errors);
} else {
    console.log('🏆 Read: end');
    const f2 = `${name}.json`;
    fs.writeFileSync(f2, JSON.stringify(w3a, null, 2), {flag: 'w+'});
}
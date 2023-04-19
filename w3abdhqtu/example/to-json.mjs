import fs from 'fs';
import {W3ABDHQTU} from '../W3ABDHQTU.mjs';
import path from 'path';

let name;

name = 'war3map.w3a';
name = 'war3map.w3b';

const adq = ['.w3a', '.w3d', '.w3q'].indexOf(path.extname(name)) >= 0;

const data = fs.readFileSync(name);
const buffer = new ArrayBuffer(data.length);
data.copy(new Uint8Array(buffer));

const w3a = new W3ABDHQTU(buffer, adq);
w3a.read();

console.log('🏁 Read: start');

if (w3a.errors.length) {
    console.log('⚠️', w3a.errors);
} else {
    console.log('🏆 Read: end');
    const f2 = `${name}.json`;
    fs.writeFileSync(f2, JSON.stringify(w3a, null, 2), {flag: 'w+'});
}
import fs from 'fs';
import {W3ABDHQTU} from '../W3ABDHQTU.mjs';

let name;

name = 'war3map.w3a';


const data = fs.readFileSync(name);
const buffer = new ArrayBuffer(data.length);
data.copy(new Uint8Array(buffer));

const w3a = new W3ABDHQTU(buffer, true);
w3a.read();

console.log('🍀 Read Start');
//console.log(JSON.stringify(w3a, null, 4));

if (w3a.errors.length) {
    console.log('⚠️', w3a.errors);
} else {
    const f2 = `${name}.json`;
    fs.writeFileSync(f2, JSON.stringify(w3a, null, 2), {flag: 'w+'});
}


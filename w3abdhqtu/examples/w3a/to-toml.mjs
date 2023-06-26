import fs from 'fs';
import {W3A} from '../../W3A.mjs';

const ext = 'w3a';
const name = [
    'wa',
    'wa.test',
][0];

const w3a = new W3A(fs.readFileSync(`${name}.${ext}`));
w3a.read();

console.log('🏁 W3A: start');

if (w3a.errors.length) {
    console.log('⚠️', w3a.errors);
} else {
    fs.writeFileSync(`${name}.toml`, w3a.toTOML(), {flag: 'w+'});
    console.log('🏆 W3A: end');
}
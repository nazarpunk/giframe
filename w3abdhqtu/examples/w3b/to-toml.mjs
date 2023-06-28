import fs from 'fs';
import {W3B} from '../../W3B.mjs';

const ext = 'w3b';
const name = [
    'wa',
][0];

const w3b = new W3B(fs.readFileSync(`${name}.${ext}`));
w3b.read();

if (w3b.errors.length) {
    console.log('⚠️', w3b.errors);
} else {
    fs.writeFileSync(`${name}.toml`, w3b.toTOML(), {flag: 'w+'});
}
import fs from 'fs';
import {WTS} from '../../WTS.mjs';

const jName = 'all.j';
const wtsName = 'main.wts';

const wts = new WTS(fs.readFileSync(wtsName).toString());
console.log('🏁 Read: start');
wts.read();

let j = fs.readFileSync(jName).toString();

if (wts.errors.length) {
    console.log('⚠️', wts.errors);
} else {
    console.log('🏆 Read: end');
    for (const s of wts.strings) {
        const text = s.text.replaceAll('\n', '|n').replaceAll('"', '').trim();
        j = j.replaceAll(`"TRIGSTR_${s.line}"`, `"${text}"`);
    }
    fs.writeFileSync(jName, j, {flag: 'w+'});
}
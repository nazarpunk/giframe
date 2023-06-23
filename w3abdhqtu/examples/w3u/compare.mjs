import * as fs from 'fs';
import {W3U} from '../../W3U.mjs';
import vbindiff from '../../../utils/vbindiff.mjs';

const ext = 'w3u';
const name = [
    'war3map',
    'bundle',
][0];

const f1 = `${name}.${ext}`;

console.log(`🏁 ${ext}: start`);
const w3i = new W3U(fs.readFileSync(f1));
w3i.read();
if (w3i.errors.length) {
    console.log('⚠️', w3i.errors);
} else {
    console.log(`🏆 ${ext}: read end`);

    const b = w3i.write();
    console.log(`🏆 ${ext}: write end`);

    const f2 = `${name}.test.${ext}`;
    fs.writeFileSync(f2, Buffer.from(b), {flag: 'w+'});

    vbindiff(f1, f2);
}
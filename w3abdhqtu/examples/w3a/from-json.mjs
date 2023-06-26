import fs from 'fs';
import vbindiff from '../../../utils/vbindiff.mjs';
import {W3A} from '../../W3A.mjs';

const ext = 'w3a';
const name = [
    'wa',
][0];

const w3a = W3A.fromJSON(fs.readFileSync(`${name}.json`, {encoding: 'utf8'}));

const f2 = `${name}.test.${ext}`;
fs.writeFileSync(f2, Buffer.from(w3a.write()), {flag: 'w+'});

vbindiff(`${name}.${ext}`, f2);
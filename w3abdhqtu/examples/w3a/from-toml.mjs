import fs from 'fs';
import vbindiff from '../../../utils/vbindiff.mjs';
import {W3A} from '../../W3A.mjs';

const ext = 'w3a';
const name = [
    'wa',
    'wa.test',
][0];

const w3a = W3A.fromTOML(fs.readFileSync(`${name}.${ext}.toml`, {encoding: 'utf8'}));
const b = w3a.write();

const f2 = `${name}.test.${ext}`;
fs.writeFileSync(f2, Buffer.from(b), {flag: 'w+'});

vbindiff(`${name}.${ext}`, f2);
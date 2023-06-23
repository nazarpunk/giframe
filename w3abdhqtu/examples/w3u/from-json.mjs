import fs from 'fs';
import {W3U} from '../../W3U.mjs';
import vbindiff from '../../../utils/vbindiff.mjs';

const ext = 'w3u';
const name = [
    'war3map',
    'skin',
][0];

const w3u = W3U.fromJSON(fs.readFileSync(`${name}.${ext}.json`, {encoding: 'utf8'}));
const b = w3u.write();

const f1 = `${name}.${ext}`;
const f2 = `${name}.test.${ext}`;
fs.writeFileSync(f2, '', {flag: 'w+'});
fs.appendFileSync(f2, Buffer.from(b));

vbindiff(f1, f2);
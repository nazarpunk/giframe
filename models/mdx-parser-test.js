import * as fs from 'fs';
import {MDX} from '../mdx/MDX.mjs';
import * as chip from 'child_process';

const names = [
    'VKbrute',
    'heroarchmage_ref',
    'Arthas_portrait',
    'sprite',
    'DNCAshenValeTerrain',
    'BlackDragon',
    'BlackDragon_Portrait',
    'candelabra_01.MESH',
    'heroarchmage',
    'HumanMale',
    'heroarchmage_hd',
    'knight',
    'Footman',
];

const name = names[0];
const f1 = `${name}.mdx`;
const buffer = fs.readFileSync(f1).buffer;

const model = new MDX(buffer);
model.read();
console.log('Read End!');
const b = model.write();
console.log('Write End!');

const f2 = `${name}_test.mdx`;
fs.writeFileSync(f2, '', {flag: 'w+'});
fs.appendFileSync(f2, Buffer.from(b));

const cwd = process.cwd();

if (1)
    chip.exec(
        `osascript -e 'activate application "Terminal"' -e 'tell app "Terminal"
    do script "vbindiff ${cwd}/${f1} ${cwd}/${f2}"
end tell'`,
    );

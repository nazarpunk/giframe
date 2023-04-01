import * as path from 'path';
import * as fs from 'fs';

const DIR = 'models/test';
const MOVE = true;
const TEMP = 'models/temp';
const EXCLUDE = [
    'ex',
    'ex.blp',
];

const getAllFiles = dir =>
    fs.readdirSync(dir).reduce((files, file) => {
        const name = path.join(dir, file);
        const isDirectory = fs.statSync(name).isDirectory();
        return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name];
    }, []);

const models = getAllFiles(DIR).filter(f => path.extname(f) === '.mdx');

const map = new Map();

for (const file of models) {
    console.log(`Read file: ${file}`);
    const data = fs.readFileSync(file);
    const buffer = new ArrayBuffer(data.length);
    data.copy(new Uint8Array(buffer));
    const view = new DataView(buffer);

    let byteOffset = 4;
    while (byteOffset < view.byteLength) {
        const key = view.getUint32(byteOffset, true);
        const byteLength = view.getUint32(byteOffset += 4, true);
        byteOffset += 4;
        if (key === 0x53584554) {
            const end = byteOffset + byteLength;
            for (let i = byteOffset; i < end; i += 268) {
                const s = [];
                for (let k = 4; k < 264; k++) {
                    s.push(String.fromCharCode(view.getUint8(i + k)));
                }
                for (let j = s.length - 1; j >= 0; j--) {
                    if (s[j] !== '\x00') break;
                    s.length -= 1;
                }
                if (s.length === 0) continue;

                const p = path.join(DIR, s.join('').toLowerCase().replace('\\', path.sep));
                map.set(p, true);
            }
            break;
        }
        byteOffset += byteLength;
    }
}

const textures = getAllFiles(DIR).filter(f => ['.blp', '.dds'].indexOf(path.extname(f)) >= 0);

console.log(EXCLUDE);

const folders = [];

for (const e of EXCLUDE) {
    const p = path.join(DIR, e);

    if (path.extname(p).length === 0) {
        folders.push(`${p}${path.sep}`);
    } else {
        map.set(p, true);
    }

}

loop:
    for (const t of textures) {
        if (map.has(t)) continue;

        for (const f of folders) {
            console.log(t, f);
            if (t.startsWith(f)) continue loop;
        }

        if (MOVE) {
            console.log(`Move: ${t}`);
            const name = t.startsWith(DIR) ? t.slice(DIR.length) : t;
            const p = path.join(TEMP, name);
            fs.mkdirSync(path.dirname(p), {recursive: true});
            fs.renameSync(t, p);
        } else {
            console.log(`Found: ${t}`);
        }
    }

import * as fs from 'fs';
import {MDX} from "../mdx/MDX.mjs";
import * as cp from 'child_process';

const f1 = 'sprite.mdx';
const buffer = fs.readFileSync(f1);

const arrayBuffer = new ArrayBuffer(buffer.length);
const view = new Uint8Array(arrayBuffer);
for (let i = 0; i < buffer.length; ++i) {
	view[i] = buffer[i];
}

const model = new MDX(arrayBuffer);

const ab = model.toArrayBuffer();

const f2 = 'sprite_test.mdx';
fs.writeFileSync(f2, '', {flag: 'w+'});
fs.appendFileSync(f2, Buffer.from(ab));

const cwd = process.cwd();

cp.exec(
	`osascript -e 'activate application "Terminal"' -e 'tell app "Terminal"
    do script "vbindiff ${cwd}/${f1} ${cwd}/${f2}"
end tell'`);
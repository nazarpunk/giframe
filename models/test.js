import * as fs from 'fs';
import {MDX} from "../mdx/MDX.mjs";
import * as cp from 'child_process';

const f1 = 'sprite.mdx';
const ba = fs.readFileSync(f1);

const arrayBuffer = new ArrayBuffer(ba.length);
const view = new Uint8Array(arrayBuffer);
for (let i = 0; i < ba.length; ++i) {
	view[i] = ba[i];
}

const model = new MDX(arrayBuffer);

let bb;
try {
	bb = model.write();
} catch (e) {
	console.log(e);
}


const f2 = 'sprite_test.mdx';
fs.writeFileSync(f2, '', {flag: 'w+'});
fs.appendFileSync(f2, Buffer.from(bb));

const cwd = process.cwd();

if (0) cp.exec(
	`osascript -e 'activate application "Terminal"' -e 'tell app "Terminal"
    do script "vbindiff ${cwd}/${f1} ${cwd}/${f2}"
end tell'`);
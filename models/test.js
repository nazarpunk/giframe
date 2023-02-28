// noinspection JSUnusedAssignment

import * as fs from 'fs';
import {MDX} from "../mdx/MDX.mjs";
import * as chip from "child_process";

let name;

name = 'VKbrute';
name = 'Arthas_portrait';
name = 'sprite';
name = 'DNCAshenValeTerrain';
name = 'BlackDragon';
name = 'BlackDragon_Portrait';
name = 'Footman';
name = 'candelabra_01.MESH';
name = 'heroarchmage_ref';
name = 'heroarchmage';
name = 'heroarchmage_hd';
name = '../frameborder/model/aganim_sprite';

const f1 = `${name}.mdx`;
const ba = fs.readFileSync(f1);

const arrayBuffer = new ArrayBuffer(ba.length);
const view = new Uint8Array(arrayBuffer);
for (let i = 0; i < ba.length; ++i) {
	view[i] = ba[i];
}

const model = new MDX(arrayBuffer);
model.read();
console.log('Read End!');
const b = model.write();
console.log('Write End!');


const f2 = `${name}_test.mdx`;
fs.writeFileSync(f2, '', {flag: 'w+'});
fs.appendFileSync(f2, Buffer.from(b));

const cwd = process.cwd();

if (1) chip.exec(
	`osascript -e 'activate application "Terminal"' -e 'tell app "Terminal"
    do script "vbindiff ${cwd}/${f1} ${cwd}/${f2}"
end tell'`);

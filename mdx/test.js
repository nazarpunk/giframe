import * as fs from 'fs';
import {Model} from "./../model/Model.mjs";

const buffer = fs.readFileSync('sprite.mdx');

const arrayBuffer = new ArrayBuffer(buffer.length);
const view = new Uint8Array(arrayBuffer);
for (let i = 0; i < buffer.length; ++i) {
	view[i] = buffer[i];
}

const model = new Model(arrayBuffer);

const ab = model.toArrayBuffer();

const path = 'sprite_test.mdx';
fs.writeFileSync(path, '', {flag: 'w+'});
fs.appendFileSync(path, Buffer.from(arrayBuffer));
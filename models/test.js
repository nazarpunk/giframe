import * as fs from 'fs';
import {MDX} from "../mdx/MDX.mjs";
import * as cp from 'child_process';
import {Reader} from "../mdx/parser/Reader.mjs";


//const name = 'BlackDragon';
//const name = 'BlackDragon_Portrait';
//const name = 'DNCAshenValeTerrain';
//const name = 'sprite';
//const name = 'Footman';
//const name = 'heroarchmage';
const name = 'heroarchmage_ref';

const f1 = `${name}.mdx`;
const ba = fs.readFileSync(f1);

const arrayBuffer = new ArrayBuffer(ba.length);
const view = new Uint8Array(arrayBuffer);
for (let i = 0; i < ba.length; ++i) {
	view[i] = ba[i];
}

let rc = 0, rp = -1;
let wc = 0, wp = -1;
let calcs = true;
const reader = new Reader(arrayBuffer, {
	onRead: (byteOffset, byteLength) => {
		rc++;
		const rpn = Math.round(byteOffset / byteLength * 100);
		if (rpn === rp && rpn < 99) {
			return;
		}
		rp = rpn;
		process.stdout.write(`\rread ${rp}% byte ${byteOffset} of ${byteLength}, count ${rc}`);
	},
	onWrite: (byteOffset, byteLength, calc) => {
		if (calc !== calcs) {
			calcs = calc;
			console.log('\nCalc End!');
		}

		if (calc) {
			process.stdout.write(`\rcalc byte ${byteLength}, count ${rc}`);
			return;
		}
		wc++;
		const wpn = Math.round(byteOffset / byteLength * 100);
		if (wpn === wp && wpn < 99) {
			return;
		}
		wp = wpn;
		process.stdout.write(`\rwrite ${rp}% byte ${byteOffset} of ${byteLength}, count ${rc}`);
	},

});
const model = new MDX(reader);
model.read();
console.log('\nRead Complete!\n');
if (model.error) {
	console.log(model.error)
}
model.write();
if (model.error) {
	console.log('\n', model.error)
}


const f2 = `${name}_test.mdx`;
fs.writeFileSync(f2, '', {flag: 'w+'});
fs.appendFileSync(f2, Buffer.from(reader.output));

const cwd = process.cwd();

if (1) cp.exec(
	`osascript -e 'activate application "Terminal"' -e 'tell app "Terminal"
    do script "vbindiff ${cwd}/${f1} ${cwd}/${f2}"
end tell'`);

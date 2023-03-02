import parseAPNG from "../apng/parser.mjs";
import {getSquare} from "./util.mjs";
import {APNG} from "../apng/APNG.mjs";
import {Cyberlink} from "../web/cyberlink.mjs";
import {Dropzone} from "../web/dropzone.mjs";
import {MDX} from "../mdx/MDX.mjs";
import {InterpolationTrack} from "../mdx/parser/Interpolation.mjs";
import {Float32List} from "../mdx/parser/Float.mjs";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.style.display = 'none';
const ctx = canvas.getContext('2d');

const response = await fetch(`frame/sprite.mdx`);
const modelBuffer = await response.arrayBuffer();

const dropzone = new Dropzone();
dropzone.accept = '.png';
document.body.appendChild(dropzone);

const container = document.createElement('div');
container.classList.add('container');
document.body.appendChild(container);

/**
 *
 * @param {File?} file
 * @param {ArrayBuffer} buffer
 * @return {Promise<void>}
 */
const addFile = async (file, buffer) => {
	const apng = parseAPNG(buffer);
	if (!(apng instanceof APNG)) {
		return;
	}
	await apng.createBitmap(apng.width, apng.height);

	const name = file?.name ?? 'test.png';

	const aw = apng.width;
	const ah = apng.height;

	const [cw, ch] = getSquare(aw, ah, apng.frames.length);
	canvas.width = cw;
	canvas.height = ch;

	const mdx = new Cyberlink();
	const newBuffer = new ArrayBuffer(modelBuffer.byteLength);
	new Uint8Array(newBuffer).set(new Uint8Array(modelBuffer));

	const model = new MDX(newBuffer);
	model.read();

	const pname = name.replace(/\.[a-z]+$/, '');
	model.textures.items[0].filename.value = `${pname}.blp`;

	const translations = model.textureAnimations.items[0].translations;
	translations.items = [];

	let end = 0;
	const add32 = (time, x, y) => {
		const t = new InterpolationTrack(translations);
		end += t.time = Math.round(time);
		t.value = new Float32List(3);
		t.value.list = [x, y, 0];
		translations.items.push(t);
	};

	const framesCSS = [];
	const addCss = (prc, x, y) => {
		framesCSS.push([`${Math.round(prc)}% {transform:translate(${x}px,${y}px)}\n`]);
	};
	addCss(0, 0, 0);
	add32(0, 0, 0);
	add32(apng.frames[0].delay, 0, 0);

	model.sequences.items[0].intervalEnd.value = end;

	mdx.download = `${pname}.mdx`;
	const rb = model.write();
	mdx.href = URL.createObjectURL(new Blob([rb]));

	const dx = aw / cw;
	const dy = ah / ch;
	let x = -1;
	let y = 0;
	for (let i = 0; i < apng.frames.length; i++) {
		const f = apng.frames[i];
		x++;
		if ((x + 1) * aw > cw) {
			x = 0;
			y++;
		}
		if (i > 0) {
			addCss(i * (f.delay / apng.playTime * 100), x * -aw, y * -ah);
			add32(f.delay, dx * x, dy * y);
		}

		ctx.drawImage(f.imageBitmap, x * aw + f.left, y * ah + f.top);
	}
	addCss(100, 0, 0);

	const card = document.createElement('div');
	card.classList.add('card');
	container.appendChild(card);

	const wrap = document.createElement('div');
	card.appendChild(wrap);
	wrap.classList.add('wrap');
	wrap.style.width = `${aw}px`;
	wrap.style.height = `${ah}px`;

	const cls = `image-${Date.now()}${Math.random()}`.replace('.', '');
	const style = document.createElement('style');

	style.textContent = `
	.${cls} {animation: ${cls} ${Math.round(apng.playTime)}ms steps(1) infinite; }
	@keyframes ${cls} {\n${framesCSS.join('')}}`;

	wrap.appendChild(style);

	const img = new Image(cw, ch);
	wrap.appendChild(img);
	img.classList.add(cls);

	/** @type {Blob} */
	const iblob = await new Promise(resolve => canvas.toBlob(blob => resolve(blob)));
	img.src = URL.createObjectURL(iblob);

	card.appendChild(mdx);
	mdx.color = 'blue';
	mdx.text = 'MDX';

	const png = new Cyberlink();
	card.appendChild(png);
	png.color = 'green';
	png.text = 'PNG';
	png.href = img.src;
	png.download = name;
};

dropzone.addEventListener('bufferupload', async e => {
	const [file, buffer] = /** @type [File, ArrayBuffer] */ e.detail;
	await addFile(file, buffer);
});

if (1) {
	const response = await fetch(`frame/red_sence.png`);
	const buffer = await response.arrayBuffer();
	await addFile(null, buffer);
}
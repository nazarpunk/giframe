import parseAPNG from "../apng/parser.mjs";
import {textureSize} from "./util.mjs";
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

const addFrame = (prc, x, y) => {
	return `${Math.round(prc)}% {transform:translate(${x}px,${y}px)}\n`
};

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

	const aw = apng.width;
	const ah = apng.height;

	const [w, h] = textureSize(aw, ah, apng.frames.length);
	canvas.width = w;
	canvas.height = h;

	const framesCSS = [addFrame(0, 0, 0)];

	let x = -1;
	let y = 0;
	for (let i = 0; i < apng.frames.length; i++) {
		const f = apng.frames[i];
		x++;
		if ((x + 1) * aw > w) {
			x = 0;
			y++;
		}
		if (i > 0) {
			framesCSS.push(addFrame(i * (f.delay / apng.playTime * 100), x * -aw + f.left, y * -ah + f.top));
		}

		ctx.drawImage(f.imageBitmap, x * aw, y * ah);
	}
	framesCSS.push(addFrame(100, 0, 0));

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
	@keyframes ${cls} {\n${framesCSS.join('')}}
	`;

	wrap.appendChild(style);

	const img = new Image(w, h);
	wrap.appendChild(img);
	img.classList.add(cls);
	img.src = canvas.toDataURL('image/png', 1.0);

	const name = file?.name ?? 'test.png';

	const mdx = new Cyberlink();
	card.appendChild(mdx);
	mdx.color = 'blue';
	mdx.text = 'MDX';
	{
		const b = new ArrayBuffer(modelBuffer.byteLength);
		new Uint8Array(b).set(new Uint8Array(modelBuffer));

		const model = new MDX(b);
		model.read();

		const pname = name.replace(/\.[a-z]+$/, '');
		model.textures.items[0].filename.value = `${pname}.blp`;

		const translations = model.textureAnimations.items[0].translations;
		translations.items = [];
		const add32 = (time, x, y) => {
			const t = new InterpolationTrack(translations);
			t.time = time;
			t.value = new Float32List(3);
			t.value.list = [x, y, 0];
			translations.items.push(t);

		};
		add32(0, 0, 0);

		const dx = aw / w;
		const dy = ah / h;

		for (let i = 1; i < apng.frames.length; i++) {
			const f = apng.frames[i];
			x++;
			if ((x + 1) * aw > w) {
				x = 0;
				y++;
			}
			add32(f.delay, dx * x, dy * y);
		}
		add32(apng.frames[0].delay, 0, 0);

		mdx.download = `${pname}.mdx`;
		const rb = model.write();
		mdx.href = URL.createObjectURL(new Blob([rb]));
	}

	const png = new Cyberlink();
	card.appendChild(png);
	png.color = 'green';
	png.text = 'PNG';
	png.href = URL.createObjectURL(new Blob([buffer]));
	png.download = name;
};

dropzone.addEventListener('bufferupload', async e => {
	const [file, buffer] = /** @type [File, ArrayBuffer] */ e.detail;
	await addFile(file, buffer);
});

if (0) {
	const response = await fetch(`frame/red_sence.png`);
	const buffer = await response.arrayBuffer();
	await addFile(null, buffer);
}
import parseAPNG, {APNG} from "../apng/parser.mjs";
import {getSquare} from "./util.mjs";
import {APNGOLD} from "../apng/APNGOLD.mjs";
import {Cyberlink} from "../web/cyberlink.mjs";
import {Dropzone} from "../web/dropzone.mjs";
import {MDX} from "../mdx/MDX.mjs";
import {InterpolationTrack} from "../mdx/parser/Interpolation.mjs";
import {Float32List} from "../mdx/parser/Float.mjs";
import {GIFOLD} from "../gif/GIF.mjs";

/**
 * @param {string} filename
 * @return {string|null}
 */
const extension = filename => {
	const r = /.+\.(.+)$/.exec(filename);
	return r ? r[1] : null;
};

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.dataset.version = '6';
canvas.style.display = 'none';
const ctx = canvas.getContext('2d');

const response = await fetch(`frame/sprite.mdx`);
const modelBuffer = await response.arrayBuffer();

const newModel = () => {
	const newBuffer = new ArrayBuffer(modelBuffer.byteLength);
	new Uint8Array(newBuffer).set(new Uint8Array(modelBuffer));
	const model = new MDX(newBuffer);
	model.read();
	return model;
};

const dropzone = new Dropzone();
dropzone.accept = '.png,.gif';
document.body.appendChild(dropzone);

const container = document.createElement('div');
container.classList.add('container');
document.body.appendChild(container);

/**
 *
 * @param {File} file
 * @param {ArrayBuffer} buffer
 * @return {Promise<void>}
 */
const addFile = async (file, buffer) => {

	if (0) {
		const apngnew = new APNG(buffer);
		apngnew.read();
	}

	let image;

	const name = file.name;

	const ext = extension(name);

	switch (ext) {
		case 'png':
			image = parseAPNG(buffer);
			if (!(image instanceof APNGOLD)) {
				console.error('not apng');
				return;
			}
			break;
		case 'gif':
			image = new GIFOLD();
			image.dataLoaded(buffer);
			break;
	}

	await image.createBitmap();

	const pname = name.replace(/\.[a-z]+$/, '');

	const aw = image.width;
	const ah = image.height;

	const [cw, ch] = getSquare(aw, ah, image.frames.length);
	canvas.width = cw;
	canvas.height = ch;

	const mdx = new Cyberlink();
	const model = newModel();

	model.textures.items[0].filename.value = `${pname}.blp`;
	const sets = model.geosets.items[0].textureCoordinateSets.items[0].items;

	const dx = aw / cw;
	const dy = ah / ch;

	sets[0].value = dx;
	sets[1].value = dy;

	sets[2].value = dx;
	sets[3].value = 0;

	sets[4].value = 0;
	sets[5].value = dy;

	sets[6].value = 0;
	sets[7].value = 0;

	const translations = model.textureAnimations.items[0].translations;
	translations.items = [];

	let animationEnd = 0;
	const add32 = (time, x, y) => {
		const t = new InterpolationTrack(translations);
		animationEnd += Math.round(time);
		t.time = animationEnd;

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

	mdx.download = `${pname}.mdx`;

	let x = -1;
	let y = 0;
	for (let i = 0; i < image.frames.length; i++) {
		const f = image.frames[i];
		x++;
		if ((x + 1) * aw > cw) {
			x = 0;
			y++;
		}
		if (i > 0) {
			const delay = image.frames[i - 1].delay;
			addCss(i * (delay / image.time * 100), x * -aw, y * -ah);
			add32(delay, dx * x, dy * y);
		}

		ctx.drawImage(f.imageBitmap, x * aw + f.left, y * ah + f.top);
	}
	addCss(100, 0, 0);
	add32(image.frames[image.frames.length - 1].delay, 0, 0);

	model.sequences.items[0].intervalEnd.value = animationEnd;

	mdx.href = URL.createObjectURL(new Blob([model.write()]));

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
	.${cls} {animation: ${cls} ${Math.round(image.time)}ms steps(1) infinite; }
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

if (location.host.indexOf('localhost') === 0) {
	const name = 'frame/senko.gif';
	//const name = 'frame/white_border.png';
	//const name = 'frame/red_sence.png';
	const response = await fetch(name);
	const buffer = await response.arrayBuffer();

	await addFile(new File([], name), buffer);
}
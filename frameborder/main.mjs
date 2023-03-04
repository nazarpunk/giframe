import parseAPNG, {APNG} from "../apng/parser.mjs";
import {getSquare} from "./util.mjs";
import {APNGOLD} from "../apng/APNGOLD.mjs";
import {Cyberlink} from "../web/cyberlink.mjs";
import {Dropzone} from "../web/dropzone.mjs";
import {MDX} from "../mdx/MDX.mjs";
import {InterpolationTrack} from "../mdx/parser/Interpolation.mjs";
import {Float32List} from "../mdx/parser/Float.mjs";
import {GIFOLD} from "../gif/gif2.mjs";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.dataset.version = '5';
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

	if (0) {
		const apngnew = new APNG(buffer);
		apngnew.read();
	}

	const apng = parseAPNG(buffer);
	if (!(apng instanceof APNGOLD)) {
		return;
	}
	await apng.createBitmap(apng.width, apng.height);

	const name = file?.name ?? 'test.png';
	const pname = name.replace(/\.[a-z]+$/, '');

	const aw = apng.width;
	const ah = apng.height;

	const [cw, ch] = getSquare(aw, ah, apng.frames.length);
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
	for (let i = 0; i < apng.frames.length; i++) {
		const f = apng.frames[i];
		x++;
		if ((x + 1) * aw > cw) {
			x = 0;
			y++;
		}
		if (i > 0) {
			const delay = apng.frames[i - 1].delay;
			addCss(i * (delay / apng.playTime * 100), x * -aw, y * -ah);
			add32(delay, dx * x, dy * y);
		}

		ctx.drawImage(f.imageBitmap, x * aw + f.left, y * ah + f.top);
	}
	addCss(100, 0, 0);
	add32(apng.frames[apng.frames.length - 1].delay, 0, 0);

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

if (location.host.indexOf('localhost') === 0) {
	if (0) {
		const response = await fetch(`frame/red_sence.png`);
		//const response = await fetch(`frame/white_border.png`);
		const buffer = await response.arrayBuffer();
		await addFile(null, buffer);
	}


	const response = await fetch('frame/senko.gif');
	//const response = await fetch(`frame/white_border.png`);
	const buffer = await response.arrayBuffer();

	const gif = GIFOLD();                  // creates a new gif

	gif.dataLoaded(buffer);

	const [cw, ch] = getSquare(gif.width, gif.height, gif.frames.length);
	const canvas = document.createElement('canvas');
	canvas.width = cw;
	canvas.height = ch;
	container.appendChild(canvas);
	const ctx = canvas.getContext("2d");

	const aw = gif.width;
	const ah = gif.height;

	console.log(cw, ch, gif.frames);

	let x = -1;
	let y = 0;
	for (let i = 0; i < gif.frames.length; i++) {
		const f = gif.frames[i];
		x++;
		if ((x + 1) * aw > cw) {
			x = 0;
			y++;
		}

		container.appendChild(f.image);
		ctx.drawImage(f.image, x * aw + f.left, y * ah + f.top);
	}
}
import parseAPNG from "../apng/parser.mjs";
import {textureSize} from "./util.mjs";
import {APNG} from "../apng/APNG.mjs";
import {Cyberlink} from "../web/cyberlink.mjs";
import {Dropzone} from "../web/dropzone.mjs";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.style.display = 'none';
const ctx = canvas.getContext('2d');

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

	const frames = [addFrame(0, 0, 0)];

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
			frames.push(addFrame(i * (f.delay / apng.playTime * 100), x * -aw, y * -ah));
		}

		ctx.drawImage(f.imageBitmap, x * aw, y * ah);
	}
	frames.push(addFrame(100, 0, 0));

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
	@keyframes ${cls} {\n${frames.join('')}}
	`;

	wrap.appendChild(style);

	const img = new Image(w, h);
	wrap.appendChild(img);
	img.classList.add(cls);
	img.src = canvas.toDataURL('image/png', 1.0);

	const bj = URL.createObjectURL(new Blob([buffer]));
	const png = new Cyberlink();
	card.appendChild(png);
	png.color = 'green';
	png.text = 'PNG';
	png.href = bj;
	png.download = file?.name ?? 'test.png';
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
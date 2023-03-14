// noinspection JSUnusedAssignment,DuplicatedCode

import {Dropzone} from "../../web/dropzone.mjs";
import {GIF} from "../../gif/GIF.mjs";
import {RibbonHeader} from "../../web/ribbon-header.mjs";
import {ErrorMessage} from "../split/web/error-message.mjs";
import {GrowingPacker} from "../../utils/growing_packer.mjs";
import {nextDivisible} from "../../utils/utils.mjs";

const dropzone = new Dropzone();
dropzone.accept = '.gif';
document.body.appendChild(dropzone);

/**
 * @param {File} file
 * @param {ArrayBuffer} buffer
 * @return {Promise<void>}
 */
const addFile = async (file, buffer) => {
	const gif = new GIF(buffer);
	gif.parse();

	const header = new RibbonHeader();
	header.text = `${file.name} #${gif.frames.length} ${gif.width}x${gif.height}`;
	document.body.appendChild(header);

	if (gif.errors.length) {
		const em = new ErrorMessage();
		em.errors = gif.errors;
		document.body.appendChild(em);
	}

	const packer = new GrowingPacker();

	for (const frame of gif.frames) {
		frame.imageData;
		packer.item = {index: frame.index, width: gif.width, height: gif.height};
	}

	packer.pack();

	const canvas = document.createElement('canvas');
	document.body.appendChild(canvas);
	const ctx = canvas.getContext('2d');
	canvas.width = packer.width;
	canvas.height = packer.height;

	for (const item of packer.items) {
		const frame = gif.frames[item.index];
		ctx.putImageData(frame.imageDataFrame, item.x, item.y);
	}

};

for (const i of [4, 5, 6, 7, 8, 9, 10, 12]) {
	console.log(i, nextDivisible(i, 4));
}


dropzone.addEventListener('bufferupload', async e => {
	const [file, buffer] = /** @type [File, ArrayBuffer] */ e.detail;
	await addFile(file, buffer);
});

if (location.host.indexOf('localhost') === 0) {
	let name;
	name = 'kitagawa-marin.gif';
	name = 'disposal3-2.gif';
	name = 'boobs-1.gif';
	const response = await fetch(`../images/${name}`);
	const buffer = await response.arrayBuffer();

	await addFile(new File([], name), buffer);
}
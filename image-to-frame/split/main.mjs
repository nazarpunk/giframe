import {Dropzone} from "../../web/dropzone.mjs";
import {GIF} from "../../gif/GIF.mjs";
import {RibbonHeader} from "../../web/ribbon-header.mjs";
import {InfoTable} from "./info-table.mjs";
import {InfoFrame} from "./info-frame.mjs";

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
	console.log(gif);

	const header = new RibbonHeader();
	header.text = `${file.name} #${gif.frames.length} ${gif.width}x${gif.height}`;
	document.body.appendChild(header);

	for (let i = 0; i < gif.frames.length; i++) {
		const info = new InfoFrame();
		document.body.appendChild(info);
		info.size(gif.width, gif.height);

		for (let k = 0; k < i; k++) {
			const frame = gif.frames[k];
			//const image = new ImageData(gif.width, gif.height);
			//gif.decodeAndBlitFrameRGBA(k, image.data);
			//info.right.ctx.putImageData(image, frame.x, frame.y);
		}

		const image = new ImageData(gif.width, gif.height);
		gif.decodeAndBlitFrameRGBA(i, image.data);

		const frame = gif.frames[i];

		const table = new InfoTable();
		table.header = `Frame ${i}`;
		info.center = table;
		for (const k of Object.getOwnPropertyNames(frame)) {
			if (!k.startsWith('_')) {
				table.addRow(k, frame[k]);
			}
		}
		info.left.ctx.putImageData(image, 0, 0);
		//info.right.ctx.putImageData(image, 0, 0);
		info.left.inner(frame.x, frame.y, frame.width, frame.height);
	}

};

dropzone.addEventListener('bufferupload', async e => {
	const [file, buffer] = /** @type [File, ArrayBuffer] */ e.detail;
	await addFile(file, buffer);
});

if (location.host.indexOf('localhost') === 0) {
	let name;
	//name = '../frame/senko.gif';
	//name = '../frame/white_border.png';
	//name = '../frame/red_sence.png';
	name = '../frame/kitagawa-kitagawa-marin.gif';
	//name = '../frame/test1.gif';
	const response = await fetch(name);
	const buffer = await response.arrayBuffer();

	await addFile(new File([], name), buffer);
}
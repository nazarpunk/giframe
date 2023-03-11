import {Dropzone} from "../../web/dropzone.mjs";
import {GIF} from "../../gif/GIF.mjs";
import {RibbonHeader} from "../../web/ribbon-header.mjs";
import {InfoTable} from "./info-table.mjs";

const dropzone = new Dropzone();
dropzone.accept = '.png,.gif';
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
	header.text = file.name;
	document.body.appendChild(header);

	const table = new InfoTable();
	document.body.appendChild(table);
	table.header = 'GIF info';
	table.addRow('width', gif.width);
	table.addRow('height', gif.height);

	for (let i = 0; i < gif.frames.length; i++) {

		const image = new ImageData(gif.width, gif.height);
		gif.decodeAndBlitFrameRGBA(i, image.data);



		const frame = gif.frames[i];

		console.log(frame);

		let canvas = document.createElement('canvas');
		document.body.appendChild(canvas);
		canvas.width = gif.width;
		canvas.height = gif.height;

		canvas.getContext('2d').putImageData(image, 0, 0);
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
	const response = await fetch(name);
	const buffer = await response.arrayBuffer();

	await addFile(new File([], name), buffer);
}
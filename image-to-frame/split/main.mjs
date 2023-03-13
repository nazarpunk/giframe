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

	const header = new RibbonHeader();
	header.text = `${file.name} #${gif.frames.length} ${gif.width}x${gif.height}`;
	document.body.appendChild(header);

	const infos = [];
	for (let i = 0; i < gif.frames.length; i++) {
		const frame = gif.frames[i];

		const info = new InfoFrame();
		document.body.appendChild(info);

		info.size(gif.width, gif.height);
		info.left.loading = true;
		info.left.inner(frame.x, frame.y, frame.width, frame.height);

		info.right.loading = true;

		const table = new InfoTable();
		table.header = `Frame ${i}`;
		info.center = table;
		table.addRow('offset', `${frame.x}, ${frame.y}`);
		table.addRow('size', `${frame.width}, ${frame.height}`);
		table.addRow('disposal', `${frame.disposal} - ${frame.disposalName}`);

		infos.push(info);
	}

	for (let i = 0; i < gif.frames.length; i++) {
		const frame = gif.frames[i];
		const info = infos[i];

		info.left.loading = false;
		info.left.ctx.putImageData(frame.imageData, 0, 0);
	}

	for (let i = 0; i < 2; i++) {
		const fi = gif.frames[i];

		console.log(fi.imageDataArray);

		for (let k = i + 1; k < gif.frames.length; k++) {
			const fk = gif.frames[k];

		}
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
// noinspection JSUnusedAssignment

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

	for (const frame of gif.frames) {
		const info = new InfoFrame();
		document.body.appendChild(info);

		info.size(gif.width, gif.height);

		const table = new InfoTable();
		table.header = `Frame ${frame.index}`;
		info.center = table;
		table.addRow('offset', `<b>${frame.x}</b>, <b>${frame.y}</b>`);
		table.addRow('size', `<b>${frame.width}</b>, <b>${frame.height}</b>`);
		table.addRow('disposal', `<b>${frame.disposal}</b> <i>${frame.disposalName}</i>`);
		table.addRow('delay', `<b>${frame.delay}</b><i>ms</i>`);

		info.left.inner(frame.x, frame.y, frame.width, frame.height);

		info.left.loading = false;
		info.left.ctx.putImageData(frame.imageData, 0, 0);

		info.right.loading = false;
		info.right.ctx.putImageData(frame.imageDataFrame, 0, 0);
	}
};

dropzone.addEventListener('bufferupload', async e => {
	const [file, buffer] = /** @type [File, ArrayBuffer] */ e.detail;
	await addFile(file, buffer);
});

if (location.host.indexOf('localhost') === 0) {
	let name;
	name = '../frame/disposal2-2.gif';
	name = '../frame/disposal2-1.gif';
	name = '../frame/disposal3-1.gif';
	name = '../frame/disposal3-2.gif';
	name = '../frame/kitagawa-marin.gif';
	const response = await fetch(name);
	const buffer = await response.arrayBuffer();

	await addFile(new File([], name), buffer);
}
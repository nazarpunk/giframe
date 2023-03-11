import {Dropzone} from "../../web/dropzone.mjs";
import {GifReader} from "../../gif/omgif.mjs";

const dropzone = new Dropzone();
dropzone.accept = '.png,.gif';
document.body.appendChild(dropzone);

const container = document.createElement('div');
container.classList.add('container');
document.body.appendChild(container);

/**
 * @param {File} file
 * @param {ArrayBuffer} buffer
 * @return {Promise<void>}
 */
const addFile = async (file, buffer) => {
	const intArray = new Uint8Array(buffer);

	const reader = new GifReader(intArray);
	const info = reader.frameInfo(0);


	for (let i = 0; i < reader.frames.length; i++) {
		const image = new ImageData(info.width, info.height);
		reader.decodeAndBlitFrameRGBA(i, image.data);
		const frame = reader.frames[i];


		console.log(frame);

		let canvas = document.createElement('canvas');
		container.appendChild(canvas);
		canvas.width = info.width;
		canvas.height = info.height;

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
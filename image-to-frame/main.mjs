import {Dropzone} from "../web/dropzone.mjs";
import {MDX} from "../mdx/MDX.mjs";
import {FrameModel} from "./web/frame-model.mjs";
import {TextureSwitcher} from "./web/texture-switcher.mjs";

/**
 * @param {string} filename
 * @return {string|null}
 */
const extension = filename => {
	const r = /.+\.(.+)$/.exec(filename);
	return r ? r[1] : null;
};

const response = await fetch(`sprite.mdx`);
const modelBuffer = await response.arrayBuffer();

const newModel = () => {
	const newBuffer = new ArrayBuffer(modelBuffer.byteLength);
	new Uint8Array(newBuffer).set(new Uint8Array(modelBuffer));
	const model = new MDX(newBuffer);
	model.read();
	return model;
};

const dropzone = new Dropzone();
dropzone.accept = '.gif';
document.body.appendChild(dropzone);

const switcher = new TextureSwitcher();
document.body.appendChild(switcher);

/**
 * @param {File} file
 * @param {ArrayBuffer} buffer
 */
const addFile = async (file, buffer) => {
	const model = new FrameModel();
	model.model = newModel();
	await model.add(file, buffer);

	document.body.appendChild(model);
};

dropzone.addEventListener('bufferupload', async e => {
	const [file, buffer] = /** @type [File, ArrayBuffer] */ e.detail;
	await addFile(file, buffer);
});

if (location.host.indexOf('localhost') === 0) {
	const name = 'boobs2.gif';
	const response = await fetch(`images/${name}`);
	const buffer = await response.arrayBuffer();

	await addFile(new File([], name), buffer);
}
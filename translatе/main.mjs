// noinspection JSUnusedAssignment

import {Dropzone} from "../web/dropzone.mjs";
import {RibbonHeader} from "../web/ribbon-header.mjs";
import {ErrorMessage} from "../web/error-message.mjs";
import {WtsTranslate} from "./web/wts-translate.mjs";

const dropzone = new Dropzone();
dropzone.accept = '.wts';
document.body.appendChild(dropzone);

const key = 'trnsl.1.1.20160820T064946Z.14df1873a2a59784.ed80e4711ea99e81c36aaf18c4fdd4dd7de857c7';

const input = document.createElement('input');
input.classList.add('key-input');
document.body.appendChild(input);
input.value = key;
input.value = '1b58c185.6415be34.9cce44e7.74722d74657874-0-0';

/**
 * @param {File} file
 * @param {string} text
 */
dropzone.readAsText = (file, text) => {

	RibbonHeader.fromText(file.name, document.body);

	const matches = text.matchAll(/STRING\s+(\d+)(?:\r\n)+\{(?:\r\n)+([^}]+)(?:\r\n)+}/g);

	const map = new Map();

	for (const match of matches) {
		const id = +match[1];
		if (map.has(id)) {
			ErrorMessage.fromText(`Duplicate id: ${id}`, document.body);
			continue;
		}
		map.set(id, match[2]);
		WtsTranslate.fromMap(map, id, document.body);
	}
};


if (location.host.indexOf('localhost') === 0) {
	let name;
	name = 'war3map.wts';
	const response = await fetch(`files/${name}`);
	const buffer = await response.text();

	dropzone.readAsText(new File([], name), buffer);
}
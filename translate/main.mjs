// noinspection JSUnusedAssignment

import {Dropzone} from "../web/dropzone.mjs";
import {RibbonHeader} from "../web/ribbon-header.mjs";
import {ErrorMessage} from "../web/error-message.mjs";
import {WtsTranslate} from "./web/wts-translate.mjs";
import {YaInput} from "./web/ya-input.mjs";
import {Cyberlink} from "../web/cyberlink.mjs";

const dropzone = new Dropzone();
dropzone.accept = '.wts';
document.body.appendChild(dropzone);

const ya = new YaInput();
document.body.appendChild(ya);

/**
 * @param {File} file
 * @param {string} text
 */
dropzone.readAsText = (file, text) => {

	RibbonHeader.fromText(file.name, document.body);



	const matches = text.matchAll(/STRING\s+(\d+)(?:\r\n)+\{(?:\r\n)+([^}]+)(?:\r\n)+}/g);

	const map = new Map();

	/** @type {WtsTranslate[]} */ const list = [];

	for (const match of matches) {
		const id = +match[1];
		if (map.has(id)) {
			ErrorMessage.fromText(`Duplicate id: ${id}`, document.body);
			continue;
		}
		map.set(id, match[2]);
		list.push(WtsTranslate.fromMap(map, id, document.body, ya));
	}

	const b = new Cyberlink();
	b.color = 'green';
	b.text = 'DOWNLOAD';
	b.onclick = () => {
		let out = '';
		for (const e of list) {
			out += `STRING ${e.id}\r\n{\r\n${e.translate}\r\n}\r\n\r\n`;
		}
		const blob = new Blob([out],
			{type: "text/plain;charset=utf-8"});

		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.target = '_blank';
		a.download = `translate.txt`;
		a.click();
	};

	const buttons = document.createElement('div');
	buttons.appendChild(b);
	buttons.classList.add('buttons');
	buttons.style.display = 'flex';
	buttons.style.justifyContent = 'center';

	document.body.appendChild(buttons);
};


if (location.host.indexOf('localhost') === 0) {
	let name;
	name = 'war3map.wts';
	const response = await fetch(`files/${name}`);
	const buffer = await response.text();

	dropzone.readAsText(new File([], name), buffer);
}
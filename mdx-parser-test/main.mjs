import {MDX} from "../mdx/MDX.mjs";

const equal = (a, b) => {
	if (a.byteLength !== b.byteLength) return false;
	for (let i = 0; i < a.byteLength; i++) {
		if (a.getUint8(i) !== b.getUint8(i)) return false;
	}
	return true;
};

const input = document.querySelector('[type=file]');

/** @param {string} str */
const print = str => {
	const div = document.createElement('pre');
	div.textContent = str;
	document.body.appendChild(div);
};
input.addEventListener('change', e => {
	e.preventDefault();
	e.stopPropagation();
	const list = e.target.files;
	if (list.length === 0) {
		return;
	}
	for (const f of list) {
		const reader = new FileReader();
		reader.addEventListener('load', e => {
			print(`Парсим ${f.name}`);
			/** @type {ArrayBuffer} */
			const a = e.target.result;

			let b;
			try {
				b = new MDX(a).write();
			} catch (e) {
				console.error(e);
				print(e.toString());
				return;
			}
			if (equal(new DataView(a), new DataView(b))) {
				print(`Парсинг ${f.name} завершён успешно!`);
			} else {
				print(`Ошибка побайтового сравнения ${f.name}`);
			}
		});
		reader.readAsArrayBuffer(f);
	}
	input.value = null;
});
import {MDX} from "../mdx/MDX.mjs";

const equal = (a, b) => {
	if (a.byteLength !== b.byteLength) return false;
	for (let i = 0; i < a.byteLength; i++) {
		if (a.getUint8(i) !== b.getUint8(i)) return false;
	}
	return true;
};

const uploader = document.querySelector('.uploader');
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

			const model = new MDX(e.target.result);
			model.read();

			if (model.error) {
				print(model.error.toString());
				return;
			}

			model.write();


			if (equal(model.reader.readView, model.reader.writeView)) {
				const blob = new Blob([JSON.stringify(model, null, 4)], {type: "application/json"});
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				//a.download = `${f.name}.json`;
				a.target = '_blank';
				a.href = url;
				a.textContent = `Парсинг ${f.name} завершён успешно!`;
				document.body.appendChild(a);
			} else {
				print(`Ошибка побайтового сравнения ${f.name}`);
			}
		});
		reader.readAsArrayBuffer(f);
	}
	input.value = null;
});

const leave = () => {
	uploader.classList.remove('active');
	uploader.removeEventListener('dragleave', leave);
};

addEventListener('dragenter', () => {
	uploader.classList.add('active');
	uploader.addEventListener('dragleave', leave);
});

uploader.addEventListener('drop', leave);

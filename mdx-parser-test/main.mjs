import {MDX} from "../mdx/MDX.mjs";

const equal = (a, b) => {
	if (a.byteLength !== b.byteLength) return false;
	for (let i = 0; i < a.byteLength; i++) {
		if (a.getUint8(i) !== b.getUint8(i)) return false;
	}
	return true;
};

const uploader = document.querySelector('.dropzone');
const input = document.querySelector('[type=file]');

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
			const m = new Model(f.name);

			m.log('Начинаем парсить!');

			const model = new MDX(e.target.result);
			model.read();

			for (const e of model.errors) {
				m.log(`⚠️ ${e}`);
			}

			const bb = model.write();
			const a = new DataView(model.buffer);
			const b = new DataView(bb);
			const eq = equal(a, b);

			if (!eq) {
				m.log('⚠️ Ошибка побайтового сравнения!');
			}

			if (model.errors.length === 0 && eq) {
				m.log('💋 Парсинг завершён успешно.')
			}

			const bu = URL.createObjectURL(new Blob([JSON.stringify(model, null, 4)], {type: "application/json"}));
			m.json.target = '_blank';
			m.json.href = bu;

			const bj = URL.createObjectURL(new Blob([bb]));
			m.mdx.download = f.name;
			m.mdx.href = bj;

			m.buttons.style.removeProperty('display');
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


class Model {

	constructor(name) {
		const parent = document.createElement('div');
		parent.classList.add('model');
		document.body.appendChild(parent);

		const h1 = document.createElement('h1');
		h1.classList.add('model-header');
		h1.textContent = name;
		parent.appendChild(h1);

		this.logger = document.createElement('div');
		this.logger.classList.add('model-log');
		parent.appendChild(this.logger);

		this.buttons = document.createElement('div');
		this.buttons.style.display = 'none';
		this.buttons.classList.add('model-buttons');
		parent.appendChild(this.buttons);

		const bmd = document.createElement('div');
		bmd.classList.add('cyber-button', 'button-blue');
		this.buttons.appendChild(bmd);
		this.mdx = document.createElement('a');
		this.mdx.textContent = '.mdx';
		bmd.appendChild(this.mdx);

		const bmj = document.createElement('div');
		bmj.classList.add('cyber-button', 'button-green');
		this.buttons.appendChild(bmj);
		this.json = document.createElement('a');
		this.json.textContent = '.json';
		bmj.appendChild(this.json);

	}

	log(text) {
		const p = document.createElement('p');
		p.textContent = text;
		this.logger.appendChild(p);
	}
}

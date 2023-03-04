// noinspection CssUnusedSymbol,JSUnusedGlobalSymbols

export class Dropzone extends HTMLElement {
	constructor() {
		super();

		const shadow = this.attachShadow({mode: 'open'});
		shadow.adoptedStyleSheets = [sheet];

		this.dropzone = document.createElement('div');
		this.dropzone.classList.add('dropzone');
		shadow.appendChild(this.dropzone);

		const inner = document.createElement('div');
		inner.classList.add('inner');
		this.dropzone.appendChild(inner);

		const box = document.createElement('div');
		inner.appendChild(box);
		box.classList.add('box');

		this.input = document.createElement('input');
		this.input.type = 'file';
		this.input.multiple = true;
		this.input.classList.add('input');
		box.appendChild(this.input);

		const text = document.createElement('div');
		text.textContent = 'UPLOAD';
		text.classList.add('neon');
		box.appendChild(text);

		this.dragleave = this.dragleave.bind(this);
		this.drop = this.drop.bind(this);
		this.upload = this.upload.bind(this);
		this.dragenter = this.dragenter.bind(this);
		this.change = this.change.bind(this);
		this.paste = this.paste.bind(this);

		addEventListener('dragenter', this.dragenter);

		this.dropzone.addEventListener('drop', this.drop);
		this.input.addEventListener('change', this.change);

		addEventListener('paste', this.paste);
	}

	static get observedAttributes() {
		return ['accept'];
	}

	/** @param {string} accept */
	set accept(accept) {
		this.setAttribute('accept', accept);
	}

	/** @param {File} file */
	upload(file) {
		const exts = this.input.accept.split(',');
		const ext = extension(file.name);
		if (!ext || exts.indexOf('.' + ext) < 0) {
			return;
		}

		const reader = new FileReader();
		reader.addEventListener('load', e => {
			this.dropzone.dispatchEvent(new CustomEvent('bufferupload', {
				bubbles: true,
				composed: true,
				detail: [file, e.target.result],
			}));

		});
		reader.readAsArrayBuffer(file);
	}

	/** @param {Event} e */
	change(e) {
		e.preventDefault();
		e.stopPropagation();
		if (e.target.files.length === 0) {
			return;
		}
		for (const file of e.target.files) {
			this.upload(file);
		}
		e.target.value = null;
	}

	dragenter(e) {
		e.preventDefault();
		e.stopPropagation();
		this.dropzone.classList.add('active');
		this.dropzone.addEventListener('dragleave', this.dragleave);
	}

	/** @param {Event} e */
	dragleave(e) {
		e.preventDefault();
		e.stopPropagation();
		this.dropzone.classList.remove('active');
		this.dropzone.removeEventListener('dragleave', this.dragleave);
	}

	/**
	 * @param {DataTransferItemList} itemList
	 * @private
	 */
	async _upload(itemList) {
		const list = [];

		for (const item of itemList) {
			const file = item.webkitGetAsEntry();
			if (file) {
				list.push(scanFiles(file));
			}
		}

		const files = (await Promise.all(list)).flat(100);
		for (const file of files) {
			if (file.name.startsWith('.')) {
				continue;
			}
			this.upload(file);
		}
	}

	async paste(e) {
		await this._upload(e.clipboardData.items);
	}

	/** @param {DragEvent} e */
	async drop(e) {
		this.dragleave(e);
		await this._upload(e.dataTransfer.items);
	}

	/*
	// noinspection JSMethodCanBeStatic
	connectedCallback() {
		console.log('Custom square element added to page.');
	}

	// noinspection JSMethodCanBeStatic
	disconnectedCallback() {
		console.log('Custom square element removed from page.');
	}

	// noinspection JSMethodCanBeStatic
	adoptedCallback() {
		console.log('Custom square element moved to new page.');
	}
	 */

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case 'accept':
				this.input.accept = newValue;
		}
	}
}

const sheet = new CSSStyleSheet();
// noinspection CssUnresolvedCustomProperty
sheet.replaceSync(
	//language=CSS
	`
		.dropzone {
			height: 6rem;
			margin: 1rem;
		}

		.inner {
			position: relative;
			height: 100%;
			background: linear-gradient(0deg, #000, #272727);
			border-radius: 0.313rem;
		}

		.inner:before, .inner:after {
			position: absolute;
			z-index: -1;
			top: -2px;
			left: -2px;
			width: calc(100% + 4px);
			height: calc(100% + 4px);
			content: "";
			animation: dropzone 20s linear infinite;
			border-radius: 0.313rem;
			background: linear-gradient(45deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000);
			background-size: 400%;
		}

		.inner:after {
			filter: blur(50px);
		}

		.box {
			position: relative;
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: inherit;
			z-index: 100;
		}

		.active .box {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			height: auto;

			--c1: rgba(30, 30, 30, 0.8);
			--c2: rgba(60, 60, 60, 0.8);
			background-image: repeating-linear-gradient(
					-45deg,
					var(--c1),
					var(--c1) 1rem,
					var(--c2) 1rem,
					var(--c2) 2rem
			);
			background-size: 200% 200%;
			animation: barberpole 60s linear infinite;
		}

		.input {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 100%;
			cursor: pointer;
			opacity: 0;
			appearance: none;
			z-index: 10;
		}


		@keyframes barberpole {
			100% {
				background-position: 100% 100%;
			}
		}

		@keyframes dropzone {
			0% {
				background-position: 0 0;
			}
			50% {
				background-position: 400% 0;
			}
			100% {
				background-position: 0 0;
			}
		}

		.neon {
			font-size: 3rem;
			pointer-events: none;
			color: #fff;
			text-shadow: 0 0 5px #fff,
			0 0 10px #fff,
			0 0 20px #fff,
			0 0 40px #0ff,
			0 0 80px #0ff,
			0 0 90px #0ff,
			0 0 100px #0ff,
			0 0 150px #0ff;
		}
	`);


customElements.define('drop-zone', Dropzone);

/**
 * @param {string} filename
 * @return {string|null}
 */
const extension = filename => {
	const r = /.+\.(.+)$/.exec(filename);
	return r ? r[1] : null;
};

/**
 * @param dir
 * @return {Promise<File[]>}
 */
const scanFiles = dir => {
	if (dir.isFile) {
		return new Promise(resolve => dir.file(file => resolve([file])));
	}
	const reader = dir.createReader();
	return new Promise((resolve, reject) => {
		const list = [];
		const readEntries = () => {
			reader.readEntries(entries => {
				if (!entries.length) {
					resolve(Promise.all(list));
				} else {
					list.push(Promise.all(entries.map(entry => entry.isFile ? new Promise(resolve => entry.file(file => resolve(file))) : scanFiles(entry))));
					readEntries();
				}
			}, error => reject(error));
		};
		readEntries();
	});
};
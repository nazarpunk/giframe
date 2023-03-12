export class InfoFrame extends HTMLElement {
	constructor() {
		super();

		const shadow = this.attachShadow({mode: 'open'});
		shadow.adoptedStyleSheets = [sheet];

		this.parent = document.createElement('div');
		this.parent.classList.add('parent');
		shadow.appendChild(this.parent);

		this.left = new InfoFrameImage();
		this.parent.appendChild(this.left);

		this._center = document.createElement('div');
		this.parent.appendChild(this._center);

		this.right = new InfoFrameImage();
		this.parent.appendChild(this.right);
	}

	/**
	 * @param {number} width
	 * @param {number} height
	 */
	size(width, height) {
		this.left.size(width, height);
		this.right.size(width, height);
	}

	/**
	 * @param {HTMLElement} elem
	 */
	set center(elem) {
		this._center.appendChild(elem);
	}

}

const sheet = new CSSStyleSheet();

// noinspection CssUnusedSymbol
sheet.replaceSync(
	//language=CSS
	`
		.parent {
			display: flex;
			padding: 0 1rem 1rem;
			justify-content: space-between;
			gap: 1rem;
			overflow: auto;
			margin-bottom: 2rem;
		}
	`);

customElements.define('info-frame', InfoFrame);

export class InfoFrameImage extends HTMLElement {
	constructor() {
		super();

		const shadow = this.attachShadow({mode: 'open'});
		shadow.adoptedStyleSheets = [sheetImage];

		this.parent = document.createElement('div');
		this.parent.classList.add('parent');
		shadow.appendChild(this.parent);

		this.canvas = document.createElement('canvas');
		this.parent.appendChild(this.canvas);
		this.ctx = this.canvas.getContext('2d');
	}

	/**
	 * @param {number} width
	 * @param {number} height
	 */
	size(width, height) {
		this.canvas.width = width;
		this.canvas.height = height;
		this.parent.style.width = `${width}px`;
		this.parent.style.height = `${height}px`;
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 */
	inner(x, y, width, height) {
		if (!this._inner) {
			this._inner = document.createElement('div');
			this._inner.classList.add('inner');
			this.parent.appendChild(this._inner);
		}

		this._inner.style.left = `${x}px`;
		this._inner.style.top = `${y}px`;
		this._inner.style.width = `${width}px`;
		this._inner.style.height = `${height}px`;
	}

}

const sheetImage = new CSSStyleSheet();

// noinspection CssUnusedSymbol
sheetImage.replaceSync(
	//language=CSS
	`
		/*noinspection CssUnresolvedCustomProperty*/
		.parent {
			--a: rgba(255, 255, 255, .15);
			display: flex;
			background-color: #000;
			background-image: linear-gradient(45deg, var(--a) 25%, transparent 25%),
			linear-gradient(-45deg, var(--a) 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, var(--a) 75%),
			linear-gradient(-45deg, transparent 75%, var(--a) 75%);
			background-size: 20px 20px;
			background-position: 0 0, 0 10px, 10px -10px, -10px 0;
			box-shadow: 0 0 10px black;
			position: relative;
		}

		/*noinspection CssReplaceWithShorthandSafely,CssUnresolvedCustomProperty*/
		.inner {
			--a: #ff00ed;
			pointer-events: none;
			position: absolute;
			background: linear-gradient(to right, var(--a) 50%, transparent 0%),
			linear-gradient(var(--a) 50%, transparent 0%),
			linear-gradient(to right, var(--a) 50%, transparent 0%),
			linear-gradient(var(--a) 50%, transparent 0%);
			background-position: top, right, bottom, left;
			background-repeat: repeat-x, repeat-y;
			background-size: 10px 1px, 1px 10px;
		}

	`);

customElements.define('info-frame-image', InfoFrameImage);


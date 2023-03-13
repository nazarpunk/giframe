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

	/** @param {boolean} loading */
	set loading(loading) {
		if (loading) {
			if (this._loader) {
				return;
			}
			this._loader = document.createElement('div');
			this._loader.classList.add('loader');
			this.parent.appendChild(this._loader);
		} else {
			this._loader?.remove();
		}
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


		.loader {
			transform: rotateZ(45deg) translateX(-50%) translateY(-50%);
			perspective: 1000px;
			border-radius: 50%;
			width: 48px;
			height: 48px;
			color: #fff;
			position: absolute;
			left: 50%;
			top: 50%;
		}
		.loader:before,
		.loader:after {
			content: '';
			display: block;
			position: absolute;
			top: 0;
			left: 0;
			width: inherit;
			height: inherit;
			border-radius: 50%;
			transform: rotateX(70deg);
			animation: 1s spin linear infinite;
		}
		.loader:after {
			color: #FF3D00;
			transform: rotateY(70deg);
			animation-delay: .4s;
		}

		@keyframes rotate {
			0% {
				transform: translate(-50%, -50%) rotateZ(0deg);
			}
			100% {
				transform: translate(-50%, -50%) rotateZ(360deg);
			}
		}

		@keyframes rotateccw {
			0% {
				transform: translate(-50%, -50%) rotate(0deg);
			}
			100% {
				transform: translate(-50%, -50%) rotate(-360deg);
			}
		}

		@keyframes spin {
			0%,
			100% {
				box-shadow: .2em 0 0 0 currentcolor;
			}
			12% {
				box-shadow: .2em .2em 0 0 currentcolor;
			}
			25% {
				box-shadow: 0 .2em 0 0 currentcolor;
			}
			37% {
				box-shadow: -.2em .2em 0 0 currentcolor;
			}
			50% {
				box-shadow: -.2em 0 0 0 currentcolor;
			}
			62% {
				box-shadow: -.2em -.2em 0 0 currentcolor;
			}
			75% {
				box-shadow: 0 -.2em 0 0 currentcolor;
			}
			87% {
				box-shadow: .2em -.2em 0 0 currentcolor;
			}
		}


	`);

customElements.define('info-frame-image', InfoFrameImage);


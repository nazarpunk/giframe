// noinspection CssUnusedSymbol

export class WtsTranslate extends HTMLElement {
	constructor() {
		super();

		this.#shadow = this.attachShadow({mode: 'open'});
		this.#shadow.adoptedStyleSheets = [sheet];


	}

	// noinspection JSUnusedGlobalSymbols
	connectedCallback() {
		const id = document.createElement('div');
		id.textContent = `${this.#id}`;
		this.#shadow.appendChild(id);

		this.#ta = document.createElement('textarea');
		this.#shadow.appendChild(this.#ta);

		this.#tb = document.createElement('textarea');
		this.#shadow.appendChild(this.#tb);
	}

	/** @type {number} */ #id;
	/** @type {Map<number,string>} */ #map;

	/** @type {ShadowRoot} */ #shadow;
	/** @type {HTMLTextAreaElement} */ #ta;
	/** @type {HTMLTextAreaElement} */ #tb;

	/**
	 * @param {Map<number,string>} map
	 * @param {number} id
	 * @param {HTMLElement|ShadowRoot} parent
	 * @return {WtsTranslate}
	 */
	static fromMap(map, id, parent) {
		const wts = new WtsTranslate();
		wts.#id = id;
		wts.#map = map;
		parent.appendChild(wts);
		return wts;
	}
}

const sheet = new CSSStyleSheet();
// noinspection CssUnresolvedCustomProperty
sheet.replaceSync(
	//language=CSS
	`
		:host {
			display: flex;
			justify-content: center;
		}

	`);

customElements.define('wts-translate', WtsTranslate);

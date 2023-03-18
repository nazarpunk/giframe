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
		id.classList.add('label');
		id.textContent = `${this.#id}`;
		this.#shadow.appendChild(id);

		const value = this.#map.get(this.#id);

		this.#ta = document.createElement('textarea');
		this.#ta.value = value;
		this.#shadow.appendChild(this.#ta);

		this.#tb = document.createElement('textarea');
		this.#shadow.appendChild(this.#tb);

		this.#key = document.body.querySelector('.key-input');

		// noinspection JSIgnoredPromiseFromCall
		this.#send();
	}

	async #send(){
		const url = new URL('api/v1.5/tr.json/translate', 'https://translate.yandex.net');
		url.search = new URLSearchParams({
			text: this.#ta.value,
			key: this.#key.value,
			lang: 'en-ru',
		}).toString();

		const request = await fetch(url.toString(), {method: 'get'});
		const response = await request.text();

		console.log(response);
	}


	/** @type {number} */ #id;
	/** @type {Map<number,string>} */ #map;
	/** @type {ShadowRoot} */ #shadow;
	/** @type {HTMLTextAreaElement} */ #ta;
	/** @type {HTMLTextAreaElement} */ #tb;
	/** @type {HTMLInputElement} */ #key;

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
			display: grid;
			grid-template-columns: 2rem 1fr 1fr;
			align-items: center;
			gap: 1rem;
		}
		
		textarea {
			height: 100%;
			resize: vertical;
		}
		
	`);

customElements.define('wts-translate', WtsTranslate);

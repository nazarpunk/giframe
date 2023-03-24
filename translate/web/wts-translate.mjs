// noinspection CssUnusedSymbol

export class WtsTranslate extends HTMLElement {
	constructor() {
		super();

		this.#shadow = this.attachShadow({mode: 'open'});
		this.#shadow.adoptedStyleSheets = [sheet];

		this.#id = document.createElement('div');
		this.#id.classList.add('label');
		this.#shadow.appendChild(this.#id);

		this.#ta = document.createElement('textarea');
		this.#shadow.appendChild(this.#ta);

		this.#tb = document.createElement('textarea');
		this.#shadow.appendChild(this.#tb);
	}

	send() {
		this.#id.textContent = `${this.id}`;
		this.#ta.value = this.#map.get(this.id);

		// noinspection JSIgnoredPromiseFromCall
		this.#send();
	}

	async #send() {
		// https://cloud.yandex.ru/docs/translate/api-ref/Translation/translate
		const request = new XMLHttpRequest();
		request.open('POST', 'https://translate.api.cloud.yandex.net/translate/v2/translate', true);
		request.setRequestHeader('Authorization', `Bearer ${this.#keys.token}`);
		request.setRequestHeader('Content-Type', 'application/json');
		request.onload = r => {
			const data = JSON.parse(r.target.response);
			this.#tb.value = data.translations[0].text;
		};
		request.send(JSON.stringify({
			targetLanguageCode: 'ru',
			folderId: this.#keys.folder,
			texts: [this.#ta.value],
		}).toString());
	}

	/** @type {number} */ id;

	get translate() {
		return this.#tb.value;
	}

	/** @type {HTMLElement} */ #id;
	/** @type {Map<number,string>} */ #map;
	/** @type {ShadowRoot} */ #shadow;
	/** @type {HTMLTextAreaElement} */ #ta;
	/** @type {HTMLTextAreaElement} */ #tb;
	/** @type {YaInput} */ #keys;

	/**
	 * @param {Map<number,string>} map
	 * @param {number} id
	 * @param {HTMLElement|ShadowRoot} parent
	 * @param {YaInput} keys
	 * @return {WtsTranslate}
	 */
	static fromMap(map, id, parent, keys) {
		const wts = new WtsTranslate();
		wts.id = id;
		wts.#map = map;
		wts.#keys = keys;
		parent.appendChild(wts);
		wts.send();
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

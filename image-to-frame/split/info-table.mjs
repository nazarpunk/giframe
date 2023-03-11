export class InfoTable extends HTMLElement {
	constructor() {
		super();

		const shadow = this.attachShadow({mode: 'open'});
		shadow.adoptedStyleSheets = [sheet];

		this.parent = document.createElement('div');
		this.parent.classList.add('parent');
		shadow.appendChild(this.parent);

		this.table = document.createElement('table');
		this.parent.appendChild(this.table);

	}

	// noinspection JSUnusedGlobalSymbols
	static get observedAttributes() { return ['header']; }

	/** @param {string} text */
	set header(text) {
		this.setAttribute('header', text);
	}

	/**
	 * @param {string} k
	 * @param {string|number} v
	 */
	addRow(k, v) {
		const tr = document.createElement('tr');
		this.table.appendChild(tr);

		const ta = document.createElement('td');
		tr.appendChild(ta);
		ta.textContent = k;

		const tb = document.createElement('td');
		tr.appendChild(tb);
		tb.textContent = v;
	}

	// noinspection JSUnusedGlobalSymbols
	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case 'header':
				if (!this._header) {
					const tr = document.createElement('tr');
					this.table.insertAdjacentElement('afterbegin', tr);
					this._header = document.createElement('th');
					tr.appendChild(this._header);
					this._header.colSpan = 2;
				}
				this._header.textContent = newValue;
				break;
		}
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
			justify-content: center;
		}

		table {
			border-collapse: collapse;
		}

		td, th {
			background: #141414;
			border: 1px solid #494949;
			padding: 0.5rem;
		}
	`);

customElements.define('info-table', InfoTable);

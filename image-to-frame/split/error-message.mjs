export class ErrorMessage extends HTMLElement {
	constructor() {
		super();

		const shadow = this.attachShadow({mode: 'open'});
		shadow.adoptedStyleSheets = [sheet];

		this.parent = document.createElement('div');
		this.parent.classList.add('parent');
		shadow.appendChild(this.parent);
	}

	/** @param {Error[]} errors */
	set errors(errors) {
		this.parent.textContent = '';
		for (const e of errors) {
			this.parent.insertAdjacentHTML('afterbegin', `<div>${e}</div>`);
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
			background-color: rgb(233, 30, 99);
			margin: 0 1rem;
			flex-direction: column;
			padding: 1rem;
			gap: 1rem;
			border-radius: 0.1rem;
			box-shadow: 0 0 5px black;
		}

	`);

customElements.define('error-message', ErrorMessage);

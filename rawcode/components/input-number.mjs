// noinspection DuplicatedCode

export class InputNumber extends HTMLElement {
    /** @type {HTMLInputElement} */ #input;
    /** @type {HTMLElement} */ #prefix;

    constructor() {
        super();

        const shadow = this.attachShadow({mode: 'open'});
        shadow.adoptedStyleSheets = [sheet];

        const div = document.createElement('div');
        shadow.appendChild(div);
        div.classList.add('container');

        this.#input = document.createElement('input');
        this.#input.spellcheck = false;
        this.#input.type = 'text';
        div.appendChild(this.#input);
    }

    /** @param text */
    set text(text) {
        this.#input.value = text;
    }

    /** @param {number} length */
    set maxLength(length) {
        this.#input.maxLength = length;
        this.#input.style.width = `calc(${length}ch + ${length} * var(--ils))`;
    }

    /**
     * @param {HTMLElement} parent
     * @return {InputNumber}
     */
    static create(parent) {
        const input = new InputNumber();

        parent.appendChild(input);

        return input;
    }
}

const sheet = new CSSStyleSheet();
// noinspection CssUnresolvedCustomProperty,CssUnusedSymbol
sheet.replaceSync(
    //language=CSS
    `
        :host {
            --ip: 4px;
            --ils: 6px;
        }

        .container, input {
            font-family: Monaco, monospace;
            font-size: 2rem;
            letter-spacing: var(--ils);
        }

        .prefix {

        }

        .container {
            border: 1px solid gray;
            display: inline-block;
            border-radius: 3px;
            background-color: #1e1e1e;
            padding: var(--ip) 0 var(--ip) var(--ip);
            transition: border-color 400ms ease-in-out;
        }

        .container:focus-within {
            border-color: #00ffdc;
        }

        input {
            border: 0;
            appearance: none;
            color: transparent;

        }

        input:focus {
            outline: none;
        }

    `);

customElements.define('input-number', InputNumber);

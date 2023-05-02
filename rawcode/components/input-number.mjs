// noinspection DuplicatedCode

// Fucking FF
ShadowRoot.prototype.getSelection = ShadowRoot.prototype.getSelection || function() {
    return document.getSelection();
};

export class InputNumber extends HTMLElement {
    /** @type {HTMLDivElement} */ #input;
    /** @type {HTMLElement} */ #prefix;
    #maxLength = 0;
    #colorRegex;

    /** @type {ShadowRoot} */ #shadow;

    constructor() {
        super();

        this.#shadow = this.attachShadow({mode: 'open'});
        this.#shadow.adoptedStyleSheets = [sheet];

        const div = document.createElement('div');
        this.#shadow.appendChild(div);
        div.classList.add('container');

        // input
        this.#input = document.createElement('div');
        this.#input.contentEditable = 'true';
        this.#input.spellcheck = false;
        div.appendChild(this.#input);
        this.#input.addEventListener('input', () => this.#update());
    }

    #update() {
        const preSel = this.#shadow.getSelection();
        const preSeg = getTextSegments(this.#input);

        let absoluteAnchorIndex = null;
        let absoluteFocusIndex = null;
        let currentIndex = 0;

        preSeg.forEach(({text, node}) => {
            if (node === preSel.anchorNode) absoluteAnchorIndex = currentIndex + preSel.anchorOffset;
            if (node === preSel.focusNode) absoluteFocusIndex = currentIndex + preSel.focusOffset;
            currentIndex += text.length;
        });

        // render text
        let textContent = this.#input.textContent;
        if (this.#maxLength) textContent = textContent.slice(0, this.#maxLength);
        if (this.#colorRegex) {
            const matches = textContent.match(this.#colorRegex) ?? [];
            let textContentNew = '';

            const list = ['#e11ccd', '#11e034', '#fbde14', '#c20909'];
            if (this.#maxLength > 4) list.reverse();

            for (let i = 0; i < matches.length; i++) {
                const match = matches[i];
                textContentNew += `<span style='color:${list[i % list.length]}'>${match}</span>`;
            }

            this.#input.innerHTML = textContentNew;
        } else {
            this.#input.innerHTML = textContent;
        }

        // restore selection
        if (this.#shadow.host !== document.activeElement) return;

        const newSel = this.#shadow.getSelection();
        const newSeg = getTextSegments(this.#input);

        let anchorNode = this.#input;
        let anchorIndex = 0;
        let focusNode = this.#input;
        let focusIndex = 0;
        let currentIndexN = 0;
        newSeg.forEach(({text, node}) => {
            const startIndexOfNode = currentIndexN;
            const endIndexOfNode = startIndexOfNode + text.length;
            if (startIndexOfNode <= absoluteAnchorIndex && absoluteAnchorIndex <= endIndexOfNode) {
                anchorNode = node;
                anchorIndex = absoluteAnchorIndex - startIndexOfNode;
            }
            if (startIndexOfNode <= absoluteFocusIndex && absoluteFocusIndex <= endIndexOfNode) {
                focusNode = node;
                focusIndex = absoluteFocusIndex - startIndexOfNode;
            }
            currentIndexN += text.length;
        });

        if (this.#maxLength && anchorNode === focusNode && focusNode === this.#input && this.#input.textContent.length) {
            newSel.selectAllChildren(this.#input);
            newSel.collapseToEnd();
            return;
        }

        newSel.setBaseAndExtent(anchorNode, anchorIndex, focusNode, focusIndex);
    }


    /** @param {number} count */
    set colorGroup(count) {
        this.#colorRegex = count ? new RegExp(`.{1,${count}}`, 'g') : undefined;
    }

    /**
     * @param {string} text
     */
    set text(text) {
        this.#input.textContent = text;
        this.#update();
    }

    get text() {
        return this.#input.textContent;
    }

    /** @param {number} length */
    set maxLength(length) {
        this.#maxLength = length;
        this.#input.style.width = `calc(${length}ch + ${length} * var(--ils))`;
    }

    set prefix(text) {
        if (!this.#prefix) {
            this.#prefix = document.createElement('div');
            this.#prefix.classList.add('prefix');
            this.#input.insertAdjacentElement('beforebegin', this.#prefix);
        }
        this.#prefix.textContent = text;
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


const getTextSegments = element => {
    const textSegments = [];
    Array.from(element.childNodes).forEach((node) => {
        switch (node.nodeType) {
            case Node.TEXT_NODE:
                textSegments.push({text: node.nodeValue, node});
                break;

            case Node.ELEMENT_NODE:
                textSegments.splice(textSegments.length, 0, ...(getTextSegments(node)));
                break;

            default:
                throw new Error(`Unexpected node type: ${node.nodeType}`);
        }
    });
    return textSegments;
};


const sheet = new CSSStyleSheet();
// noinspection CssUnresolvedCustomProperty,CssUnusedSymbol
sheet.replaceSync(
    //language=CSS
    `
        :host {
            --ipv: 4px;
            --iph: 16px;
            --ils: 6px;
        }

        .prefix {
            color: #535353;
            letter-spacing: 0;
        }

        [contenteditable] {
            outline: none;
            white-space: nowrap;
        }

        .container {
            display: flex;
            border: 1px solid gray;
            border-radius: 3px;
            background-color: #1e1e1e;
            padding: var(--ipv) calc(var(--iph) - var(--ils)) var(--ipv) var(--iph);
            transition: border-color 400ms ease-in-out;
            font: 2rem/3rem Monaco, monospace;
            letter-spacing: var(--ils);
        }

        .container:focus-within {
            border-color: #0089ff;
        }

        input:focus {
            outline: none;
        }

    `);

customElements.define('input-number', InputNumber);


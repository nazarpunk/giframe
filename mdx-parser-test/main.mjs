import {MDX} from '../mdx/MDX.mjs';
import {Dropzone} from '../web/dropzone.mjs';
import {Cyberlink} from '../web/cyberlink.mjs';

const equal = (a, b) => {
    if (a.byteLength !== b.byteLength) return false;
    for (let i = 0; i < a.byteLength; i++) {
        if (a.getUint8(i) !== b.getUint8(i)) return false;
    }
    return true;
};

const dropzone = new Dropzone();
dropzone.accept = '.mdx';
document.body.appendChild(dropzone);

dropzone.addEventListener('bufferupload', e => {
    const [file, buffer] = /** @type [File, ArrayBuffer] */ e.detail;

    const m = new Model(file.name);

    m.log('🏁 Начинаем парсинг.');

    const model = new MDX(buffer);
    model.read();

    for (const e of model.errors) {
        m.log(`⚠️ ${e}`);
    }

    const bb = model.write();
    const a = new DataView(model.buffer);
    const b = new DataView(bb);
    const eq = equal(a, b);

    if (!eq) {
        m.log('⚠️ Ошибка побайтового сравнения!');
    }

    if (model.errors.length === 0 && eq) {
        m.log('💋 Парсинг завершён успешно.');
    }

    const bu = URL.createObjectURL(new Blob([JSON.stringify(model, null, 4)], {type: 'application/json'}));
    m.json.target = '_blank';
    m.json.href = bu;

    const bj = URL.createObjectURL(new Blob([bb]));
    m.mdx.download = file.name;
    m.mdx.href = bj;

    m.buttons.style.removeProperty('display');

});

class Model {

    constructor(name) {
        const parent = document.createElement('div');
        parent.classList.add('model');
        document.body.appendChild(parent);

        const h1 = document.createElement('h1');
        h1.classList.add('model-header');
        h1.textContent = name;
        parent.appendChild(h1);

        this.logger = document.createElement('div');
        this.logger.classList.add('model-log');
        parent.appendChild(this.logger);

        this.buttons = document.createElement('div');
        this.buttons.style.display = 'none';
        this.buttons.classList.add('model-buttons');
        parent.appendChild(this.buttons);

        this.mdx = new Cyberlink();
        this.mdx.text = 'MDX';
        this.mdx.color = 'blue';
        this.buttons.appendChild(this.mdx);

        this.json = new Cyberlink();
        this.json.text = 'JSON';
        this.json.target = '_blank';
        this.json.color = 'green';
        this.buttons.appendChild(this.json);
    }

    log(text) {
        const p = document.createElement('p');
        p.textContent = text;
        this.logger.appendChild(p);
    }
}
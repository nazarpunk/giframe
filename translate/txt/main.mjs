import {Dropzone} from '../../web/dropzone.mjs';
import {RibbonHeader} from '../../web/ribbon-header.mjs';
import {WTS} from '../../wts/WTS.mjs';

const dropzone = new Dropzone();
dropzone.accept = '.wts';
document.body.appendChild(dropzone);

/**
 * @param {File} file
 * @param {string} text
 */
dropzone.readAsText = (file, text) => {
    RibbonHeader.fromText(file.name, document.body);

    const ta = document.createElement('textarea');

    const wts = new WTS(text);
    wts.read();

    ta.textContent = wts.toTXT();
    document.body.appendChild(ta);

    ta.style.height = '1px';
    ta.style.height = `${ta.scrollHeight}px`;
};


if (location.host.indexOf('localhost') === 0) {
    let name;
    name = 'war3map.wts';
    const response = await fetch(`../files/${name}`);
    const buffer = await response.text();

    dropzone.readAsText(new File([], name), buffer);
}
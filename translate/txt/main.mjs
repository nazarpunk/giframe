import {Dropzone} from '../../web/dropzone.mjs';
import {RibbonHeader} from '../../web/ribbon-header.mjs';
import {WTS} from '../../wts/WTS.mjs';
import fileNameExtension from '../../utils/file-name-extension.mjs';

const dropzone = new Dropzone();
dropzone.accept = '.wts,.txt';
document.body.appendChild(dropzone);

/**
 * @param {File} file
 * @param {string} text
 */
dropzone.readAsText = (file, text) => {
    RibbonHeader.fromText(file.name, document.body);

    const ta = document.createElement('textarea');

    switch (fileNameExtension(file.name)) {
        case 'wts':
            const wts = new WTS(text);
            wts.read();
            ta.textContent = wts.toTXT();
            break;

        case 'txt':
            const matches = text.matchAll(/^(\d+):([^(^\d+:)]+)/gm);

            for (const match of matches) {
                ta.textContent += `STRING ${match[1]}\n{\n${match[2].trim()}\n}\n\n`;
            }
            ta.textContent = ta.textContent.trim();
            break;
        default:
            return;
    }

    document.body.appendChild(ta);

    ta.style.height = '1px';
    ta.style.height = `${ta.scrollHeight}px`;
};


if (location.host.indexOf('localhost') === 0) {
    let name;
    name = 'war3map.wts';
    name = 'war3map.txt';
    const response = await fetch(`../files/${name}`);
    const buffer = await response.text();

    dropzone.readAsText(new File([], name), buffer);
}
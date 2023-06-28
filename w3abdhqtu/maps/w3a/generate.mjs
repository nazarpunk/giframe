import {SLK} from '../../../slk/SLK.mjs';
import fs from 'fs';
import WESTRING from '../../../westring/WESTRING.mjs';
import W3ABDHQTUTOMLMapType from '../W3ABDHQTUTOMLMapType.mjs';

const slk = new SLK(fs.readFileSync('abilitymetadata.slk', {encoding: 'utf8'}));
slk.read();

let out = '';

for (const list of slk.list) {
    const [raw, name, , , repeat, data, , description, , type] = list;
    const [itype, singleline] = W3ABDHQTUTOMLMapType(type);
    out += `\t${raw}: {type: ${itype}, data : ${data}, name: \`(${type}) ${name} ${repeat > 0 ? '[multilevel]' : ''}: ${WESTRING[description]}\`${repeat > 0 ? ', level : true' : ''}${singleline ? ', singleline : true' : ''}},\n`;
}

out = `/** @type {Object.<string, W3ABDHQTUTOMLMapProperty>} */\nconst map = \{\n${out}\n\};\nexport default map;`;
fs.writeFileSync(`W3ATOMLMap.mjs`, out, {flag: 'w+'});
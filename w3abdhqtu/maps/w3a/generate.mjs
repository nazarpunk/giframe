import {SLK} from '../../../slk/SLK.mjs';
import fs from 'fs';
import WESTRING from '../../../westring/WESTRING.mjs';

const slk = new SLK(fs.readFileSync(`abilitymetadata.slk`, {encoding: 'utf8'}));
slk.read();

let out = '';

for (const list of slk.list) {
    const [raw, name, , , repeat, , , description, , type] = list;
    let singleline = true;
    let itype = -1;

    switch (type) {
        case 'bool':
            itype = 0;
            break;
        case 'int':
        case 'unitCode':
        case 'detectionType':
        case 'upgradeCode':
        case 'morphFlags':
        case 'stackFlags':
        case 'interactionFlags':
        case 'fullFlags':
        case 'channelFlags':
        case 'pickFlags':
        case 'silenceFlags':
        case 'defenseTypeInt':
        case 'abilCode':
        case 'attackBits':
        case 'channelType':
            itype = 0;
            break;
        case 'real':
            itype = 1;
            break;
        case 'unreal':
            itype = 2;
            break;
        case 'string':
            itype = 3;
            singleline = false;
            break;
        case 'unitRace':
        case 'char':
        case 'icon':
        case 'soundLabel':
        case 'abilityList':
        case 'lightningList':
        case 'stringList':
        case 'modelList':
        case 'heroAbilityList':
        case 'orderString':
        case 'unitList':
        case 'techList':
        case 'intList':
        case 'unitSkinList':
        case 'targetList':
        case 'buffList':
        case 'effectList':
            itype = 3;
            break;
        default:
            throw new Error(`Missing type: ${type}`);

    }
    if (itype < 0) throw new Error(`Missing type int: ${type}`);


    out += `\t${raw}: {type: ${itype}, name: \`(${type}) ${name} ${repeat > 0 ? '[multilevel]' : ''}: ${WESTRING[description]}\`${repeat > 0 ? ', level : true' : ''}${singleline ? ', singleline : true' : ''}},\n`;
}

out = `/** @type {Object.<string, W3ABDHQTUTOMLMapProperty>} */\nconst map = \{\n${out}\n\};\nexport default map;`;
fs.writeFileSync(`W3ATOMLMap.mjs`, out, {flag: 'w+'});
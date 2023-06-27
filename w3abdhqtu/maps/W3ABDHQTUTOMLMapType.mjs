/**
 * @param {string} type
 * @return {[number, boolean]}
 */
export default (type) => {
    let itype = -1;
    let singleline = true;

    switch (type) {
        case 'bool':
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
        case 'attackBits': // unit
        case 'channelFlags': // ability
        case 'channelType': // ability
        case 'detectionType':
        case 'deathType': // unit
        case 'defenseTypeInt':
        case 'fullFlags':
        case 'int':
        case 'itemClass':
        case 'interactionFlags':
        case 'morphFlags':
        case 'pickFlags':
        case 'stackFlags':
        case 'silenceFlags':
        case 'teamColor': // unit
        case 'unitCode':
        case 'upgradeCode':
        case 'versionFlags':
            itype = 0;
            break;
        case 'abilCode': // unit
        case 'abilityList': // unit
        case 'abilitySkinList':
        case 'armorType': // unit
        case 'attributeType': // unit
        case 'attackType': // unit
        case 'aiBuffer': // unit
        case 'buffList': // ability
        case 'char':
        case 'combatSound': // unit
        case 'defenseType': // unit
        case 'effectList': // ability
        case 'heroAbilityList': // unit
        case 'icon':
        case 'intList': // ability, unit
        case 'itemList': // unit
        case 'lightningList':
        case 'modelList':
        case 'model':
        case 'moveType': // unit
        case 'orderString': // ability
        case 'pathingListPrevent':
        case 'pathingListRequire':
        case 'pathingTexture':
        case 'regenType': // unit
        case 'soundLabel':
        case 'stringList':
        case 'shadowTexture':
        case 'shadowImage':
        case 'targetList': // ability, unit
        case 'techList': // ability, unit
        case 'tilesetList': // unit
        case 'uberSplat':
        case 'unitClass': // unit
        case 'unitSound':
        case 'unitRace': // ability, unit
        case 'unitList': // unit
        case 'upgradeList': // unit
        case 'unitSkinList':
        case 'weaponType': // unit
            itype = 3;
            break;
        default:
            throw new Error(`Missing type: ${type}`);
    }

    if (itype < 0) throw new Error(`Missing type int: ${type}`);

    return [itype, singleline];
}
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
        case 'abilCode':
        case 'aiBuffer':
        case 'attackBits':
        case 'attributeType':
        case 'armorType':
        case 'channelType': //
        case 'detectionType':
        case 'deathType':
        case 'defenseTypeInt':
        case 'fullFlags':
        case 'int':
        case 'unitCode':
        case 'upgradeCode':
        case 'unitClass':
        case 'morphFlags':
        case 'regenType':
        case 'stackFlags':
        case 'itemClass':
        case 'interactionFlags':
        case 'channelFlags':
        case 'pickFlags':
        case 'silenceFlags':
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
        case 'abilityList':
        case 'abilitySkinList':
        case 'attackType':
        case 'buffList':
        case 'effectList':
        case 'char':
        case 'combatSound':
        case 'defenseType': //
        case 'icon':
        case 'soundLabel': //
        case 'stringList':
        case 'lightningList':
        case 'modelList':
        case 'heroAbilityList':
        case 'pathingListPrevent':
        case 'pathingListRequire':
        case 'pathingTexture':
        case 'shadowTexture':
        case 'orderString':
        case 'teamColor':
        case 'uberSplat':
        case 'unitSound':
        case 'techList':
        case 'shadowImage':
        case 'tilesetList':
        case 'intList':
        case 'itemList':
        case 'versionFlags':
        case 'model':
        case 'moveType':
        case 'unitRace':
        case 'targetList':
        case 'unitList':
        case 'upgradeList':
        case 'unitSkinList':
        case 'weaponType':
            itype = 3;
            break;
        default:
            throw new Error(`Missing type: ${type}`);
    }

    if (itype < 0) throw new Error(`Missing type int: ${type}`);

    return [itype, singleline];
}
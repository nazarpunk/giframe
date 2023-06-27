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
        //
        case 'abilCode':
        case 'aiBuffer':
        case 'attackBits':
        case 'attributeType':
        case 'armorType':
        case 'channelType': //
        case 'channelFlags':
        case 'detectionType':
        case 'deathType':
        case 'defenseTypeInt':
        case 'fullFlags':
        case 'int':
        case 'itemClass':
        case 'interactionFlags':
        case 'morphFlags':
        case 'pickFlags':
        case 'regenType':
        case 'stackFlags':
        case 'silenceFlags':
        case 'unitClass':
        case 'unitCode':
        case 'upgradeCode':
            itype = 0;
            break;
        case 'abilityList':
        case 'abilitySkinList':
        case 'attackType':
        case 'buffList':
        case 'char':
        case 'combatSound':
        case 'defenseType': //
        case 'effectList':
        case 'heroAbilityList':
        case 'icon':
        case 'intList':
        case 'itemList':
        case 'lightningList':
        case 'modelList':
        case 'model':
        case 'moveType':
        case 'orderString':
        case 'pathingListPrevent':
        case 'pathingListRequire':
        case 'pathingTexture':
        case 'soundLabel': //
        case 'stringList':
        case 'shadowTexture':
        case 'shadowImage':
        case 'teamColor':
        case 'uberSplat':
        case 'unitSound':
        case 'techList':
        case 'tilesetList':
        case 'targetList':
        case 'unitRace':
        case 'unitList':
        case 'upgradeList':
        case 'unitSkinList':
        case 'versionFlags':
        case 'weaponType':
            itype = 3;
            break;
        default:
            throw new Error(`Missing type: ${type}`);
    }

    if (itype < 0) throw new Error(`Missing type int: ${type}`);

    return [itype, singleline];
}
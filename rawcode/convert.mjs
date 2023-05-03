/**
 * @param {number} number
 * @return {string}
 */
export const Dec2RawBE = number => {
    const n = BigInt(number);
    return String.fromCharCode(Number(n >> 24n & 255n), Number(n >> 16n & 255n), Number(n >> 8n & 255n), Number(n & 255n));
};

/**
 * @param {number} number
 * @return {string}
 */
export const Dec2RawLE = number => {
    const n = BigInt(number);
    return String.fromCharCode(Number(n & 0xff), Number(n >> 8n & 0xff), Number(n >> 16n & 0xff), Number(n >> 24n & 0xff));
};

/**
 * @param {string} string
 * @return {bigint}
 */
export const Raw2Dec = string => BigInt(string.charCodeAt(3)) | BigInt(string.charCodeAt(2)) << 8n | BigInt(string.charCodeAt(1)) << 16n | BigInt(string.charCodeAt(0)) << 24n;

/**
 * @param {string} string
 * @return {string}
 */
export const Raw2HexLE = string => `${string.charCodeAt(3).toString(16)}${string.charCodeAt(2).toString(16)}${string.charCodeAt(1).toString(16)}${string.charCodeAt(0).toString(16)}`;

/**
 * @param string
 * @return {string}
 */
export const HexLE2Raw = string => `${String.fromCharCode(parseInt(`${string[7]}${string[6]}`, 16))}${String.fromCharCode(parseInt(`${string[5]}${string[4]}`, 16))}${String.fromCharCode(parseInt(`${string[3]}${string[2]}`, 16))}${String.fromCharCode(parseInt(`${string[1]}${string[0]}`, 16))}`;
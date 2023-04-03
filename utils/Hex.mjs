export const HexInt2StringBE = number => number === 0 ? '' : String.fromCharCode(
    number >> 24 & 0xff,
    number >> 16 & 0xff,
    number >> 8 & 0xff,
    number & 0xff,
);
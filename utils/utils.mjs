/**
 * @param  {number} num
 * @return {number}
 */
export const nextPow2 = num => num > 0 && (num & num - 1) === 0 ? num : 1 << 32 - Math.clz32(num);

/**
 * @param {number} num
 * @param {number} divider
 * @return {number}
 */
export const nextDivisible = (num, divider) => num % divider === 0 ? num : Math.ceil(num / divider) * divider;

// noinspection JSUnusedLocalSymbols
/**
 * @param  {number} num
 * @return {number}
 */
const nextPow2 = num => num > 0 && (num & num - 1) === 0 ? num : 1 << 32 - Math.clz32(num);

/**
 * @param {number} m
 * @param {number} i
 * @return {number}
 */
const getBorderLen = (m, i = 1) => {
	const x = 2 ** i;
	return x < m ? getBorderLen(m, i + 1) : x;
};

/**
 * @param {number} width
 * @param {number} height
 * @param {number} count
 * @return {[number,number]}
 */
export const getSquare = (width, height, count) => {
	const proportion = width / height;
	const pole = [[]];
	const [min, max] = proportion >= 1 ? [height, width] : [width, height];
	let curRow = 0;
	let cnt = count;
	while (cnt) {
		pole[curRow].push(1);
		if (pole[curRow].length * min + min > pole.length * max + max) {
			if (pole.length - 1 === curRow) {
				curRow++;
				pole.push([])
			}
		}
		if (curRow && pole[curRow].length === pole[0].length && !pole[curRow + 1]) {
			curRow = 0
		}
		if (pole[curRow + 1] && pole[curRow].length > pole[curRow + 1].length) {
			curRow++
		}
		cnt--;
	}
	return [getBorderLen(proportion >= 1 ? pole[0].length * min : pole.length * max), getBorderLen(proportion >= 1 ? pole.length * max : pole[0].length * min)];
};
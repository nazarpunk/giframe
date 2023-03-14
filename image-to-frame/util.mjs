import {nextPow2} from "../utils/utils.mjs";

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

	const w = getBorderLen(proportion >= 1 ? pole[0].length * min : pole.length * max);
	//const h = getBorderLen(proportion >= 1 ? pole.length * max : pole[0].length * min);

	const col = Math.floor(w / width);
	const row = Math.ceil(count / col);

	return [nextPow2(col * width), nextPow2(row * height)];
};
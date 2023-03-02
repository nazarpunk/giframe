/**
 * @param  {number} num
 * @return {number}
 */
const nextPow2 = num => num > 0 && (num & num - 1) === 0 ? num : 1 << 32 - Math.clz32(num);

/**
 * @param {number} w
 * @param {number} h
 * @param count
 * @return {[number,number]}
 */
export const textureSize = (w, h, count) => {
	let xw = nextPow2(w);
	let xh = nextPow2(h);
	let x = 0;
	let y = 1;

	for (let i = 0; i < count; i++) {
		x++;
		if (x * w <= xw) {
			continue;
		}
		if (x < y) {
			xw *= 2;
			continue;
		}
		y++;
		if (y * h > xh) {
			x = 0;
			xh *= 2;
		}
	}
	const col = Math.floor(xw / w);
	const row = Math.ceil(count / col);

	return [nextPow2(col * w), nextPow2(row * h)];
};

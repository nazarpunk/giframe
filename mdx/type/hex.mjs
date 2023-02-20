/** @module MDX */
// noinspection JSUnusedGlobalSymbols

/** @param {String} s */
export const hex = s => {
	const out = `0x${s.charCodeAt(3).toString(16)}${s.charCodeAt(2).toString(16)}${s.charCodeAt(1).toString(16)}${s.charCodeAt(0).toString(16)}/*${s}*/`;
	console.log(out);
	return out;
};

export const hex2s = h => {
	const view = new DataView(new Uint32Array(4).buffer);
	view.setUint32(0, h, true);
	const s = [];
	for (let i = 0; i < 4; i++) {
		s.push(String.fromCharCode(view.getUint8(i)));
	}
	return s.join('');
};
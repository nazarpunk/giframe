import parseAPNG from "../apng/parser.mjs";

const response = await fetch(`model/sprite.png`);
const buffer = await response.arrayBuffer();

const apng = parseAPNG(buffer);

await apng.createBitmap(apng.width, apng.height);

const div = document.createElement('div');
document.body.appendChild(div);

const canvas = document.createElement('canvas');
div.appendChild(canvas);

canvas.width = apng.width;
canvas.height = apng.height;

const input = document.createElement('input');
input.type = 'color';
input.value = 'rgba(0,0,0,0)';
input.addEventListener('input', () => {
	div.style.backgroundColor = input.value;

});
input.addEventListener('change', () => {
	div.style.backgroundColor = input.value;
});

div.appendChild(input);

const ctx = canvas.getContext('2d');

let start;
let current = -1;

function animate(timestamp) {
	start ??= timestamp;
	const progress = timestamp - start;

	let sum = 0;
	let cur = -1;
	for (let i = 0; i < apng.frames.length; i++) {
		sum += apng.frames[i].delay;
		if (progress < sum) {
			cur = i;
			break;
		}
	}
	if (cur < 0) {
		start = timestamp;
		cur = 0;
	}

	if (current !== cur) {
		current = cur;
		const f = apng.frames[cur];
		ctx.clearRect(0, 0, apng.width, apng.height);
		ctx.drawImage(f.imageBitmap, f.left, f.top);
	}

	window.requestAnimationFrame(animate);
}

requestAnimationFrame(animate);


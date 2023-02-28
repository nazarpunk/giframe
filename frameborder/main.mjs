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
let current = 0;
let prev = -1;

function animate(timestamp) {
	start ??= timestamp;
	const progress = timestamp - start;

	let fr = apng.frames[current];
	if (progress > fr.delay) {
		start = timestamp;
		current = current >= apng.frames.length - 1 ? 0 : current + 1;
	}

	if (current !== prev) {
		prev = current;
		const f = apng.frames[prev];
		ctx.clearRect(0, 0, apng.width, apng.height);
		ctx.drawImage(f.imageBitmap, f.left, f.top);
	}

	window.requestAnimationFrame(animate);
}

requestAnimationFrame(animate);


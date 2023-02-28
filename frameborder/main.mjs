import parseAPNG from "../apng/parser.mjs";

const response = await fetch(`model/sprite.png`);
const buffer = await response.arrayBuffer();

const apng = parseAPNG(buffer);


for (const frame of apng.frames) {

	const canvas = document.createElement('canvas');
	document.body.appendChild(canvas);
	canvas.width = apng.width;
	canvas.height = apng.height;

	const ctx = canvas.getContext('2d');

	const b = await createImageBitmap(frame.imageData);

	ctx.drawImage(b, frame.top, frame.left);

	//canvas.getContext('2d').drawImage(imageBitmap, 0, 0)


	//input.addEventListener('change', blobToCanvas, false);

}

console.log(apng);

import {MDX} from "./mdx/MDX.mjs";

const name = 'heroarchmage_ref';

const response = await fetch(`models/${name}.mdx`);
const buffer = await response.arrayBuffer();

let model;

try {
	model = new MDX(buffer);
	model.read();
	console.log(model);
} catch (e) {
	console.log(e);
}



//const a = Array.from(Uint32Array.from(buffer));

/*
const a = document.createElement('a');
const blob = new Blob();
const f = new File([''], "filename");

const url = URL.createObjectURL(blob) // Create an object URL from blob
a.setAttribute('href', url) // Set "a" element link
a.setAttribute('download', filename) // Set download filename
a.click() // Start downloading
}
*/
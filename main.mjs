// noinspection JSUnusedGlobalSymbols

import {Model} from "./model/Model.mjs";

const response = await fetch('mdx/sprite.mdx');
const buffer = await response.arrayBuffer();

const model = new Model(buffer);

//const a = Array.from(Uint32Array.from(buffer));

//console.log(a);
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


//const bfr = new ArrayBuffer(2**30);
//console.log(bfr);


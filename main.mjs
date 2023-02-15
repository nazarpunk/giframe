// noinspection JSUnusedGlobalSymbols

import {Model} from "./model/Model.mjs";

const response = await fetch('7x7sprite.mdx');
const buffer = await response.arrayBuffer();

new Model(buffer);

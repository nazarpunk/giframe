// noinspection JSUnusedGlobalSymbols

import {Model} from "./model/Model.mjs";

const response = await fetch('mdx/sprite.mdx');
const buffer = await response.arrayBuffer();

new Model(buffer);

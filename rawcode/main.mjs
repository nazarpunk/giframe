import {InputNumber} from './components/input-number.mjs';


const container = document.createElement('div');
container.classList.add('container');
document.body.appendChild(container);

const raw = InputNumber.create(container);
raw.maxLength = 4;
raw.text = 'WWWW';

const hex = InputNumber.create(container);
hex.maxLength = 8;
hex.text = 'WWWWWWWW';

const num = InputNumber.create(container);
num.maxLength = 10;
num.text = 'WWWWWWWWWW';


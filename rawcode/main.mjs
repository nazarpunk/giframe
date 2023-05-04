import {RawcodeInput} from './components/rawcode-input.mjs';
import {Dec2RawBE, Raw2Dec, Raw2HexBE, HexBE2Raw, Dec2HexBE} from './convert.mjs';

const container = document.createElement('div');
container.classList.add('container');
document.body.appendChild(container);

const raw = new RawcodeInput('raw', container);
const hex = new RawcodeInput('hex', container);
const dec = new RawcodeInput('dec', container);

// raw
raw.input.addEventListener('update', () => {
    const string = raw.text;
    dec.text = Raw2Dec(string).toString();
    hex.text = Raw2HexBE(string);
});

// hex
hex.input.addEventListener('update', () => {
    const string = hex.text;
    const _raw = HexBE2Raw(string);
    raw.text = _raw;
    dec.text = Raw2Dec(_raw).toString();
});

// num
dec.input.addEventListener('update', () => {
    const string = dec.text;
    const number = BigInt(parseInt(string));
    raw.text = Dec2RawBE(number);
    hex.text = Dec2HexBE(number);

    console.log(string, number);
});

const popstate = () => {
    const text = window.location.hash.substring(1);
    if (!hex.valid(text)) return;
    hex.text = text;
    hex.dispatch();
};
popstate();
addEventListener('popstate', popstate);
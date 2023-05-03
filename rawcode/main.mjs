import {RawcodeInput} from './components/rawcode-input.mjs';
import {Dec2RawBE, Raw2HexLE, Raw2Dec, HexLE2Raw} from './convert.mjs';

const container = document.createElement('div');
container.classList.add('container');
document.body.appendChild(container);

const raw = RawcodeInput.create(container);
raw.maxLength = 4;
raw.colorGroup = 1;
raw.text = 'A0U2';

const hex = RawcodeInput.create(container);
hex.maxLength = 8;
hex.prefix = '0x';
hex.colorGroup = 2;
hex.text = '32553041';

const dec = RawcodeInput.create(container);
dec.maxLength = 10;
dec.text = '1093686578';

// raw
raw.input.addEventListener('input', () => {
    const string = raw.text;
    if (!/^[\x00-\xFF]{4}$/.test(string)) return;
    dec.text = Raw2Dec(string).toString();
    hex.text = Raw2HexLE(string);
});

// hex
hex.input.addEventListener('input', () => {
    const string = hex.text;
    if (!/^[0-9a-fA-F]{8}$/.test(string)) return;
    const _raw = HexLE2Raw(string);
    raw.text = _raw;
    dec.text = Raw2Dec(_raw).toString();
});

// num
dec.input.addEventListener('input', () => {
    const string = dec.text;
    if (!/^[1-9]\d*$/g.test(string)) return;
    const int = parseInt(string);
    const _raw = Dec2RawBE(int);
    raw.text = _raw;
    hex.text = Raw2HexLE(_raw);
});



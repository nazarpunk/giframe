import {InputNumber} from './components/input-number.mjs';
import {HexInt2StringBE, HexInt2StringLE, HexString2HexLE, HexString2IntLE} from '../utils/hex.mjs';

const container = document.createElement('div');
container.classList.add('container');
document.body.appendChild(container);

const raw = InputNumber.create(container);
raw.maxLength = 4;
raw.colorGroup = 1;
raw.text = 'A0U2';

const hex = InputNumber.create(container);
hex.maxLength = 8;
hex.prefix = '0x';
hex.colorGroup = 2;
hex.text = '32553041';

const num = InputNumber.create(container);
num.maxLength = 10;
num.text = '1093686578';

// raw
raw.addEventListener('input', () => {
    const string = raw.text;
    if (string.length !== 4) return;
    for (const s of string) {
        if (s < 0 || s > 255) return;
    }

    num.text = HexString2IntLE(string).toString();
    hex.text = HexString2HexLE(string);
});

// hex
hex.addEventListener('input', () => {
    const string = hex.text;
    if (!/^[0-9a-fA-F]{8}$/.test(string)) return;
    const _raw = string.match(/.{1,2}/g).reverse().reduce((s, v) => s + String.fromCharCode(parseInt(v, 16)), '');
    raw.text = _raw;
    num.text = HexString2IntLE(_raw).toString();
});

// num
num.addEventListener('input', () => {
    const string = num.text;
    if (!/^[0-9]{1,10}$/.test(string)) return;
    const int = parseInt(string);
    const _raw = HexInt2StringBE(int);
    raw.text = _raw;
    hex.text = HexString2HexLE(_raw);
});



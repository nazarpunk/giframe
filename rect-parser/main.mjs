// native Rect takes real minx, real miny, real maxx, real maxy returns rect

const input = document.querySelector('.input');
const output = document.querySelector('.output');

class Rect {
    name = ''
    minx = 0
    miny = 0
    maxx = 0
    maxy = 0

    /**
     * @param {string} name
     * @param {string} minx
     * @param {string} miny
     * @param {string} maxx
     * @param {string} maxy
     */
    constructor(name, minx, miny, maxx, maxy) {
        this.name = name;
        this.minx = parseFloat(minx);
        this.miny = parseFloat(miny);
        this.maxx = parseFloat(maxx);
        this.maxy = parseFloat(maxy);
    }

    get valid() {
        return !isNaN(this.minx) && !isNaN(this.miny) && !isNaN(this.maxx) && !isNaN(this.maxy)
    }

    toString() {
        return `${this.name} (minX:${Math.round(this.minx)}, minY:${Math.round(this.miny)}, maxX:${Math.round(this.maxx)}, maxY:${Math.round(this.maxy)})`
    }
}

const rex = /set\s+gg_rct_([_a-zA-Z\d]+)\s*=\s*Rect\(\s*(-?\d+\.?\d*|\.\d+)\s*,\s*(-?\d+\.?\d*|\.\d+)\s*,\s*(-?\d+\.?\d*|\.\d+)\s*,\s*(-?\d+\.?\d*|\.\d+)\s*\)/gm

const parse = () => {
    const list = [...input.value.matchAll(rex)];
    /** @type {Rect[]} */ const rects = [];

    for (const item of list) {
        if (item.length !== 6) continue;
        item.shift();
        const r = new Rect(...item);
        if (!r.valid) continue
        rects.push(new Rect(...item))
    }

    output.textContent = '';
    for (const rect of rects) {
        output.textContent += `${rect}\n`;
    }

}
input.addEventListener('input', parse);
export {}

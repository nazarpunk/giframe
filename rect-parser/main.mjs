// native Rect takes real minx, real miny, real maxx, real maxy returns rect

const input = document.querySelector('.input')
const output = document.querySelector('.output')
/** @type {HTMLAnchorElement} */ const button = document.querySelector('.save')

const prefix = 'gg_rct_'

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
        this.name = name
        this.minx = parseFloat(minx)
        this.miny = parseFloat(miny)
        this.maxx = parseFloat(maxx)
        this.maxy = parseFloat(maxy)
    }

    get valid() {
        return !isNaN(this.minx) && !isNaN(this.miny) && !isNaN(this.maxx) && !isNaN(this.maxy)
    }

    toString() {
        return `${this.name} (${Math.trunc(this.minx)}, ${Math.trunc(this.miny)}, ${Math.trunc(this.maxx)}, ${Math.trunc(this.maxy)})`
    }
}

const rex = /set\s+([_a-zA-Z\d]+)\s*=\s*Rect\s*\(([^)]+)\)/gm

/** @type {Rect[]} */ const rects = []

const parse = () => {
    const list = [...input.value.matchAll(rex)]

    rects.splice(0, rects.length)
    for (const item of list) {
        if (item.length !== 3) continue
        const values = item[2].split(',').map(v => parseFloat(v.replace(/[^-.\d]/g, '')))
        if (values.length !== 4) continue
        let name = item[1]
        if (name.startsWith(prefix)) name = name.substring(prefix.length, name.length)
        const r = new Rect(name, ...values)
        if (!r.valid) continue
        rects.push(r)
    }

    output.textContent = ''
    for (const rect of rects) {
        output.textContent += `${rect}\n`
    }
}
input.addEventListener('input', parse)

if (location.host.startsWith('localhost')) {
    input.value = 'set gg_rct_dwfwf = Rect( -   1.0 , - .0 , -3 , -    .4)'
    parse()
}

// https://xgm.guru/p/wc3/w3-file-format
button.addEventListener('click', () => {
    const textDecoder = new TextEncoder('utf-8')
    // noinspection JSCheckFunctionSignatures
    const buffer = new ArrayBuffer(0, {maxByteLength: 0xffffffff})
    const view = new DataView(buffer)

    let cursor = 0

    /**
     * @param {number} value
     * @param {boolean} int
     */
    const number = (value, int) => {
        const offset = cursor
        cursor += 4
        buffer.resize(cursor)
        if (int) view.setInt32(offset, value, true)
        else view.setFloat32(offset, value, true)
    }

    const color = value => {
        const offset = cursor
        cursor += 4
        buffer.resize(cursor)
        view.setInt32(offset, value, false)
    }

    const string = value => {
        const offset = cursor
        const list = textDecoder.encode(value)
        cursor += list.length + 1
        buffer.resize(cursor)
        for (let i = 0; i < list.length; i++) {
            view.setUint8(offset + i, list[i])
        }
        view.setUint8(offset + list.length, 0)
    }

    number(5, true) // Версия формата
    number(rects.length, true) // Количество областей

    for (let i = 0; i < rects.length; i++) {
        const rect = rects[i]
        number(rect.minx, false) // Влево
        number(rect.miny, false) // Вниз
        number(rect.maxx, false) // Вправо
        number(rect.maxy, false) // Вверх
        string(rect.name) // Название
        number(i, true) // Номер области
        number(0, true) // Равкод погоды
        string('') // Фоновый звук
        color(0x11D933FF)
    }

    const list = new Uint8Array(buffer.byteLength)
    for (let i = 0; i < list.length; i++) {
        list[i] = view.getUint8(i)
    }

    const url = URL.createObjectURL(new Blob([list]))
    button.target = '_blank'
    button.href = url
    button.download = 'war3map.w3r'

})

export {}

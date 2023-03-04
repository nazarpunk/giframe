// noinspection JSBitwiseOperatorUsage

class Stream {
	constructor(data) {
		this.data = new Uint8ClampedArray(data);
		this.pos = 0;
		let len = this.data.length;
		this.getString = function (count) { // returns a string from current pos of len count
			let s = "";
			while (count--) {
				s += String.fromCharCode(this.data[this.pos++])
			}
			return s;
		};
		this.readSubBlocks = function () { // reads a set of blocks as a string
			let size, count, data = "";
			do {
				count = size = this.data[this.pos++];
				while (count--) {
					data += String.fromCharCode(this.data[this.pos++])
				}
			} while (size !== 0 && this.pos < len);
			return data;
		};
		this.readSubBlocksB = function () { // reads a set of blocks as binary
			let size, count, data = [];
			do {
				count = size = this.data[this.pos++];
				while (count--) {
					data.push(this.data[this.pos++]);
				}
			} while (size !== 0 && this.pos < len);
			return data;
		}
	}
}

const interlaceOffsets = [0, 4, 2, 1]; // used in de-interlacing.
const interlaceSteps = [8, 8, 4, 2];

const GIF_FILE = { // gif file data headers
	GCExt: 0xF9,
	COMMENT: 0xFE,
	APPExt: 0xFF,
	UNKNOWN: 0x01, // not sure what this is but need to skip it in parser
	IMAGE: 0x2C,
	EOF: 59,   // This is entered as decimal
	EXT: 0x21,
};

export class GIFOLD {
	width = 0;
	height = 0;
	/** @type {Frame[]} */ frames = [];
	comment = '';
	time = 0;
	st;
	interlacedBufSize;  // this holds a buffer to de interlace. Created on the first frame and when size changed
	deinterlaceBuf;
	pixelBufSize;    // this holds a buffer for pixels. Created on the first frame and when size changed
	pixelBuf;

	// LZW decoder uncompressed each frames pixels
	// this needs to be optimised.
	// minSize is the min dictionary as powers of two
	// size and data is the compressed pixels
	lzwDecode(minSize, data) {
		let i, pixelPos, pos, clear, eod, size, done, dic, code, d, len;
		pos = pixelPos = 0;
		dic = [];
		clear = 1 << minSize;
		eod = clear + 1;
		size = minSize + 1;
		done = false;
		while (!done) {
			// noinspection JSUnusedAssignment
			let last = code;
			code = 0;
			for (i = 0; i < size; i++) {
				if (data[pos >> 3] & 1 << (pos & 7)) {
					code |= 1 << i
				}
				pos++;
			}
			if (code === clear) {
				dic = [];
				size = minSize + 1;
				for (i = 0; i < clear; i++) {
					dic[i] = [i]
				}
				dic[clear] = [];
				dic[eod] = null;
			} else {
				if (code === eod) {
					done = true;
					return
				}
				if (code >= dic.length) {
					dic.push(dic[last].concat(dic[last][0]))
				} else if (last !== clear) {
					dic.push(dic[last].concat(dic[code][0]))
				}
				d = dic[code];
				len = d.length;
				for (i = 0; i < len; i++) {
					this.pixelBuf[pixelPos++] = d[i]
				}
				if (dic.length === 1 << size && size < 12) {
					size++
				}
			}
		}
	}

	parseColourTable(count) { // get a colour table of length count  Each entry is 3 bytes, for RGB.
		const colours = [];
		for (let i = 0; i < count; i++) {
			colours.push([this.st.data[this.st.pos++], this.st.data[this.st.pos++], this.st.data[this.st.pos++]])
		}
		return colours;
	}

	parseAppExt() { // get application specific data. Netscape added iterations and terminator. Ignoring that
		this.st.pos += 1;
		if ('NETSCAPE' === this.st.getString(8)) {
			this.st.pos += 8
		}  // ignoring this data. iterations (word) and terminator (byte)
		else {
			this.st.pos += 3;            // 3 bytes of string usually "2.0" when identifier is NETSCAPE
			this.st.readSubBlocks();     // unknown app extension
		}
	}

	parseGCExt() { // get GC data
		let bitField;
		this.st.pos++;
		bitField = this.st.data[this.st.pos++];
		this.disposalMethod = (bitField & 0b11100) >> 2;
		this.transparencyGiven = !!(bitField & 0b1); // ignoring bit two that is marked as  userInput???
		this.delayTime = this.st.data[this.st.pos++] + (this.st.data[this.st.pos++] << 8);
		this.transparencyIndex = this.st.data[this.st.pos++];
		this.st.pos++;
	}

	parseImg() {
		const frame = new Frame();
		this.frames.push(frame);
		frame.disposalMethod = this.disposalMethod;
		frame.time = this.time;
		frame.delay = this.delayTime * 10;
		this.time += frame.delay;
		frame.transparencyIndex = this.transparencyGiven ? this.transparencyIndex : undefined;
		frame.left = this.st.data[this.st.pos++] + (this.st.data[this.st.pos++] << 8);
		frame.top = this.st.data[this.st.pos++] + (this.st.data[this.st.pos++] << 8);
		frame.width = this.st.data[this.st.pos++] + (this.st.data[this.st.pos++] << 8);
		frame.height = this.st.data[this.st.pos++] + (this.st.data[this.st.pos++] << 8);
		const bitField = this.st.data[this.st.pos++];
		frame.localColourTableFlag = !!(bitField & 0b10000000);
		if (frame.localColourTableFlag) {
			frame.localColourTable = this.parseColourTable(1 << (bitField & 0b111) + 1)
		}
		if (this.pixelBufSize !== frame.width * frame.height) {
			this.pixelBuf = new Uint8Array(frame.width * frame.height);
			this.pixelBufSize = frame.width * frame.height;
		}
		this.lzwDecode(this.st.data[this.st.pos++], this.st.readSubBlocksB()); // decode the pixels

		if (bitField & 0b1000000) {// de interlace if needed
			frame.interlaced = true;
			const width = frame.width;
			let lines, fromLine, pass;
			lines = this.pixelBufSize / width;
			fromLine = 0;
			if (this.interlacedBufSize !== this.pixelBufSize) {
				this.deinterlaceBuf = new Uint8Array(this.pixelBufSize);
				this.interlacedBufSize = this.pixelBufSize;
			}
			for (pass = 0; pass < 4; pass++) {
				for (let toLine = interlaceOffsets[pass]; toLine < lines; toLine += interlaceSteps[pass]) {
					this.deinterlaceBuf.set(this.pixelBuf.subarray(fromLine, fromLine + width), toLine * width);
					fromLine += width;
				}
			}
		} else {
			frame.interlaced = false
		}

		frame.image = document.createElement('canvas');
		frame.image.width = this.width;
		frame.image.height = this.height;
		frame.image.ctx = frame.image.getContext("2d");
		const ct = frame.localColourTableFlag ? frame.localColourTable : this.globalColourTable;
		const useT = frame.disposalMethod === 2 || frame.disposalMethod === 3;
		if (!useT) {
			frame.image.ctx.drawImage(frame.image, 0, 0, this.width, this.height);
		}

		frame.imageData = frame.image.ctx.getImageData(frame.left, frame.top, frame.width, frame.height);
		const ti = frame.transparencyIndex;
		let pDat = frame.interlaced ? this.deinterlaceBuf : this.pixelBuf;
		let ind = 0;
		const d = frame.imageData.data;
		for (let i = 0; i < pDat.length; i++) {
			const pixel = pDat[i];
			const col = ct[pixel];
			if (ti !== pixel) {
				d[ind++] = col[0];
				d[ind++] = col[1];
				d[ind++] = col[2];
				d[ind++] = 255;      // Opaque.
			} else if (useT) {
				d[ind + 3] = 0; // Transparent.
				ind += 4;
			} else {
				ind += 4
			}
		}
		frame.image.ctx.putImageData(frame.imageData, frame.left, frame.top);
	}

	parseExt() {
		const blockID = this.st.data[this.st.pos++];
		if (blockID === GIF_FILE.GCExt) {
			this.parseGCExt()
		} else if (blockID === GIF_FILE.COMMENT) {
			this.comment += this.st.readSubBlocks()
		} else if (blockID === GIF_FILE.APPExt) {
			this.parseAppExt()
		} else {
			if (blockID === GIF_FILE.UNKNOWN) {
				this.st.pos += 13;
			} // skip unknow block
			this.st.readSubBlocks();
		}
	}

	parseBlock() {
		const blockId = this.st.data[this.st.pos++];
		if (blockId === GIF_FILE.IMAGE) {
			this.parseImg();
		} else if (blockId === GIF_FILE.EOF) {
			return
		} else {
			this.parseExt()
		}
		this.parseBlock();
	}

	dataLoaded(data) { // Data loaded create stream and parse
		this.st = new Stream(data);
		let bitField;
		this.st.pos += 6;
		this.width = this.st.data[this.st.pos++] + (this.st.data[this.st.pos++] << 8);
		this.height = this.st.data[this.st.pos++] + (this.st.data[this.st.pos++] << 8);
		bitField = this.st.data[this.st.pos++];
		this.globalColourCount = 1 << (bitField & 0b111) + 1;
		this.st.pos++;
		this.st.pos++;
		if (bitField & 0b10000000) {
			this.globalColourTable = this.parseColourTable(this.globalColourCount)
		}
		this.parseBlock();
	}

	createBitmap() {
		return Promise.all(this.frames.map(f => f.createBitmap()));
	}
}

class Frame {

	/** @return {Promise<ImageBitmap>} */
	createBitmap() {
		return new Promise(async resolve => {
			this.imageBitmap = await createImageBitmap(this.imageData);
			resolve(this.imageBitmap)
		});
	}

}
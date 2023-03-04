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

export const GIFOLD = function () {
	const gif = {                      // the gif image object
		onload: null,       // fire on load. Use waitTillDone = true to have load fire at end or false to fire on first frame
		onerror: null,       // fires on error
		onprogress: null,       // fires a load progress event
		onloadall: null,       // event fires when all frames have loaded and gif is ready
		paused: false,      // true if paused
		waitTillDone: true,       // If true onload will fire when all frames loaded, if false, onload will fire when first frame has loaded
		loading: false,      // true if still loading
		firstFrameOnly: false,      // if true only load the first frame
		width: null,       // width in pixels
		height: null,       // height in pixels
		frames: [],         // array of frames
		comment: "",         // comments if found in file. Note I remember that some gifs have comments per frame if so this will be all comment concatenated
		length: 0,          // gif length in ms (1/1000 second)
		currentFrame: 0,          // current frame.
		frameCount: 0,          // number of frames
		lastFrame: null,       // temp hold last frame loaded so you can display the gif as it loads
		image: null,       // the current image at the currentFrame
		dataLoaded: dataLoaded,
	};
	let st;                               // holds the stream object when loading.
	const interlaceOffsets = [0, 4, 2, 1]; // used in de-interlacing.
	const interlaceSteps = [8, 8, 4, 2];
	let interlacedBufSize;  // this holds a buffer to de interlace. Created on the first frame and when size changed
	let deinterlaceBuf;
	let pixelBufSize;    // this holds a buffer for pixels. Created on the first frame and when size changed
	let pixelBuf;
	const GIF_FILE = { // gif file data headers
		GCExt: 0xF9,
		COMMENT: 0xFE,
		APPExt: 0xFF,
		UNKNOWN: 0x01, // not sure what this is but need to skip it in parser
		IMAGE: 0x2C,
		EOF: 59,   // This is entered as decimal
		EXT: 0x21,
	};

	// LZW decoder uncompressed each frames pixels
	// this needs to be optimised.
	// minSize is the min dictionary as powers of two
	// size and data is the compressed pixels
	function lzwDecode(minSize, data) {
		let i, pixelPos, pos, clear, eod, size, done, dic, code, last, d, len;
		pos = pixelPos = 0;
		dic = [];
		clear = 1 << minSize;
		eod = clear + 1;
		size = minSize + 1;
		done = false;
		while (!done) { // JavaScript optimisers like a clear exit though I never use 'done' apart from fooling the optimiser
			last = code;
			code = 0;
			for (i = 0; i < size; i++) {
				if (data[pos >> 3] & 1 << (pos & 7)) {
					code |= 1 << i
				}
				pos++;
			}
			if (code === clear) { // clear and reset the dictionary
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
					pixelBuf[pixelPos++] = d[i]
				}
				if (dic.length === 1 << size && size < 12) {
					size++
				}
			}
		}
	}

	function parseColourTable(count) { // get a colour table of length count  Each entry is 3 bytes, for RGB.
		const colours = [];
		for (let i = 0; i < count; i++) {
			colours.push([st.data[st.pos++], st.data[st.pos++], st.data[st.pos++]])
		}
		return colours;
	}

	function parseAppExt() { // get application specific data. Netscape added iterations and terminator. Ignoring that
		st.pos += 1;
		if ('NETSCAPE' === st.getString(8)) {
			st.pos += 8
		}  // ignoring this data. iterations (word) and terminator (byte)
		else {
			st.pos += 3;            // 3 bytes of string usually "2.0" when identifier is NETSCAPE
			st.readSubBlocks();     // unknown app extension
		}
	}

	function parseGCExt() { // get GC data
		let bitField;
		st.pos++;
		bitField = st.data[st.pos++];
		gif.disposalMethod = (bitField & 0b11100) >> 2;
		gif.transparencyGiven = !!(bitField & 0b1); // ignoring bit two that is marked as  userInput???
		gif.delayTime = st.data[st.pos++] + (st.data[st.pos++] << 8);
		gif.transparencyIndex = st.data[st.pos++];
		st.pos++;
	}

	function parseImg() {                           // decodes image data to create the indexed pixel image
		let deinterlace, frame, bitField;
		deinterlace = function (width) {                   // de interlace pixel data if needed
			let lines, fromLine, pass;
			lines = pixelBufSize / width;
			fromLine = 0;
			if (interlacedBufSize !== pixelBufSize) {      // create the buffer if size changed or undefined.
				deinterlaceBuf = new Uint8Array(pixelBufSize);
				interlacedBufSize = pixelBufSize;
			}
			for (pass = 0; pass < 4; pass++) {
				for (let toLine = interlaceOffsets[pass]; toLine < lines; toLine += interlaceSteps[pass]) {
					deinterlaceBuf.set(pixelBuf.subarray(fromLine, fromLine + width), toLine * width);
					fromLine += width;
				}
			}
		};
		frame = {};
		gif.frames.push(frame);
		frame.disposalMethod = gif.disposalMethod;
		frame.time = gif.length;
		frame.delay = gif.delayTime * 10;
		gif.length += frame.delay;
		if (gif.transparencyGiven) {
			frame.transparencyIndex = gif.transparencyIndex
		} else {
			frame.transparencyIndex = undefined
		}
		frame.leftPos = st.data[st.pos++] + (st.data[st.pos++] << 8);
		frame.topPos = st.data[st.pos++] + (st.data[st.pos++] << 8);
		frame.width = st.data[st.pos++] + (st.data[st.pos++] << 8);
		frame.height = st.data[st.pos++] + (st.data[st.pos++] << 8);
		bitField = st.data[st.pos++];
		frame.localColourTableFlag = !!(bitField & 0b10000000);
		if (frame.localColourTableFlag) {
			frame.localColourTable = parseColourTable(1 << (bitField & 0b111) + 1)
		}
		if (pixelBufSize !== frame.width * frame.height) { // create a pixel buffer if not yet created or if current frame size is different from previous
			pixelBuf = new Uint8Array(frame.width * frame.height);
			pixelBufSize = frame.width * frame.height;
		}
		lzwDecode(st.data[st.pos++], st.readSubBlocksB()); // decode the pixels
		if (bitField & 0b1000000) {                        // de interlace if needed
			frame.interlaced = true;
			deinterlace(frame.width);
		} else {
			frame.interlaced = false
		}
		processFrame(frame);                               // convert to canvas image
	}

	function processFrame(frame) {
		console.log(frame);

		let ct, cData, dat, pixCount, ind, useT, i, pixel, pDat, col, ti;
		frame.image = document.createElement('canvas');
		frame.image.width = gif.width;
		frame.image.height = gif.height;
		frame.image.ctx = frame.image.getContext("2d");
		ct = frame.localColourTableFlag ? frame.localColourTable : gif.globalColourTable;
		if (gif.lastFrame === null) {
			gif.lastFrame = frame
		}
		useT = gif.lastFrame.disposalMethod === 2 || gif.lastFrame.disposalMethod === 3;
		if (!useT) {
			frame.image.ctx.drawImage(gif.lastFrame.image, 0, 0, gif.width, gif.height)
		}
		cData = frame.image.ctx.getImageData(frame.leftPos, frame.topPos, frame.width, frame.height);
		ti = frame.transparencyIndex;
		dat = cData.data;
		if (frame.interlaced) {
			pDat = deinterlaceBuf
		} else {
			pDat = pixelBuf
		}
		pixCount = pDat.length;
		ind = 0;
		for (i = 0; i < pixCount; i++) {
			pixel = pDat[i];
			col = ct[pixel];
			if (ti !== pixel) {
				dat[ind++] = col[0];
				dat[ind++] = col[1];
				dat[ind++] = col[2];
				dat[ind++] = 255;      // Opaque.
			} else if (useT) {
				dat[ind + 3] = 0; // Transparent.
				ind += 4;
			} else {
				ind += 4
			}
		}
		frame.image.ctx.putImageData(cData, frame.leftPos, frame.topPos);
		gif.lastFrame = frame;
	}

	// **NOT** for commercial use.
	function finnished() { // called when the load has completed
		gif.loading = false;
		gif.frameCount = gif.frames.length;
		gif.lastFrame = null;
		st = undefined;
		gif.complete = true;
		gif.disposalMethod = undefined;
		gif.transparencyGiven = undefined;
		gif.delayTime = undefined;
		gif.transparencyIndex = undefined;
		gif.waitTillDone = undefined;
		pixelBuf = undefined; // dereference pixel buffer
		deinterlaceBuf = undefined; // dereference interlace buff (may or may not be used);
		pixelBufSize = undefined;
		deinterlaceBuf = undefined;
		gif.currentFrame = 0;
		if (gif.frames.length > 0) {
			gif.image = gif.frames[0].image
		}
	}

	function parseExt() {              // parse extended blocks
		const blockID = st.data[st.pos++];
		if (blockID === GIF_FILE.GCExt) {
			parseGCExt()
		} else if (blockID === GIF_FILE.COMMENT) {
			gif.comment += st.readSubBlocks()
		} else if (blockID === GIF_FILE.APPExt) {
			parseAppExt()
		} else {
			if (blockID === GIF_FILE.UNKNOWN) {
				st.pos += 13;
			} // skip unknow block
			st.readSubBlocks();
		}

	}

	function parseBlock() { // parsing the blocks
		const blockId = st.data[st.pos++];
		if (blockId === GIF_FILE.IMAGE) { // image block
			parseImg();
			if (gif.firstFrameOnly) {
				finnished();
				return
			}
		} else if (blockId === GIF_FILE.EOF) {
			finnished();
			return
		} else {
			parseExt()
		}
		if (typeof gif.onprogress === "function") {
			gif.onprogress({bytesRead: st.pos, totalBytes: st.data.length, frame: gif.frames.length});
		}
		parseBlock();
	}

	function dataLoaded(data) { // Data loaded create stream and parse
		st = new Stream(data);
		let bitField;
		st.pos += 6;
		gif.width = st.data[st.pos++] + (st.data[st.pos++] << 8);
		gif.height = st.data[st.pos++] + (st.data[st.pos++] << 8);
		bitField = st.data[st.pos++];
		gif.colorRes = (bitField & 0b1110000) >> 4;
		gif.globalColourCount = 1 << (bitField & 0b111) + 1;
		gif.bgColourIndex = st.data[st.pos++];
		st.pos++;                    // ignoring pixel aspect ratio. if not 0, aspectRatio = (pixelAspectRatio + 15) / 64
		if (bitField & 0b10000000) {
			gif.globalColourTable = parseColourTable(gif.globalColourCount)
		} // global colour flag
		parseBlock();
	}

	return gif;
};
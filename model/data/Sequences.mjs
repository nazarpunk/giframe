import {ModelData} from "../ModelData.mjs";

export class Sequences extends ModelData {
	/**
	 *  @param key
	 *  @param {Model} model
	 */
	constructor(key, model) {
		super(key, model);
		this.ChunkSize = model.readDWORD();
		const n = this.ChunkSize / 132;
		for (let i = 0; i < n; i++) {
			this.sequences.push(new Sequence(model));
		}
	}

	/** @type {Sequence[]} */
	sequences = [];

	write() {
		const n = this.model;
		n.writeDWORD(this.key);
		n.writeDWORD(this.sequences.length * 132);
		for (const s of this.sequences) {
			s.write();
		}
	}
}

export class Sequence {
	/**  @param {Model} model */
	constructor(model) {
		this.model = model;

		this.Name = model.readCHAR(80);
		this.IntervalStart = model.readDWORD();
		this.IntervalEnd = model.readDWORD();
		this.MoveSpeed = model.readFLOAT();
		this.Flags = model.readDWORD();
		this.Rarity = model.readFLOAT();
		this.SyncPoint = model.readDWORD();
		this.BoundsRadius = model.readFLOAT();
		this.MinimumExtent = [model.readFLOAT(), model.readFLOAT(), model.readFLOAT()];
		this.MaximumExtent = [model.readFLOAT(), model.readFLOAT(), model.readFLOAT()];
	}

	/**
	 * 0 - Looping
	 * 1 - NonLooping
	 * @type {number}
	 */
	Flags;

	write() {
		const m = this.model;
		m.writeCHAR(this.Name, 80);
		m.writeDWORD(this.IntervalStart);

	}
}
import {ModelData} from "../ModelData.mjs";

export class Sequences extends ModelData {
	/**
	 *  @param key
	 *  @param {Model} model
	 */
	constructor(key, model) {
		super(key);
		this.ChunkSize = model.readDWORD();
		const n = this.ChunkSize / 132;
		for (let i = 0; i < n; i++) {
			this.sequences.push(new Sequence(model));
		}
	}

	/** @type {Sequence[]} */
	sequences = [];
}

export class Sequence {
	/**  @param {Model} model */
	constructor(model) {
		this.Name = model.char(80);
		this.IntervalStart = model.readDWORD();
		this.IntervalEnd = model.readDWORD();
		this.MoveSpeed = model.float();
		this.Flags = model.readDWORD();
		this.Rarity = model.float();
		this.SyncPoint = model.readDWORD();
		this.BoundsRadius = model.float();
		this.MinimumExtent = [model.float(), model.float(), model.float()];
		this.MaximumExtent = [model.float(), model.float(), model.float()];
	}

	/**
	 * 0 - Looping
	 * 1 - NonLooping
	 * @type {number}
	 */
	Flags;
}
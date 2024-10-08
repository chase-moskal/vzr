
export class Mesh {
	static makeCube() {
		const vertices = new Float32Array([
			-1, -1, -1,
			1, -1, -1,
			1, 1, -1,
			-1, 1, -1,
			-1, -1, 1,
			1, -1, 1,
			1, 1, 1,
			-1, 1, 1,
		])
		const indices = new Uint16Array([
			0, 1, 2, 2, 3, 0,
			4, 5, 6, 6, 7, 4,
			0, 4, 7, 7, 3, 0,
			1, 5, 6, 6, 2, 1,
			3, 2, 6, 6, 7, 3,
			0, 1, 5, 5, 4, 0,
		])
		return new this(vertices, indices)
	}

	constructor(
		public vertices: Float32Array,
		public indices: Uint16Array,
	) {}
}

export class Stage {
	meshes = new Set<Mesh>()
}


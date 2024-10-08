
export class Accessor {
	bufferView: BufferView; // Use the BufferView class now
	byteOffset: number; // Offset from the BufferView's start
	componentType: number; // Type of each component (e.g., FLOAT, UNSIGNED_SHORT)
	count: number; // Number of elements
	type: string; // Type of data (e.g., VEC3, SCALAR)

	constructor({
		bufferView,
		byteOffset = 0,
		componentType,
		count,
		type,
	}: {
		bufferView: BufferView;
		byteOffset?: number;
		componentType: number;
		count: number;
		type: string;
	}) {
		this.bufferView = bufferView;
		this.byteOffset = byteOffset;
		this.componentType = componentType;
		this.count = count;
		this.type = type;
	}

	// Compute the total byte length of the accessor's data
	get byteLength(): number {
		return this.count * this.elementSize * this.componentSize;
	}

	// Determine the number of components per element (based on type: SCALAR, VEC3, etc.)
	get elementSize(): number {
		switch (this.type) {
			case 'SCALAR':
				return 1;
			case 'VEC2':
				return 2;
			case 'VEC3':
				return 3;
			case 'VEC4':
				return 4;
			case 'MAT2':
				return 4;
			case 'MAT3':
				return 9;
			case 'MAT4':
				return 16;
			default:
				throw new Error(`Unknown accessor type: ${this.type}`);
		}
	}

	// Determine the size of each component (based on componentType)
	get componentSize(): number {
		switch (this.componentType) {
			case 5120: // BYTE
				return 1;
			case 5121: // UNSIGNED_BYTE
				return 1;
			case 5122: // SHORT
				return 2;
			case 5123: // UNSIGNED_SHORT
				return 2;
			case 5125: // UNSIGNED_INT
				return 4;
			case 5126: // FLOAT
				return 4;
			default:
				throw new Error(`Unknown component type: ${this.componentType}`);
		}
	}

	// Retrieve the typed array representing the data, using the BufferView
	getTypedArray() {
		const arrayBuffer = this.bufferView.getBufferSlice(); // Get the data slice from BufferView
		const byteOffset = this.byteOffset;

		switch (this.componentType) {
			case 5120: // BYTE
				return new Int8Array(arrayBuffer, byteOffset, this.count * this.elementSize);
			case 5121: // UNSIGNED_BYTE
				return new Uint8Array(arrayBuffer, byteOffset, this.count * this.elementSize);
			case 5122: // SHORT
				return new Int16Array(arrayBuffer, byteOffset, this.count * this.elementSize);
			case 5123: // UNSIGNED_SHORT
				return new Uint16Array(arrayBuffer, byteOffset, this.count * this.elementSize);
			case 5125: // UNSIGNED_INT
				return new Uint32Array(arrayBuffer, byteOffset, this.count * this.elementSize);
			case 5126: // FLOAT
				return new Float32Array(arrayBuffer, byteOffset, this.count * this.elementSize);
			default:
				throw new Error(`Unsupported component type: ${this.componentType}`);
		}
	}
}

export class BufferView {
	buffer: ArrayBuffer
	byteOffset: number
	byteLength: number
	byteStride: number | null // Stride between elements, or null if tightly packed
	target: number | null // GLTF target type (optional)

	constructor({
		buffer,
		byteOffset = 0,
		byteLength,
		byteStride = null,
		target = null,
	}: {
		buffer: ArrayBuffer
		byteOffset?: number
		byteLength: number
		byteStride?: number | null
		target?: number | null
	}) {
		this.buffer = buffer
		this.byteOffset = byteOffset
		this.byteLength = byteLength
		this.byteStride = byteStride
		this.target = target
	}

	// Get a slice of the buffer data represented by this BufferView
	getBufferSlice(): ArrayBuffer {
		return this.buffer.slice(this.byteOffset, this.byteOffset + this.byteLength)
	}

	// Check if this BufferView is for vertices (GL_ARRAY_BUFFER)
	isVertexBuffer(): boolean {
		return this.target === 34962
	}

	// Check if this BufferView is for indices (GL_ELEMENT_ARRAY_BUFFER)
	isIndexBuffer(): boolean {
		return this.target === 34963
	}
}


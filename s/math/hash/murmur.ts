
import {Vec2} from "../vec2.js"
import {Vec3} from "../vec3.js"
import {Hasher} from "./types.js"
import {Scalar} from "../scalar.js"

export class MurmurHash implements Hasher {
	constructor(private seed = 1) {}

	hash(value: number) {
		let h = this.seed ^ value
		h = Math.imul(h ^ (h >>> 16), 0x85ebca6b)
		h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35)
		return Scalar.clamp(h)
	}

	hash2d_(x: number, y: number) {
		const value = Math.imul(x, 0x5bd1e995) + Math.imul(y, 0x1b873593)
		return this.hash(value)
	}

	hash3d_(x: number, y: number, z: number) {
		const value = Math.imul(x, 0x5bd1e995) + Math.imul(y, 0x1b873593) + Math.imul(z, 0x85ebca6b)
		return this.hash(value)
	}

	hash2d(vector: Vec2) {
		return this.hash2d_(vector.x, vector.y)
	}

	hash3d(vector: Vec3) {
		return this.hash3d_(vector.x, vector.y, vector.z)
	}
}


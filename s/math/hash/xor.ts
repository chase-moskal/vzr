
import {Vec2} from "../vec2.js"
import {Vec3} from "../vec3.js"
import {Hasher} from "./types.js"

export class XorHash implements Hasher {
	constructor(private seed = 1) {}

	hash(x: number) {
		let n = x ^ this.seed
		n = (n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff
		return 1.0 - (n / 1073741824.0)
	}

	hash2d_(x: number, y: number) {
		const value = (x << 13) ^ y
		return this.hash(value)
	}

	hash3d_(x: number, y: number, z: number) {
		const value = (x << 13) ^ (y ^ (z << 7))
		return this.hash(value)
	}

	hash2d(vector: Vec2) {
		return this.hash2d_(vector.x, vector.y)
	}

	hash3d(vector: Vec3) {
		return this.hash3d_(vector.x, vector.y, vector.z)
	}
}


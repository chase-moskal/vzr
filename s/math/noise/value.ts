
import {Vec2} from "../vec2.js"
import {Vec3} from "../vec3.js"
import {Noiser} from "./types.js"
import {Hasher} from "../hash/types.js"

export class ValueNoise implements Noiser {
	constructor(public frequency = 1, public hasher: Hasher) {}

	noise2d(vector: Vec2) {
		return this.noise2d_(vector.x, vector.y)
	}

	noise3d(vector: Vec3) {
		return this.noise3d_(vector.x, vector.y, vector.z)
	}

	noise2d_(rawX: number, rawY: number) {
		const x = rawX * this.frequency
		const y = rawY * this.frequency

		const x0 = Math.floor(x)
		const x1 = x0 + 1
		const y0 = Math.floor(y)
		const y1 = y0 + 1

		const v00 = this.hasher.hash2d_(x0, y0)
		const v10 = this.hasher.hash2d_(x1, y0)
		const v01 = this.hasher.hash2d_(x0, y1)
		const v11 = this.hasher.hash2d_(x1, y1)

		const tx = smooth(x - x0)
		const ty = smooth(y - y0)

		const lerpX0 = lerp(v00, v10, tx)
		const lerpX1 = lerp(v01, v11, tx)

		return lerp(lerpX0, lerpX1, ty)
	}

	noise3d_(rawX: number, rawY: number, rawZ: number) {
		const x = rawX * this.frequency
		const y = rawY * this.frequency
		const z = rawZ * this.frequency

		const x0 = Math.floor(x)
		const x1 = x0 + 1
		const y0 = Math.floor(y)
		const y1 = y0 + 1
		const z0 = Math.floor(z)
		const z1 = z0 + 1

		const v000 = this.hasher.hash3d_(x0, y0, z0)
		const v100 = this.hasher.hash3d_(x1, y0, z0)
		const v010 = this.hasher.hash3d_(x0, y1, z0)
		const v110 = this.hasher.hash3d_(x1, y1, z0)
		const v001 = this.hasher.hash3d_(x0, y0, z1)
		const v101 = this.hasher.hash3d_(x1, y0, z1)
		const v011 = this.hasher.hash3d_(x0, y1, z1)
		const v111 = this.hasher.hash3d_(x1, y1, z1)

		const tx = smooth(x - x0)
		const ty = smooth(y - y0)
		const tz = smooth(z - z0)

		const lerpX00 = lerp(v000, v100, tx)
		const lerpX10 = lerp(v010, v110, tx)
		const lerpX01 = lerp(v001, v101, tx)
		const lerpX11 = lerp(v011, v111, tx)

		const lerpY0 = lerp(lerpX00, lerpX10, ty)
		const lerpY1 = lerp(lerpX01, lerpX11, ty)

		return lerp(lerpY0, lerpY1, tz)
	}
}

function smooth(t: number) {
	return t * t * (3 - 2 * t)
}

function lerp(a: number, b: number, t: number) {
	return a + t * (b - a)
}


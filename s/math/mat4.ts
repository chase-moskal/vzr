
import {Vec3} from "./vec3.js"

export type Mat4Array = [
	number, number, number, number,
	number, number, number, number,
	number, number, number, number,
	number, number, number, number,
]

export class Mat4 {
	constructor(
		public elements: Mat4Array = [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1,
		]
	) {}

	static new(elements?: Mat4Array) {
		return new this(elements)
	}

	static identity() {
		return this.new()
	}

	static scaling(sx: number, sy: number, sz: number): Mat4 {
		return new Mat4([
			sx, 0, 0, 0,
			0, sy, 0, 0,
			0, 0, sz, 0,
			0, 0, 0, 1,
		])
	}

	static translation(tx: number, ty: number, tz: number): Mat4 {
		return new Mat4([
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			tx, ty, tz, 1,
		])
	}

	static rotationX(angle: number): Mat4 {
		const c = Math.cos(angle)
		const s = Math.sin(angle)
		return new Mat4([
			1, 0, 0, 0,
			0, c, -s, 0,
			0, s, c, 0,
			0, 0, 0, 1,
		])
	}

	static rotationY(angle: number): Mat4 {
		const c = Math.cos(angle)
		const s = Math.sin(angle)
		return new Mat4([
			c, 0, s, 0,
			0, 1, 0, 0,
			-s, 0, c, 0,
			0, 0, 0, 1,
		])
	}

	static rotationZ(angle: number): Mat4 {
		const c = Math.cos(angle)
		const s = Math.sin(angle)
		return new Mat4([
			c, -s, 0, 0,
			s, c, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1,
		])
	}

	static perspective(fov: number, aspect: number, near: number, far: number) {
		const f = 1.0 / Math.tan(fov / 2)
		const nf = 1 / (near - far)

		const elements: Mat4Array = [
			f / aspect, 0, 0, 0,
			0, f, 0, 0,
			0, 0, (far + near) * nf, -1,
			0, 0, 2 * far * near * nf, 0
		]

		return new this(elements)
	}

	static orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4 {
		const lr = 1 / (left - right)
		const bt = 1 / (bottom - top)
		const nf = 1 / (near - far)
		return new Mat4([
			-2 * lr, 0, 0, 0,
			0, -2 * bt, 0, 0,
			0, 0, 2 * nf, 0,
			(left + right) * lr, (top + bottom) * bt, (far + near) * nf, 1,
		])
	}

	static lookAt(eye: Vec3, center: Vec3, up: Vec3) {
		// right-handed: z-axis points from center to eye (negative z direction)
		const z0 = eye.x - center.x
		const z1 = eye.y - center.y
		const z2 = eye.z - center.z

		let len = Math.hypot(z0, z1, z2)
		const z = { x: z0 / len, y: z1 / len, z: z2 / len }

		const x = {
			x: up.y * z.z - up.z * z.y,
			y: up.z * z.x - up.x * z.z,
			z: up.x * z.y - up.y * z.x
		}

		len = Math.hypot(x.x, x.y, x.z)
		x.x /= len
		x.y /= len
		x.z /= len

		const y = {
			x: z.y * x.z - z.z * x.y,
			y: z.z * x.x - z.x * x.z,
			z: z.x * x.y - z.y * x.x
		}

		const elements: Mat4Array = [
			x.x, y.x, z.x, 0,
			x.y, y.y, z.y, 0,
			x.z, y.z, z.z, 0,
			-(x.x * eye.x + x.y * eye.y + x.z * eye.z),
			-(y.x * eye.x + y.y * eye.y + y.z * eye.z),
			-(z.x * eye.x + z.y * eye.y + z.z * eye.z),
			1
		]

		return new this(elements)
	}

	clone() {
		return new Mat4([...this.elements])
	}

	array() {
		return [...this.elements]
	}

	toString() {
		const m = this.elements
		return `(Mat4 ${[
			[m[0], m[1], m[2], m[3]],
			[m[4], m[5], m[6], m[7]],
			[m[8], m[9], m[10], m[11]],
			[m[12], m[13], m[14], m[15]],
		].map(a => `[${a.map(x => x.toFixed(2)).join(", ")}]`).join(" ")})`
	}

	/** mutator */
	transpose() {
		const m = this.elements
		this.elements = [
			m[0], m[4], m[8], m[12],
			m[1], m[5], m[9], m[13],
			m[2], m[6], m[10], m[14],
			m[3], m[7], m[11], m[15],
		]
		return this
	}

	determinant(): number {
		const m = this.elements
		return (
			m[0] * (m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10]) -
			m[1] * (m[4] * m[10] * m[15] - m[4] * m[11] * m[14] - m[8] * m[6] * m[15] + m[8] * m[7] * m[14] + m[12] * m[6] * m[11] - m[12] * m[7] * m[10]) +
			m[2] * (m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] + m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9]) -
			m[3] * (m[4] * m[9] * m[14] - m[4] * m[10] * m[13] - m[8] * m[5] * m[14] + m[8] * m[6] * m[13] + m[12] * m[5] * m[10] - m[12] * m[6] * m[9])
		)
	}

	invert() {
		const m = this.elements
		const inv = new Array(16) as Mat4Array

		// Calculate cofactors for the inverse matrix
		inv[0] =  m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10]
		inv[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] - m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10]
		inv[2] =  m[1] * m[6]  * m[15] - m[1] * m[7]  * m[14] - m[5] * m[2] * m[15] + m[5] * m[3] * m[14] + m[13] * m[2] * m[7]  - m[13] * m[3] * m[6]
		inv[3] = -m[1] * m[6]  * m[11] + m[1] * m[7]  * m[10] + m[5] * m[2] * m[11] - m[5] * m[3] * m[10] - m[9]  * m[2] * m[7]  + m[9]  * m[3] * m[6]

		inv[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] - m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10]
		inv[5] =  m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] + m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10]
		inv[6] = -m[0] * m[6]  * m[15] + m[0] * m[7]  * m[14] + m[4] * m[2] * m[15] - m[4] * m[3] * m[14] - m[12] * m[2] * m[7]  + m[12] * m[3] * m[6]
		inv[7] =  m[0] * m[6]  * m[11] - m[0] * m[7]  * m[10] - m[4] * m[2] * m[11] + m[4] * m[3] * m[10] + m[8]  * m[2] * m[7]  - m[8]  * m[3] * m[6]

		inv[8] =  m[4] * m[9]  * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] + m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9]
		inv[9] = -m[0] * m[9]  * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] - m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9]
		inv[10] =  m[0] * m[5] * m[15] - m[0] * m[7]  * m[13] - m[4] * m[1] * m[15] + m[4] * m[3] * m[13] + m[12] * m[1] * m[7]  - m[12] * m[3] * m[5]
		inv[11] = -m[0] * m[5] * m[11] + m[0] * m[7]  * m[9]  + m[4] * m[1] * m[11] - m[4] * m[3] * m[9]  - m[8]  * m[1] * m[7]  + m[8]  * m[3] * m[5]

		inv[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] - m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9]
		inv[13] =  m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] + m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9]
		inv[14] = -m[0] * m[5] * m[14] + m[0] * m[6]  * m[13] + m[4] * m[1] * m[14] - m[4] * m[2] * m[13] - m[12] * m[1] * m[6]  + m[12] * m[2] * m[5]
		inv[15] =  m[0] * m[5] * m[10] - m[0] * m[6]  * m[9]  - m[4] * m[1] * m[10] + m[4] * m[2] * m[9]  + m[8]  * m[1] * m[6]  - m[8]  * m[2] * m[5]

		// calculate the determinant using the cofactor matrix
		const det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12]
		if (det === 0) return this // non-invertible

		// scale the inverse matrix by 1/det
		const invDet = 1.0 / det
		for (let i = 0; i < 16; i++) {
			inv[i] *= invDet
		}

		this.elements = inv
		return this
	}

	static index(row: number, column: number) {
		return (4 * row) + column
	}

	/** mutator */
	multiply_(e: Mat4Array) {
		const o = [...this.elements] // original
		const r = this.elements // result

		for (let row = 0; row < 4; row++) {
			const rowIndex = row * 4
			const a = o[rowIndex + 0]
			const b = o[rowIndex + 1]
			const c = o[rowIndex + 2]
			const d = o[rowIndex + 3]
			r[rowIndex + 0] = (a * e[0]) + (b * e[4]) + (c * e[8]) + (d * e[12])
			r[rowIndex + 1] = (a * e[1]) + (b * e[5]) + (c * e[9]) + (d * e[13])
			r[rowIndex + 2] = (a * e[2]) + (b * e[6]) + (c * e[10]) + (d * e[14])
			r[rowIndex + 3] = (a * e[3]) + (b * e[7]) + (c * e[11]) + (d * e[15])
		}

		return this
	}

	/** mutator */
	multiply(mat: Mat4) {
		const b = mat.elements
		return this.multiply_(b)
	}

	/** mutates the vector */
	static transform(vector: Vec3, matrix: Mat4) {
		const m = matrix.elements
		const {x: vx, y: vy, z: vz} = vector
		const x = vx * m[0] + vy * m[4] + vz * m[8] + m[12]
		const y = vx * m[1] + vy * m[5] + vz * m[9] + m[13]
		const z = vx * m[2] + vy * m[6] + vz * m[10] + m[14]
		return vector.set_(x, y, z)
	}

	/** mutates the vector */
	transform(vector: Vec3): Vec3 {
		return Mat4.transform(vector, this)
	}
}


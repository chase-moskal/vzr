
import {Vec2} from "../vec2.js"
import {Vec3} from "../vec3.js"

export type Hasher = {
	hash(x: number): number
	hash2d_(x: number, y: number): number
	hash3d_(x: number, y: number, z: number): number

	hash2d(vector: Vec2): number
	hash3d(vector: Vec3): number
}


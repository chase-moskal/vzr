
import {Vec2} from "../vec2.js"
import {Vec3} from "../vec3.js"

export type Noiser = {
	noise2d_(x: number, y: number): number
	noise3d_(x: number, y: number, z: number): number
	noise2d(vector: Vec2): number
	noise3d(vector: Vec3): number
}


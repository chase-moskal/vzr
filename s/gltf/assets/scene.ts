
import {Mesh} from "./mesh.js"
import {Camera} from "./camera.js"
import {Mat4} from "../../math/mat4.js"

export class Scene {
	name?: string
	nodes = new Set<Node>()
}

export class Node {
	name?: string
	matrix?: Mat4
	mesh?: Mesh
	camera?: Camera
	children = new Set<Node>()
}


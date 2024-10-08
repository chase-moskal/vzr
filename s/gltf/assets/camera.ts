
import {Node} from "./scene.js"

export class Camera {
	name?: string
	instance() {
		const node = new Node()
		node.camera = this
		return node
	}
}


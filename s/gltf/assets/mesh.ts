
import {Node} from "./scene.js"
import {Material} from "./material.js"
import {Accessor} from "./accessor.js"

export class Mesh {
	name?: string
	primitives: Primitive[] = []
	instance() {
		const node = new Node()
		node.mesh = this
		return node
	}
}

export class Primitive {
	mode: PrimitiveMode = PrimitiveMode.Triangles
	indices?: Accessor
	material?: Material
	targets: MeshAttributes = {}
	attributes: MeshAttributes = {}
}

export enum PrimitiveMode {
	Points,
	Lines,
	LineLoop,
	LineStrip,
	Triangles,
	TriangleStrip,
	TriangleFan,
}

export type PrimitiveAttributeName = (
	| "POSITION"
	| "NORMAL"
)

export type MeshAttributes = Partial<Record<PrimitiveAttributeName, Accessor>>


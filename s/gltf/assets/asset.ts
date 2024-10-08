
import {Mesh} from "./mesh.js"
import {Skin} from "./skin.js"
import {Scene} from "./scene.js"
import {Camera} from "./camera.js"
import {Material} from "./material.js"
import {Accessor, BufferView} from "./accessor.js"
import {Texture, Image, Sampler} from "./texture.js"

export type Asset = (
	| Scene
	| Node
	| Mesh
	| Camera
	| Accessor
	| BufferView
	| ArrayBuffer
	| Material
	| Texture
	| Image
	| Sampler
	| Skin
	| Animation
)


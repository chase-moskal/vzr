
import {Renderer, Mesh, Scene, Camera, Sunlight, Vec3} from "@benev/vzr"

// create an empty render graph
const renderer = await Renderer.setup(canvas)

// make mesh resource
const mesh = Mesh.box()

// setup the scene
const scene = new Scene()
const camera = Camera.orbit({radius: 10})
const sun = new Sunlight({direction: new Vec3(0.123, -1, 0.234)})
const instances = new Array(100).map((_, i) => {
	const node = mesh.instance()
	node.position = new Vec3(i * 2, 0, 0)
	return node
})

// add stuff to the scene
scene.add(camera, sun, ...instances)

// add the scene to the render graph,
// which uploads all relevant resources to the gpu
await renderer.add(scene)

// set the active scene
renderer.scene = scene

// render a frame
renderer.render()


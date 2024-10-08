
import {RenderGraph, gltf, Mesh} from "@benev/vsr"

// create an empty RenderGraph
const renderGraph = await RenderGraph.setup(canvas)

// add a box
const mesh = Mesh.box()
renderGraph.add(mesh)

// load a gltf into a different Graph
const world = await gltf("./world.glb")

// add everything from the world graph into the render graph.
// the render graph will preprocess and upload all relevant gpu resources.
await renderGraph.add(world)

// render to the canvas
renderGraph.render(canvas)


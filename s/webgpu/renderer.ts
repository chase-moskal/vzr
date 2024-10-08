
import {Gltf} from "../gltf/gltf.js"
import {GpuSetup} from "./setup-gpu.js"
import {Asset} from "../gltf/assets/asset.js"
import {Crawler} from "../gltf/utils/crawler.js"
import {GpuResource, makeGpuResource} from "./utils/make-gpu-resource.js"

export class Renderer extends Gltf {
	protected resources = new Map<Asset, GpuResource>()

	constructor(protected setup: GpuSetup) {
		super()
	}

	async add(...additions: (Asset | Gltf)[]) {
		const {setup} = this
		const {device} = setup
		const assets = await super.add(...additions)
		const command = device.createCommandEncoder()

		for (const asset of assets) {
			const resource = makeGpuResource(setup, command, asset)
			this.resources.set(asset, resource)
		}

		device.queue.submit([command.finish()])
		await device.queue.onSubmittedWorkDone()
		return assets
	}

	async remove(...assets: Asset[]) {
		await super.remove(...assets)
		for (const asset of assets) {
			const resource = this.resources.get(asset)
			if (resource) {
				resource.destroy()
				this.resources.delete(asset)
			}
		}
	}

	async render() {
		const {scene} = this
		const {device, context} = this.setup

		if (!scene)
			return undefined

		const command = device.createCommandEncoder()

		const pass = command.beginRenderPass({
			colorAttachments: [{
				view: context.getCurrentTexture().createView(),
				loadOp: "clear",
				clearValue: [0, 0, 0, 1],
				storeOp: "store",
			}],
		})

		const crawler = new Crawler()

		for (const asset of crawler.crawl(scene)) {
			if (asset instanceof Primitive) {
				const pipeline = this.gpuPipelines.get("default") // assuming a default pipeline for now
				pass.setPipeline(pipeline)
				pass.setVertexBuffer(0, this.gpuBuffers.get(mesh)!)
				pass.draw(primitive.vertexCount)
			}
		}

		pass.end()
		device.queue.submit([command.finish()])
		await device.queue.onSubmittedWorkDone()
	}
}


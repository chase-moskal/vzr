
import {wgsl} from "../tools/templating.js"

export async function setup() {
	const adapter = await navigator.gpu.requestAdapter({
		powerPreference: "high-performance",
	})

	if (!adapter)
		throw new Error("adapter failed")

	const device = await adapter.requestDevice()

	const canvas = document.createElement("canvas")
	const context = canvas.getContext("webgpu")

	if (!context)
		throw new Error("canvas context failed")

	const format = navigator.gpu.getPreferredCanvasFormat()

	context.configure({device, format, alphaMode: "opaque"})

	const vertexData = new Float32Array([
		0, 1, 1,
		-1, -1, 1,
		1, -1, 1,
	])

	const vertexBuffer = device.createBuffer({
		size: vertexData.byteLength,
		usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
	})

	const pipeline = device.createRenderPipeline({
		layout: "auto",
		vertex: {
			module: device.createShaderModule({code: wgsl`
				@vertex
				fn vertex(@location(0) pos : vec3f) -> @builtin(position) vec4f {
					return vec4f(pos, 1);
				}
			`}),
			buffers: [{
				arrayStride: 12,
				attributes: [{
					shaderLocation: 0,
					offset: 0,
					format: "float32x3",
				}],
			}],
		},
		fragment: {
			module: device.createShaderModule({code: wgsl`
				@fragment
				fn fragment() -> @location(0) vec4f {
					return vec4f(1, 0, 0, 1);
				}
			`}),
			entryPoint: "fragment",
			targets: [{format}],
		},
	})

	const commandEncoder = device.createCommandEncoder()

	const passEncoder = commandEncoder.beginRenderPass({
		colorAttachments: [{
			view: context.getCurrentTexture().createView(),
			loadOp: "clear",
			clearValue: [0, 0, 0, 1],
			storeOp: "store",
		}],
	})

	passEncoder.setPipeline(pipeline)
	passEncoder.setVertexBuffer(0, vertexBuffer)
	passEncoder.draw(3)
	passEncoder.end()

	device.queue.writeBuffer(vertexBuffer, 0, vertexData)
	device.queue.submit([commandEncoder.finish()])

	return canvas
}



import {VzrError} from "./errors.js"
import {wgsl} from "../tools/templating.js"

export async function setup_webgpu(
		canvas: HTMLCanvasElement | OffscreenCanvas
			= document.createElement("canvas")
	) {

	if (!navigator.gpu)
		throw new VzrError(`webgpu not supported`)

	const adapter = await navigator.gpu.requestAdapter({powerPreference: "high-performance"})

	if (!adapter)
		throw new VzrError(`gpu adapter failed`)

	const context = canvas.getContext("webgpu")

	if (!context)
		throw new VzrError(`canvas context failed`)

	const device = await adapter.requestDevice()
	const format = navigator.gpu.getPreferredCanvasFormat()
	context.configure({device, format, alphaMode: "opaque"})

	return {adapter, device, format, canvas, context}
}

export async function cubes() {
	const {device, format, context} = await setup_webgpu()

	// simple example for instance buffer
	const instanceData = new Float32Array([
		// x, y, z for each cube
		0, 0, 0,   // cube 1 position
		2, 0, 0,   // cube 2 position
		-2, 0, 0,  // cube 3 position
		// ... more cubes
	]);

	const instanceBuffer = device.createBuffer({
		size: instanceData.byteLength,
		usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
		mappedAtCreation: true
	});

	new Float32Array(instanceBuffer.getMappedRange()).set(instanceData);
	instanceBuffer.unmap();

	const vertexShader = wgsl`
		@group(0) @binding(0) var<uniform> viewProjMatrix : mat4x4<f32>;
		@group(1) @binding(0) var<storage, read> modelMatrices : array<mat4x4<f32>>;

		struct VertexInput {
			@location(0) position : vec3<f32>, // Position of each vertex
			@builtin(instance_index) instanceIndex : u32, // Index of the current instance
		};

		struct VertexOutput {
			@builtin(position) clipPosition : vec4<f32>, // Position in clip space (for rasterization)
			@location(0) fragColor : vec3<f32>, // Pass color to fragment shader
		};

		@vertex
		fn vs_main(input: VertexInput) -> VertexOutput {
			var output : VertexOutput;
			let modelMatrix = modelMatrices[input.instanceIndex];
			let worldPosition = modelMatrix * vec4<f32>(input.position, 1.0);
			output.clipPosition = viewProjMatrix * worldPosition;
			output.fragColor = vec3<f32>(f32(input.instanceIndex) * 0.1, 0.5, 0.7);
			return output;
		}
	`
}

export async function helloTriangle() {
	const {device, format, canvas, context} = await setup_webgpu()

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


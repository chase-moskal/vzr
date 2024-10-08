
import {VzrError} from "./utils/errors.js"

export type GpuSetup = Awaited<ReturnType<typeof setupGpu>>

export async function setupGpu(
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


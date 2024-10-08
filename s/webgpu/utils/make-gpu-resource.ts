
import {VzrError} from "./errors.js"
import {GpuSetup} from "../setup-gpu.js"
import {Asset} from "../../gltf/assets/asset.js"
import {Accessor} from "../../gltf/assets/accessor.js"
import {Primitive, PrimitiveAttributeName} from "../../gltf/assets/mesh.js"

export type GpuResource = {destroy: () => void}

export type PrimitiveGpuResource = {
	vertexBuffers: Map<PrimitiveAttributeName, GPUBuffer>
	indexBuffer: GPUBuffer
} & GpuResource

export function makeGpuResource(setup: GpuSetup, command: GPUCommandEncoder, asset: Asset): GpuResource {
	if (asset instanceof Primitive)
		return makePrimitive(setup, command, asset)
	else
		throw new VzrError(`could not make gpu resource for unknown asset type`)
}

function createBufferFromAccessor(device: GPUDevice, accessor: Accessor, usage: GPUBufferUsageFlags): GPUBuffer {
	const buffer = device.createBuffer({
		size: accessor.byteLength,
		usage,
		mappedAtCreation: true
	});

	// Copy the data from the accessor to the buffer
	const arrayBuffer = new Uint8Array(buffer.getMappedRange());
	arrayBuffer.set(new Uint8Array(accessor.bufferView.buffer, accessor.byteOffset, accessor.byteLength));
	buffer.unmap();

	return buffer;
}

// TODO actually use command buffer for uploading geometry
function makePrimitive({device}: GpuSetup, command: GPUCommandEncoder, primitive: Primitive) {
	const vertexBuffers = new Map<PrimitiveAttributeName, GPUBuffer>();

	// 1. Handle vertex attributes (e.g., POSITION, NORMAL)
	for (const [attributeName, accessor] of Object.entries(primitive.attributes) as [PrimitiveAttributeName, Accessor][]) {
		if (!accessor) continue; // Skip if no accessor is provided
		const buffer = createBufferFromAccessor(device, accessor, GPUBufferUsage.VERTEX);
		vertexBuffers.set(attributeName, buffer);
	}

	// 2. Handle index buffer, if available
	let indexBuffer: GPUBuffer | undefined = undefined;
	if (primitive.indices) {
		indexBuffer = createBufferFromAccessor(device, primitive.indices, GPUBufferUsage.INDEX);
	}

	// 3. Return a GpuResource containing the buffers and a destroy method
	return {
		vertexBuffers,
		indexBuffer,
		destroy: () => {
			// Clean up GPU resources when no longer needed
			for (const buffer of vertexBuffers.values()) {
				buffer.destroy();
			}
			if (indexBuffer) {
				indexBuffer.destroy();
			}
		}
	};
}


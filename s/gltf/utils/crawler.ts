
import {Gltf} from "../gltf.js"
import {Asset} from "../assets/asset.js"

export class Crawler {
	assets = new Set<Asset>()

	crawl(subjects: Asset | Gltf): Set<Asset> {
		const {assets: resources} = this
		throw new Error("TODO")
		return resources
	}
}


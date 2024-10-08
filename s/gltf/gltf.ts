
import {Asset} from "./assets/asset.js"
import {Scene} from "./assets/scene.js"
import {Crawler} from "./utils/crawler.js"

export class Gltf {
	scene: Scene | undefined
	protected assets = new Set<Asset>()

	async add(...additions: (Asset | Gltf)[]) {
		const crawler = new Crawler()

		for (const addition of additions)
			crawler.crawl(addition)

		for (const asset of crawler.assets)
			this.assets.add(asset)

		return crawler.assets
	}

	async remove(...resources: Asset[]) {
		for (const resource of resources)
			this.assets.delete(resource)
	}
}


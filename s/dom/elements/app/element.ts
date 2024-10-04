
import {html} from "@benev/slate"

import styles from "./styles.js"
import {nexus} from "../../nexus.js"

export const GameApp = nexus.shadowComponent(use => {
	use.styles(styles)

	return html`
		<h2>game-app</h2>
	`
})


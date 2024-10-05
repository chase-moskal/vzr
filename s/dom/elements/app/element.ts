
import {loading} from "@benev/slate"

import styles from "./styles.js"
import {nexus} from "../../nexus.js"
import {setup} from "../../../sketch/sketch.js"

export const GameApp = nexus.shadowComponent(use => {
	use.styles(styles)
	const canvasOp = use.load(async() => setup())
	return loading.braille(canvasOp, canvas => canvas)
})


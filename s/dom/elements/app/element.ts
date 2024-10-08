
import {loading} from "@benev/slate"

import styles from "./styles.js"
import {nexus} from "../../nexus.js"
import {helloTriangle} from "../../../sketch/sketch.js"

export const GameApp = nexus.shadowComponent(use => {
	use.styles(styles)
	const canvasOp = use.load(async() => helloTriangle())
	return loading.braille(canvasOp, canvas => canvas)
})


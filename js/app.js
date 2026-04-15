// app.js
import { generateExamples } from "./math.js"
import { renderExamples } from "./ui.js"
import { startFireworks, stopFireworks } from "./fireworks.js" 
import { initFlowerEffect, syncFlowerEffect } from "./flowereffect.js"

const container = document.getElementById("examples")

const ui = renderExamples(
    generateExamples(5),
    container,
    () => startFireworks()
)

initFlowerEffect()

document.getElementById('refresh-btn').onclick = () => {
    stopFireworks() 
    
    const newExamples = generateExamples(5)
    ui.update(newExamples)
    
    syncFlowerEffect()
}
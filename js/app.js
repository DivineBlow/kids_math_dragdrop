import { generateExamples } from "./math.js"
import { renderExamples } from "./ui.js"
import { startFireworks } from "./fireworks.js"
import { initFlowerEffect } from "./flowereffect.js" // Добавляем импорт

const container = document.getElementById("examples")
const examples = generateExamples(5)

renderExamples(
    examples,
    container,
    () => {
        startFireworks()
    }
)

// Запускаем 3D-эффект только после того, как примеры загружены в скрытый div
initFlowerEffect();

document.getElementById('refresh-btn').onclick = () => {
    window.location.reload();
};
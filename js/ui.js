import confetti from 'canvas-confetti';

export function renderExamples(examples, container, onSolved) {
    const textInputEl = document.getElementById("text-input");
    const refreshBtn = document.getElementById("refresh-btn");

    let currentExamples = examples;
    let solvedCount = 0;

    // Функция для отрисовки текста
    const updateContent = (newExamples) => {
        currentExamples = newExamples;
        solvedCount = 0;
        
        const examplesText = currentExamples.map((ex, index) => {
            ex.solved = false;
            const op = ex.operator === '-' ? '−' : ex.operator;
            const line = `${ex.a} ${op} ${ex.b} =&nbsp;`;
            return index === 0 ? line : `<div>${line}</div>`;
        }).join('');

        textInputEl.innerHTML = examplesText;
        
        // Фокусируемся и ставим курсор в начало (триггерит перерисовку цветов)
        textInputEl.focus();
        // ВАЖНО: Событие input нужно вызвать вручную, чтобы FlowerEffect увидел изменения
        textInputEl.dispatchEvent(new Event('input', { bubbles: true }));
    };

    // Первичная инициализация
    updateContent(examples);

    // Кнопка теперь не перезагружает страницу, а просит новые данные
    refreshBtn.onclick = () => {
        // Импортируем генератор динамически или передаем функцию
        // Для простоты: вызываем внешнюю функцию обновления
        if (window.refreshMathTasks) {
            const freshData = window.refreshMathTasks();
            updateContent(freshData);
        }
    };

    textInputEl.addEventListener("keydown", (e) => {
        const sel = window.getSelection();
        const range = sel.getRangeAt(0);
        const currentLineText = range.startContainer.textContent || "";
        const equalIndex = currentLineText.indexOf('=');

        if (e.key === "Delete") {
            e.preventDefault();
            return;
        }

        if (e.key === "Enter") e.preventDefault();

        // Блокировка удаления условия (слева от =)
        if (e.key === "Backspace") {
            if (sel.anchorOffset <= equalIndex + 2) {
                e.preventDefault();
                return;
            }
        }

        // Разрешаем ТОЛЬКО цифры и ТОЛЬКО до 3 символов
        const isNumber = /^[0-9]$/.test(e.key);
        const isControlKey = e.key.length > 1;

        if (!isControlKey) {
            if (!isNumber) {
                e.preventDefault();
                return;
            }
            const answerPart = currentLineText.slice(equalIndex + 1).trim();
            if (answerPart.length >= 3) {
                e.preventDefault();
            }
        }
    });

    textInputEl.addEventListener("input", () => {
        const lines = textInputEl.innerText.split('\n').filter(l => l.trim() !== '');
        
        currentExamples.forEach((ex, i) => {
            if (lines[i] && !ex.solved) {
                const parts = lines[i].split('=');
                if (parts[1] && parseInt(parts[1].trim()) === ex.result) {
                    ex.solved = true;
                    solvedCount++;
                    
                    // --- ЭФФЕКТ КОНФЕТТИ ПРИ УСПЕХЕ ---
                    confetti({
                        particleCount: 400,
                        spread: 200,
                        origin: { y: 0.5 }
                    });

                    // Прыжок вниз
                    const nextNode = textInputEl.childNodes[i + 1];
                    if (nextNode) {
                        setTimeout(() => {
                            const newRange = document.createRange();
                            const newSel = window.getSelection();
                            const target = nextNode.nodeType === 3 ? nextNode : (nextNode.firstChild || nextNode);
                            newRange.setStart(target, target.textContent.length);
                            newRange.collapse(true);
                            newSel.removeAllRanges();
                            newSel.addRange(newRange);
                        }, 10);
                    }
                    if (solvedCount === currentExamples.length) onSolved();
                }
            }
        });
    });
}
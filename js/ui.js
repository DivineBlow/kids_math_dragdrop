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

        // 1. Возвращаем фокус
        textInputEl.focus();

        // 2. Ставим курсор в конец первой строки (после знака "=")
        const range = document.createRange();
        const sel = window.getSelection();
        
        // Берем первый узел (текст первой строки)
        const firstNode = textInputEl.firstChild;
        if (firstNode) {
            // Устанавливаем курсор в конец текстового узла
            const target = firstNode.nodeType === 3 ? firstNode : firstNode.lastChild;
            range.setStart(target, target.textContent.length);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }

        // 3. Пингуем систему, что контент изменился
        textInputEl.dispatchEvent(new Event('input', { bubbles: true }));
    };

    // Первичная инициализация
    updateContent(examples);

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
                    
                    // ui.js (фрагмент внутри обработчика "input")

                    // --- ЭФФЕКТ КОНФЕТТИ ПРИ УСПЕХЕ ---
                    confetti({
                        particleCount: 400,
                        spread: 200,
                        origin: { y: 0.5 }
                    });

                    // --- НОВЫЙ БЛОК ПРЫЖКА ВНИЗ ---
                    setTimeout(() => {
                        // Ищем следующий пример, который еще не решен
                        let nextIndex = currentExamples.findIndex((e, idx) => idx > i && !e.solved);
                        
                        // Если ниже всё решено, ищем сверху (если пользователь решал вразнобой)
                        if (nextIndex === -1) {
                            nextIndex = currentExamples.findIndex((e) => !e.solved);
                        }

                        // Если нашли нерешенный пример - прыгаем туда
                        if (nextIndex !== -1) {
                            const range = document.createRange();
                            const sel = window.getSelection();
                            
                            let targetNode;
                            if (nextIndex === 0) {
                                // 1-й пример (индекс 0) лежит просто как текст (firstChild)
                                targetNode = textInputEl.firstChild; 
                            } else {
                                // Остальные обернуты в <div>, поэтому используем children (в нём только теги)
                                const divNode = textInputEl.children[nextIndex - 1];
                                targetNode = divNode ? divNode.firstChild : null;
                            }

                            if (targetNode) {
                                // Убеждаемся, что мы ставим каретку в конец текста
                                const nodeForCaret = targetNode.nodeType === 3 ? targetNode : targetNode.lastChild || targetNode;
                                range.setStart(nodeForCaret, nodeForCaret.textContent.length);
                                range.collapse(true);
                                sel.removeAllRanges();
                                sel.addRange(range);
                            }
                        }
                    }, 20); // Таймаут 20мс для гарантии, что DOM обновился
                    // --- КОНЕЦ НОВОГО БЛОКА ---

                    if (solvedCount === currentExamples.length) onSolved();
                }
            }
        });
    });

    // Кнопка теперь не перезагружает страницу, а просит новые данные
    return {
        update: updateContent
    };
}
export function startFireworks() {
    const canvas = document.getElementById("fireworks");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];

    // Массив ярких цветов
    const colors = ["#FF5252", "#FFEB3B", "#2196F3", "#4CAF50", "#FF4081", "#E040FB", "#00BCD4"];

    function createExplosion() {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height / 2);
        
        // Выбираем один случайный цвет для всего взрыва
        const explosionColor = colors[Math.floor(Math.random() * colors.length)];

        for (let i = 0; i < 100; i++) {
            particles.push({
                x,
                y,
                // Случайное направление разлета
                vx: (Math.random() - 0.5) * (Math.random() * 8 + 2),
                vy: (Math.random() - 0.5) * (Math.random() * 8 + 2),
                life: 100,
                size: Math.random() * 3 + 2,
                color: explosionColor,
                gravity: 0.1 // Добавим немного гравитации для реализма
            });
        }
    }

    function update() {
        // Очистка с небольшим шлейфом (альфа-канал создает эффект затухания)
        ctx.fillStyle = "rgba(0, 0, 0, 0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, index) => {
            p.vx *= 0.98; // Трение воздуха
            p.vy *= 0.98;
            p.vy += p.gravity; // Гравитация тянет вниз
            
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 1.5;

            // Удаляем мертвые частицы, чтобы не тормозило
            if (p.life <= 0) {
                particles.splice(index, 1);
                return;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            // Уменьшаем прозрачность вместе с жизнью
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life / 100;
            ctx.fill();
            ctx.globalAlpha = 1;
        });
    }

    if (window.fireworkInterval) clearInterval(window.fireworkInterval);
    if (window.updateInterval) clearInterval(window.updateInterval);

    window.fireworkInterval = setInterval(createExplosion, 800);
    window.updateInterval = setInterval(update, 16);

}

export function stopFireworks() {
    if (window.fireworkInterval) clearInterval(window.fireworkInterval);
    if (window.updateInterval) clearInterval(window.updateInterval);
    
    const canvas = document.getElementById("fireworks");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}
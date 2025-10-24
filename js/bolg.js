// ����GitHub����ͼ
const grid = document.getElementById('contribGrid');
const levels = [0, 1, 2, 3, 4];

for (let i = 0; i < 364; i++) {
    const cell = document.createElement('div');
    cell.className = 'contrib-cell';
    const level = levels[Math.floor(Math.random() * levels.length)];
    if (level > 0) {
        cell.classList.add(`level-${level}`);
    }
    grid.appendChild(cell);
}

// �����Ŀ��Ƭ���Ч��
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
});
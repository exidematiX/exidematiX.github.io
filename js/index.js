// github 贡献图
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

// 项目卡片点击动画
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
});

// 点击博客图标跳转
const blogBtn = document.getElementById('blog-button');
if (blogBtn) {
    blogBtn.tabIndex = 0; // 允许键盘聚焦
    blogBtn.addEventListener('click', function() {
        window.location.href = './src/bolg.html';
    });
    blogBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            window.location.href = 'bolg.html';
        }
    });
}

// 相册页面逻辑：从 window.GALLERY（由 build.bat 生成的 img/gallery/gallery.js 提供）
// 渲染图片网格，点击放大查看。

(function () {
    const images = Array.isArray(window.GALLERY) ? window.GALLERY : [];
    const grid = document.getElementById('galleryGrid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    if (!images.length) {
        grid.innerHTML =
            '<p class="empty">相册还是空的。把图片放进 img/gallery/ 后，' +
            '运行根目录的 build.bat 即可生成。</p>';
        return;
    }

    images.forEach((img, i) => {
        const card = document.createElement('figure');
        card.className = 'photo-card';
        card.style.setProperty('--d', (i * 0.06).toFixed(2) + 's');
        card.innerHTML =
            `<img src="${img.src}" alt="${escapeHtml(img.name)}" loading="lazy">` +
            '<div class="cap">' +
                '<span class="c-ico">🖼️</span>' +
                `<span class="c-name">${escapeHtml(img.name)}</span>` +
                '<span class="c-size">GAL · ' + String(i + 1).padStart(2, '0') + '</span>' +
            '</div>';
        card.addEventListener('click', () => openLightbox(img));
        grid.appendChild(card);
    });

    function openLightbox(img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.name;
        lightboxCaption.textContent = img.name;
        lightbox.classList.add('open');
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        lightboxImg.src = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
})();

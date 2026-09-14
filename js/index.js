// ================= AI Chat 风主页逻辑 =================
// 数据来源：src/post/posts.js（由 build.bat 生成，提供 window.POSTS）

(function () {
    const posts = (Array.isArray(window.POSTS) ? window.POSTS : [])
        .slice()
        .sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });

    function escapeHtml(str) {
        return String(str == null ? '' : str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function tagsOf(post) {
        return Array.isArray(post.tags) ? post.tags.slice(0, 2) : [];
    }

    function emojiFor(post) {
        const blob = ((post.title || '') + ' ' + (post.tags || []).join(' ')).toLowerCase();
        if (/unity|游戏|同步|帧/.test(blob)) return '🎮';
        if (/面经|面试|interview/.test(blob)) return '🧠';
        if (/css|前端|html/.test(blob)) return '🎨';
        if (/算法|刷题|leetcode/.test(blob)) return '📖';
        return '📄';
    }

    function minsOf(post) {
        if (post.mins) return post.mins;
        return Math.max(1, Math.ceil((post.content || '').length / 500));
    }

    // ===== 导航徽标（总 / 随笔 / 知识库）=====
    const badge = document.getElementById('postCount');
    if (badge) badge.textContent = posts.length || '';
    const essayCount = document.getElementById('essayCount');
    if (essayCount) essayCount.textContent = posts.filter(function (p) { return p.kind === 'essay'; }).length || '';
    const kbCount = document.getElementById('kbCount');
    if (kbCount) kbCount.textContent = posts.filter(function (p) { return p.kind === 'kb'; }).length || '';

    const blogLatest = document.getElementById('blogLatest');
    if (blogLatest) {
        blogLatest.textContent = posts.length
            ? '最新一篇：《' + (posts[0].title || posts[0].id) + '》（' + minsOf(posts[0]) + ' 分钟）'
            : '还没有文章。放入 .md 后双击 build.bat 发布。';
    }

    // ===== 最近写作（聊天条目）=====
    const msgs = document.getElementById('postMsgs');
    if (msgs) {
        if (!posts.length) {
            msgs.innerHTML = '<div class="empty">尚无文章。将 .md 放进 src/post 后运行 build.bat 即可发布。</div>';
        } else {
            posts.slice(0, 4).forEach(function (post) {
                const el = document.createElement('div');
                el.className = 'msg';
                el.innerHTML =
                    '<div class="m-ava">' + emojiFor(post) + '</div>' +
                    '<div class="m-body">' +
                        '<div class="m-title">' + escapeHtml(post.title || post.id) + '</div>' +
                        '<div class="m-meta">' +
                            '<span>' + escapeHtml(post.date || '') + ' · ' + minsOf(post) + ' min</span>' +
                            '<span class="mtag mtag-kind">' + escapeHtml(post.kindLabel || (post.kind === 'essay' ? '随笔' : '知识库')) + '</span>' +
                            tagsOf(post).map(function (t) {
                                return '<span class="mtag">' + escapeHtml(t) + '</span>';
                            }).join('') +
                        '</div>' +
                    '</div>';
                el.addEventListener('click', function () {
                    location.href = './src/blog.html#' + encodeURIComponent(post.id);
                });
                msgs.appendChild(el);
            });
        }
    }

    // ===== hero 快捷 chip（对应最近文章）=====
    const hint = document.getElementById('chatHint');
    if (hint && posts.length) {
        posts.slice(0, 3).forEach(function (post) {
            const c = document.createElement('span');
            c.className = 'chip';
            c.textContent = '✍ ' + (post.title || post.id);
            c.addEventListener('click', function () {
                location.href = './src/blog.html#' + encodeURIComponent(post.id);
            });
            hint.appendChild(c);
        });
    }

    // ===== 导航跳转 =====
    function bindNav(id, url) {
        const el = document.getElementById(id);
        if (!el || el.classList.contains('locked')) return;
        function go() { location.href = url; }
        el.addEventListener('click', go);
        el.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
        });
    }
    bindNav('blog-button', './src/blog.html');
    bindNav('nav-blog', './src/blog.html');
    bindNav('nav-essay', './src/blog.html?kind=essay');
    bindNav('nav-kb', './src/blog.html?kind=kb');
    bindNav('gallery-button', './src/gallery.html');
    bindNav('nav-gallery', './src/gallery.html');
    bindNav('nav-lab', './src/gallery.html');

    // ===== 技能条充能动画 =====
    setTimeout(function () {
        document.querySelectorAll('.sbar div').forEach(function (b) {
            b.style.width = (b.dataset.w || 0) + '%';
        });
    }, 400);
})();

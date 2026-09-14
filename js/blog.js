// ================= 博客页逻辑（含随笔/知识库分类） =================
// 数据来源：src/post/posts.js（由 build.bat 生成，提供 window.POSTS）
// 每篇文章带 kind / kindLabel：放在 src/post/notes/ 下为随笔，其余为知识库。

(function () {
    const posts = (Array.isArray(window.POSTS) ? window.POSTS : [])
        .slice()
        .sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });

    const tabsEl = document.getElementById('kindTabs');
    const featureEl = document.getElementById('featureCard');
    const listEl = document.getElementById('postList');
    const contentEl = document.getElementById('content');
    const headEl = document.getElementById('articleHead');
    const ghostMsg = document.getElementById('ghostMsg');

    // ?kind=essay / ?kind=kb 可直接进入指定分类
    const q = new URLSearchParams(location.search);
    let curKind = ['essay', 'kb'].indexOf(q.get('kind')) >= 0 ? q.get('kind') : null;

    // ===== 目录（TOC）状态：知乎式，点击跳转 + 滚动高亮 =====
    const tocNav = document.getElementById('tocNav');
    let tocHeadings = [];

    function escapeHtml(str) {
        return String(str == null ? '' : str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function tagsOf(post) {
        return Array.isArray(post.tags) ? post.tags.slice(0, 3) : [];
    }

    function emojiFor(post) {
        const blob = ((post.title || '') + ' ' + (post.tags || []).join(' ')).toLowerCase();
        if (/unity|游戏|同步|帧/.test(blob)) return '🎮';
        if (/面经|面试|interview/.test(blob)) return '🧠';
        if (/css|前端|html/.test(blob)) return '🎨';
        if (/算法|刷题|leetcode/.test(blob)) return '📖';
        if (post.kind === 'essay') return '✍️';
        return '📄';
    }

    function minsOf(post) {
        if (post.mins) return post.mins;
        return Math.max(1, Math.ceil((post.content || '').length / 500));
    }

    function tagHtml(post) {
        return tagsOf(post).map(function (t) {
            return '<span class="mtag">' + escapeHtml(t) + '</span>';
        }).join('');
    }

    function kindLabelOf(post) {
        return post.kindLabel || (post.kind === 'essay' ? '随笔' : '知识库');
    }

    function filtered() {
        return curKind ? posts.filter(function (p) { return p.kind === curKind; }) : posts;
    }

    // ===== 分类 Tab =====
    function renderTabs() {
        const cnt = function (k) {
            return k ? posts.filter(function (p) { return p.kind === k; }).length : posts.length;
        };
        const defs = [
            { k: null,   name: '全部' },
            { k: 'essay', name: '✍️ 随笔' },
            { k: 'kb',    name: '📚 知识库' }
        ];
        tabsEl.innerHTML = defs.map(function (d) {
            return '<span class="tab' + (curKind === d.k ? ' on' : '') + '" data-kind="' + (d.k || '') + '">' +
                d.name + '<span class="t-cnt">' + cnt(d.k) + '</span></span>';
        }).join('');
        tabsEl.querySelectorAll('.tab').forEach(function (tab) {
            tab.addEventListener('click', function () {
                curKind = tab.dataset.kind || null;
                renderTabs();
                renderList();
                window.p5rDecorate && window.p5rDecorate();
            });
        });
    }

    // ===== 渲染列表 =====
    function renderList() {
        const list = filtered();
        featureEl.innerHTML = '';
        listEl.innerHTML = '';
        if (!list.length) {
            listEl.innerHTML =
                '<p class="empty">该分类下暂无文章。' +
                (curKind === 'essay' ? '将 .md 放入 src/post/notes/' : '将 .md 放入 src/post/') +
                ' 后运行 build.bat 即可生成。</p>';
            ghostMsg.textContent = '该分类下暂无文章。';
            headEl.innerHTML = '';
            contentEl.innerHTML = '';
            buildToc();
            return;
        }

        // 精选卡（当前分类第一篇）
        const f = list[0];
        featureEl.innerHTML =
            '<div class="feat" tabindex="0">' +
                '<span class="f-tag">' + escapeHtml(f.kindLabel || '') + '</span>' +
                '<div class="f-title">' + escapeHtml(f.title || f.id) + '</div>' +
                '<div class="f-meta">' + escapeHtml(f.date || '') + ' · ' + minsOf(f) + ' min</div>' +
                (f.excerpt ? '<div class="f-quote">' + escapeHtml(f.excerpt) + '</div>' : '') +
            '</div>';
        featureEl.firstElementChild.addEventListener('click', function () {
            selectPost(f.id);
        });

        // 其余条目
        list.slice(1).forEach(function (post) {
            const item = document.createElement('div');
            item.className = 'msg';
            item.dataset.id = post.id;
            item.innerHTML =
                '<div class="m-ava">' + emojiFor(post) + '</div>' +
                '<div class="m-body">' +
                    '<div class="m-title">' + escapeHtml(post.title || post.id) + '</div>' +
                    '<div class="m-meta">' +
                        '<span>' + escapeHtml(post.date || '') + ' · ' + minsOf(post) + ' min</span>' +
                        tagHtml(post) +
                    '</div>' +
                '</div>';
            item.addEventListener('click', function () { selectPost(post.id); });
            listEl.appendChild(item);
        });
    }

    // ===== 正文渲染 =====
    function selectPost(id) {
        const post = posts.find(function (p) { return p.id === id; });
        if (!post) return;

        document.querySelectorAll('#postList .msg').forEach(function (el) {
            el.classList.toggle('on', el.dataset.id === id);
        });

        headEl.innerHTML =
            '<div class="crumb">' + escapeHtml(post.kind === 'essay' ? 'notes' : 'kb') +
                ' / ' + escapeHtml(post.id) + '</div>' +
            '<div class="t">' + escapeHtml(post.title || post.id) + '</div>' +
            '<div class="meta">' +
                '<span class="mark-kind">' + escapeHtml(post.kindLabel || '') + '</span>' +
                '<span>👤 ℒℯℴ𝓃</span>' +
                '<span>⏱ ' + minsOf(post) + ' min</span>' +
                (tagsOf(post).length ? '<span>🗂 ' + escapeHtml(tagsOf(post).join(' · ')) + '</span>' : '') +
            '</div>';

        contentEl.innerHTML = window.marked
            ? window.marked.parse(post.content)
            : '<p>' + escapeHtml(post.content).replace(/\n/g, '<br>') + '</p>';

        buildToc();

        ghostMsg.textContent = '接着读《' + (nextTitle(post) || '面经') + '》？';

        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (location.hash !== '#' + id) {
            history.replaceState(null, '', '#' + id);
        }
    }

    function nextTitle(post) {
        const idx = posts.indexOf(post);
        const next = posts[idx + 1];
        return next ? (next.title || next.id || '').slice(0, 20) : '';
    }

    // ===== 阅读进度条 =====
    const bar = document.createElement('div');
    bar.className = 'readbar';
    document.body.appendChild(bar);
    window.addEventListener('scroll', function () {
        const h = document.documentElement;
        const total = h.scrollHeight - h.clientHeight;
        bar.style.width = (total > 0 ? (h.scrollTop / total) : 0) * 100 + '%';
    });

    // ===== 初始化 =====
    renderTabs();
    renderList();

    // hash 初始定位
    const initial = location.hash ? decodeURIComponent(location.hash.slice(1)) : null;
    if (posts.length) {
        selectPost(initial && posts.some(function (p) { return p.id === initial; }) ? initial : posts[0].id);
    }

    // ===== 目录构建：点击跳转 + 滚动高亮 =====
    function buildToc() {
        if (!tocNav) return;
        tocNav.innerHTML = '';
        tocHeadings = Array.from(contentEl.querySelectorAll('h1, h2, h3, h4'));
        const inline = document.getElementById('tocInline');
        if (inline) inline.innerHTML = '';
        if (!tocHeadings.length) {
            tocNav.innerHTML = '<div class="toc-empty">本文暂无标题结构</div>';
            return;
        }
        // 以全文最小标题层级为基准，计算缩进级数（支持文档从三级标题开头的情况）
        const minLv = Math.min.apply(null, tocHeadings.map(function (h) {
            return Number(h.tagName.slice(1));
        }));
        tocHeadings.forEach(function (h, i) {
            h.id = 'md-h-' + i;
            const a = document.createElement('a');
            a.className = 'toc-link toc-lv' + (Number(h.tagName.slice(1)) - minLv + 1);
            a.textContent = h.textContent;
            a.title = h.textContent;
            a.dataset.i = i;
            a.addEventListener('click', function () {
                scrollToHeading(h);
                setActive(i);
            });
            tocNav.appendChild(a);
        });
        // 同步窄屏行内 TOC
        if (inline) {
            inline.innerHTML = '<div class="toc-panel"><nav class="toc-nav" id="tocNavInline"></nav></div>';
            Array.from(tocNav.children).forEach(function (child) {
                const clone = child.cloneNode(true);
                clone.dataset.i = child.dataset.i;
                clone.addEventListener('click', function () {
                    scrollToHeading(tocHeadings[Number(clone.dataset.i)]);
                    setActive(Number(clone.dataset.i));
                });
                inline.firstElementChild.firstElementChild.appendChild(clone);
            });
        }
    }

    function scrollToHeading(h) {
        const y = h.getBoundingClientRect().top + window.scrollY - 24;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }

    function setActive(i) {
        document.querySelectorAll('.toc-link').forEach(function (el) {
            el.classList.toggle('on', Number(el.dataset.i) === i);
        });
    }

    // 滚动监听：高亮最近标题
    window.addEventListener('scroll', function () {
        if (!tocHeadings.length) return;
        const probe = window.scrollY + 90;
        let cur = 0;
        tocHeadings.forEach(function (h, i) {
            if (h.getBoundingClientRect().top + window.scrollY <= probe) cur = i;
        });
        setActive(cur);
    }, { passive: true });

    // P5R 主题装饰需要重新挂接（tab/list 是动态生成的）
    window.p5rDecorate && window.p5rDecorate();
})();

// ================= 全站主题切换（含 P5R 结构增强） =================
// 两种主题：ai（AI Chat 风，默认） / p5r（女神异闻录风，结构级还原）
(function () {
    var KEY = 'site-theme';
    var root = document.documentElement;
    var MARQUEE_ID = 'p5-marquee';
    var FLASH_ID = 'p5-flash';

    var MARQUEE_HTML =
        '<div class="p5-marquee" id="' + MARQUEE_ID + '"><div class="p5-marq-inner">' +
            '<span>★ WAKE UP ★ GET UP ★ BOOST UP ★</span><span>🎴 心を盗め 🎴</span>' +
            '<span>★ FULL>STACK MASTERMIND ★</span><span>第 n 章 · RELOAD</span>' +
            '<span>★ WAKE UP ★ GET UP ★ BOOST UP ★</span><span>🎴 心を盗め 🎴</span>' +
            '<span>★ FULL>STACK MASTERMIND ★</span><span>第 n 章 · RELOAD</span>' +
        '</div></div>';

    // 每次激活 P5R 都重新“注入 + 装饰”（因为内容可能是 JS 后渲染的）
    function decorate() {
        if (root.dataset.theme !== 'p5r') return cleanup();

        // 1. 顶部跑马灯
        if (!document.getElementById(MARQUEE_ID)) {
            document.body.insertAdjacentHTML('afterbegin', MARQUEE_HTML);
        }

        // 2. Hero 空芯 echo：把 h1 文案复制到 data-echo，CSS ::before 渲染错位描边字
        document.querySelectorAll('.hero h1, .hdr .t, .side-h').forEach(function (h) {
            if (!h.dataset.echo) h.dataset.echo = h.textContent.trim();
            h.classList.add('p5-echo');
        });

        // 3. 卡片右下空芯编号 + 红色顶条
        document.querySelectorAll('.aicard').forEach(function (c, i) {
            c.dataset.cardNo = ['BLOG', 'GAL', 'LAB', 'LOCKED'][i] || 'CELL-' + (i + 1);
            c.classList.add('p5-card');
        });
        document.querySelectorAll('.panel').forEach(function (p, i) {
            p.classList.add('p5-card');
            p.dataset.cardNo = 'PANEL-' + (i + 1);
        });
        document.querySelectorAll('.photo-card').forEach(function (p, i) {
            p.dataset.cardNo = String(i + 1).padStart(2, '0');
            p.classList.add('p5-card');
        });

        // 4. 技能条等级角标（数值 → S/A/B）
        document.querySelectorAll('.srow .s-val').forEach(function (v) {
            const n = parseInt(v.textContent, 10) || 0;
            const rank = n >= 85 ? 'S' : n >= 75 ? 'A' : n >= 60 ? 'B' : 'C';
            if (!v.dataset.rank) {
                const r = document.createElement('span');
                r.className = 'rank rank-' + rank.toLowerCase();
                r.textContent = rank;
                v.parentNode.appendChild(r);
                v.dataset.rank = rank;
            }
        });

        // 5. 卡片砸落入场（一次性校准 delay）
        document.querySelectorAll('.p5-card, .hero, .sidebar, .hdr, .article').forEach(function (el, i) {
            el.style.setProperty('--d', (i * 0.06).toFixed(2) + 's');
            el.classList.add('p5-drop', 'p5-armed');
        });
        document.body.classList.add('p5-armed');

        // 6. 点击黑闪（对可点击元素，锁定的除外）
        document.querySelectorAll('.aicard:not(.locked), .msg, .nav-item:not(.locked), .feat, .photo-card').forEach(function (el) {
            if (el.dataset.p5flash) return;
            el.dataset.p5flash = '1';
            el.addEventListener('click', function () {
                showFlash('「 移动中……」');
            });
        });

        markMarqueeFallback();
    }

    // 离开 P5R：清理注入物
    function cleanup() {
        const m = document.getElementById(MARQUEE_ID);
        if (m) m.remove();
        document.querySelectorAll('.p5-card, .p5-drop, .p5-armed').forEach(function (el) {
            el.classList.remove('p5-card', 'p5-drop', 'p5-armed');
            el.style.removeProperty('--d');
        });
        document.body.classList.remove('p5-armed');
    }

    // 黑闪转场
    var flashTimer = null;
    function ensureFlash() {
        let f = document.getElementById(FLASH_ID);
        if (!f) {
            f = document.createElement('div');
            f.id = FLASH_ID;
            f.className = 'p5-flash';
            document.body.appendChild(f);
        }
        return f;
    }
    function showFlash(msg) {
        if (root.dataset.theme !== 'p5r') return;
        const f = ensureFlash();
        f.textContent = msg;
        f.classList.remove('go');
        void f.offsetWidth;
        f.classList.add('go');
        clearTimeout(flashTimer);
    }

    // 固定取景框回归到 body::after（marquee 出现后无需 adjustment）
    function markMarqueeFallback() {}

    // 切换主题
    function setTheme(t) {
        if (t !== 'ai' && t !== 'p5r') return;
        root.dataset.theme = t;
        try { localStorage.setItem(KEY, t); } catch (e) {}
        decorate();
        markActive();
        if (t === 'p5r') showFlash('· THEME CHANGED ·');
    }

    // 绑定右下角切换小组件
    document.addEventListener('click', function (e) {
        var btn = e.target.closest && e.target.closest('.theme-sw');
        if (!btn) return;
        setTheme(btn.dataset.theme);
    });

    function markActive() {
        document.querySelectorAll('.theme-sw').forEach(function (b) {
            b.classList.toggle('cur', b.dataset.theme === root.dataset.theme);
        });
    }

    // 首次载入恢复
    try {
        var saved = localStorage.getItem(KEY);
        if (saved === 'p5r' || saved === 'ai') root.dataset.theme = saved;
    } catch (e) {}
    decorate();
    markActive();

    // 暴露给页面延迟渲染后补充装饰（如主页 hero chip 动态生成）
    window.p5rDecorate = decorate;
    window.addEventListener('load', decorate);
})();

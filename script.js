document.addEventListener('DOMContentLoaded', function () {
    const contentArea = document.getElementById('content-area');

    if (typeof DATABASE_HTML === 'undefined') {
        contentArea.innerHTML = `
            <div id="sticky-text">
                Erro: <strong>database.js</strong> não encontrado.<br>
                Certifique-se de que o arquivo database.js está na mesma pasta.
            </div>
        `;
        return;
    }

    contentArea.innerHTML = DATABASE_HTML;

    // --- LÓGICA DO ACORDEÃO (EXPANDIR/FECHAR) ---
    const editions = document.querySelectorAll('.edition');

    function openAccordion(edition) {
        const content = edition.querySelector('.edition-content');
        if (!content) return;

        if (!edition.classList.contains('active')) {
            edition.classList.add('active');
            content.style.maxHeight = content.scrollHeight + "px";
            content.style.padding = "0 1.5rem";
        }
    }

    function closeAccordion(edition) {
        const content = edition.querySelector('.edition-content');
        if (!content) return;

        if (edition.classList.contains('active')) {
            edition.classList.remove('active');
            content.style.maxHeight = null;
            content.style.padding = "0 1.5rem";
        }
    }

    editions.forEach(edition => {
        const title = edition.querySelector('.edition-title');
        if (!title) return;

        title.addEventListener('click', () => {
            if (edition.classList.contains('active')) {
                closeAccordion(edition);
            } else {
                openAccordion(edition);
            }
        });
    });

    // --- LÓGICA DOS FILTROS ---
    const dbSelector = document.getElementById('dbSelector');
    const searchInput = document.getElementById('searchInput');
    const filterClass = document.getElementById('filterClass');
    const filterSistema = document.getElementById('filterSistema');
    const jdaCheckbox = document.getElementById('check');

    // Monta as opções automaticamente a partir do HTML carregado (data-label)
    const dbOptions = Array.from(editions).map(edition => {
        const label =
            edition.getAttribute('data-label') ||
            edition.dataset.label ||
            edition.querySelector('.edition-title span')?.textContent?.trim() ||
            edition.id;

        return { id: edition.id, label };
    });

    // Preenche o seletor de DBs
    if (dbSelector) {
        dbSelector.innerHTML = '';

        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = 'Todas';
        dbSelector.appendChild(allOption);

        dbOptions.forEach(db => {
            const option = document.createElement('option');
            option.value = db.id;
            option.textContent = db.label;
            dbSelector.appendChild(option);
        });
    }

    function applyAllFilters() {
        const searchTerm = (searchInput?.value || '').toLowerCase();
        const classValue = filterClass?.value || 'all';
        const systemValue = filterSistema?.value || 'all';
        const selectedDB = dbSelector?.value || 'all';

        document.querySelectorAll('.edition').forEach(edition => {
            let editionHasVisibleArticle = false;

            // 1. Filtra por seletor de DB
            if (selectedDB !== 'all' && edition.id !== selectedDB) {
                edition.style.display = 'none';
                return;
            }
            edition.style.display = 'block';

            // 2. Filtra os artigos dentro da edição visível
            const articles = edition.querySelectorAll('.searchable');
            articles.forEach(article => {
                const textMatch = article.textContent.toLowerCase().includes(searchTerm);
                const classMatch = classValue === 'all' || article.classList.contains(classValue);
                const systemMatch = systemValue === 'all' || article.classList.contains(systemValue);

                if (textMatch && classMatch && systemMatch) {
                    article.style.display = '';
                    editionHasVisibleArticle = true;
                } else {
                    article.style.display = 'none';
                }
            });

            // 3. Abre ou fecha o acordeão da edição com base nos resultados
            if (editionHasVisibleArticle) {
                openAccordion(edition);
            } else {
                closeAccordion(edition);
            }
        });
    }

    // Eventos dos filtros
    dbSelector?.addEventListener('change', applyAllFilters);
    searchInput?.addEventListener('input', applyAllFilters);
    filterClass?.addEventListener('change', applyAllFilters);
    filterSistema?.addEventListener('change', applyAllFilters);

    // Checkbox pré JdA (mantém sua lógica separada, pois afeta um container diferente)
    jdaCheckbox?.addEventListener('change', function () {
        const alvo = document.getElementById('palavra-marcada');
        if (!alvo) return;
        alvo.style.display = this.checked ? 'none' : 'block';
    });

    // --- Botão Voltar ao Topo ---
    const backToTopButton = document.getElementById("backToTop");

    window.onscroll = function () {
        if (!backToTopButton) return;

        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    };

    if (backToTopButton) {
        backToTopButton.onclick = function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    }

    // ===== TEMA SANGUE/SOMBRAS/CLÁSSICO =====
    (function initTheme() {
        var body = document.body;
        var key = 't20_theme';

        function applyTheme(theme) {
            body.classList.remove('theme-dark', 'theme-classic');
            if (theme === 'dark') body.classList.add('theme-dark');
            else if (theme === 'classic') body.classList.add('theme-classic');

            document.querySelectorAll('.theme-btn').forEach(function (btn) {
                btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
            });
            localStorage.setItem(key, theme);
        }

        var saved = localStorage.getItem(key);
        if (!saved) {
            var oldStr = localStorage.getItem('strTheme');
            var oldHub = localStorage.getItem('hubTheme');
            var refTheme = oldStr || oldHub;
            if (refTheme === 'dark') saved = 'dark';
            else if (refTheme === 'classic' || refTheme === 'light') saved = 'classic';
            else saved = 'blood';
        }

        applyTheme(saved);

        document.querySelectorAll('.theme-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                applyTheme(btn.getAttribute('data-theme'));
            });
        });
    })();

    // ===== PARTÍCULAS MÁGICAS =====
    (function initParticles() {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let w, h;

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        const particles = [];
        const count = 50;

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                r: Math.random() * 2 + 1,
                alpha: Math.random() * 0.5 + 0.1,
            });
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 213, 79, ${p.alpha})`;
                ctx.fill();
            });
            requestAnimationFrame(draw);
        }
        draw();
    })();
});

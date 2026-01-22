document.addEventListener('DOMContentLoaded', async function () {
    const contentArea = document.getElementById('content-area');

    // Carrega a "database" separada do index (editions + articles)
    try {
        const response = await fetch('database.html', { cache: 'no-store' });
        if (!response.ok) throw new Error(`Falha ao carregar database.html (HTTP ${response.status})`);
        const html = await response.text();
        contentArea.innerHTML = html;
    } catch (err) {
        console.error(err);
        contentArea.innerHTML = `
            <div id="sticky-text">
                Não foi possível carregar a database.<br>
                Confirme se o arquivo <strong>database.html</strong> está na mesma pasta do site e se você está abrindo o site via servidor (http/https).
            </div>
        `;
        return;
    }

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
});

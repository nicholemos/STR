document.addEventListener('DOMContentLoaded', function () {
    // --- LÓGICA DO ACORDEÃO (EXPANDIR/FECHAR) ---
    const editions = document.querySelectorAll('.edition');

    // Função para abrir um acordeão
    function openAccordion(edition) {
        const content = edition.querySelector('.edition-content');
        if (!edition.classList.contains('active')) {
            edition.classList.add('active');
            content.style.maxHeight = content.scrollHeight + "px";
            content.style.padding = "0 1.5rem";
        }
    }

    // Função para fechar um acordeão
    function closeAccordion(edition) {
        const content = edition.querySelector('.edition-content');
        if (edition.classList.contains('active')) {
            edition.classList.remove('active');
            content.style.maxHeight = null;
            content.style.padding = "0 1.5rem";
        }
    }

    // Adiciona o evento de clique para expandir/fechar manualmente
    editions.forEach(edition => {
        const title = edition.querySelector('.edition-title');
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

    const dbOptions = [
        { id: 'db220', label: 'DB 220 (Out/25)' },
        { id: 'db219', label: 'DB 219 (Set/25)' },
        { id: 'db218', label: 'DB 218 (Ago/25)' },
        { id: 'db217', label: 'DB 217 (Jul/25)' },
        { id: 'db216', label: 'DB 216 (Jun/25)' },
        { id: 'db215', label: 'DB 215 (Mai/25)' },
        { id: 'db214', label: 'DB 214 (Abr/25)' },
        { id: 'db213', label: 'DB 213 (Mar/25)' },
        { id: 'db212', label: 'DB 212 (Fev/25)' },
        { id: 'db211', label: 'DB 211 (Jan/25)' },
        { id: 'db210', label: 'DB 210 (Dez/24)' },
        { id: 'db209', label: 'DB 209 (Nov/24)' },
        { id: 'db208', label: 'DB 208 (Out/24)' },
        { id: 'db207', label: 'DB 207 (Set/24)' },
        { id: 'db206', label: 'DB 206 (Ago/24)' },
        { id: 'db205', label: 'DB 205 (Jul/24)' },
        { id: 'db204', label: 'DB 204 (Jun/24)' },
        { id: 'db203', label: 'DB 203 (Mai/24)' },
        { id: 'db202', label: 'DB 202 (Abr/24)' },
        { id: 'db201', label: 'DB 201 (Mar/24)' },
        { id: 'db200', label: 'DB 200 (Fev/24)' },
        { id: 'db199', label: 'DB 199 (Jan/24)' },
        { id: 'db198', label: 'DB 198 (Dez/23)' },
        { id: 'db197', label: 'DB 197 (Nov/23)' },
        { id: 'db196', label: 'DB 196 (Out/23)' },
        { id: 'db195', label: 'DB 195 (Set/23)' },
        { id: 'db194', label: 'DB 194 (Ago/23)' },
        { id: 'db193', label: 'DB 193 (Jul/23)' },
        { id: 'db192', label: 'DB 192 (Jun/23)' },
        { id: 'db191', label: 'DB 191 (Mai/23)' },
        { id: 'db190', label: 'DB 190 (Abr/23)' },
        { id: 'db189', label: 'DB 189 (Mar/23)' },
        { id: 'db188', label: 'DB 188 (Fev/23)' },
        { id: 'db187', label: 'DB 187 (Jan/23)' },
        { id: 'db186', label: 'DB 186 (Dez/22)' },
        { id: 'db185', label: 'DB 185 (Nov/22)' },
        { id: 'db184', label: 'DB 184 (Out/22)' },
        { id: 'db183', label: 'DB 183 (Set/22)' },
        { id: 'db182', label: 'DB 182 (Ago/22)' },
        { id: 'db181', label: 'DB 181 (Jul/22)' },
        { id: 'db180', label: 'DB 180 (Jun/22)' },
        { id: 'db179', label: 'DB 179 (Mai/22)' },
        { id: 'db178', label: 'DB 178 (Abr/22)' },
    ];

    // Preenche o seletor de DBs
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

    /**
     * Função principal que aplica todos os filtros de uma vez.
     * Isso garante que os filtros funcionem em conjunto.
     */
    function applyAllFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const classValue = filterClass.value;
        const systemValue = filterSistema.value;
        const selectedDB = dbSelector.value;

        let hasVisibleResults = false;

        document.querySelectorAll('.edition').forEach(edition => {
            let editionHasVisibleArticle = false;

            // 1. Filtra por seletor de DB
            if (selectedDB !== 'all' && edition.id !== selectedDB) {
                edition.style.display = 'none';
                return; // Pula para a próxima edição
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
                    hasVisibleResults = true;
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

    // Adiciona os eventos aos filtros para chamar a função principal
    dbSelector.addEventListener('change', applyAllFilters);
    searchInput.addEventListener('input', applyAllFilters);
    filterClass.addEventListener('change', applyAllFilters);
    filterSistema.addEventListener('change', applyAllFilters);

    // Checkbox pré JdA (mantém sua lógica separada, pois afeta um container diferente)
    jdaCheckbox.addEventListener('change', function () {
        document.getElementById('palavra-marcada').style.display = this.checked ? 'none' : 'block';
    });


    // --- Botão Voltar ao Topo ---
    const backToTopButton = document.getElementById("backToTop");
    window.onscroll = function () {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    };
    backToTopButton.onclick = function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

});

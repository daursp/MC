document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('services-grid');
  const empty = document.getElementById('empty');
  const count = document.getElementById('count');
  const chipsBox = document.getElementById('categories');
  const search = document.getElementById('search');
  const sort = document.getElementById('sort');

  const state = { category: 'Все', q: '', sort: '' };
  let lastRequest = 0;
  let chipsBuilt = false;

  function renderChips(categories) {
    if (chipsBuilt) return;
    chipsBuilt = true;

    const all = ['Все', ...categories];
    chipsBox.innerHTML = all
      .map(
        (name) =>
          `<button class="chip${name === state.category ? ' is-active' : ''}" type="button" data-category="${esc(name)}">${esc(name)}</button>`
      )
      .join('');
  }

  async function load() {
    const id = ++lastRequest;
    empty.hidden = true;
    count.textContent = 'Загрузка…';
    grid.innerHTML = '<div class="skeleton skeleton--row"></div><div class="skeleton skeleton--row"></div><div class="skeleton skeleton--row"></div><div class="skeleton skeleton--row"></div>';

    const params = new URLSearchParams({ category: state.category, q: state.q, sort: state.sort });

    try {
      const data = await api.get('/api/services?' + params);
      if (id !== lastRequest) return;

      renderChips(data.categories);
      grid.innerHTML = data.items.map(practiceRow).join('');
      count.textContent = data.items.length
        ? `Найдено практик: ${data.items.length}`
        : 'По вашему запросу ничего не найдено';
      empty.hidden = data.items.length > 0;
    } catch (err) {
      if (id !== lastRequest) return;
      grid.innerHTML = '';
      count.textContent = '';
      grid.innerHTML = errorNote(err.message);
    }
  }

  chipsBox.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    state.category = chip.dataset.category;
    chipsBox.querySelectorAll('.chip').forEach((c) => c.classList.toggle('is-active', c === chip));
    load();
  });

  let timer;
  search.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      state.q = search.value;
      load();
    }, 300);
  });

  sort.addEventListener('change', () => {
    state.sort = sort.value;
    load();
  });

  load();
});

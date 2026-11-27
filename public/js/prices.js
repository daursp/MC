document.addEventListener('DOMContentLoaded', async () => {
  const box = document.getElementById('plans');

  try {
    const { items } = await api.get('/api/plans');

    box.innerHTML = items
      .map(
        (p) => `
        <article class="plan">
          <div class="plan__main">
            <h2>${esc(p.name)}</h2>
            <p>${esc(p.note)}</p>
          </div>
          <div class="plan__price">
            <span class="plan__amount">${money(p.price)}</span>
            <span class="plan__per">${
              p.visits > 1
                ? `${money(Math.round(p.price / p.visits))} за занятие`
                : p.price === 1100
                  ? 'первое посещение'
                  : 'одно занятие'
            }</span>
          </div>
          <button class="btn btn--small" type="button" data-open-booking>Выбрать</button>
        </article>`
      )
      .join('');
  } catch (err) {
    box.innerHTML = errorNote(err.message);
  }
});

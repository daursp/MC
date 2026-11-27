document.addEventListener('DOMContentLoaded', async () => {
  const box = document.getElementById('faq');

  try {
    const { items } = await api.get('/api/faq');

    box.innerHTML = items
      .map(
        (item, index) => `
        <details class="faq__item"${index === 0 ? ' open' : ''}>
          <summary>${esc(item.question)}<span aria-hidden="true">+</span></summary>
          <p>${esc(item.answer)}</p>
        </details>`
      )
      .join('');
  } catch (err) {
    box.innerHTML = errorNote(err.message);
  }
});

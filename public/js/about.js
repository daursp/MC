document.addEventListener('DOMContentLoaded', async () => {
  const box = document.getElementById('teachers');

  try {
    const { items } = await api.get('/api/teachers');

    box.innerHTML = items
      .map((t) => {
        const initials = t.name
          .split(/\s+/)
          .map((word) => word[0])
          .slice(0, 2)
          .join('');

        const avatar = t.image
          ? `<div class="member__avatar"><img src="${esc(t.image)}" alt="${esc(t.name)}" decoding="async"></div>`
          : `<div class="member__avatar member__avatar--monogram" aria-hidden="true">${esc(initials)}</div>`;

        return `
        <article class="member">
          ${avatar}
          <div class="member__body">
            <h3>${esc(t.name)}</h3>
            <span>${esc(t.role)}</span>
            <p>${esc(t.bio)}</p>
          </div>
        </article>`;
      })
      .join('');
  } catch (err) {
    box.innerHTML = errorNote(err.message);
  }
});

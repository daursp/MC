document.addEventListener('DOMContentLoaded', async () => {
  const servicesBox = document.getElementById('popular-services');
  const reviewsBox = document.getElementById('reviews');

  try {
    const { items } = await api.get('/api/services');
    servicesBox.innerHTML = items.slice(0, 3).map(serviceCard).join('');
    setupPhotos(servicesBox);
  } catch (err) {
    servicesBox.innerHTML = errorNote(err.message);
  }

  try {
    const { items } = await api.get('/api/reviews');
    reviewsBox.innerHTML = items
      .slice(0, 3)
      .map(
        (r) => `
        <article class="quote">
          <p class="quote__stars" aria-label="Оценка ${r.rating} из 5">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</p>
          <p class="quote__text">«${esc(r.text)}»</p>
          <p class="quote__author">${esc(r.author)}</p>
        </article>`
      )
      .join('');
  } catch (err) {
    reviewsBox.innerHTML = errorNote(err.message);
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  const view = document.getElementById('service-view');
  const crumb = document.getElementById('crumb-current');
  const slug = location.pathname.split('/').filter(Boolean).pop();

  try {
    const { service: s, similar } = await api.get('/api/services/' + encodeURIComponent(slug));

    document.title = `${s.title} — Мягкая сила`;
    crumb.textContent = s.title;

    view.innerHTML = `
      <div class="service-hero">
        <div class="photo photo--tall" data-photo="${esc(s.image)}"
             data-hint="ФОТО · ${esc(s.title)}" data-alt="${esc(s.title)}"></div>

        <div>
          <p class="kicker">${esc(s.category)} · 38 °C</p>
          <h1>${esc(s.title)}</h1>
          <p class="lead">${esc(s.short_desc)}</p>
          <span class="trial-note">Пробное посещение — 1 100 ₽</span>

          <dl class="service-facts">
            <div><dt>Стоимость</dt><dd>${money(s.price)}</dd></div>
            <div><dt>Длительность</dt><dd>${s.duration} мин</dd></div>
            <div><dt>Уровень</dt><dd>${esc(s.level)}</dd></div>
            <div><dt>Температура</dt><dd>+38 °C</dd></div>
          </dl>

          <div class="service-text">
            <p>${esc(s.description)}</p>

            <h2>Что взять с собой</h2>
            <ul class="ticks">
              <li>Удобную одежду, в которой можно двигаться</li>
              <li>Бутылку воды — в горячем зале пьётся чаще</li>
              <li>Коврик и полотенце — или уточните у администратора</li>
            </ul>

            <p style="margin-top: 22px;">
              <a class="link" href="/beginners">Как проходит первое занятие <span aria-hidden="true">→</span></a>
            </p>
          </div>

          <div class="actions-row">
            <button class="btn" type="button" data-open-booking data-service-id="${s.id}">Записаться</button>
            <a class="btn btn--line" href="/services">Все практики</a>
          </div>
        </div>
      </div>
    `;

    setupPhotos(view);

    if (similar.length) {
      view.insertAdjacentHTML(
        'beforeend',
        `<section class="section section--tight">
           <div class="section__head">
             <div><p class="kicker">Ещё</p><h2>Похожие практики</h2></div>
             <a class="link" href="/services">Каталог <span aria-hidden="true">→</span></a>
           </div>
           <div class="practices-list">${similar.map(practiceRow).join('')}</div>
         </section>`
      );
    }
  } catch (err) {
    crumb.textContent = 'Не найдено';
    view.innerHTML = `
      <div class="empty" style="padding: 90px 0;">
        <h3>${esc(err.message)}</h3>
        <p>Возможно, практика переехала или больше не проводится.</p>
        <p style="margin-top: 24px;"><a class="btn" href="/services">Вернуться в каталог</a></p>
      </div>`;
  }
});

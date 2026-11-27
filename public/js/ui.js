
const esc = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const money = (value) => Number(value).toLocaleString('ru-RU') + ' ₽';


function serviceCard(s, index = 0) {
  return `
    <a class="practice-card" href="/service/${esc(s.slug)}">
      <div class="photo" data-photo="${esc(s.image)}"
           data-hint="ФОТО · ${esc(s.title)}" data-alt="${esc(s.title)}"></div>
      <span class="practice-card__num">${String(index + 1).padStart(2, '0')}</span>
      <div class="practice-card__body">
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.category)} · ${s.duration} мин</p>
      </div>
    </a>`;
}


function practiceRow(s, index = 0) {
  return `
    <a class="practice-row" href="/service/${esc(s.slug)}">
      <span class="practice-row__num">${String(index + 1).padStart(2, '0')}</span>
      <span class="practice-row__title">${esc(s.title)}</span>
      <span class="practice-row__meta">${esc(s.category)} · ${s.duration} мин · ${esc(s.level)}</span>
      <span class="practice-row__price">${money(s.price)}</span>
      <span class="practice-row__arrow" aria-hidden="true">→</span>
    </a>`;
}

function errorNote(text) {
  return `<div class="empty"><h3>Не удалось загрузить</h3><p>${esc(text)}</p></div>`;
}


function setupPhotos(root = document) {
  root.querySelectorAll('[data-photo]').forEach((box) => {
    if (box.dataset.ready) return;
    box.dataset.ready = '1';

    const hint = box.dataset.hint || 'ФОТО';
    box.insertAdjacentHTML('beforeend', `<span class="photo__hint">${esc(hint)}</span>`);

    if (!box.dataset.photo) return;

    const img = new Image();
    img.alt = box.dataset.alt || '';
    img.loading = 'eager';
    img.decoding = 'async';
    img.onload = () => {
      box.innerHTML = '';
      box.appendChild(img);
    };
    img.src = box.dataset.photo;
  });
}


let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.hidden = true), 3500);
}


function setupNav() {
  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  if (!header || !burger) return;

  const close = () => {
    header.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-locked');
  };

  burger.addEventListener('click', () => {
    const open = header.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('is-locked', open);
  });

  header.querySelectorAll('.nav a, .nav__cta').forEach((el) => el.addEventListener('click', close));

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  const page = document.body.dataset.page;
  if (page) {
    document.querySelectorAll(`.nav a[data-nav="${page}"]`).forEach((a) => a.setAttribute('aria-current', 'page'));
  }
}


function setupBookingModal() {
  const modal = document.getElementById('booking-modal');
  if (!modal) return;

  const open = (serviceId) => {
    modal.hidden = false;
    document.body.classList.add('is-locked');
    const select = modal.querySelector('select[name="serviceId"]');
    const msg = document.getElementById('booking-msg');
    if (msg) {
      msg.textContent = '';
      msg.className = 'form__msg';
    }
    if (serviceId && select) select.value = String(serviceId);
    const first = modal.querySelector('input');
    if (first) setTimeout(() => first.focus(), 60);
  };

  const close = () => {
    modal.hidden = true;
    document.body.classList.remove('is-locked');
  };

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open-booking]');
    if (opener) {
      e.preventDefault();
      if (document.getElementById('header')) {
        document.getElementById('header').classList.remove('is-open');
      }
      open(opener.dataset.serviceId);
    }
    if (e.target.closest('[data-close-modal]')) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) close();
  });

  window.openBooking = open;
  setupBookingForms();
}


async function fillServiceSelects() {
  const selects = document.querySelectorAll('select[name="serviceId"]');
  if (!selects.length) return;

  try {
    const { items } = await api.get('/api/services');
    selects.forEach((select) => {
      const current = select.value;
      select.innerHTML =
        '<option value="">Не выбрана</option>' +
        items.map((s) => `<option value="${s.id}">${esc(s.title)} — ${money(s.price)}</option>`).join('');
      if (current) select.value = current;
    });
  } catch (err) {
    console.warn(err.message);
  }
}


const BOOKING_LIMITS = { name: 60, phone: 25, comment: 1000 };

function validateBooking(data) {
  const errors = {};

  const name = String(data.name ?? '').trim();
  if (!name) {
    errors.name = 'Укажите, как к вам обращаться';
  } else if (name.length < 2) {
    errors.name = 'Имя должно быть не короче 2 символов';
  } else if (name.length > BOOKING_LIMITS.name) {
    errors.name = `Имя не должно быть длиннее ${BOOKING_LIMITS.name} символов`;
  } else if (!/^[А-Яа-яЁёA-Za-z][А-Яа-яЁёA-Za-z\s'’-]*$/.test(name)) {
    errors.name = 'Имя может содержать только буквы, пробел, дефис и апостроф';
  }

  const phone = String(data.phone ?? '').trim();
  const digits = phone.replace(/\D/g, '');
  if (!phone) {
    errors.phone = 'Укажите номер телефона';
  } else if (phone.length > BOOKING_LIMITS.phone) {
    errors.phone = 'Телефон слишком длинный';
  } else if (!/^\+?[\d\s()\-]+$/.test(phone)) {
    errors.phone = 'Телефон может содержать только цифры, +, скобки, пробел и дефис';
  } else if (digits.length < 10 || digits.length > 15) {
    errors.phone = 'Введите телефон из 10–15 цифр';
  }

  const comment = String(data.comment ?? '').trim();
  if (comment.length > BOOKING_LIMITS.comment) {
    errors.comment = `Комментарий не должен быть длиннее ${BOOKING_LIMITS.comment} символов`;
  }

  return errors;
}

function clearFieldError(input) {
  const field = input.closest('.field');
  if (!field) return;
  field.classList.remove('has-error');
  input.removeAttribute('aria-invalid');
  const error = field.querySelector('.field__error');
  if (error) error.remove();
}

function showFieldError(input, message) {
  const field = input.closest('.field');
  if (!field || !message) return;

  let error = field.querySelector('.field__error');
  if (!error) {
    error = document.createElement('p');
    error.className = 'field__error';
    error.setAttribute('role', 'alert');
    field.appendChild(error);
  }
  error.textContent = message;

  field.classList.add('has-error');
  input.setAttribute('aria-invalid', 'true');
}

function applyBookingErrors(form, errors) {
  let first = null;
  Object.entries(errors).forEach(([name, message]) => {
    const input = form.elements.namedItem(name);
    if (!input) return;
    showFieldError(input, message);
    if (!first) first = input;
  });
  if (first) first.focus();
  return Boolean(first);
}


function setupBookingForms() {
  document.querySelectorAll('form[data-booking]').forEach((form) => {
    if (form.dataset.ready) return;
    form.dataset.ready = '1';

    const msg = form.querySelector('.form__msg');
    const fields = [...form.querySelectorAll('input, select, textarea')].filter((el) => el.name);

    fields.forEach((input) => {
      input.addEventListener('input', () => {
        clearFieldError(input);
        if (msg && msg.classList.contains('is-error')) {
          msg.textContent = '';
          msg.className = 'form__msg';
        }
      });

      input.addEventListener('blur', () => {
        const data = Object.fromEntries(new FormData(form).entries());
        const error = validateBooking(data)[input.name];
        if (error) showFieldError(input, error);
        else clearFieldError(input);
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(form).entries());
      const button = form.querySelector('button[type="submit"]');
      const label = button.textContent;

      if (msg) {
        msg.textContent = '';
        msg.className = 'form__msg';
      }

      fields.forEach(clearFieldError);

      const errors = validateBooking(data);
      if (Object.keys(errors).length) {
        applyBookingErrors(form, errors);
        if (msg) {
          msg.textContent = 'Пожалуйста, проверьте выделенные поля';
          msg.className = 'form__msg is-error';
        }
        return;
      }

      button.disabled = true;
      button.textContent = 'Отправляем…';

      try {
        const res = await api.post('/api/bookings', data);
        form.reset();
        fields.forEach(clearFieldError);
        if (msg) {
          msg.textContent = res.message;
          msg.className = 'form__msg is-ok';
        }
        showToast('Заявка отправлена — мы свяжемся с вами');

        if (form.id === 'booking-form') {
          setTimeout(() => {
            document.getElementById('booking-modal').hidden = true;
            document.body.classList.remove('is-locked');
          }, 1800);
        }
      } catch (err) {
        if (err.fields) applyBookingErrors(form, err.fields);

        if (msg) {
          msg.textContent = err.message;
          msg.className = 'form__msg is-error';
        }
      } finally {
        button.disabled = false;
        button.textContent = label;
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupPhotos();
  setupNav();
  setupBookingModal();
  fillServiceSelects();
});

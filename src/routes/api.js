'use strict';

const express = require('express');
const db = require('../models/database');

const router = express.Router();

const BOOKING_LIMITS = { name: 60, phone: 25, comment: 1000 };

router.get('/services', (req, res) => {
  const { category = '', q = '', sort = '' } = req.query;

  let rows = db.prepare('SELECT * FROM services').all();

  if (category && category !== 'Все') {
    rows = rows.filter((service) => service.category === category);
  }

  if (q.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter(
      (service) =>
        service.title.toLowerCase().includes(needle) ||
        service.short_desc.toLowerCase().includes(needle)
    );
  }

  if (sort === 'price-asc') rows.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') rows.sort((a, b) => b.price - a.price);
  if (sort === 'title') rows.sort((a, b) => a.title.localeCompare(b.title, 'ru'));

  const categories = [...new Set(db.prepare('SELECT category FROM services').all().map((item) => item.category))];

  res.json({ total: rows.length, categories, items: rows });
});

router.get('/services/:slug', (req, res) => {
  const service = db.prepare('SELECT * FROM services WHERE slug = ?').get(req.params.slug);

  if (!service) {
    return res.status(404).json({ error: 'Практика не найдена' });
  }

  const similar = db
    .prepare('SELECT slug, title, price, category, duration, level FROM services WHERE category = ? AND slug != ? LIMIT 3')
    .all(service.category, service.slug);

  res.json({ service, similar });
});

router.get('/teachers', (req, res) => {
  res.json({ items: db.prepare('SELECT * FROM teachers').all() });
});

router.get('/reviews', (req, res) => {
  res.json({ items: db.prepare('SELECT * FROM reviews ORDER BY id DESC').all() });
});

router.get('/faq', (req, res) => {
  res.json({ items: db.prepare('SELECT * FROM faq ORDER BY sort, id').all() });
});

router.get('/plans', (req, res) => {
  res.json({ items: db.prepare('SELECT * FROM plans ORDER BY sort, id').all() });
});

function validateBooking(body = {}) {
  const errors = {};

  const name = String(body.name ?? '').trim();
  if (!name) {
    errors.name = 'Укажите, как к вам обращаться';
  } else if (name.length < 2) {
    errors.name = 'Имя должно быть не короче 2 символов';
  } else if (name.length > BOOKING_LIMITS.name) {
    errors.name = `Имя не должно быть длиннее ${BOOKING_LIMITS.name} символов`;
  } else if (!/^[А-Яа-яЁёA-Za-z][А-Яа-яЁёA-Za-z\s'’-]*$/.test(name)) {
    errors.name = 'Имя может содержать только буквы, пробел, дефис и апостроф';
  }

  const phone = String(body.phone ?? '').trim();
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

  let serviceId = null;
  if (body.serviceId !== undefined && body.serviceId !== null && String(body.serviceId).trim() !== '') {
    serviceId = Number(body.serviceId);
    if (!Number.isInteger(serviceId) || serviceId <= 0) {
      errors.serviceId = 'Выберите практику из списка';
    } else if (!db.prepare('SELECT id FROM services WHERE id = ?').get(serviceId)) {
      errors.serviceId = 'Такой практики нет в расписании';
    }
  }

  const comment = String(body.comment ?? '').trim();
  if (comment.length > BOOKING_LIMITS.comment) {
    errors.comment = `Комментарий не должен быть длиннее ${BOOKING_LIMITS.comment} символов`;
  }

  return { errors, value: { name, phone, serviceId, comment } };
}

router.post('/bookings', (req, res) => {
  const { errors, value } = validateBooking(req.body);

  if (Object.keys(errors).length) {
    return res.status(400).json({
      error: Object.values(errors)[0],
      fields: errors,
    });
  }

  const result = db
    .prepare('INSERT INTO bookings (name, phone, service_id, comment) VALUES (?, ?, ?, ?)')
    .run(value.name, value.phone, value.serviceId, value.comment);

  res.status(201).json({
    ok: true,
    id: Number(result.lastInsertRowid),
    message: 'Спасибо! Мы свяжемся с вами в течение дня.',
  });
});

router.use((req, res) => res.status(404).json({ error: 'Такого адреса API нет' }));

module.exports = router;

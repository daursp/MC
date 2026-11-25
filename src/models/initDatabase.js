'use strict';

const db = require('./database');

const services = [
  ['hatha-yoga', 'Хатха-йога', 'Горячий зал', 'Классическая практика в тепле: асаны, дыхание, спокойный темп.',
    'Хатха-йога в горячем зале — это последовательные асаны, работа с дыханием и мягкий темп. Тепло помогает телу раскрываться, поэтому практика ощущается глубже, чем в обычном зале. Подойдёт новичкам и тем, кто возвращается после перерыва.',
    1500, 90, 'Для всех', '/images/products/hatha.jpg'],
  ['vinyasa', 'Виньяса-йога', 'Горячий зал', 'Плавный поток асан под дыхание — динамика и концентрация.',
    'Виньяса — плавный поток, где одно движение перетекает в другое. В жаре связки идут мягче, а внимание удерживается на дыхании. Для тех, кто уже знаком с базовыми асанами и хочет больше динамики.',
    1500, 90, 'Средний', '/images/products/vinyasa.jpg'],
  ['universal-yoga', 'Универсальная йога', 'Горячий зал', 'Сила, растяжка и баланс в одной практике.',
    'Универсальная йога соединяет силу, растяжку и баланс. Каждое занятие выстраивается вокруг тела и состояния группы — без жёсткой схемы. Подходит для любого уровня, включая первый раз на коврике.',
    1500, 90, 'Для всех', '/images/products/universal.jpg'],
  ['tibetan-bowls', 'Йога с тибетскими поющими чашами', 'Восстановление', 'Мягкая практика под звук чаш — замедлиться и выдохнуть.',
    'Спокойные асаны, дыхание и звук тибетских поющих чаш. Такая практика помогает замедлиться, снять напряжение после рабочего дня и вернуться в тело без спешки.',
    1500, 90, 'Для всех', '/images/products/bowls.jpg'],
  ['stretching', 'Стретчинг', 'Стретчинг', 'Глубокое растяжение в тёплом зале: тело становится мягче.',
    'Стретчинг в горячем зале: длинные удержания и работа с подвижностью суставов. Тепло помогает тянуться комфортнее, без резких движений. Тело становится мягче, а движения — свободнее.',
    1500, 90, 'Для всех', '/images/products/stretching.jpg'],
  ['mobility', 'Mobility', 'Стретчинг', 'Короткая практика на подвижность суставов и качество движения.',
    'Mobility — работа с подвижностью суставов: плечи, таз, позвоночник. Упражнения помогают движению быть свободным и хорошо сочетаются с силовыми практиками.',
    1500, 60, 'Для всех', '/images/products/mobility.jpg'],
  ['stretch-power', 'Растяжка с подкачкой', 'Стретчинг', 'Длинные вытяжения плюс силовая работа на стабилизаторы.',
    'Чередуем длинные вытяжения и упражнения на мышцы-стабилизаторы. Формат для тех, кому мало просто растягиваться: тело получает и мягкость, и опору.',
    1500, 90, 'Средний', '/images/products/stretch-power.jpg'],
  ['pilates', 'Силовой пилатес', 'Сила', 'Кор, осанка и контроль движения без ударной нагрузки.',
    'Силовой пилатес с акцентом на кор, осанку и контроль движения. Укрепляет мышцы без ударной нагрузки и помогает чувствовать тело собранным.',
    1500, 60, 'Средний', '/images/products/pilates.jpg'],
];

const teachers = [
  ['Яна Малютина', 'Виньяса-йога', 'Плавные связки асан под дыхание: динамика, концентрация и работа с балансом в горячем зале.', '/images/teachers/yana.jpg'],
  ['Тамара Никитина', 'Стретчинг · шпагаты', 'Ведёт stretching: осанка и растяжка на шпагаты. Длинные вытяжения, работа с тазом и плечами.', '/images/teachers/tamara.jpg'],
  ['Александра Баркова', 'Пилатес · стретчинг', 'Силовой пилатес, «Растяжка с подкачкой» и «Стретчинг + Mobility»: сила и гибкость в одной практике.', '/images/teachers/sasha.jpg'],
  ['Алексей Коновалов', 'Mobility · функционал', 'Mobility и функциональный тренинг: подвижность суставов, качество движения и работа с позвоночником.', '/images/teachers/alexey.jpg'],
  ['Лиза Вороньжева', 'Универсальная йога', 'Соединяет силу, растяжку и баланс. Мягкий формат для первого знакомства с йогой и для опытных.', ''],
  ['Кристина Алексеева', 'Хатха-йога', 'Классическая хатха: последовательные асаны, дыхание и спокойный темп. Внимание к технике и состоянию.', ''],
  ['Екатерина Кольцова', 'Хатха-йога', 'Ведёт хатху как живой процесс: разный темп, дыхание и баланс — без гонки за идеальной формой.', ''],
  ['Юлия Белайчук', 'Aplomb · спина', 'Aplomb: гармонизация спины и шпагаты. Работа с осанкой, подвижностью и мягким раскрытием тела.', ''],
];

const reviews = [
  ['Гость студии', 'Хатха в горячем зале под поющие чаши — совершенно другие ощущения от занятий.', 5],
  ['Анна', 'Фишка горячей йоги в том, что в зале +38. И в нашем климате это действительно хорошо.', 5],
  ['Мария', 'Пришла на стретчинг и осталась: тело стало гибче, а голова спокойнее.', 5],
  ['Ксения', 'Один абонемент на все направления — очень удобно, не нужно выбирать что-то одно.', 5],
];

const faq = [
  ['Я никогда не занимался йогой — можно?',
    'Да. Начните с хатхи, универсальной йоги или стретчинга — это самые мягкие форматы. Скажите администратору, что вы впервые: подскажем практику и преподавателя.', 1],
  ['Насколько жарко в зале?',
    '+38 °C. Тепло помогает мышцам раскрываться, поэтому движение идёт мягче. Если станет тяжело, можно выйти из зала, попить воды и вернуться.', 2],
  ['Сколько длится занятие?',
    'Большинство практик — 90 минут, mobility и силовой пилатес — 60 минут. Актуальное время и свободные места — в расписании онлайн-записи.', 3],
  ['Что взять с собой?',
    'Удобную одежду, в которой можно двигаться и потеть, бутылку воды и полотенце. Коврик можно принести свой — или уточнить у администратора, есть ли свободный.', 4],
  ['Есть ли противопоказания?',
    'Горячая практика — это нагрузка на сердце и сосуды. При беременности, повышенном давлении, проблемах с сердцем и недавних травмах сначала проконсультируйтесь с врачом. Обязательно предупредите преподавателя об ограничениях.', 5],
  ['Можно ли прийти на одно занятие?',
    'Да. Разовое посещение — 1 500 ₽, первое пробное — 1 100 ₽. Абонемент действует на все направления, так что потом можно пробовать разное.', 6],
  ['Как записаться?',
    'Через форму на сайте, по телефону +7 (903) 398-90-50 или в онлайн-записи. Если сомневаетесь с выбором — напишите в Instagram, поможем.', 7],
];

const plans = [
  ['Пробное посещение', 1, 1100, 'вместо 1 500 ₽ · любая практика', 1],
  ['Разовое занятие', 1, 1500, 'одна практика из расписания', 2],
  ['12 занятий', 12, 13200, '45 дней', 3],
  ['20 занятий', 20, 17000, '60 дней', 4],
  ['36 занятий', 36, 30600, '90 дней', 5],
  ['48 занятий', 48, 38400, '120 дней', 6],
  ['72 занятия', 72, 57600, '120 дней', 7],
  ['96 занятий', 96, 67200, '365 дней', 8],
  ['144 занятия', 144, 72000, '365 дней', 9],
];

function createTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      short_desc TEXT NOT NULL,
      description TEXT NOT NULL,
      price INTEGER NOT NULL,
      duration INTEGER NOT NULL,
      level TEXT NOT NULL,
      image TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      bio TEXT NOT NULL,
      image TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author TEXT NOT NULL,
      text TEXT NOT NULL,
      rating INTEGER NOT NULL DEFAULT 5
    );

    CREATE TABLE IF NOT EXISTS faq (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      sort INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      visits INTEGER NOT NULL,
      price INTEGER NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      sort INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
      comment TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

function isEmpty(table) {
  return db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get().count === 0;
}

function seedIfEmpty() {
  let created = false;

  if (isEmpty('services')) {
    const insert = db.prepare(
      'INSERT INTO services (slug, title, category, short_desc, description, price, duration, level, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    services.forEach((service) => insert.run(...service));
    created = true;
  }

  if (isEmpty('teachers')) {
    const insert = db.prepare('INSERT INTO teachers (name, role, bio, image) VALUES (?, ?, ?, ?)');
    teachers.forEach((teacher) => insert.run(...teacher));
    created = true;
  }

  if (isEmpty('reviews')) {
    const insert = db.prepare('INSERT INTO reviews (author, text, rating) VALUES (?, ?, ?)');
    reviews.forEach((review) => insert.run(...review));
    created = true;
  }

  if (isEmpty('faq')) {
    const insert = db.prepare('INSERT INTO faq (question, answer, sort) VALUES (?, ?, ?)');
    faq.forEach((item) => insert.run(...item));
    created = true;
  }

  if (isEmpty('plans')) {
    const insert = db.prepare('INSERT INTO plans (name, visits, price, note, sort) VALUES (?, ?, ?, ?, ?)');
    plans.forEach((plan) => insert.run(...plan));
    created = true;
  }

  return created;
}

createTables();
const seeded = seedIfEmpty();

if (require.main === module) {
  console.log(seeded ? 'База данных создана и заполнена данными студии.' : 'База данных уже содержит данные.');
}

module.exports = { createTables, seedIfEmpty };

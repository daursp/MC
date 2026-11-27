const path = require('node:path');

try {
  process.loadEnvFile(path.join(__dirname, '..', '.env'));
} catch (err) {
  if (err.code !== 'ENOENT') console.warn('Не удалось прочитать .env:', err.message);
}

const token = process.env.TELEGRAM_BOT_TOKEN || '';
const chatId = process.env.TELEGRAM_CHAT_ID || '';

async function main() {
  if (!token || !chatId) {
    console.error('Ошибка: задайте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в .env');
    process.exitCode = 1;
    return;
  }

  console.log(`Отправляю тестовое сообщение в ${chatId}…`);

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: '✅ Тестовое сообщение с сайта «Мягкая сила». Уведомления о заявках настроены.',
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(15000),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.ok === false) {
      console.error('Telegram ответил ошибкой:', data.description || `HTTP ${res.status}`);
      process.exitCode = 1;
      return;
    }

    console.log('Готово: сообщение отправлено. Проверьте канал', chatId);
  } catch (err) {
    console.error('Не удалось связаться с Telegram:', err.message);
    console.error('Если это таймаут — нужен прокси/VPN или хостинг с доступом к api.telegram.org.');
    process.exitCode = 1;
  }
}

main();

# EVOLVE AI 2.0 — iPhone / Cloud Ready

Это версия Telegram Mini App, которую можно развернуть **без компьютера**: только iPhone + браузер.

## Что внутри
- AI Chat
- режим Web Search
- интерфейсы Images / Files
- Telegram WebApp user context
- Express backend
- frontend и backend работают из одного Render Web Service
- API-ключ хранится в переменных окружения облака, а не в коде

## Развёртывание только с iPhone

### 1. GitHub
Создай репозиторий на GitHub и загрузи содержимое этой папки. GitHub поддерживает работу через iOS и браузер.

Важно: **не загружай `.env` и не публикуй API-ключ**.

### 2. Render
В Render создай **New → Web Service**, подключи GitHub-репозиторий и используй:
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

Добавь Environment Variables:
- `OPENAI_API_KEY` = твой API-ключ
- `OPENAI_MODEL` = `gpt-5.6-luna`

После деплоя Render выдаст HTTPS-адрес вида `https://....onrender.com`.

### 3. Telegram
В @BotFather создай/настрой бота и укажи полученный HTTPS-адрес как URL Mini App / Main Mini App.

## Локальный запуск
Требует Node.js и поэтому для iPhone не нужен.

## Важно
MVP не хранит постоянную память в PostgreSQL и не включает генерацию видео. Изображения и файлы пока представлены интерфейсом; backend для них можно добавить следующим этапом.

## Playwright E2E (UI-visible)

Быстрый каркас для визуальных прогоночных тестов с открытым браузером.

### Предварительно
- Node.js 18+
- Установить браузеры Playwright:
```bash
npm install
npx playwright install
```

### Запуск
```bash
npm test
```

### Настройка
- URL через `BASE_URL` (по умолчанию `http://localhost:3000`).
- Скриншоты сохраняются в `artifacts/`.


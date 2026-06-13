# Instagram AI Analytics Dashboard

Личный dashboard для ручного учёта Instagram Reels, анализа метрик, тем контента и будущих AI-рекомендаций. Проект основан на Admin One и сохраняет его responsive layout, sidebar, dark mode и Tailwind-компоненты.

## Стек

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Formik
- Chart.js
- Redux Toolkit для состояния шаблона

Instagram API и внешний AI API пока не используются. Supabase остаётся опциональным:
local mode работает полностью автономно.

## Этап 6

Добавлены Supabase Auth и персональная изоляция данных:

- вход по magic link через email на странице `/auth`;
- сохранение и автоматическое обновление Supabase-сессии;
- привязка каждого облачного Reel к `user_id`;
- owner-scoped RLS policies для select, insert, update и delete;
- Account и Data Storage states в Settings;
- понятный notice в cloud mode, если пользователь не вошёл;
- localStorage fallback и локальные Reels остаются нетронутыми;
- подготовлен блок будущей миграции localStorage → Supabase.

В `NEXT_PUBLIC_DATA_MODE=local` авторизация не требуется. В режиме `supabase` облачные данные
доступны только после входа.

## Этап 5

Приложение подготовлено к двум режимам хранения:

- `local` — текущий `localStorage` браузера;
- `supabase` — облачная таблица `reels` через Supabase.

Страницы используют единый provider из `src/services/reelsDataProvider.ts` и не зависят от
конкретного источника. Если Supabase mode включён, но credentials отсутствуют или облачный
запрос завершился ошибкой, приложение автоматически продолжает работу через localStorage.
Автоматической миграции локальных Reels в Supabase пока нет.

## Этап 3

На третьем этапе добавлен локальный smart recommendation engine:

- глубокий анализ лучших и слабых Reels по просмотрам, engagement, сохранениям, репостам, подпискам и score;
- анализ тем, форматов, hooks и дней публикации;
- главный персональный совет и контент-направление на Dashboard;
- 10 идей Reels с темой, форматом, hook, целью и объяснением;
- полноценный AI-разбор на странице каждого Reel;
- недельные рекомендации и автоматически сформированный контент-план;
- состояния для пустой, маленькой и достаточной выборки данных.

Рекомендации генерируются локально правилами из `src/services/aiRecommendationEngine.ts`.
Это пока не настоящий AI API: приложение не отправляет данные во внешнюю модель, а
сравнивает сохранённые Reels через функции из `src/utils/analytics.ts`.

Для первых персональных закономерностей достаточно 3 Reels. При 5 и более Reels
приложение считает выборку пригодной для более уверенных рекомендаций.

## Этап 2

На втором этапе реализованы:

- добавление Reels через mobile-first форму;
- хранение пользовательских данных в `localStorage`;
- список Reels в виде карточек на mobile и таблицы на desktop;
- детальная страница каждого Reel;
- редактирование и удаление с подтверждением;
- поиск по названию, hook и заметкам;
- фильтры по теме и формату;
- сортировка по дате, просмотрам, engagement, подписчикам и score;
- Dashboard, который пересчитывается по сохранённым Reels;
- локальные аналитические выводы без настоящего AI.

До первого пользовательского сохранения приложение показывает demo data. После добавления собственного Reel список переключается на пользовательские данные и demo-записи больше не смешиваются с ними.

## Как добавить Reel

1. Откройте `/dashboard/add-reel`.
2. Заполните название и дату публикации.
3. Выберите тему и формат.
4. Внесите доступные метрики.
5. При желании добавьте hook, ссылку и заметки.
6. Нажмите `Сохранить Reel`.

После сохранения приложение перенаправит на `/dashboard/reels`. Запись останется доступной после перезагрузки страницы.

## Где хранятся данные

Пользовательские Reels хранятся в `localStorage` текущего браузера под ключом:

```text
reelscope.reels.v1
```

Данные не отправляются на сервер и не синхронизируются между устройствами или браузерами.
Это поведение сохраняется в режиме `NEXT_PUBLIC_DATA_MODE=local` и используется как fallback.

Основные файлы:

- `src/types/index.ts` — типы Reel, темы, форматы и формы;
- `src/data/demoData.ts` — демонстрационные Reels;
- `src/services/reelsStorage.ts` — совместимый фасад для существующих CRUD-страниц;
- `src/services/reelsLocalStorage.ts` — локальная реализация CRUD и сообщения между страницами;
- `src/services/authService.ts` — magic link auth, session и auth state subscription;
- `src/services/supabaseClient.ts` — безопасная инициализация Supabase client;
- `src/services/reelsSupabaseStorage.ts` — облачный CRUD и маппинг колонок;
- `src/services/reelsDataProvider.ts` — выбор режима и localStorage fallback;
- `src/hooks/useAuth.ts` — клиентское состояние пользователя и сессии;
- `src/services/aiRecommendationEngine.ts` — текстовые локальные рекомендации;
- `src/hooks/useReels.ts` — клиентская подписка компонентов на изменения;
- `src/utils/analytics.ts` — безопасные аналитические расчёты и группировки.

## Расчёты

### Engagement rate

```text
(likes + comments + saves + shares) / reach * 100
```

Если `reach` равен нулю, используется `views`.

### Follower conversion

```text
newFollowers / views * 100
```

### Save, share и comment rate

```text
saves / views * 100
shares / views * 100
comments / views * 100
```

### Reel score

Score рассчитывается по шкале от 1 до 10. Учитываются просмотры относительно среднего, engagement rate, сохранения, репосты, новые подписчики и retention rate. Все вычисления защищены от деления на ноль, `NaN` и `Infinity`.

## Локальный запуск

Требуется Node.js `20.19+` или `22.12+`.

```bash
npm install
npm run dev
```

Откройте Dashboard:

```text
http://localhost:3000/dashboard
```

Корневой адрес `http://localhost:3000` автоматически перенаправляет на Dashboard.

### Local development on Windows

- Проект лучше хранить в короткой папке, например `C:\insta`.
- Не размещайте его глубоко внутри `Downloads` или папок с длинными названиями.
- Обычный запуск использует Turbopack: `npm run dev`.
- Если Turbopack на Windows падает из-за ограничения длины пути, запустите webpack-режим:

```bash
npm run dev:webpack
```

Альтернативная команда:

```bash
npx next dev
```

## Deployment to Vercel

1. Откройте [vercel.com](https://vercel.com).
2. Войдите через GitHub.
3. Нажмите `Add New Project`.
4. Выберите репозиторий `rpakeee-cyber/admin-one-react-tainstagram-ai-analyticsilwind`.
5. Убедитесь, что в поле Framework выбран `Next.js`.
6. Укажите Build Command: `npm run build`.
7. Output Directory оставьте пустым или со значением по умолчанию.
8. Укажите Install Command: `npm install`.
9. Нажмите `Deploy`.
10. После завершения откройте `https://your-project.vercel.app/dashboard`.

Корневой публичный адрес `https://your-project.vercel.app` также перенаправит на Dashboard.
Для local mode переменные окружения не требуются. Для Supabase mode добавьте переменные из
раздела ниже в Vercel Project Settings → Environment Variables.

### Хранение данных на Vercel

В local mode Reels сохраняются только в `localStorage` конкретного браузера. В Supabase mode
каждая запись получает `user_id`, а RLS разрешает пользователю работать только со своими Reels.

## Supabase setup

1. Создайте проект на [supabase.com](https://supabase.com).
2. Откройте `SQL Editor`.
3. Выполните SQL из `supabase/schema.sql`.
4. В настройках проекта возьмите `Project URL` и `anon public key`.
5. Создайте в корне проекта файл `.env.local`.
6. Добавьте:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
NEXT_PUBLIC_DATA_MODE=supabase
```

7. Перезапустите dev server.
8. Откройте `/dashboard/settings` и нажмите `Test Supabase Connection`.

Если credentials не заполнены или Supabase временно недоступен, provider автоматически
использует localStorage. Чтобы принудительно оставить локальный режим:

```dotenv
NEXT_PUBLIC_DATA_MODE=local
```

Автоматический перенос localStorage → Supabase пока не выполняется. Локальные записи остаются
в браузере и будут перенесены отдельным управляемым действием на следующем этапе.

## Supabase Auth setup

1. Откройте свой проект в Supabase.
2. Перейдите в `Authentication` → `Providers`.
3. Убедитесь, что Email provider включён.
4. Откройте `Authentication` → `URL Configuration`.
5. Укажите корректный `Site URL`.
6. Для локальной разработки добавьте redirect URL `http://localhost:3000/auth`.
7. После Vercel deployment добавьте production URL вида
   `https://your-project.vercel.app/auth`.
8. Выполните обновлённый SQL из `supabase/schema.sql` в SQL Editor.
9. Создайте `.env.local`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
NEXT_PUBLIC_DATA_MODE=supabase
```

10. Запустите проект через `npm run dev`.
11. Откройте `http://localhost:3000/auth`.
12. Введите email и откройте magic link из письма.
13. Проверьте Account и Data Storage Mode на `/dashboard/settings`.

Local mode работает без входа. Supabase mode требует активную сессию, а все запросы
дополнительно защищены RLS по условию `auth.uid() = user_id`. Instagram API будет подключаться
после auth, чтобы будущие токены были связаны с конкретным пользователем.

## Проверка этапа 6

```bash
npm run typecheck
npm run lint
npm run build
npm run start
```

Для ручной проверки:

1. Добавьте 3–5 Reels с разными темами, форматами, hooks и метриками.
2. Перезагрузите страницу и убедитесь, что данные сохранились.
3. Откройте `/dashboard/ai-recommendations` и проверьте реальные выводы и идеи.
4. Откройте Details любого Reel и проверьте раздел `AI-разбор ролика`.
5. Откройте `/dashboard/content-plan` и проверьте персональный план на семь дней.
6. Вернитесь на Dashboard и проверьте темы, форматы, лучший день, риск и следующий шаг.
7. Проверьте mobile bottom navigation и desktop sidebar.

## Следующий этап

Этап 7 может включать безопасную миграцию Reels из localStorage в Supabase, профиль пользователя
и подготовку защищённого хранения будущих Instagram credentials. Instagram API и настоящий AI
API пока не подключены.

## Лицензия

Основа Admin One распространяется по лицензии MIT. См. `LICENSE`.

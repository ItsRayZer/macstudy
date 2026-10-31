# MacStudy

BYJU'S-style mobile study web app for MGU BCA 3rd Sem students.
Next.js (app router) + TypeScript + Tailwind CSS v4. PWA-ready, mobile-first
(480px app container), bottom tab navigation.

Theme: premium Apple-like liquid glass on AMOLED black (`#0D0D14`), violet
`#7C3AED` to cyan `#06B6D4` gradients, gold reserved for achievements and
streaks. Dark mode default, light mode toggle. Zero emojis.

## Shared libraries (stable API - other workers build on these, do not rename)

### lib/db.ts - progress database

```ts
import { getDB, isCloud, LocalDB, SupabaseDB } from "./lib/db";
```

- `getDB(): ProgressDB` - singleton. `SupabaseDB` only when
  `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set,
  otherwise `LocalDB` (localStorage, `macstudy:` namespace).
- `isCloud(): boolean`

All `ProgressDB` methods are async:

| Method | Purpose |
| --- | --- |
| `getTopicProgress(subject, module, topic)` | `{ percent, quizBest, completed, updatedAt }` or null |
| `setTopicProgress(subject, module, topic, { percent?, quizBest?, completed? })` | merge + save, returns full record |
| `getBookmarks(subject?)` | bookmark list, optionally filtered |
| `toggleBookmark(subject, module, topic, qIndex)` | returns true when now bookmarked |
| `getMistakes(dueOnly?)` | spaced-repetition deck, due-only filter |
| `addMistake(subject, module, topic, qIndex)` | increments wrongCount, sets nextReview |
| `resolveMistake(subject, module, topic, qIndex)` | removes from deck |
| `getXP()` | lifetime XP total |
| `addXP(amount, reason?)` | adds XP, returns new total |
| `getDailyXP(date?)` | XP for a day (`YYYY-MM-DD`, default today) |
| `getStreak()` | `{ current, longest, lastDay, freezes }` |
| `touchStreak()` | records today: extends, starts, or returns unchanged |
| `getAchievements()` | unlocked achievements |
| `unlockAchievement(id)` | returns true when newly unlocked |

Supabase tables + RLS policies live in `supabase/schema.sql`.

### lib/store.ts - zustand UI store

```ts
import { useAppStore } from "./lib/store";
const theme = useAppStore((s) => s.theme); // 'dark' | 'light', persisted
```

`setTheme`, `toggleTheme`, `xpToday`, `setXpToday`, `streak`, `setStreak`,
`refreshFromDB()` (reloads xpToday + streak from `getDB()`).

### components/ui.tsx - UI kit

`GlassCard`, `Pill` (`sure`/`repeated`/`important`/`default`), `ProgressBar`
(0-100), `SegmentedTabs`, `BottomNav` (Home/Subjects/Revise/Profile),
`Countdown` (to a date prop), `EmptyState`. All touch targets min 44px.

## Theming

CSS variables under `:root` / `[data-theme="dark"]` / `[data-theme="light"]`
in `app/globals.css`, plus `glass`, `glass-strong`, `text-gradient`, `app-glow`
utilities. Theme is applied via `document.documentElement[data-theme]`;
first paint is set by the inline script in `app/layout.tsx` (no FOUC).

## Env vars (optional)

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` - enable cloud
  persistence. Leave unset for local-only mode.

## Develop

```bash
npm install
npm run dev
npm run build
```

# naio. — project rules

naio. (always lowercase, always with the period) is a mobile app where people who are new in a city, solo travellers or locals join spontaneous plans (coffee, sunset drinks, a hike) with nearby people. It is NOT a dating app.

## Working with the owner
- The owner is not a developer. Explain what you do in simple words. Ask before big decisions.
- They work in GitHub Codespaces (browser) and test on their phone with Expo Go. Always tell them exactly what to run.
- Dev server: `npm start` (= `npx expo start --tunnel ngrok`). In SDK 58 plain `--tunnel` needs an Expo login; `--tunnel ngrok` does not.
- Build in phases (see PLAN.md). Stop after each phase, say what to run and what they should see on the phone.
- After every phase (and any notable change), update `RESUM-FASES.md` (in Catalan, simple words): move the finished phase from "2. PROPERAMENT" to "1. FET FINS ARA" with what was built, screens, what to check on the phone and decisions taken; update "3. PENDENT" and the date. Then regenerate the Word copy with `node scripts/resum-to-docx.js` (needs the `docx` npm library via NODE_PATH, see the script header) so `RESUM-FASES.docx` always matches.

## Designs (source of truth)
- `/designs` holds 44 PNG screens numbered in app order (index in `designs/INDEX.pdf`). Look at the image before building a screen; match layout, spacing, copy and hierarchy.
- Screens 25–36 are drawn in a rougher style: keep their layout and copy but use the polished style of the other screens (rounded buttons with →, peach chips, tab bar on the map).
- Screen 14's export is broken (white overlay): build it as a dark camera screen.
- Reel 01–05: full-screen photos with a dark gradient on top so the white text reads. Originals (huge PNGs) are in `assets/Reel`; the app uses optimized 1170px JPEG copies in `assets/images/reel/01–05.jpg`. Never require the originals.
- Screens not in the designs (My plans Upcoming/Requests tabs, "Add more about you", Blocked people, Request sent) are designed in the same style and pointed out to the owner.

## Style
- Colors live in `src/theme/colors.ts` (soft, warm palette chosen by the owner; never dark brown buttons or cards). Primary terracotta `accentFill` `#C66337` for main buttons, the "+", badges and your chat bubbles, with white text (not for map markers, see the map colour code below). `accent` `#B05430` for small labels, links, selected text and the active tab (readable on cream). `accentLine` `#E2A07C` for chip borders, selected outlines and focused fields. Surfaces: `accentSoft` pale peach `#F8DED0` (selected chips), `mist` butter `#FBEFD3` (info boxes, received bubbles), `blush` `#FBE9DD`, `border` sand `#EFDCCF`. Text `dark` `#43312A` (warm, not black), `muted` `#7D675B`. Background cream `#FFFAF6`. Few dark cards use `accentDeep` `#A84E30`. "Get started" on the intro is a very light, soft peach gradient (`glow`). Keep text contrast readable.
- **Map colour code (exception to the theme, never change it with a theme update):** on the map, green and orange are functional colours. GREEN `mapPlan` `#2E7D61` = "Plan to join": every plan marker (pill with the time, including your own plan, which only adds a ★ and "Your plan"). ORANGE `mapOpen` `#E8893A` = "Open to plans": every marker of a person open to plans. The legend at the top of the map always shows a green dot "Plan to join" and an orange dot "Open to plans". Don't reuse terracotta or other theme colours for map markers.
- Big headings: Source Serif 4. Everything else: DM Sans. Never hardcode colors or fonts in screens; use the theme.
- Reuse components from `src/components` (Button, Chip, Card, Input, Header…) instead of restyling per screen.
- Icons: one style everywhere, Lucide thin outline via `<Icon name=… />` (`src/components/Icon.tsx`; sizes in `theme.icon`: 20 standard, 24 tabs and back arrow, 48 big status icons; stroke 1.5). Icons sit directly on the background: no boxes, circles or pills around them. Only real buttons look like buttons. Icon colour: dark brown or warm grey; `accent` only for the active/most important element. Exceptions with a shape: the "+" tab button, avatars, map markers. Apple/Google logos stay as brand logos (Ionicons). Back button is always a plain "‹".

## Copy
- Short, warm, direct. Keep the texts that appear in the images.
- The brand is written "naio." (or "naio" mid-sentence), never "NAIO".

## Tech
- React Native + Expo (SDK 58) + TypeScript + Expo Router. Must run in Expo Go: no custom native modules.
- Routes live in `src/app/` (one file per screen). Everything else lives in `src/` (`theme`, `components`, `data`, `state`). Import with `@/…`.
- Tabs come from `expo-router/js-tabs`; the custom tab bar receives `emitter` and `navigateToTab` (not `navigation`).
- Install packages with `npx expo install`, never plain npm. Before saying a phase is done: `npx tsc --noEmit` and `npx expo-doctor`.
- See also AGENTS.md (Expo's own notes: check the SDK 58 docs, don't trust memory).
- No backend. All data goes through `src/data/api.ts` (backed by mock data in `src/data/mock/`) so it can be swapped for Supabase later. Screens never import mock files directly.
- Fixed choice lists (languages, interests, moods, distances, situations, city) live in `src/data/catalog.ts`.
- App state lives in `src/state/` (in memory only, resets on reload): `session` (sign-in), `profile` (your profile + age check in progress), `filters` (map filters + whether the "What are you up to?" card was seen), `plans` (all plans, your joins with demo auto-accept, requests to your plans, create/edit/cancel), `chat` (temporary chats, demo auto-replies), `alerts` (Alerts tab), `safety` (blocked people, offline, location and notification settings). `api.ts` keeps an in-memory copy of the mock data so changes stick until reload. `useMe`/`usePeople` in `state/people.ts` turn ids (incl. `'me'`) into people.
- Times: the demo runs on a fixed demo clock (today, 4:18 PM) in `src/data/time.ts`, so plans always look upcoming. Times show in 12-hour format like the designs.
- The map is a drawing (`FakeMap`), not a real map SDK. Coordinates are turned into screen positions by `project()`.
- You host the mock plan "Coffee and a wander?" (`hostId: 'me'`, Today 5:00 PM, Monastiraki) and Leo has asked to join it (39–41). You start already accepted in "Morning walk on Philopappou" so a chat has messages.
- Sign in with Apple/Google, face check, ID check, map, chat and push notifications are fake: screens with mock behaviour only. Never integrate paid or external services.
- Bottom tabs: Map, Plans, big "+" in the middle, Alerts, Profile.

## Product rules
- Plans exist only for today or tomorrow, never later. Plans and their chats disappear after they happen.
- Joining a plan is a request the host accepts. After tapping "Join", show "Request sent". Until the host accepts, the chat stays locked and the exact meeting point stays hidden. In the demo the request is auto-accepted after a few seconds, then "You're in" is shown.
- The exact meeting point is hidden until the user is accepted ("Exact point is shared after joining").
- Everyone is age-verified. Exact age is never shown, only a range.
- Age ranges, ALWAYS and everywhere (screens, mock data, filters): exactly `18-24`, `25-30`, `31-39`, `40-45`, `46-49`, `50+`. No other ranges (e.g. never "29-35"). They are defined once in `src/data/types.ts`.

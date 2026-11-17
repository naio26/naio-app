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
- Fixed choice lists (languages, interests, moods, distances, situations) live in `src/data/catalog.ts`.
- **Current city: never type a city name in a text.** Screens use `useCity().name` (`src/state/city.ts`), which reads `getCurrentCity()` in `api.ts` (mock: `src/data/mock/city.ts`, always Athens in the demo). Later it will come from the user's real location; don't add real location until asked.
- App state lives in `src/state/` and is **saved on the phone** with AsyncStorage (`src/state/storage.ts`, keys prefixed `naio:`). Each store takes an `initial` value read once at start-up in `src/app/_layout.tsx` (splash stays up until then) and saves on every change (`useSaved`). `src/app/index.tsx` opens the map if the profile was created, otherwise always the intro reel (never jump into profile setup: that left it as the first screen with nothing to go back to → "GO_BACK was not handled"). Back buttons use `goBack()` from `@/components` (never `router.back()` directly): it goes back, or to `/` when there is no previous screen (e.g. after a reload). Settings → "Reset demo" (`useBoot().resetDemo`) clears the saved data, resets `api.ts` and rebuilds the app at the intro. Stores: `session` (sign-in), `profile` (your profile + age check in progress), `filters` (map filters + whether the "What are you up to?" card was seen), `plans` (all plans, your joins with demo auto-accept, requests to your plans, create/edit/cancel), `chat` (temporary chats, demo auto-replies), `alerts` (Alerts tab), `safety` (blocked people, offline, location and notification settings). `api.ts` keeps a copy of the mock data that it also saves on the phone (key `db`), so created plans, accepted requests, chats, alerts and blocked people survive a reload. New persistent state: add it to `KEYS` and to the start-up snapshot, and make sure "Reset demo" clears it. `useMe`/`usePeople` in `state/people.ts` turn ids (incl. `'me'`) into people.
- Times: the demo runs on a fixed demo clock (today, 4:18 PM) in `src/data/time.ts`, so plans always look upcoming. Times show in 12-hour format like the designs.
- The map is a drawing (`FakeMap`), not a real map SDK. Coordinates are turned into screen positions by `project()`.
- You host the mock plan "Coffee and a wander?" (`hostId: 'me'`, Today 5:00 PM, Monastiraki) and Leo has asked to join it (39–41). You start already accepted in "Morning walk on Philopappou" so a chat has messages.
- Sign in with Apple/Google, face check, ID check, map, chat and push notifications are fake: screens with mock behaviour only. Never integrate paid or external services.
- Bottom tabs: Map, Plans, big "+" in the middle, Alerts, Profile.

## Publishing a preview (EAS Update, opens in Expo Go without the Codespace)
When the owner says **"publish a new preview"**:
1. Check: `npx tsc --noEmit` and `npx expo-doctor` must pass.
2. Check the login: `npx eas-cli@latest whoami` must show `naioali`. If not, stop and ask the owner to type `! npx expo login` (account `naioali`).
3. Publish: `npx eas-cli@latest update --channel preview --environment preview --platform all --non-interactive --message "<short description of what changed>"`
4. Give the owner the dashboard link the command prints, and remind them how to open it (below). The link and QR never change: Expo Go always loads the latest update of the `preview` channel when the app is opened again (close it fully and reopen; sometimes it needs a second reopen).

Setup (already done, don't redo):
- EAS project `@naioali/naio`, id `69984178-632d-4299-99a2-3328d3585b14` (in `app.json` → `extra.eas.projectId`, `owner: naioali`).
- `app.json`: `"runtimeVersion": "exposdk:58.0.0"` and `"updates": { "url": "https://u.expo.dev/<projectId>" }`. **The runtime must be exactly `exposdk:<SDK>.0.0`**: it's the only runtime Expo Go accepts (Expo's docs say updates with a runtime version don't load in Expo Go; this exposdk form is the exception). Never switch it to the `appVersion`/`fingerprint` policies or run `eas update:configure` (it would change it). When upgrading the Expo SDK, change it to the new SDK (e.g. `exposdk:59.0.0`), regenerate the link and QR, and publish again.
- `expo-updates` is installed (it's included in Expo Go). `eas.json` has a `preview` channel.
- Expo Go link: `exp://u.expo.dev/69984178-632d-4299-99a2-3328d3585b14?runtime-version=exposdk%3A58.0.0&channel-name=preview`. QR code: `docs/expo-go-preview-qr.png` (see `docs/PREVIEW.md`).
- The preview only contains what's in this folder when publishing (saved or not in git). Dashboard: https://expo.dev/accounts/naioali/projects/naio/updates

## Product rules
- Plans exist only for today or tomorrow, never later. Plans and their chats disappear after they happen.
- Joining a plan is a request the host accepts. After tapping "Join", show "Request sent". Until the host accepts, the chat stays locked and the exact meeting point stays hidden. In the demo the request is auto-accepted after a few seconds, then "You're in" is shown.
- The exact meeting point is hidden until the user is accepted ("Exact point is shared after joining").
- Everyone is age-verified. Exact age is never shown, only a range.
- Age ranges, ALWAYS and everywhere (screens, mock data, filters): exactly `18-24`, `25-30`, `31-39`, `40-45`, `46-49`, `50+`. No other ranges (e.g. never "29-35"). They are defined once in `src/data/types.ts`.

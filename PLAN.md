# naio. — build plan

Status: approved. All 4 phases done.

## 1. The look (sampled from the designs)

| Use | Color |
|---|---|
| Background (cream) | `#FFFAF6` |
| Main buttons (terracotta) | `#BA5836` (brand `#C66337` on the Welcome screen) |
| Disabled button | `#E1B5A4` |
| Selected chip / soft fill (peach) | `#F8DED0` |
| Info boxes (light grey) | `#F4EEE9` |
| Borders | `#EAD6CC` |
| Dark text / safety card | `#29241F` |
| "Verified" / success green | `#2E7D61` |

**Fonts** (free, work in Expo Go): **Source Serif 4** for big headings, **DM Sans** for everything else.

## 2. Screens and flow

```
Reel 01–05 (auto-advancing story, Skip / Get started)
  → Sign up 06 → Apple 07 / Google 08 / email
  → Your profile 09 (checklist hub)
       ├ Add photo → Face check 10
       ├ Age range 11 → Verify range 12 → Add your ID 13 → Take photo 14 / Upload 15
       ├ Languages 16 → Levels 17
       ├ Interests 18
       └ Add more about you → Your situation 19
  → Profile completed 20 → Welcome to Athens 21 (moves on by itself)
  → "What are you up to?" 22 → Filters 23/24 (or Skip for now)
  → TABS:  Map | Plans | (+) | Alerts | Profile

Map 25 → tap a plan → Plan sheet 26 → Plan details 27 → Join → You're in 35 → Chat 38
       → tap a person → Available person 28
(+)    → Create a plan 29 → Plan posted 30 → Your plan 31 → Edit 32 / Cancel 33 → Cancelled 34
                                                       → Manage group 36
Plans 37 (Upcoming / Requests / Past) → plan → chat
Alerts 39 → Join request 40 → Accept → 41 → chat
Profile 42 → Settings 43 → Safety centre 44
```

## 3. Folder structure

```
src/app/                  ← one file per screen (Expo Router)
  (onboarding)/           reel, sign-up, apple, google
  setup/                  profile, face-check, age-range, verify-age, add-id,
                          take-id, upload-id, languages, language-levels,
                          interests, situation, completed, welcome
  (tabs)/                 map, plans, alerts, profile   (+ opens /create)
  plan/[id]/              details, joined, chat, edit, cancel, cancelled, group
  person/[id], request/[id], filters, settings, safety
src/
  theme/                  colors, fonts, spacing
  components/             Button, Chip, Card, Input, Header, Avatar, TabBar…
  data/
    types.ts              what a Plan, Person and Message look like
    mock/                 Athens plans, Maya, Leo, Nora…
    api.ts                the only door to the data, so Supabase can replace it later
  state/                  your profile, filters, joined plans (kept in memory)
CLAUDE.md                 project rules, always followed
```

## 4. Decisions (all approved)

1. **Screens 25–36 are drawn in a rougher style** (different size, no tab bar, plain "OK"/"X" icons, square buttons). → *Keep their layout and texts but use the same polished style as the other screens.*
2. **Age ranges don't match.** The picker offers 18–24, 25–30, 31–39, 40–45, 46–49 and 50+, but Maya and Leo show "29–35", and Alicia is 25–30 on screen 20 but 29–35 on screen 42. → **Approved:** ALWAYS use exactly 18-24, 25-30, 31-39, 40-45, 46-49, 50+ in every screen and all mock data.
3. **"NAIO" in capitals** in some small texts. → *Change it to "naio." so the brand is always written the same way.*
4. **Joining a plan:** screen 35 says "You're in" right away, but screens 39–40 show Leo *asking* to join. → **Approved:** joining is a request the host accepts. New screen **Request sent** (not in the designs) after tapping Join: the host has your request; once accepted you're active in the group chat and see the exact meeting point. Until then the chat is locked and the exact point hidden. Demo: auto-accepted after a few seconds, then "You're in".
5. **Screens not in the designs:** the Upcoming and Requests tabs of My plans, the "Add more about you" section, Blocked people. → *Design them in the same style and point them out.*

Note: the screen 14 image (take ID photo) seems to have exported badly, with a white layer over it. Build it as a normal dark camera screen.

## 5. Phases

- **Phase 1:** project setup, theme (colors, fonts, buttons, chips, cards, bottom tabs), the 5-screen reel, sign-up screens 06–08.
- **Phase 2:** profile setup 09–20, welcome and filter screens 21–24.
- **Phase 3:** live map, plan on map, plan details, available person 25–28, join flow (Request sent → You're in, manage group).
- **Phase 4:** create, edit, cancel plan, My plans, temporary chat, Alerts, join request, Profile, Settings, Safety centre.

After each phase: stop, give the exact command to run (`npm start`, which runs `npx expo start --tunnel ngrok`) and describe what should appear on the phone.

Before starting: update Expo Go on the phone to the latest version.

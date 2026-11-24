// Soft, warm palette (owner's request): terracotta primary, luminous butter / sand / peach surfaces,
// warm dark text that isn't almost black. Every pair used for text keeps good contrast on cream.
export const colors = {
  // Base
  cream: '#FFFAF6', // app background
  white: '#FFFFFF',
  dark: '#43312A', // headings and main text (warm dark, ~12:1 on cream)
  text: '#43312A',
  muted: '#7D675B', // secondary text (~5:1 on cream)
  faint: '#A89A90', // placeholders, inactive tabs

  // Primary: terracotta
  accentFill: '#C66337', // main buttons, the "+", badges, your chat bubbles (white text on top); never map markers
  accent: '#B05430', // small labels, links, selected text, active tab and icons (readable terracotta)
  accentLight: '#CC7650', // soft light terracotta for large text only (3.2:1 on cream): "Welcome to {city}, {name}."
  accentLine: '#E2A07C', // soft light terracotta: chip borders, selected outlines, focused fields
  accentSoft: '#F8DED0', // pale peach: selected chips, soft fills, avatars
  disabled: '#E9BCA7', // disabled main button
  accentDeep: '#A84E30', // deep terracotta for the few dark cards (Safety centre, offline banner), white text on top

  // Soft surfaces
  mist: '#FBEFD3', // butter: info boxes, received chat bubbles, small badges
  mistLight: '#FDF6E6', // lighter butter: the age-range info box
  blush: '#FBE9DD', // pale peach band on plan details
  border: '#EFDCCF', // sand: card and field borders

  // Status
  green: '#2E7D61', // verified badge, success
  greenSoft: '#E4F1EA',
  greenLight: '#F2F9F5', // very light green fill ("You're in" plan box)
  greenLine: '#8FC4A8', // green border that stands out ("You're in" plan box)
  link: '#007AFF', // the usual link blue: the tappable exact address that opens a maps app
  danger: '#B8433A', // destructive actions (white text on top)
  cancelLine: '#E4A097', // soft red border around a cancelled plan

  // Brand details
  brandDot: '#E0784A', // the period in the "naio." logo
  reelEyebrow: '#F2A285', // small labels on the intro photos
  overlay: 'rgba(67, 49, 42, 0.55)',
  // Soft terracotta tones of the photo placeholder gradient.
  brandBandDeep: '#A84E30',
  brandGlow: '#E8956C',
  // The very light, soft gradient of "Get started" on the intro.
  glowFrom: '#FFF7EE',
  glowTo: '#FBE2D2',

  // Map colour code (25–28). FUNCTIONAL colours: keep them on the map whatever the theme.
  mapPlan: '#2E7D61', // GREEN = "Plan to join": plan markers and legend dot
  // Your own plan (marker and "Your plan" label): lighter green with white text (owner's choice A).
  mapMine: '#5FAA8A',
  mapOpen: '#E8893A', // ORANGE = "Open to plans": people markers and legend dot
  // The drawn map (25–28).
  mapLand: '#ECE7DF',
  mapPark: '#DCE6D2',
  mapHill: '#E3DCCF',
  mapLabel: '#ABA196',
  you: '#3F8CC4', // "You · approximate" dot
  youHalo: 'rgba(63, 140, 196, 0.22)',
} as const;

export type ColorName = keyof typeof colors;

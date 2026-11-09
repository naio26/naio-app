import {
  Aperture,
  ArrowRight,
  ArrowUp,
  Backpack,
  Ban,
  Bell,
  BookOpen,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Coffee,
  Compass,
  Flag,
  House,
  IdCard,
  LoaderCircle,
  Lock,
  Luggage,
  Map,
  MapPin,
  MessageCircle,
  Minus,
  Moon,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Share,
  Shield,
  SlidersHorizontal,
  Star,
  Sun,
  User,
  UserPlus,
  X,
} from 'lucide-react-native';
import { colors, icon } from '@/theme';

// Every icon in the app, by name. Add new ones here so they all share the same style.
const icons = {
  aperture: Aperture,
  'arrow-right': ArrowRight,
  'arrow-up': ArrowUp,
  backpack: Backpack,
  ban: Ban,
  bell: Bell,
  'book-open': BookOpen,
  camera: Camera,
  check: Check,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  clock: Clock,
  coffee: Coffee,
  compass: Compass,
  flag: Flag,
  home: House,
  'id-card': IdCard,
  loader: LoaderCircle,
  lock: Lock,
  luggage: Luggage,
  map: Map,
  'map-pin': MapPin,
  'message-circle': MessageCircle,
  minus: Minus,
  moon: Moon,
  pencil: Pencil,
  plus: Plus,
  'refresh-cw': RefreshCw,
  search: Search,
  settings: Settings,
  share: Share,
  shield: Shield,
  sliders: SlidersHorizontal,
  star: Star,
  sun: Sun,
  user: User,
  'user-plus': UserPlus,
  x: X,
} as const;

export type IconName = keyof typeof icons;

type Props = {
  name: IconName;
  /** Defaults to the standard size; only tabs and big status icons differ. */
  size?: number;
  /** Dark brown by default; terracotta only for what's active or most important. */
  color?: string;
};

/** A plain outline icon, straight on the background: no box, no circle. */
export function Icon({ name, size = icon.size, color = colors.dark }: Props) {
  const C = icons[name];
  return <C size={size} color={color} strokeWidth={icon.stroke} absoluteStrokeWidth />;
}

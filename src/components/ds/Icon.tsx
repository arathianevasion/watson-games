import type { CSSProperties } from "react";
import {
  ArrowLeft, ArrowRight, Bell, Bookmark, BookmarkCheck, Check, ChevronDown, Circle, CircleCheck, CircleX,
  Coins, Flag, Flame, Gamepad2, Info, Lightbulb, Lock, LogOut, Mail, Maximize, Minimize, Pause, Play,
  RotateCcw, Search, Settings, Share2, ShieldCheck, Star, Timer, TriangleAlert, Trophy, User, Users,
  Volume2, VolumeX, X, MousePointerClick, Keyboard, Hand,
  type LucideIcon,
} from "lucide-react";

// Lucide slugs used across the site, mapped explicitly so only these ship in the bundle.
const ICONS = {
  "arrow-left": ArrowLeft, "arrow-right": ArrowRight, bell: Bell, bookmark: Bookmark, "bookmark-check": BookmarkCheck,
  check: Check, "chevron-down": ChevronDown, circle: Circle, "circle-check": CircleCheck, "circle-x": CircleX,
  coins: Coins, flag: Flag, flame: Flame, "gamepad-2": Gamepad2, info: Info, lightbulb: Lightbulb, lock: Lock,
  "log-out": LogOut, mail: Mail, maximize: Maximize, minimize: Minimize, pause: Pause, play: Play,
  "rotate-ccw": RotateCcw, search: Search, settings: Settings, "share-2": Share2, "shield-check": ShieldCheck,
  star: Star, timer: Timer, "triangle-alert": TriangleAlert, trophy: Trophy, user: User, users: Users,
  "volume-2": Volume2, "volume-x": VolumeX, x: X,
  "mouse-pointer-click": MousePointerClick, keyboard: Keyboard, hand: Hand,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export interface IconProps {
  name: IconName;
  /** Square px size. 13 in metadata, 15 in sm buttons, 17 default, 19 in lg buttons, 28 decorative. */
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: CSSProperties;
}

export function Icon({ name, size = 17, color = "currentColor", strokeWidth = 2, style }: IconProps) {
  const Glyph = ICONS[name];
  return (
    <span
      aria-hidden
      data-icon={name}
      style={{ width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto", color, lineHeight: 0, ...style }}
    >
      <Glyph size={size} strokeWidth={strokeWidth} />
    </span>
  );
}

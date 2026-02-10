/**
 * Shared category → Lucide icon mapping.
 * UI-only — nothing is persisted to the database.
 *
 * Used by:
 *  - CategoryScroller (product list page)
 *  - DashboardCategoryCreate / DashboardCategoryEdit (admin forms)
 */
import {
  Boxes,
  Camera,
  Cpu,
  Gamepad2,
  Headphones,
  Keyboard,
  Laptop,
  LayoutGrid,
  Monitor,
  Mouse,
  Printer,
  Router,
  Server,
  Smartphone,
  Speaker,
  Tablet,
  Tv,
  Watch,
  Wifi,
  BatteryCharging,
  Cable,
  HardDrive,
  Mic,
  Radio,
  Usb,
} from 'lucide-vue-next'

/* ── keyword → icon component ── */
export const CATEGORY_ICON_MAP = {
  smartphone:  Smartphone,
  smartphones: Smartphone,
  phone:       Smartphone,
  phones:      Smartphone,
  mobile:      Smartphone,

  laptop:      Laptop,
  laptops:     Laptop,
  notebook:    Laptop,

  tablet:      Tablet,
  tablets:     Tablet,
  ipad:        Tablet,

  headphone:   Headphones,
  headphones:  Headphones,
  earphone:    Headphones,
  earphones:   Headphones,
  earbuds:     Headphones,
  accessory:   Headphones,
  accessories: Headphones,
  audio:       Headphones,

  smartwatch:  Watch,
  watch:       Watch,
  watches:     Watch,
  wearable:    Watch,
  wearables:   Watch,

  camera:      Camera,
  cameras:     Camera,

  monitor:     Monitor,
  monitors:    Monitor,
  display:     Monitor,
  displays:    Monitor,
  screen:      Monitor,

  tv:          Tv,
  television:  Tv,

  keyboard:    Keyboard,
  keyboards:   Keyboard,

  mouse:       Mouse,
  mice:        Mouse,

  speaker:     Speaker,
  speakers:    Speaker,

  printer:     Printer,
  printers:    Printer,

  gaming:      Gamepad2,
  gamepad:     Gamepad2,
  console:     Gamepad2,
  controller:  Gamepad2,

  router:      Router,
  routers:     Router,
  networking:  Router,
  network:     Router,

  server:      Server,
  servers:     Server,

  processor:   Cpu,
  cpu:         Cpu,
  chip:        Cpu,
  component:   Cpu,
  components:  Cpu,

  cable:       Cable,
  cables:      Cable,
  charger:     BatteryCharging,
  chargers:    BatteryCharging,
  battery:     BatteryCharging,
  power:       BatteryCharging,

  storage:     HardDrive,
  drive:       HardDrive,
  ssd:         HardDrive,
  hdd:         HardDrive,

  microphone:  Mic,
  mic:         Mic,

  radio:       Radio,
  wifi:        Wifi,
  wireless:    Wifi,
  bluetooth:   Wifi,

  usb:         Usb,

  all:         LayoutGrid,
}

/** Fallback when no keyword matches */
export const FALLBACK_ICON = Boxes

/**
 * Unique list of selectable icons (de-duped).
 * Each entry: { key, label, component }
 */
export const ICON_PALETTE = [
  { key: 'smartphone',  label: 'Smartphone',  component: Smartphone },
  { key: 'laptop',      label: 'Laptop',      component: Laptop },
  { key: 'tablet',      label: 'Tablet',      component: Tablet },
  { key: 'headphones',  label: 'Headphones',  component: Headphones },
  { key: 'watch',       label: 'Watch',       component: Watch },
  { key: 'camera',      label: 'Camera',      component: Camera },
  { key: 'monitor',     label: 'Monitor',     component: Monitor },
  { key: 'tv',          label: 'TV',          component: Tv },
  { key: 'keyboard',    label: 'Keyboard',    component: Keyboard },
  { key: 'mouse',       label: 'Mouse',       component: Mouse },
  { key: 'speaker',     label: 'Speaker',     component: Speaker },
  { key: 'printer',     label: 'Printer',     component: Printer },
  { key: 'gaming',      label: 'Gaming',      component: Gamepad2 },
  { key: 'router',      label: 'Router',      component: Router },
  { key: 'server',      label: 'Server',      component: Server },
  { key: 'cpu',         label: 'CPU',         component: Cpu },
  { key: 'cable',       label: 'Cable',       component: Cable },
  { key: 'charger',     label: 'Charger',     component: BatteryCharging },
  { key: 'storage',     label: 'Storage',     component: HardDrive },
  { key: 'mic',         label: 'Microphone',  component: Mic },
  { key: 'radio',       label: 'Radio',       component: Radio },
  { key: 'wifi',        label: 'Wi-Fi',       component: Wifi },
  { key: 'usb',         label: 'USB',         component: Usb },
  { key: 'boxes',       label: 'General',     component: Boxes },
]

/**
 * Suggest an icon key based on a category name.
 * Splits the name into words and checks each against the keyword map.
 *
 * @param {string} name - Category name (e.g. "Smartphones")
 * @returns {string} matching ICON_PALETTE key, or 'boxes' (fallback)
 */
export function suggestIconKey(name = '') {
  const words = name.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/)
  for (const word of words) {
    if (CATEGORY_ICON_MAP[word]) {
      // find the palette entry whose component matches
      const matched = ICON_PALETTE.find(
        (p) => p.component === CATEGORY_ICON_MAP[word],
      )
      if (matched) return matched.key
    }
  }
  return 'boxes'
}

/**
 * Get a Lucide icon component for a category name.
 * Drop-in replacement for CategoryScroller's old `getIcon()`.
 *
 * @param {string} name - Category name
 * @returns {import('vue').Component}
 */
export function getCategoryIcon(name = '') {
  const key = name.toLowerCase()
  return CATEGORY_ICON_MAP[key] || FALLBACK_ICON
}

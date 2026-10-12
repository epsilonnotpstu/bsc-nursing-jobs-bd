const ICONS: Record<string, string> = {
  "building-government": "🏛️",
  landmark: "🏢",
  shield: "🛡️",
  hospital: "🏥",
  clinic: "🩺",
  microscope: "🔬",
  school: "👩‍🏫",
  "heart-handshake": "🤝",
  factory: "🏭",
  home: "🏠",
  plane: "✈️",
  "graduation-cap": "🎓",
  "book-open": "📖",
  "clipboard-check": "📋",
  star: "⭐",
};

export default function CategoryIcon({ icon, size = "text-2xl" }: { icon: string | null; size?: string }) {
  return <span className={size}>{ICONS[icon ?? ""] ?? "📋"}</span>;
}

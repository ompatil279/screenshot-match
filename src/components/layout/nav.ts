import {
  LayoutGrid, Search, Binary, Radio, ArrowLeftRight, TerminalSquare, BookOpen, Plug, Activity, Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  to: "/" | "/explorer" | "/decode" | "/events" | "/transactions" | "/developers" | "/docs" | "/integrations" | "/status" | "/settings";
  label: string;
  icon: LucideIcon;
}

export const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Workspace",
    items: [
      { to: "/", label: "Overview", icon: LayoutGrid },
      { to: "/explorer", label: "Signature Explorer", icon: Search },
      { to: "/decode", label: "Calldata Decoder", icon: Binary },
      { to: "/events", label: "Event Inspector", icon: Radio },
      { to: "/transactions", label: "Transaction Lab", icon: ArrowLeftRight },
    ],
  },
  {
    label: "Developer",
    items: [
      { to: "/developers", label: "CLI & SDK", icon: TerminalSquare },
      { to: "/docs", label: "Documentation", icon: BookOpen },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/integrations", label: "Integrations", icon: Plug },
      { to: "/status", label: "Service Status", icon: Activity },
      { to: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export const allNavItems = navGroups.flatMap((g) => g.items);

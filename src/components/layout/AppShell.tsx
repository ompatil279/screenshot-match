import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, PanelLeftClose, PanelLeftOpen, Search, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { allNavItems, navGroups, type NavItem } from "./nav";
import { AtlasMark } from "./AtlasMark";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { CommandPalette } from "./CommandPalette";
import { StatusIndicator } from "@/components/atlas/primitives";
import { useBackendState } from "@/lib/health";

const COLLAPSE_KEY = "atlas.sidebar.collapsed";

function useActivePath() {
  return useRouterState({ select: (s) => s.location.pathname });
}

function isActive(path: string, to: string) {
  return to === "/" ? path === "/" : path === to || path.startsWith(to + "/");
}

function NavLink({ item, collapsed, onNavigate }: { item: NavItem; collapsed: boolean; onNavigate?: (() => void) | undefined }) {
  const path = useActivePath();
  const active = isActive(path, item.to);
  const link = (
    <Link
      to={item.to}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13.5px] transition-colors duration-150",
        active
          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-secondary hover:text-foreground",
        collapsed && "justify-center px-0",
      )}
    >
      <item.icon className={cn("size-[17px] shrink-0", active ? "text-sidebar-accent-foreground" : "text-muted-foreground group-hover:text-foreground")} aria-hidden />
      {collapsed ? <span className="sr-only">{item.label}</span> : <span className="truncate">{item.label}</span>}
    </Link>
  );
  if (!collapsed) return link;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}

function SidebarNav({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: (() => void) | undefined }) {
  return (
    <nav aria-label="Primary" className="flex flex-col gap-5">
      {navGroups.map((g) => (
        <div key={g.label}>
          {!collapsed && <p className="mb-1 px-2.5 text-[11.5px] font-medium text-subtle-foreground">{g.label}</p>}
          {collapsed && <div className="mx-auto mb-2 h-px w-6 bg-border" aria-hidden />}
          <ul className="flex flex-col gap-0.5">
            {g.items.map((item) => (
              <li key={item.to}>
                <NavLink item={item} collapsed={collapsed} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Brand({ collapsed }: { collapsed?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 rounded-lg" aria-label="ATLAS Developer Studio home">
      <AtlasMark />
      {!collapsed && (
        <span className="leading-tight">
          <span className="block text-[14px] font-semibold tracking-[0.02em] text-foreground">ATLAS</span>
          <span className="block text-[11.5px] text-muted-foreground">Developer Studio</span>
        </span>
      )}
    </Link>
  );
}

function BackendPill() {
  const { state } = useBackendState();
  const map = {
    not_configured: { tone: "neutral", label: "Backend not configured" },
    checking: { tone: "checking", label: "Checking API…" },
    connected: { tone: "success", label: "API connected" },
    degraded: { tone: "warning", label: "API degraded" },
    unavailable: { tone: "error", label: "API unavailable" },
  } as const;
  const m = map[state];
  return (
    <Link to="/status" className="hidden rounded-lg px-2 py-1.5 hover:bg-secondary md:inline-flex">
      <StatusIndicator tone={m.tone} label={m.label} />
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const path = useActivePath();
  const current = allNavItems.find((n) => isActive(path, n.to));

  useEffect(() => {
    setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
  }, []);
  const toggle = () => {
    setCollapsed((c) => {
      localStorage.setItem(COLLAPSE_KEY, c ? "0" : "1");
      return !c;
    });
  };

  return (
    <TooltipProvider delayDuration={250}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2">
        Skip to content
      </a>
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside
          className={cn(
            "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 lg:flex",
            collapsed ? "w-[68px]" : "w-[244px]",
          )}
        >
          <div className={cn("flex h-14 items-center", collapsed ? "justify-center" : "px-4")}>
            <Brand collapsed={collapsed} />
          </div>
          <div className={cn("flex-1 overflow-y-auto py-3", collapsed ? "px-2.5" : "px-3")}>
            <SidebarNav collapsed={collapsed} />
          </div>
          <div className={cn("border-t border-sidebar-border p-2", collapsed && "flex justify-center")}>
            <button
              onClick={toggle}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="inline-flex h-9 items-center gap-2 rounded-lg px-2.5 text-[13px] text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
              {!collapsed && "Collapse"}
            </button>
          </div>
        </aside>

        {/* Mobile drawer */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-[280px] bg-sidebar p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex h-14 items-center px-4"><Brand /></div>
            <div className="px-3 py-3"><SidebarNav collapsed={false} onNavigate={() => setMobileOpen(false)} /></div>
          </SheetContent>
        </Sheet>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="glass-nav sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border px-3 sm:px-5">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              className="inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary lg:hidden"
            >
              <Menu className="size-5" />
            </button>
            <div className="lg:hidden"><AtlasMark className="size-6" /></div>
            <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 text-[13px] sm:flex">
              <span className="text-muted-foreground">ATLAS</span>
              <span className="text-subtle-foreground">/</span>
              <span className="truncate font-medium text-foreground">{current?.label ?? "Studio"}</span>
            </nav>
            <div className="flex-1" />
            <button
              onClick={() => setPaletteOpen(true)}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-2.5 text-[13px] text-muted-foreground shadow-surface hover:border-border-strong hover:text-foreground sm:w-64"
              aria-label="Open command palette"
            >
              <Search className="size-4" />
              <span className="hidden flex-1 text-left sm:inline">Search pages & actions</span>
              <kbd className="mono hidden rounded border border-border bg-secondary px-1.5 text-[11px] sm:inline">⌘K</kbd>
            </button>
            <BackendPill />
            <ThemeSwitcher />
            <Link
              to="/settings"
              aria-label="Settings"
              className="hidden size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground sm:inline-flex"
            >
              <Settings className="size-4" />
            </Link>
          </header>
          <main id="main" className="mx-auto w-full max-w-[1240px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
            {children}
          </main>
        </div>
      </div>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </TooltipProvider>
  );
}

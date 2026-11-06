import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Binary, ArrowLeftRight, History } from "lucide-react";
import { PageHeader, Panel, EmptyState } from "@/components/atlas/primitives";
import { useBackendState } from "@/lib/health";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "ATLAS Workspace — Developer Studio" },
    { name: "description", content: "Explore Ethereum interfaces, decode calldata, and investigate on-chain data." },
    { property: "og:title", content: "ATLAS Workspace — Developer Studio" },
    { property: "og:description", content: "Explore Ethereum interfaces, decode calldata, and investigate on-chain data." },
  ] }),
  component: Workspace,
});

const tiles = [
  { to: "/explorer", icon: Search, title: "Explore signatures", body: "Find matching function signatures and inspect provenance." },
  { to: "/decode", icon: Binary, title: "Decode calldata", body: "Understand a function call's parameters and possible signatures." },
  { to: "/transactions", icon: ArrowLeftRight, title: "Investigate transactions", body: "Inspect transaction details when RPC support is configured." },
] as const;

function Workspace() {
  const { state } = useBackendState();
  return (
    <>
      <PageHeader title="ATLAS Workspace" description="Explore Ethereum interfaces, understand contract interactions, and investigate on-chain data." />
      <div className="grid gap-3 sm:grid-cols-3">
        {tiles.map((t) => (
          <Link key={t.to} to={t.to} className="surface block p-5 transition-shadow hover:shadow-raised">
            <t.icon className="size-5 text-primary" aria-hidden />
            <p className="mt-3 text-[15px] font-semibold text-foreground">{t.title}</p>
            <p className="mt-1 text-[13px] text-muted-foreground">{t.body}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <Panel title="Recent activity"><EmptyState icon={History} title="No recent investigations yet." /></Panel>
        <Panel title="System status"><p className="text-[13px] text-muted-foreground">{state === "not_configured" ? "Backend not configured." : `API: ${state}`}</p></Panel>
      </div>
    </>
  );
}

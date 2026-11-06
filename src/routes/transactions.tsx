import { createFileRoute } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import { PageHeader, Panel, EmptyState } from "@/components/atlas/primitives";

export const Route = createFileRoute("/transactions")({
  head: () => ({ meta: [
    { title: "Transaction Lab — ATLAS" }, { name: "description", content: "Investigate Ethereum transactions via configured RPC." },
    { property: "og:title", content: "Transaction Lab — ATLAS" }, { property: "og:description", content: "Investigate Ethereum transactions via configured RPC." },
  ] }),
  component: () => (
    <>
      <PageHeader title="Transaction Lab" description="Investigate Ethereum transactions via configured RPC." />
      <Panel><EmptyState icon={Construction} title="This screen isn't built yet" description="The layout is ready; this tool's interface is still to come." /></Panel>
    </>
  ),
});

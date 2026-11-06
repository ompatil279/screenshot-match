import { createFileRoute } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import { PageHeader, Panel, EmptyState } from "@/components/atlas/primitives";

export const Route = createFileRoute("/explorer")({
  head: () => ({ meta: [
    { title: "Signature Explorer — ATLAS" }, { name: "description", content: "Search four-byte selectors and function signatures." },
    { property: "og:title", content: "Signature Explorer — ATLAS" }, { property: "og:description", content: "Search four-byte selectors and function signatures." },
  ] }),
  component: () => (
    <>
      <PageHeader title="Signature Explorer" description="Search four-byte selectors and function signatures." />
      <Panel><EmptyState icon={Construction} title="This screen isn't built yet" description="The layout is ready; this tool's interface is still to come." /></Panel>
    </>
  ),
});

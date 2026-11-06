import { createFileRoute } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import { PageHeader, Panel, EmptyState } from "@/components/atlas/primitives";

export const Route = createFileRoute("/docs")({
  head: () => ({ meta: [
    { title: "Documentation — ATLAS" }, { name: "description", content: "Architecture, provenance, and error handling." },
    { property: "og:title", content: "Documentation — ATLAS" }, { property: "og:description", content: "Architecture, provenance, and error handling." },
  ] }),
  component: () => (
    <>
      <PageHeader title="Documentation" description="Architecture, provenance, and error handling." />
      <Panel><EmptyState icon={Construction} title="This screen isn't built yet" description="The layout is ready; this tool's interface is still to come." /></Panel>
    </>
  ),
});

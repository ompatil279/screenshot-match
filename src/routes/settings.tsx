import { createFileRoute } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import { PageHeader, Panel, EmptyState } from "@/components/atlas/primitives";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [
    { title: "Settings — ATLAS" }, { name: "description", content: "Appearance, developer preferences, and API connection." },
    { property: "og:title", content: "Settings — ATLAS" }, { property: "og:description", content: "Appearance, developer preferences, and API connection." },
  ] }),
  component: () => (
    <>
      <PageHeader title="Settings" description="Appearance, developer preferences, and API connection." />
      <Panel><EmptyState icon={Construction} title="This screen isn't built yet" description="The layout is ready; this tool's interface is still to come." /></Panel>
    </>
  ),
});

import { createFileRoute } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import { PageHeader, Panel, EmptyState } from "@/components/atlas/primitives";

export const Route = createFileRoute("/status")({
  head: () => ({ meta: [
    { title: "Service Status — ATLAS" }, { name: "description", content: "Live diagnostics of the ATLAS API." },
    { property: "og:title", content: "Service Status — ATLAS" }, { property: "og:description", content: "Live diagnostics of the ATLAS API." },
  ] }),
  component: () => (
    <>
      <PageHeader title="Service Status" description="Live diagnostics of the ATLAS API." />
      <Panel><EmptyState icon={Construction} title="This screen isn't built yet" description="The layout is ready; this tool's interface is still to come." /></Panel>
    </>
  ),
});

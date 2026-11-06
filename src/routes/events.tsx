import { createFileRoute } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import { PageHeader, Panel, EmptyState } from "@/components/atlas/primitives";

export const Route = createFileRoute("/events")({
  head: () => ({ meta: [
    { title: "Event Inspector — ATLAS" }, { name: "description", content: "Inspect event topics and log data." },
    { property: "og:title", content: "Event Inspector — ATLAS" }, { property: "og:description", content: "Inspect event topics and log data." },
  ] }),
  component: () => (
    <>
      <PageHeader title="Event Inspector" description="Inspect event topics and log data." />
      <Panel><EmptyState icon={Construction} title="This screen isn't built yet" description="The layout is ready; this tool's interface is still to come." /></Panel>
    </>
  ),
});

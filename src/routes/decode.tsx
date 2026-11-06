import { createFileRoute } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import { PageHeader, Panel, EmptyState } from "@/components/atlas/primitives";

export const Route = createFileRoute("/decode")({
  head: () => ({ meta: [
    { title: "Calldata Decoder — ATLAS" }, { name: "description", content: "Decode function calldata into structured parameters." },
    { property: "og:title", content: "Calldata Decoder — ATLAS" }, { property: "og:description", content: "Decode function calldata into structured parameters." },
  ] }),
  component: () => (
    <>
      <PageHeader title="Calldata Decoder" description="Decode function calldata into structured parameters." />
      <Panel><EmptyState icon={Construction} title="This screen isn't built yet" description="The layout is ready; this tool's interface is still to come." /></Panel>
    </>
  ),
});

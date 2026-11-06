import { createFileRoute } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import { PageHeader, Panel, EmptyState } from "@/components/atlas/primitives";

export const Route = createFileRoute("/developers")({
  head: () => ({ meta: [
    { title: "CLI & SDK — ATLAS" }, { name: "description", content: "Use ATLAS from the terminal, TypeScript, or REST." },
    { property: "og:title", content: "CLI & SDK — ATLAS" }, { property: "og:description", content: "Use ATLAS from the terminal, TypeScript, or REST." },
  ] }),
  component: () => (
    <>
      <PageHeader title="CLI & SDK" description="Use ATLAS from the terminal, TypeScript, or REST." />
      <Panel><EmptyState icon={Construction} title="This screen isn't built yet" description="The layout is ready; this tool's interface is still to come." /></Panel>
    </>
  ),
});

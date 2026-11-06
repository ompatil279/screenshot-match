import { createFileRoute } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import { PageHeader, Panel, EmptyState } from "@/components/atlas/primitives";

export const Route = createFileRoute("/integrations")({
  head: () => ({ meta: [
    { title: "Integrations — ATLAS" }, { name: "description", content: "Arkiv, Swarm, Anon-RPC, ENSv2 and 0G connection states." },
    { property: "og:title", content: "Integrations — ATLAS" }, { property: "og:description", content: "Arkiv, Swarm, Anon-RPC, ENSv2 and 0G connection states." },
  ] }),
  component: () => (
    <>
      <PageHeader title="Integrations" description="Arkiv, Swarm, Anon-RPC, ENSv2 and 0G connection states." />
      <Panel><EmptyState icon={Construction} title="This screen isn't built yet" description="The layout is ready; this tool's interface is still to come." /></Panel>
    </>
  ),
});

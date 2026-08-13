import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getAllServicesAdmin, isServicesDbLive } from "@/lib/services-data";
import { seedServicesAction } from "../actions";
import { AdminTabs } from "../ui";
import { ServiceList } from "./service-list";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const [services, dbLive] = await Promise.all([
    getAllServicesAdmin(),
    isServicesDbLive(),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
        Admin · Portfolio
      </span>
      <h1 className="font-display text-4xl mt-2 mb-8">Services</h1>
      <AdminTabs active="services" />

      {!dbLive && (
        <div className="mb-8 rounded-2xl border border-accent/40 bg-accent-soft p-6">
          <h2 className="font-medium mb-1">One-time import needed</h2>
          <p className="text-fg-muted text-sm mb-4 text-pretty">
            Import the six services built into the code — after that they're
            fully editable here.
          </p>
          <form action={seedServicesAction}>
            <button className="rounded-full bg-fg text-bg px-5 py-2.5 text-sm font-medium hover:bg-accent hover:text-white transition-colors">
              Import current services
            </button>
          </form>
        </div>
      )}

      <ServiceList services={services} dbLive={dbLive} />
    </div>
  );
}

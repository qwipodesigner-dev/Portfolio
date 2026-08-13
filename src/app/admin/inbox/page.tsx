import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getMessages } from "@/lib/messages";
import { AdminTabs } from "../ui";
import { MessageList } from "./message-list";

export const dynamic = "force-dynamic";

export default async function AdminInboxPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const messages = await getMessages();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
        Admin · Portfolio
      </span>
      <h1 className="font-display text-4xl mt-2 mb-8">Inbox</h1>
      <AdminTabs active="inbox" />
      <MessageList messages={messages} />
    </div>
  );
}

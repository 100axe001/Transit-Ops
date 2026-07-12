import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { WelcomeTour } from "@/components/onboarding/welcome-tour";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role={session.role} />
      <div className="md:pl-64 flex flex-col min-h-screen">
        <Navbar user={{ name: session.name, email: session.email, role: session.role }} />
        <main className="flex-1 p-6">{children}</main>
      </div>
      <WelcomeTour />
    </div>
  );
}

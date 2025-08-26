import { getSession } from "@/actions";
import AccessControlComponent from "@/components/AccessControlComponent";
import DashboardNavbar from "@/components/Navbars/DashboardNavbar";
import DashboardSidebar from "@/components/Sidebars/DashboardSidebar";

import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (["student", "teacher"].includes(session?.user?.role)) {
    redirect("/");
  }
  return (
    <>
      {/* {role === "staff" && <AccessControlComponent payload={payload?.user} />} */}
      <main className="flex w-full min-h-screen bg-gray-200 dark:bg-dark-1 ">
        <div className="hidden md:block">
          <DashboardSidebar role={session?.user?.role || ""} />
        </div>

        <section className="w-full min-w-0 flex-1">
          <DashboardNavbar payload={session?.user || ""} />
          <div className="px-8 w-full mb-8">{children}</div>
        </section>
      </main>
    </>
  );
}

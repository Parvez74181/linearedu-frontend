import AccessControlComponent from "@/components/AccessControlComponent";
import DashboardNavbar from "@/components/Navbars/DashboardNavbar";
import DashboardSidebar from "@/components/Sidebars/DashboardSidebar";
import { authClient } from "@/lib/auth-client";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token");

  const res = await fetch(`${process.env.BETTER_AUTH_URL}/api/me?token=${sessionToken?.value}`, {
    method: "GET",
    credentials: "include", // Ensure cookies are sent with the request
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${sessionToken?.value}`,
    },
  }).then((res) => res.json());
  console.log(res);

  return (
    <>
      {/* {role === "staff" && <AccessControlComponent payload={payload?.user} />} */}
      <main className="flex w-full min-h-screen bg-gray-200 dark:bg-dark-1 ">
        <div className="hidden md:block">
          <DashboardSidebar role={"admin"} />
        </div>

        <section className="w-full min-w-0 flex-1">
          <DashboardNavbar payload={"admin"} />
          <div className="px-8 w-full mb-8">{children}</div>
        </section>
      </main>
    </>
  );
}

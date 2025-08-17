import Link from "next/link";
import {
  AcademicManagement,
  Highlights,
  OlympiadManagement,
  OthersRecords,
  StudentRecords,
  UserManagement,
} from "../../../../data/dashboardNavItems";

const page = async () => {
  const renderNavGroup = (title: string, navItems: typeof UserManagement) => {
    // Filter items based on permissions
    const filteredItems = navItems.filter((nav) => {
      // if (payload?.role === "staff") {
      //   if (["Admin", "Todos", "Collections", "Yearly Funds", "Monthly Funds", "Site Settings"].includes(nav.name))
      //     return false;
      //   if (!payload?.staffsAccess?.includes(nav.key)) return false;
      // }
      // if (payload?.role === "admin") {
      //   if (["My Attendance", "My Salary Report"].includes(nav.name)) return false;
      // }
      return true;
    });

    // Don't render the group at all if no items are visible
    if (filteredItems.length === 0) return null;

    return (
      <div className="pb-5 md:pb-10">
        <h2 className="text-xl md:text-2xl lg:text-4xl font-semibold my-2 md:my-4 lg:my-8">{title}</h2>
        <div className="grid gap-4 lg:gap-10 grid-cols-2 lg:grid-cols-4">
          {filteredItems.map((nav, i) => (
            <Link
              href={`/dashboard${nav.url}`}
              key={i}
              className="flex h-32 lg:h-44 items-center flex-col gap-5 text-lg lg:text-2xl justify-center w-full p-2 px-4 rounded-md shadow-md border border-dark-1/40 bg-dark-1/5 dark:bg-dark-3/30 dark:border-white/40"
            >
              <span className="*:size-6 lg:*:size-8">{nav.icon}</span>
              <span className="text-center">{nav.name}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  };
  return (
    <>
      {renderNavGroup("User Management", UserManagement)}
      {renderNavGroup("Highlights", Highlights)}
      {renderNavGroup("Olympiad", OlympiadManagement)}
      {renderNavGroup("Academic Management", AcademicManagement)}
      {renderNavGroup("Student Record", StudentRecords)}
      {renderNavGroup("Others Record", OthersRecords)}
    </>
  );
};

export default page;

"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Menu, LayoutDashboard, ListTodo } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  AcademicManagement,
  CourseManagement,
  Highlights,
  OlympiadManagement,
  OthersRecords,
  StudentRecords,
  UserManagement,
  Visitors,
} from "../../../data/dashboardNavItems";
import { Tooltip } from "@heroui/react";

export const DashboardSidebar = ({ role }: { role: string }) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<any>();

  // useEffect(() => {
  //   const getPayload = async () => {
  //     const payload = await getAuthJWTToken();

  //     setUser(payload);
  //   };

  //   getPayload();
  // }, []);

  const toggleSidebar = () => setCollapsed(!collapsed);

  // Reusable nav renderer
  const renderNavGroup = (title: string, navItems: typeof UserManagement) => {
    // First filter out items that shouldn't be visible
    const visibleItems = navItems.filter((nav) => {
      // if (role === "staff") {
      //   // Hide specific items for staff
      //   if (["Admin", "Todos", "Collections", "Yearly Funds", "Monthly Funds", "Site Settings"].includes(nav.name))
      //     return false;

      //   // Hide items that staff doesn't have access to
      //   if (!user?.staffsAccess?.includes(nav.key)) return false;
      // }
      // if (role === "admin") {
      //   if (["My Attendance", "My Salary Report"].includes(nav.name)) return false;
      // }
      return true;
    });

    // Don't render anything if no items are visible
    if (visibleItems.length === 0) return null;

    return (
      <>
        {!collapsed && (
          <h2 className="lg:text-lg font-semibold mt-4 mb-1">{title}</h2>
        )}
        {visibleItems.map((nav, i) => {
          const isActive = pathname?.endsWith(`/dashboard${nav.url}`);

          return (
            <Link
              href={`/dashboard${nav.url}`}
              key={i}
              className={`flex items-center ${
                collapsed ? "justify-center" : "gap-4"
              } w-full p-2 px-4 rounded-md
              hover:bg-gray-300 dark:hover:bg-gray-700 lg:text-base text-sm
              ${
                isActive
                  ? "bg-gray-600 text-white"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <Tooltip content={nav.name} placement="right-end">
                {nav.icon}
              </Tooltip>
              {!collapsed && <span>{nav.name}</span>}
            </Link>
          );
        })}
      </>
    );
  };

  return (
    <>
      <aside
        className={`${collapsed ? "md:w-20" : "md:w-[250px]"} 
      sticky top-0 max-h-screen flex flex-col md:flex-shrink-0 border-r border-gray-600 transition-all duration-300 ease-in-out overflow-y-auto  pb-14 scrollbar-4px min-h-screen`}
      >
        {/* Toggle Button */}

        <Menu
          size={24}
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="md:block hidden transition-colors cursor-pointer duration-200 self-end absolute top-4  right-4"
        />

        {/* Sidebar Content */}
        <div
          className={`flex flex-col gap-1 mt-20 px-2 ${
            collapsed ? "items-center" : "items-start"
          }`}
        >
          {/* Title */}
          {!collapsed && (
            <p className="text-xl lg:text-3xl font-semibold mb-5 text-center w-full">
              Admin Panel
            </p>
          )}

          <Link
            href={"/dashboard"}
            className={`flex items-center ${
              collapsed ? "justify-center" : "gap-4"
            } w-full p-2 px-4 rounded-md
            hover:bg-gray-300 dark:hover:bg-gray-700 
            ${
              pathname === `/dashboard`
                ? "bg-gray-600 text-white"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            <Tooltip content="Dashboard" placement="right-end">
              <LayoutDashboard />
            </Tooltip>
            {!collapsed && <span>Dashboard</span>}
          </Link>

          {renderNavGroup("User Management", UserManagement)}
          {renderNavGroup("Highlights", Highlights)}
          {renderNavGroup("Course Management", CourseManagement)}
          {renderNavGroup("Olympiad", OlympiadManagement)}
          {renderNavGroup("Academic Management", AcademicManagement)}
          {renderNavGroup("Student Record", StudentRecords)}
          {renderNavGroup("Others Record", OthersRecords)}
          {renderNavGroup("Website Visitors", Visitors)}
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;

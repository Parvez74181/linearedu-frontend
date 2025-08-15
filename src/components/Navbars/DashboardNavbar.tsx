"use client";
import { CircleUser, LogOut, Menu, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import {
  Avatar,
  Button,
  Drawer,
  DrawerContent,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@heroui/react";
import DashboardSidebar from "@/components/Sidebars/DashboardSidebar";

import Link from "next/link";

const DashboardNavbar = ({ payload }: { payload: any }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [user, setUser] = useState<any>("");

  useEffect(() => {
    if (payload) setUser(payload);
  }, [payload]);

  return (
    <>
      <nav className="border-gray-600 flex items-center bg-white border-b dark:bg-dark-2 h-[70px] mb-5 w-full">
        <div className="w-full mx-4 md:mx-8   flex items-center justify-between  ">
          <div className="flex items-center gap-2">
            <Menu
              onClick={onOpen}
              size={24}
              aria-label="Toggle sidebar"
              className="md:hidden transition-colors cursor-pointer duration-200 "
            />
            <Link href={"/"}>
              <Image
                src="/logo.png"
                alt="Linear Science Academy Logo"
                width={200}
                height={100}
                className="object-contain !h-auto !w-32"
              />
            </Link>
          </div>

          <div className="flex items-center gap-5">
            <ThemeSwitcher />

            <Popover placement="bottom" radius="sm">
              <PopoverTrigger>
                <Avatar src={user?.image} className="cursor-pointer size-8 border border-dark-3 dark:border-gray-400" />
              </PopoverTrigger>
              <PopoverContent className="p-4 dark:bg-dark-3">
                <div className="flex  w-full flex-col gap-2">
                  <div className="flex w-full items-center justify-start gap-8">
                    <span className="w-10">Name</span>
                    <span>: {user?.name}</span>
                  </div>
                  <div className="flex w-full items-center justify-start gap-8">
                    <span className="w-10">Role</span>
                    <span>: {user?.role}</span>
                  </div>
                  <div className="flex w-full items-center justify-start gap-8">
                    <span className="w-10">Email</span>
                    <span>: {user?.email}</span>
                  </div>
                  <div className="flex w-full items-center justify-start gap-8">
                    <span className="w-10">Number</span>
                    <span>: {user?.phone}</span>
                  </div>

                  <Link href={"/auth/logout"} className="flex items-center gap-2 mt-5">
                    <LogOut /> Logout
                  </Link>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </nav>

      <Drawer
        classNames={{
          base: "bg-white dark:bg-dark-2 max-w-[70%] overflow-x-hidden",
          closeButton: "drawer-close-button",
        }}
        backdrop="blur"
        placement="left"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
      >
        <DrawerContent onClick={onClose}>
          <DashboardSidebar role={user?.role} />
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DashboardNavbar;


"use client";
import React, { useState } from "react";
import { AnimatedSidebar, SidebarBody, SidebarLink } from "@/components/ui/animated-sidebar";
import { Calendar, BarChart3, Users, MapPin, Building2, Music } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AppAnimatedSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: (
        <BarChart3 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Events",
      href: "/events",
      icon: (
        <Calendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Artists",
      href: "/artists",
      icon: (
        <Users className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Venues",
      href: "/venues",
      icon: (
        <Building2 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Promoters",
      href: "/promoters",
      icon: (
        <MapPin className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  
  const [open, setOpen] = useState(false);
  
  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  return (
    <AnimatedSidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink 
                key={idx} 
                link={link} 
                className={cn(
                  isActive(link.href) 
                    ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-md" 
                    : ""
                )}
              />
            ))}
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: "Entertainment Intelligence",
              href: "#",
              icon: (
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                  className="h-7 w-7 flex-shrink-0 rounded-full"
                  width={32}
                  height={32}
                  alt="Avatar"
                />
              ),
            }}
          />
        </div>
      </SidebarBody>
    </AnimatedSidebar>
  );
}

export const Logo = () => {
  return (
    <Link
      to="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
        <Music className="w-3 h-3 text-primary-foreground" />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre font-manrope"
      >
        Entertainment Intelligence
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      to="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
        <Music className="w-3 h-3 text-primary-foreground" />
      </div>
    </Link>
  );
};

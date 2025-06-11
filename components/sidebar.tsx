"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Users,
  Scissors,
  BarChart3,
  Settings,
  Package,
  UserCircle,
  Calendar,
  Home,
  FileText,
  Tag,
  RefreshCw,
  Shield,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/contexts/sidebar";

export default function Sidebar() {
  const pathname = usePathname();

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "POS Terminal",
      icon: ShoppingBag,
      href: "/terminal",
      active: pathname === "/terminal",
    },
    {
      label: "Sales",
      icon: ShoppingBag,
      href: "/sales",
      active: pathname === "/sales",
    },
    {
      label: "Quotations",
      icon: FileText,
      href: "/quotations",
      active: pathname.startsWith("/quotations"),
    },
    {
      label: "Returns",
      icon: RefreshCw,
      href: "/returns",
      active: pathname === "/returns",
    },
    {
      label: "Tailoring",
      icon: Scissors,
      href: "/tailoring",
      active: pathname === "/tailoring",
    },
    {
      label: "Catalog",
      icon: Package,
      href: "/catalog",
      active: pathname === "/catalog",
    },
    {
      label: "Inventory",
      icon: Package,
      href: "/inventory",
      active: pathname === "/inventory",
    },
    {
      label: "Customers",
      icon: Users,
      href: "/customers",
      active: pathname === "/customers",
    },
    {
      label: "Staff",
      icon: UserCircle,
      href: "/staff",
      active: pathname === "/staff",
    },
    {
      label: "Reports",
      icon: BarChart3,
      href: "/reports",
      active: pathname === "/reports",
    },
    // {
    //   label: "Invoices",
    //   icon: FileText,
    //   href: "/invoices",
    //   active: pathname === "/invoices",
    // },
    {
      label: "Promotions",
      icon: Tag,
      href: "/promotions",
      active: pathname === "/promotions",
    },
    {
      label: "Calendar",
      icon: Calendar,
      href: "/calendar",
      active: pathname === "/calendar",
    },
    {
      label: "Stores",
      icon: Store,
      href: "/stores",
      active: pathname === "/stores",
    },
    {
      label: "Policies",
      icon: Shield,
      href: "/settings/policies",
      active: pathname === "/settings/policies",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings",
    },
  ];

  const {isOpen} = useSidebar()

  return (
    <div
      className={`${pathname.includes("register") || pathname.includes("close") || pathname.includes("reports") || pathname.includes("terminal") ||  !isOpen ? "hidden" : "flex"}  h-full w-64 flex-col border-r bg-background`}
    >
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Scissors className="h-6 w-6" />
          <span className="text-xl">Nubras POS</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                route.active && "bg-muted text-primary"
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4">
        <Button className="w-full" variant="outline" asChild>
          <Link href="/terminal">
            <ShoppingBag className="mr-2 h-4 w-4" />
            New Sale
          </Link>
        </Button>
      </div>
    </div>
  );
}

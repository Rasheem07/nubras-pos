"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Search,
  User,
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
  ChevronDown,
  Warehouse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import CommandPalette from "./command-palette";

const navigationGroups = {
  sales: {
    label: "Sales",
    icon: ShoppingBag,
    items: [
      { label: "POS Terminal", href: "/terminal", icon: ShoppingBag },
      { label: "Orders", href: "/sales", icon: ShoppingBag },
      { label: "Quotations", href: "/quotations", icon: FileText },
      { label: "Returns", href: "/returns", icon: RefreshCw },
      { label: "Promotions", href: "/promotions", icon: Tag },
    ],
  },
  operations: {
    label: "Operations",
    icon: Scissors,
    items: [
      { label: "Tailoring", href: "/tailoring", icon: Scissors },
      { label: "Calendar", href: "/calendar", icon: Calendar },
    ],
  },
  inventory: {
    label: "Product",
    icon: Package,
    items: [
      { label: "Catalog", href: "/catalog", icon: Package },
      { label: "Inventory", href: "/inventory", icon: Warehouse },
    ],
  },
  people: {
    label: "People",
    icon: Users,
    items: [
      { label: "Customers", href: "/customers", icon: Users },
      { label: "Staff", href: "/staff", icon: UserCircle },
    ],
  },
  reports: {
    label: "Reports",
    icon: BarChart3,
    items: [{ label: "Reports", href: "/reports", icon: BarChart3 }],
  },
  settings: {
    label: "Settings",
    icon: Settings,
    items: [
      { label: "Settings", href: "/settings", icon: Settings },
      { label: "Policies", href: "/settings/policies", icon: Shield },
    ],
  },
};

function NavPopover({ group, groupKey }: { group: any; groupKey: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = group.items.some(
    (item: any) => pathname === item.href || pathname.startsWith(item.href)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          size="sm"
          className={cn(
            "h-7 gap-1.5 text-xs px-2.5 font-medium transition-all duration-200 hover:scale-[1.02] min-h-[44px] sm:min-h-0 sm:h-7",
            "hover:shadow-sm hover:bg-accent/50 touch-manipulation",
            isActive && "bg-accent/80 text-accent-foreground shadow-sm"
          )}
        >
          <group.icon className="h-3.5 w-3.5" />
          {group.label}
          <ChevronDown
            className={cn(
              "h-2.5 w-2.5 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-44 p-1.5 shadow-lg border-0 bg-background/95 backdrop-blur-sm"
        align="start"
      >
        <div className="space-y-0.5">
          {group.items.map((item: any) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all duration-200 min-h-[44px] sm:min-h-0 sm:py-2",
                "hover:bg-accent/60 hover:scale-[1.02] hover:shadow-sm touch-manipulation",
                (pathname === item.href || pathname.startsWith(item.href)) &&
                  "bg-accent text-accent-foreground shadow-sm"
              )}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function CompactNavHeader() {
  const pathname = usePathname();
  const [commandOpen, setCommandOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);

  useEffect(() => {
    if(pathname.includes("terminal")) {
        setIsNavVisible(false)
    }
  }, [])
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Hide navigation: ESC key
      if (event.key === "Escape" && isNavVisible) {
        setIsNavVisible(false);
        return;
      }

      // Show navigation: Ctrl + Shift + N (Windows/Linux) or Cmd + Shift + N (Mac)
      if (
        event.key === "N" &&
        event.shiftKey &&
        (event.ctrlKey || event.metaKey) &&
        !isNavVisible
      ) {
        event.preventDefault();
        setIsNavVisible(true);
        return;
      }

      // Toggle navigation: Ctrl + ` (backtick) or Cmd + ` (Mac)
      if (event.key === "`" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        setIsNavVisible((prev) => !prev);
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isNavVisible]);

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl 
          supports-[backdrop-filter]:bg-background/80 transition-transform duration-300 ease-in-out
          ${isNavVisible ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        <div className="flex h-11 items-center justify-between px-4">
          {/* Left side - Navigation */}
          <div className="flex items-center gap-1">
            <Link href="/" className="mr-1">
              <Button
                variant={pathname === "/" ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "h-7 gap-1.5 text-xs px-2.5 font-medium transition-all duration-200 hover:scale-[1.02] min-h-[44px] sm:min-h-0 sm:h-7",
                  "hover:shadow-sm hover:bg-accent/50 touch-manipulation",
                  pathname === "/" &&
                    "bg-accent/80 text-accent-foreground shadow-sm"
                )}
              >
                <Home className="h-3.5 w-3.5" />
                Dashboard
              </Button>
            </Link>

            <div className="hidden md:flex items-center gap-0.5">
              {Object.entries(navigationGroups).map(([key, group]) => (
                <NavPopover key={key} group={group} groupKey={key} />
              ))}
            </div>
          </div>

          {/* Right side - Operations & Notifications */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden sm:block">
              <CommandPalette />
            </div>

            {/* Theme Toggle */}
            <ModeToggle />

            {/* Notifications */}
            <Link href="/notifications">
              <Button
                variant="ghost"
                size="sm"
                className="relative h-7 w-7 p-0 hover:bg-accent/50 transition-all duration-200 hover:scale-[1.05] min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:h-7 sm:w-7 touch-manipulation"
              >
                <Bell className="h-3.5 w-3.5" />
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground animate-pulse">
                  5
                </span>
                <span className="sr-only">Notifications</span>
              </Button>
            </Link>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 rounded-full hover:bg-accent/50 transition-all duration-200 hover:scale-[1.05] focus:ring-2 focus:ring-primary/20 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:h-7 sm:w-7 touch-manipulation"
                >
                  <User className="h-3.5 w-3.5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 shadow-lg border-0 bg-background/95 backdrop-blur-sm"
              >
                <DropdownMenuLabel className="text-xs font-semibold px-3 py-2.5 min-h-[44px] flex items-center touch-manipulation">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="mx-2" />
                <DropdownMenuItem className="text-xs font-medium px-3 py-2.5 hover:bg-accent/60 transition-colors duration-200 min-h-[44px] flex items-center touch-manipulation">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs font-medium px-3 py-2.5 hover:bg-accent/60 transition-colors duration-200 min-h-[44px] flex items-center touch-manipulation">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="mx-2" />
                <DropdownMenuItem className="text-xs font-medium px-3 py-2.5 hover:bg-accent/60 transition-colors duration-200 text-red-600 focus:text-red-600 min-h-[44px] flex items-center touch-manipulation">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content jump when nav is visible */}
      <div
        className={`transition-all duration-300 ease-in-out ${isNavVisible ? "h-11" : "h-0"}`}
      />

    </>
  );
}

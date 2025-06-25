"use client"
import React, { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Terminal,
  Computer,
  Monitor,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ModeToggle } from '@/components/mode-toggle';
import CommandPalette from './command-palette';
import LanguageSelect from './lang-select';

// Type for navigation items
type NavItemType = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const navigationGroups = {
  sales: {
    label: 'Sales',
    icon: ShoppingBag,
    items: [
      { label: 'Orders', href: '/sales', icon: ShoppingBag },
      { label: 'Quotations', href: '/quotations', icon: FileText },
      { label: 'Returns', href: '/returns', icon: RefreshCw },
      { label: 'Promotions', href: '/promotions', icon: Tag },
    ],
  },
  operations: {
    label: 'Tailoring',
    icon: Scissors,
    href: '/tailoring',
  },
  inventory: {
    label: 'Product',
    icon: Package,
    items: [
      { label: 'Catalog', href: '/catalog', icon: Package },
      { label: 'Inventory', href: '/inventory', icon: Warehouse },
    ],
  },
  people: {
    label: 'People',
    icon: Users,
    items: [
      { label: 'Customers', href: '/customers', icon: Users },
      { label: 'Sales persons', href: '/staff', icon: UserCircle },
    ],
  },
  reports: {
    label: 'Reports',
    icon: BarChart3,
    href: '/reports'
  },
  settings: {
    label: 'Settings',
    icon: Settings,
    items: [
      { label: 'Settings', href: '/settings', icon: Settings },
      { label: 'Policies', href: '/settings/policies', icon: Shield },
    ],
  },
};

type NavItemProps = {
  group: any; // You can replace 'any' with a more specific type if available
  groupKey: string;
};

function NavItem({ group, groupKey }: NavItemProps) {
  const pathname = usePathname();
  const isActiveLink = group.href && (pathname === group.href || pathname.startsWith(group.href));

  if (group.items) {
    // Popover for groups
    const [open, setOpen] = useState(false);
    const isActive: boolean = group.items.some((item: NavItemType) => pathname === item.href || pathname.startsWith(item.href));

    return (
      <Popover open={open} onOpenChange={setOpen} key={groupKey}>
        <PopoverTrigger asChild>
          <Button
            variant={isActive ? 'secondary' : 'ghost'}
            size="sm"
            className={cn(
              'h-7 gap-1.5 text-xs px-2.5 font-medium transition-all duration-200 hover:scale-[1.02] touch-manipulation',
              isActive && 'bg-accent/80 text-accent-foreground shadow-sm'
            )}
          >
            <group.icon className="h-3.5 w-3.5" />
            {group.label}
            <ChevronDown className={cn('h-2.5 w-2.5 transition-transform duration-200', open && 'rotate-180')} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-44 p-1.5 shadow-lg border-0 bg-background/95 backdrop-blur-sm" align="start">
          <div className="space-y-0.5">
            {group.items.map((item: NavItemType) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all duration-200 touch-manipulation',
                  (pathname === item.href || pathname.startsWith(item.href)) && 'bg-accent text-accent-foreground shadow-sm'
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
  } else if (group.href) {
    // Single direct link
    return (
      <Link key={groupKey} href={group.href}>
        <Button
          variant={isActiveLink ? 'secondary' : 'ghost'}
          size="sm"
          className={cn(
            'h-7 gap-1.5 text-xs px-2.5 font-medium transition-all duration-200 hover:scale-[1.02] touch-manipulation',
            isActiveLink && 'bg-accent/80 text-accent-foreground shadow-sm'
          )}
        >
          <group.icon className="h-3.5 w-3.5" />
          {group.label}
        </Button>
      </Link>
    );
  }

  return null;
}

export default function CompactNavHeader() {
  const pathname = usePathname();
  const [commandOpen, setCommandOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);

  useEffect(() => {
    interface HandleKeyDownEvent extends KeyboardEvent {
      key: string;
      shiftKey: boolean;
      ctrlKey: boolean;
      metaKey: boolean;
      preventDefault(): void;
    }

    const handleKeyDown = (event: HandleKeyDownEvent): void => {
      if (event.key === 'Escape' && isNavVisible) {
        setIsNavVisible(false);
        return;
      }
      if (event.key === 'N' && event.shiftKey && (event.ctrlKey || event.metaKey) && !isNavVisible) {
        event.preventDefault();
        setIsNavVisible(true);
        return;
      }
      if (event.key === '`' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        setIsNavVisible(prev => !prev);
        return;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNavVisible]);

  useEffect(() => {
    if(pathname.startsWith('/reports/share')) {
      setIsNavVisible(false);
    }
  }, [pathname]);
            
  return (
    <>
      <header id='navbar' className={cn(
        'fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl transition-transform duration-300 ease-in-out',
        isNavVisible ? 'translate-y-0' : '-translate-y-full'
      )}>
        <div className="flex h-11 items-center justify-between px-4">
          <div className="flex items-center gap-1">
            <Link href="/">
              <Button variant={pathname === '/' ? 'secondary' : 'ghost'} size="sm" className="h-7 text-xs px-2.5 font-medium">
                <Monitor className="h-3.5 w-3.5" /> Pos
              </Button>
            </Link>
            <div className="hidden md:flex items-center gap-0.5">
              {Object.entries(navigationGroups).map(([key, group]) => (
                <NavItem key={key} groupKey={key} group={group} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-x-4">
            <Link href="/calendar">
              <Button variant={pathname === '/calendar' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2.5 text-xs font-medium">
                <Calendar className="h-3.5 w-3.5" />
                Calendar
              </Button>
            </Link>
            <div className="hidden sm:block"><CommandPalette /></div>
            <ModeToggle />
            <Link href="/notifications">
              <Button variant="ghost" size="sm" className="relative h-7 w-7 p-0">
                <Bell className="h-3.5 w-3.5" />
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] text-primary-foreground animate-pulse">5</span>
              </Button>
            </Link>
            <LanguageSelect />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full">
                  <User className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <div className={cn('transition-all duration-300 ease-in-out', isNavVisible ? 'h-11' : 'h-0')} />
    </>
  );
}

"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  User,
  Package,
  ShoppingCart,
  Users,
  Scissors,
  BarChart4,
  Bell,
  Tag,
  FileText,
  PlusCircle,
  LogOut,
  HelpCircle,
  Home,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"


export default function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, setOpen])

  const runCommand = React.useCallback(
    (command: () => void) => {
      setOpen(false)
      command()
    },
    [setOpen],
  )

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Pages">
          <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/pos"))}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>Point of Sale</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/inventory"))}>
            <Package className="mr-2 h-4 w-4" />
            <span>Inventory</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/customers"))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Customers</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/staff"))}>
            <User className="mr-2 h-4 w-4" />
            <span>Staff</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/tailoring"))}>
            <Scissors className="mr-2 h-4 w-4" />
            <span>Tailoring</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/sales"))}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Sales</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/reports"))}>
            <BarChart4 className="mr-2 h-4 w-4" />
            <span>Reports</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/calendar"))}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/promotions"))}>
            <Tag className="mr-2 h-4 w-4" />
            <span>Promotions</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/invoices"))}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Invoices</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/notifications"))}>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runCommand(() => router.push("/pos"))}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>New Sale</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/inventory/add"))}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Add Inventory Item</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/customers/add"))}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Add Customer</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/staff/add"))}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Add Staff Member</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/calendar?action=new"))}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Create Event</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/promotions?tab=create"))}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Create Promotion</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Tools">
          <CommandItem onSelect={() => runCommand(() => router.push("/terminal"))}>
            <Calculator className="mr-2 h-4 w-4" />
            <span>Calculator</span>
            <CommandShortcut>⌘C</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => window.open("https://help.nubras.com", "_blank"))}>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Account">
          <CommandItem onSelect={() => runCommand(() => router.push("/auth/login"))}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
            <CommandShortcut>⇧⌘Q</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

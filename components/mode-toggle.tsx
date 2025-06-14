"use client"

import React from "react"
import { Computer, Lightbulb, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import {Button} from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
   const [mounted, setMounted] = React.useState(false);

  // Only show after mounting on client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // now theme is stable and you won’t mis-match SSR vs CSR
  const icon =
    theme === "light"
      ? <Lightbulb />
      : theme === "dark"
      ? <Moon />
      : <Computer />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="relative h-7 w-7 p-0">
           {icon}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[999] bg-white dark:text-black">
        <DropdownMenuItem onClick={() => setTheme("light")} className=" flex gap-1">
          <Lightbulb /> Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="flex gap-1">
           <Moon /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className=" flex gap-1">
          <Computer /> System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

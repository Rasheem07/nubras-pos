"use client"

import * as React from "react"
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="default">
           {theme == "light" ? <Lightbulb /> : theme == "dark" ? <Moon /> : <Computer /> } {theme?.charAt(0).toUpperCase().concat(theme.slice(1))}
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

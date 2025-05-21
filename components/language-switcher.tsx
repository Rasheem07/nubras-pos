"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

type Language = {
  code: string
  name: string
  flag: string
  dir: "ltr" | "rtl"
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "ar", name: "العربية", flag: "🇦🇪", dir: "rtl" },
]

export function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState<Language>(languages[0])

  useEffect(() => {
    // Get language from localStorage or default to English
    const savedLang = localStorage.getItem("language") || "en"
    const lang = languages.find((l) => l.code === savedLang) || languages[0]
    setCurrentLang(lang)

    // Set direction attribute on document
    document.documentElement.dir = lang.dir
    document.documentElement.lang = lang.code
  }, [])

  const switchLanguage = (lang: Language) => {
    setCurrentLang(lang)
    localStorage.setItem("language", lang.code)
    document.documentElement.dir = lang.dir
    document.documentElement.lang = lang.code

    // In a real app, this would trigger a re-render with translated content
    // or redirect to a localized version of the page
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => switchLanguage(lang)}
            className={currentLang.code === lang.code ? "bg-muted" : ""}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

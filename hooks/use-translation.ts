"use client"

import { useState, useEffect } from "react"
import { getTranslation } from "@/lib/translations"

export function useTranslation() {
  const [language, setLanguage] = useState<string>("en")

  useEffect(() => {
    // Get language from localStorage or default to English
    const savedLang = localStorage.getItem("language") || "en"
    setLanguage(savedLang)

    // Listen for language changes
    const handleStorageChange = () => {
      const currentLang = localStorage.getItem("language") || "en"
      setLanguage(currentLang)
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const t = (key: any) => getTranslation(key, language)

  return { t, language }
}

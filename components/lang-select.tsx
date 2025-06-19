'use client';

import { useState, useEffect } from "react";
import Cookie from "js-cookie";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

// Define supported languages for UAE audience
const languages = [
  { label: "Arabic", value: "ar", emoji: "🇦🇪" },
  { label: "English", value: "en", emoji: "🇬🇧" },
  { label: "Urdu", value: "ur", emoji: "🇵🇰" },
  { label: "Hindi", value: "hi", emoji: "🇮🇳" },
  { label: "Malayalam", value: "ml", emoji: "🇮🇳" },
  { label: "Tagalog", value: "tl", emoji: "🇵🇭" },
];

export default function LanguageSelect() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const cookieLang = Cookie.get("lang");
    if (cookieLang && languages.some((l) => l.value === cookieLang)) {
      setLang(cookieLang);
    }
  }, []);

  const handleChange = (value: string) => {
    setLang(value);
    // Persist language choice for 1 year
    Cookie.set("lang", value, { expires: 365, sameSite: "lax" });
    // Refresh data to apply the translation interceptor
    window.location.reload(); // or use router.refresh() if you want to keep the SPA behavior
    // router.refresh();
  };

  const current = languages.find((l) => l.value === lang) || languages[0];

  return (
    <Select value={lang} onValueChange={handleChange}>
      <SelectTrigger className=" py-0.5 px-2 h-8" aria-label="Select Language">
        <SelectValue>
          <span className="mr-2">{current.emoji}</span> {current.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((l) => (
          <SelectItem key={l.value} value={l.value}>
            <span className="mr-2">{l.emoji}</span> {l.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

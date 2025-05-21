"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SearchResult {
  id: string
  title: string
  type: "product" | "customer" | "order" | "staff" | "invoice"
  subtitle: string
  relevance: number
}

export function NLPSearch() {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Sample data for search results
  const sampleData: SearchResult[] = [
    {
      id: "p1",
      title: "Premium Kandura",
      type: "product",
      subtitle: "SKU: KAN-001 | Stock: 24",
      relevance: 0.95,
    },
    {
      id: "p2",
      title: "Luxury Abaya",
      type: "product",
      subtitle: "SKU: ABA-001 | Stock: 18",
      relevance: 0.92,
    },
    {
      id: "c1",
      title: "Ahmed Al Mansouri",
      type: "customer",
      subtitle: "Customer ID: C-1001 | Orders: 5",
      relevance: 0.88,
    },
    {
      id: "o1",
      title: "Order #1234",
      type: "order",
      subtitle: "Status: Processing | Date: May 15, 2024",
      relevance: 0.85,
    },
    {
      id: "s1",
      title: "Fatima Al Zaabi",
      type: "staff",
      subtitle: "Role: Tailor | Department: Production",
      relevance: 0.82,
    },
    {
      id: "i1",
      title: "Invoice #INV-2345",
      type: "invoice",
      subtitle: "Amount: AED 1,250 | Status: Paid",
      relevance: 0.78,
    },
  ]

  // Simulated NLP search function
  const performSearch = (searchQuery: string) => {
    setIsSearching(true)

    // Simulate API call delay
    setTimeout(() => {
      if (searchQuery.trim() === "") {
        setResults([])
        setIsSearching(false)
        return
      }

      // Simple search logic - in a real app, this would be a call to an NLP backend
      const filteredResults = sampleData
        .filter((item) => {
          const searchLower = searchQuery.toLowerCase()
          return (
            item.title.toLowerCase().includes(searchLower) ||
            item.subtitle.toLowerCase().includes(searchLower) ||
            item.type.toLowerCase().includes(searchLower)
          )
        })
        .sort((a, b) => b.relevance - a.relevance)

      setResults(filteredResults)
      setIsSearching(false)
    }, 500)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleFocus = () => {
    setIsOpen(true)
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setIsOpen(false)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "product":
        return "bg-blue-500 hover:bg-blue-600"
      case "customer":
        return "bg-green-500 hover:bg-green-600"
      case "order":
        return "bg-purple-500 hover:bg-purple-600"
      case "staff":
        return "bg-amber-500 hover:bg-amber-600"
      case "invoice":
        return "bg-rose-500 hover:bg-rose-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <div className="relative w-full md:w-2/3 lg:w-1/2" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products, customers, orders..."
          className="w-full appearance-none bg-background pl-8 shadow-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
        />
        {query && (
          <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-9 w-9" onClick={clearSearch}>
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-background p-2 shadow-md">
          {isSearching ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              <div className="px-2 text-xs font-medium text-muted-foreground">
                {results.length} result{results.length !== 1 ? "s" : ""} found
              </div>
              {results.map((result) => (
                <div
                  key={result.id}
                  className="flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-muted"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className={cn("text-white", getTypeColor(result.type))}>
                        {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                      </Badge>
                      <div className="font-medium">{result.title}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{result.subtitle}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{Math.round(result.relevance * 100)}% match</div>
                </div>
              ))}
            </div>
          ) : query ? (
            <div className="p-4 text-center text-sm text-muted-foreground">No results found</div>
          ) : (
            <div className="space-y-2 p-2">
              <div className="text-xs font-medium text-muted-foreground">Try searching for:</div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer" onClick={() => setQuery("kandura")}>
                  Kandura
                </Badge>
                <Badge variant="outline" className="cursor-pointer" onClick={() => setQuery("ahmed")}>
                  Ahmed
                </Badge>
                <Badge variant="outline" className="cursor-pointer" onClick={() => setQuery("order")}>
                  Recent Orders
                </Badge>
                <Badge variant="outline" className="cursor-pointer" onClick={() => setQuery("low stock")}>
                  Low Stock
                </Badge>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

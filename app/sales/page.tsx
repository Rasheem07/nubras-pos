import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag, Search, Filter } from "lucide-react"
import { SalesTable } from "./sales-table"
import Link from "next/link"

export default function SalesPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
        <Button asChild>
          <Link href="/terminal">
            <ShoppingBag className="mr-2 h-4 w-4" />
            New Sale
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search sales by customer, order ID, or product..."
            className="pl-8 w-full md:w-[300px] lg:w-[400px]"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
          <span className="sr-only">Filter</span>
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Sales</TabsTrigger>
          <TabsTrigger value="walk-in">Walk-in</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Orders</TabsTrigger>
          <TabsTrigger value="tailoring">Tailoring</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <SalesTable />
        </TabsContent>
        <TabsContent value="walk-in" className="space-y-4">
          <SalesTable filter="walk-in" />
        </TabsContent>
        <TabsContent value="bulk" className="space-y-4">
          <SalesTable filter="bulk" />
        </TabsContent>
        <TabsContent value="tailoring" className="space-y-4">
          <SalesTable filter="tailoring" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

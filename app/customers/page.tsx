import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, User } from "lucide-react"
import { CustomerTable } from "./customer-table"

export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <Button>
          <User className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers by name, phone, or email..."
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
          <TabsTrigger value="all">All Customers</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="vip">VIP</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <CustomerTable />
        </TabsContent>
        <TabsContent value="active" className="space-y-4">
          <CustomerTable filter="active" />
        </TabsContent>
        <TabsContent value="vip" className="space-y-4">
          <CustomerTable filter="vip" />
        </TabsContent>
        <TabsContent value="new" className="space-y-4">
          <CustomerTable filter="new" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Search, Filter, Banknote } from "lucide-react";
import { SalesTable } from "./sales-table";
import { SalesOverview } from "./sales-overview";
import Link from "next/link";

export default function SalesPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Orders</h1>
          <p className="text-muted-foreground">
            Manage and track all sales orders and invoices
          </p>
        </div>
        <div className="flex gap-x-6">
          <Button variant={"outline"} asChild>
            <Link href="/sales/transactions">
              <Banknote className="mr-2 h-4 w-4" />
              Sales transactions
            </Link>
          </Button>
          <Button asChild>
            <Link href="/terminal">
              <ShoppingBag className="mr-2 h-4 w-4" />
              New Sale
            </Link>
          </Button>
        </div>
      </div>

      {/* Sales Overview Analytics */}
      <SalesOverview />

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by invoice ID, customer name, or sales person..."
            className="pl-8 w-full md:w-[400px] lg:w-[500px]"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
          <span className="sr-only">Filter</span>
        </Button>
      </div>

      {/* Sales Orders Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <SalesTable filter="all" />
        </TabsContent>
        <TabsContent value="draft" className="space-y-4">
          <SalesTable filter="draft" />
        </TabsContent>
        <TabsContent value="confirmed" className="space-y-4">
          <SalesTable filter="confirmed" />
        </TabsContent>
        <TabsContent value="processing" className="space-y-4">
          <SalesTable filter="processing" />
        </TabsContent>
        <TabsContent value="overdue" className="space-y-4">
          <SalesTable filter="overdue" />
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <SalesTable filter="completed" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

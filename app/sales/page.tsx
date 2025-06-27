import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Search, Filter, Banknote } from "lucide-react";
import { SalesTable } from "./sales-table";
import { SalesOverview } from "./sales-overview";
import Link from "next/link";

export default function SalesPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 ">
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
            <Link href="/">
              <ShoppingBag className="mr-2 h-4 w-4" />
              New Sale
            </Link>
          </Button>
        </div>
      </div>

      {/* Sales Overview Analytics */}
      <SalesOverview />

      {/* Sales Orders */}
      <SalesTable />
    </div>
  );
}
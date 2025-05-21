import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Scissors } from "lucide-react"
import { TailoringTable } from "./tailoring-table"

export default function TailoringPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tailoring Projects</h1>
        <Button>
          <Scissors className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects by customer, ID, or tailor..."
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
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="delayed">Delayed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <TailoringTable />
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          <TailoringTable filter="pending" />
        </TabsContent>
        <TabsContent value="in-progress" className="space-y-4">
          <TailoringTable filter="in-progress" />
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <TailoringTable filter="completed" />
        </TabsContent>
        <TabsContent value="delayed" className="space-y-4">
          <TailoringTable filter="delayed" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Filter, Scissors } from "lucide-react";
import { TailoringTable } from "./tailoring-table";
import { TailoringAnalytics } from "./tailoring-analytics";
import Link from "next/link";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function TailoringPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rushOnly, setRushOnly] = useState(false);
  const [tailorFilter, setTailorFilter] = useState("");
  const [beforeDate, setBeforeDate] = useState("");

  return (
    <div className="flex flex-col gap-8 md:p-6 p-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Tailoring Operations
          </h1>
          <p className="text-gray-600 mt-1">
            Manage projects, track progress, and monitor performance
          </p>
        </div>
        <Link href="/tailoring/new">
          <Button>
            <Scissors className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Analytics Overview */}
      <TailoringAnalytics />

      {/* Search and Filters */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="pt-6 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search projects by customer, ID, or tailor..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Filter className="mr-2 h-4 w-4" /> Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-4" align="end">
              <div className="flex flex-col gap-3">
                <div className="flex items-center">
                  <Checkbox
                    id="rush"
                    checked={rushOnly}
                    onChange={(e) => setRushOnly((e.target as HTMLInputElement).checked)}
                  />
                  <Label htmlFor="rush" className="ml-2">
                    Rush Only
                  </Label>
                </div>
                <div>
                  <Label htmlFor="tailorFilter">Tailor Name</Label>
                  <Input
                    id="tailorFilter"
                    placeholder="e.g. John"
                    value={tailorFilter}
                    onChange={(e) => setTailorFilter(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="beforeDate">Deadline Before</Label>
                  <Input
                    id="beforeDate"
                    type="date"
                    value={beforeDate}
                    onChange={(e) => setBeforeDate(e.target.value)}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {/* Projects Table with Tabs */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200 bg-gray-50/50">
          <CardTitle className="text-xl text-gray-900">
            Project Management
          </CardTitle>
          <CardDescription className="text-gray-600">
            Track and manage all tailoring projects across different stages
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full">
            <div className="border-b border-gray-200 px-6">
              <TabsList className="bg-transparent border-none p-0 h-auto">
                <TabsTrigger
                  value="all"
                  className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-4 py-3"
                >
                  All Projects
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-4 py-3"
                >
                  Pending
                </TabsTrigger>
                <TabsTrigger
                  value="in-progress"
                  className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-4 py-3"
                >
                  In Progress
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-4 py-3"
                >
                  Completed
                </TabsTrigger>
                <TabsTrigger
                  value="delayed"
                  className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-4 py-3"
                >
                  Delayed
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="p-6">
              <TabsContent value="all" className="mt-0">
                <TailoringTable />
              </TabsContent>
              <TabsContent value="pending" className="mt-0">
                <TailoringTable filterStatus="pending" />
              </TabsContent>
              <TabsContent value="in-progress" className="mt-0">
                <TailoringTable filterStatus="in-progress" />
              </TabsContent>
              <TabsContent value="completed" className="mt-0">
                <TailoringTable filterStatus="completed" />
              </TabsContent>
              <TabsContent value="delayed" className="mt-0">
                <TailoringTable filterStatus="delayed" />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, AlertTriangle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

type ProjectStatus = "pending" | "in-progress" | "completed" | "delayed"

type TailoringProject = {
  id: number;
  customer: string;
  description: string;
  deadline: string; // ISO timestamp
  rush: boolean;
  status: 'pending' | 'in-progress' | 'completed' | string;
  progress: number; // 0 to 100
  tailor: string;
  tailorLevel: number;
  createdAt: Date;
};

interface TailoringTableProps {
  filter?: ProjectStatus
}

export function TailoringTable({ filter }: TailoringTableProps) {
  const {data: projects = [], isLoading} = useQuery<TailoringProject[]>({
    queryKey: ['project'],
    queryFn: async () => {
      const response = await fetch("https://api.alnubras.co/api/v1/tailoring");
      const json = await response.json();
      if(!response.ok) { 
        toast.error("Failed to load projects!")
      }
      return json;
    }
  })
  const filteredProjects = filter ? projects.filter((project) => project.status === filter) : projects

  const handleUpdateProgress = (projectId: number) => {
    // Implementation for updating progress
    console.log("Update progress for:", projectId)
  }

  const handleReassignTailor = (projectId: number) => {
    // Implementation for reassigning tailor
    console.log("Reassign tailor for:", projectId)
  }

  const handleToggleRush = (projectId: number, isRush: boolean) => {
    // Implementation for toggling rush status
    console.log("Toggle rush status for:", projectId, isRush)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "in-progress":
        return <Badge variant="secondary">In Progress</Badge>
      case "completed":
        return <Badge variant="default">Completed</Badge>
      case "delayed":
        return <Badge variant="destructive">Delayed</Badge>
      default:
        return null
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Tailor</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProjects.map((project: TailoringProject) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">
                {project.id}
                {project.rush && (
                  <Badge
                    variant="outline"
                    className="ml-2 bg-amber-50 text-amber-700 border-amber-200 flex gap-1 items-center"
                  >
                    <AlertTriangle className="h-3 w-3" />
                    Rush
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                  {project.customer}
              </TableCell>
              <TableCell>{project.description}</TableCell>
              <TableCell>{new Date(project.deadline).toLocaleDateString()}</TableCell>
              <TableCell>{getStatusBadge(project.status)}</TableCell>
              <TableCell>
                <div className="w-[100px]">
                  <Progress value={project.progress} className="h-2 bg-gray-300" />
                  <div className="text-xs text-muted-foreground mt-1">{project.progress}% complete</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={"/placeholder.svg"} alt={project.tailor} />
                    <AvatarFallback>{project.tailor.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm">{project.tailor}</div>
                    <div className="text-xs text-muted-foreground">Level {project.tailorLevel}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/tailoring/${project.id}`}>View details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateProgress(project.id)}>
                      Update progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleReassignTailor(project.id)}>
                      Reassign tailor
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {project.rush ? (
                      <DropdownMenuItem onClick={() => handleToggleRush(project.id, false)}>
                        Remove rush status
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem className="text-amber-600" onClick={() => handleToggleRush(project.id, true)}>
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Mark as rush
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

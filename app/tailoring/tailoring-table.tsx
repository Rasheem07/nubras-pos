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

type ProjectStatus = "pending" | "in-progress" | "completed" | "delayed"

interface TailoringProject {
  id: string
  customer: {
    name: string
    initials: string
    image?: string
  }
  description: string
  deadline: string
  status: ProjectStatus
  progress: number
  tailor: {
    name: string
    initials: string
    image?: string
    level: number
  }
  isRush: boolean
  createdAt: string
}

const projects: TailoringProject[] = [
  {
    id: "TP-001",
    customer: {
      name: "Fatima Mohammed",
      initials: "FM",
      image: "/frequency-modulation-spectrum.png",
    },
    description: "2 Kanduras (Custom)",
    deadline: "May 10, 2024",
    status: "in-progress",
    progress: 60,
    tailor: {
      name: "Mohammed Ali",
      initials: "MA",
      image: "/stylized-letter-ma.png",
      level: 3,
    },
    isRush: true,
    createdAt: "May 2, 2024",
  },
  {
    id: "TP-002",
    customer: {
      name: "Ahmed Al Mansouri",
      initials: "AM",
      image: "/abstract-am.png",
    },
    description: "1 Kandura (Alterations)",
    deadline: "May 12, 2024",
    status: "pending",
    progress: 0,
    tailor: {
      name: "Khalid Rahman",
      initials: "KR",
      image: "/placeholder.svg?key=vwu58",
      level: 2,
    },
    isRush: false,
    createdAt: "May 4, 2024",
  },
  {
    id: "TP-003",
    customer: {
      name: "Layla Khan",
      initials: "LK",
      image: "/abstract-geometric-lk.png",
    },
    description: "1 Abaya (Custom)",
    deadline: "May 8, 2024",
    status: "delayed",
    progress: 40,
    tailor: {
      name: "Aisha Mahmood",
      initials: "AM",
      image: "/abstract-am.png",
      level: 3,
    },
    isRush: false,
    createdAt: "Apr 28, 2024",
  },
  {
    id: "TP-004",
    customer: {
      name: "Hassan Al Farsi",
      initials: "HA",
      image: "/ha-characters.png",
    },
    description: "5 Kanduras (Bulk Order)",
    deadline: "May 15, 2024",
    status: "in-progress",
    progress: 30,
    tailor: {
      name: "Yusuf Qasim",
      initials: "YQ",
      image: "/placeholder.svg?key=kyir9",
      level: 3,
    },
    isRush: false,
    createdAt: "May 1, 2024",
  },
  {
    id: "TP-005",
    customer: {
      name: "Sara Al Ameri",
      initials: "SA",
      image: "/abstract-geometric-sa.png",
    },
    description: "1 Custom Abaya (Rush)",
    deadline: "May 6, 2024",
    status: "completed",
    progress: 100,
    tailor: {
      name: "Fatima Zahra",
      initials: "FZ",
      image: "/abstract-fz.png",
      level: 3,
    },
    isRush: true,
    createdAt: "May 3, 2024",
  },
  {
    id: "TP-006",
    customer: {
      name: "Mariam Al Hashimi",
      initials: "MH",
      image: "/stylized-mh.png",
    },
    description: "3 Custom Abayas",
    deadline: "May 20, 2024",
    status: "in-progress",
    progress: 15,
    tailor: {
      name: "Aisha Mahmood",
      initials: "AM",
      image: "/abstract-am.png",
      level: 3,
    },
    isRush: false,
    createdAt: "May 4, 2024",
  },
]

interface TailoringTableProps {
  filter?: ProjectStatus
}

export function TailoringTable({ filter }: TailoringTableProps) {
  const filteredProjects = filter ? projects.filter((project) => project.status === filter) : projects

  const handleUpdateProgress = (projectId: string) => {
    // Implementation for updating progress
    console.log("Update progress for:", projectId)
  }

  const handleReassignTailor = (projectId: string) => {
    // Implementation for reassigning tailor
    console.log("Reassign tailor for:", projectId)
  }

  const handleToggleRush = (projectId: string, isRush: boolean) => {
    // Implementation for toggling rush status
    console.log("Toggle rush status for:", projectId, isRush)
  }

  const getStatusBadge = (status: ProjectStatus) => {
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
          {filteredProjects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">
                {project.id}
                {project.isRush && (
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
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={project.customer.image || "/placeholder.svg"} alt={project.customer.name} />
                    <AvatarFallback>{project.customer.initials}</AvatarFallback>
                  </Avatar>
                  <span>{project.customer.name}</span>
                </div>
              </TableCell>
              <TableCell>{project.description}</TableCell>
              <TableCell>{project.deadline}</TableCell>
              <TableCell>{getStatusBadge(project.status)}</TableCell>
              <TableCell>
                <div className="w-[100px]">
                  <Progress value={project.progress} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">{project.progress}% complete</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={project.tailor.image || "/placeholder.svg"} alt={project.tailor.name} />
                    <AvatarFallback>{project.tailor.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm">{project.tailor.name}</div>
                    <div className="text-xs text-muted-foreground">Level {project.tailor.level}</div>
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
                    {project.isRush ? (
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

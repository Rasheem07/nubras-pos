"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, AlertTriangle } from "lucide-react"

type TailorAssignment = {
  id: string
  customer: {
    name: string
    initials: string
    image?: string
  }
  orderType: string
  deadline: string
  status: "pending" | "in-progress" | "completed" | "delayed"
  tailor: {
    name: string
    initials: string
    image?: string
    level: number
  }
  isRush: boolean
}

const assignments: TailorAssignment[] = [
  {
    id: "TA-001",
    customer: {
      name: "Fatima Mohammed",
      initials: "FM",
      image: "/frequency-modulation-spectrum.png",
    },
    orderType: "2 Kanduras (Custom)",
    deadline: "May 10, 2024",
    status: "in-progress",
    tailor: {
      name: "Mohammed Ali",
      initials: "MA",
      image: "/stylized-letter-ma.png",
      level: 3,
    },
    isRush: true,
  },
  {
    id: "TA-002",
    customer: {
      name: "Ahmed Al Mansouri",
      initials: "AM",
      image: "/abstract-am.png",
    },
    orderType: "1 Kandura (Alterations)",
    deadline: "May 12, 2024",
    status: "pending",
    tailor: {
      name: "Khalid Rahman",
      initials: "KR",
      image: "/placeholder.svg?key=k7rxp",
      level: 2,
    },
    isRush: false,
  },
  {
    id: "TA-003",
    customer: {
      name: "Layla Khan",
      initials: "LK",
      image: "/abstract-geometric-lk.png",
    },
    orderType: "1 Abaya (Custom)",
    deadline: "May 8, 2024",
    status: "delayed",
    tailor: {
      name: "Aisha Mahmood",
      initials: "AM",
      image: "/abstract-am.png",
      level: 3,
    },
    isRush: false,
  },
  {
    id: "TA-004",
    customer: {
      name: "Hassan Al Farsi",
      initials: "HA",
      image: "/ha-characters.png",
    },
    orderType: "5 Kanduras (Bulk Order)",
    deadline: "May 15, 2024",
    status: "in-progress",
    tailor: {
      name: "Yusuf Qasim",
      initials: "YQ",
      image: "/placeholder.svg?key=4ul10",
      level: 3,
    },
    isRush: false,
  },
  {
    id: "TA-005",
    customer: {
      name: "Sara Al Ameri",
      initials: "SA",
      image: "/abstract-geometric-sa.png",
    },
    orderType: "1 Custom Abaya (Rush)",
    deadline: "May 6, 2024",
    status: "completed",
    tailor: {
      name: "Fatima Zahra",
      initials: "FZ",
      image: "/abstract-fz.png",
      level: 3,
    },
    isRush: true,
  },
]

export function TailorAssignments() {
  const [assignmentsList, setAssignmentsList] = useState<TailorAssignment[]>(assignments)

  const getStatusBadge = (status: TailorAssignment["status"]) => {
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
    <div className="space-y-4">
      {assignmentsList.map((assignment) => (
        <Card key={assignment.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center p-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={assignment.customer.image || "/placeholder.svg"} alt={assignment.customer.name} />
                  <AvatarFallback>{assignment.customer.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{assignment.customer.name}</div>
                  <div className="text-sm text-muted-foreground">{assignment.orderType}</div>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-4">
                {assignment.isRush && (
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-700 border-amber-200 flex gap-1 items-center"
                  >
                    <AlertTriangle className="h-3 w-3" />
                    Rush
                  </Badge>
                )}
                <div className="text-sm">Due: {assignment.deadline}</div>
                {getStatusBadge(assignment.status)}
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={assignment.tailor.image || "/placeholder.svg"} alt={assignment.tailor.name} />
                    <AvatarFallback>{assignment.tailor.initials}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    {assignment.tailor.name}
                    <span className="ml-1 text-xs text-muted-foreground">(L{assignment.tailor.level})</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Reassign Tailor</DropdownMenuItem>
                    <DropdownMenuItem>Update Status</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Mark as Urgent</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

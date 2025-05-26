"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Store,
  MapPin,
  Monitor,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Settings,
  Wifi,
  WifiOff,
  Power,
  PowerOff,
  User,
} from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data
const stores = [
  {
    id: 1,
    name: "Main Store - Downtown",
    location: "123 Business District, City Center, State 12345",
    status: "active",
    terminals: 3,
    activeSessions: 2,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Branch Store - Mall",
    location: "Shopping Mall Level 2, Unit 205, Mall District",
    status: "active",
    terminals: 2,
    activeSessions: 1,
    createdAt: "2024-02-01",
  },
  {
    id: 3,
    name: "Outlet Store - Airport",
    location: "International Airport Terminal 1, Gate Area B",
    status: "inactive",
    terminals: 1,
    activeSessions: 0,
    createdAt: "2024-03-10",
  },
]

const terminals = [
  {
    id: 1,
    name: "Terminal 01",
    storeId: 1,
    storeName: "Main Store - Downtown",
    deviceIdentifier: "POS-MAIN-001",
    status: "online",
    currentSession: "Session #1234",
    lastActivity: "2 minutes ago",
    assignedUser: {
      id: 1,
      name: "John Doe",
      email: "john.doe@company.com",
      role: "Cashier",
      avatar: "/placeholder.svg?height=32&width=32&query=user+avatar",
    },
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Terminal 02",
    storeId: 1,
    storeName: "Main Store - Downtown",
    deviceIdentifier: "POS-MAIN-002",
    status: "online",
    currentSession: "Session #1235",
    lastActivity: "5 minutes ago",
    assignedUser: {
      id: 2,
      name: "Sarah Wilson",
      email: "sarah.wilson@company.com",
      role: "Senior Cashier",
      avatar: "/placeholder.svg?height=32&width=32&query=user+avatar",
    },
    createdAt: "2024-01-15",
  },
  {
    id: 3,
    name: "Terminal 03",
    storeId: 1,
    storeName: "Main Store - Downtown",
    deviceIdentifier: "POS-MAIN-003",
    status: "offline",
    currentSession: null,
    lastActivity: "2 hours ago",
    assignedUser: null,
    createdAt: "2024-01-20",
  },
  {
    id: 4,
    name: "Terminal 01",
    storeId: 2,
    storeName: "Branch Store - Mall",
    deviceIdentifier: "POS-MALL-001",
    status: "online",
    currentSession: "Session #1236",
    lastActivity: "1 minute ago",
    assignedUser: {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      role: "Cashier",
      avatar: "/placeholder.svg?height=32&width=32&query=user+avatar",
    },
    createdAt: "2024-02-01",
  },
  {
    id: 5,
    name: "Terminal 02",
    storeId: 2,
    storeName: "Branch Store - Mall",
    deviceIdentifier: "POS-MALL-002",
    status: "offline",
    currentSession: null,
    lastActivity: "30 minutes ago",
    assignedUser: null,
    createdAt: "2024-02-01",
  },
]

// Add available users data
const availableUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Cashier",
    status: "active",
    assignedTerminal: 1,
  },
  {
    id: 2,
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    role: "Senior Cashier",
    status: "active",
    assignedTerminal: 2,
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    role: "Cashier",
    status: "active",
    assignedTerminal: 4,
  },
  {
    id: 4,
    name: "Emma Davis",
    email: "emma.davis@company.com",
    role: "Cashier",
    status: "active",
    assignedTerminal: null,
  },
  {
    id: 5,
    name: "Alex Brown",
    email: "alex.brown@company.com",
    role: "Cashier",
    status: "active",
    assignedTerminal: null,
  },
]

export default function StoresPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("stores")
  const [isStoreDialogOpen, setIsStoreDialogOpen] = useState(false)
  const [isTerminalDialogOpen, setIsTerminalDialogOpen] = useState(false)
  const [editingStore, setEditingStore] = useState<any>(null)
  const [editingTerminal, setEditingTerminal] = useState<any>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "online":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
      case "inactive":
      case "offline":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Inactive</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <Wifi className="h-4 w-4 text-green-600" />
      case "offline":
        return <WifiOff className="h-4 w-4 text-red-600" />
      default:
        return <Monitor className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Store & Terminal Management</h1>
          <p className="text-muted-foreground">Configure and manage your stores and POS terminals</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stores.length}</div>
            <p className="text-xs text-muted-foreground">{stores.filter((s) => s.status === "active").length} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Terminals</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{terminals.length}</div>
            <p className="text-xs text-muted-foreground">
              {terminals.filter((t) => t.status === "online").length} online
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Power className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stores.reduce((sum, store) => sum + store.activeSessions, 0)}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offline Terminals</CardTitle>
            <PowerOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{terminals.filter((t) => t.status === "offline").length}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{terminals.filter((t) => t.assignedUser).length}</div>
            <p className="text-xs text-muted-foreground">
              {terminals.filter((t) => !t.assignedUser).length} unassigned
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="stores">Stores</TabsTrigger>
          <TabsTrigger value="terminals">Terminals</TabsTrigger>
        </TabsList>

        <TabsContent value="stores" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Store Locations</h2>
            <Dialog open={isStoreDialogOpen} onOpenChange={setIsStoreDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingStore(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Store
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingStore ? "Edit Store" : "Add New Store"}</DialogTitle>
                  <DialogDescription>
                    {editingStore ? "Update store information" : "Create a new store location"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Store Name</Label>
                    <Input id="name" placeholder="Enter store name" defaultValue={editingStore?.name || ""} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Textarea
                      id="location"
                      placeholder="Enter full address"
                      defaultValue={editingStore?.location || ""}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={() => setIsStoreDialogOpen(false)}>
                    {editingStore ? "Update Store" : "Create Store"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Terminals</TableHead>
                  <TableHead>Active Sessions</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Store className="mr-2 h-4 w-4 text-muted-foreground" />
                        {store.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-1 h-3 w-3" />
                        {store.location}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(store.status)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{store.terminals} terminals</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={store.activeSessions > 0 ? "default" : "secondary"}>
                        {store.activeSessions} active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{store.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingStore(store)
                              setIsStoreDialogOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Store
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Configure
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Store
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="terminals" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">POS Terminals</h2>
            <Dialog open={isTerminalDialogOpen} onOpenChange={setIsTerminalDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingTerminal(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Terminal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{editingTerminal ? "Edit Terminal" : "Add New Terminal"}</DialogTitle>
                  <DialogDescription>
                    {editingTerminal
                      ? "Update terminal information and user assignment"
                      : "Register a new POS terminal and assign a user"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="terminal-name">Terminal Name</Label>
                    <Input
                      id="terminal-name"
                      placeholder="e.g., Terminal 01"
                      defaultValue={editingTerminal?.name || ""}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="store-select">Store Location</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="">Select a store</option>
                      {stores.map((store) => (
                        <option key={store.id} value={store.id}>
                          {store.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="device-id">Device Identifier</Label>
                    <Input
                      id="device-id"
                      placeholder="e.g., POS-MAIN-001"
                      defaultValue={editingTerminal?.deviceIdentifier || ""}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="user-select">Assigned User</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="">Select a user</option>
                      {availableUsers
                        .filter((user) => !user.assignedTerminal || user.assignedTerminal === editingTerminal?.id)
                        .map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name} - {user.role}
                          </option>
                        ))}
                    </select>
                    <p className="text-xs text-muted-foreground">
                      Only unassigned users are shown. Each terminal can have one assigned user.
                    </p>
                  </div>
                  {editingTerminal?.assignedUser && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={editingTerminal.assignedUser.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {editingTerminal.assignedUser.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{editingTerminal.assignedUser.name}</p>
                          <p className="text-xs text-muted-foreground">{editingTerminal.assignedUser.email}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={() => setIsTerminalDialogOpen(false)}>
                    {editingTerminal ? "Update Terminal" : "Register Terminal"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Terminal</TableHead>
                  <TableHead>Store Location</TableHead>
                  <TableHead>Device ID</TableHead>
                  <TableHead>Assigned User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Current Session</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {terminals.map((terminal) => (
                  <TableRow key={terminal.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {getStatusIcon(terminal.status)}
                        <span className="ml-2">{terminal.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Store className="mr-1 h-3 w-3 text-muted-foreground" />
                        {terminal.storeName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{terminal.deviceIdentifier}</code>
                    </TableCell>
                    <TableCell>
                      {terminal.assignedUser ? (
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={terminal.assignedUser.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">
                              {terminal.assignedUser.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{terminal.assignedUser.name}</span>
                            <span className="text-xs text-muted-foreground">{terminal.assignedUser.role}</span>
                          </div>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-orange-600 border-orange-200">
                          Unassigned
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(terminal.status)}</TableCell>
                    <TableCell>
                      {terminal.currentSession ? (
                        <Badge variant="default">{terminal.currentSession}</Badge>
                      ) : (
                        <Badge variant="secondary">No session</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{terminal.lastActivity}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingTerminal(terminal)
                              setIsTerminalDialogOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Terminal
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            {terminal.assignedUser ? "Change User" : "Assign User"}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Configure
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Terminal
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NewEventPage() {
  const router = useRouter()
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "10:00",
    type: "appointment",
    staff: "",
    location: "",
    customer: "",
  })

  // Staff list
  const staffList = [
    "Ahmed Al Mansouri",
    "Fatima Al Zaabi",
    "Mohammed Al Hashimi",
    "Sara Al Marzooqi",
    "All Staff",
    "Management Team",
    "Marketing Team",
  ]

  // Customer list
  const customerList = [
    "Ahmed Al Mansouri",
    "Fatima Al Zaabi",
    "Sheikh Abdullah",
    "Mariam Al Suwaidi",
    "Khalid Al Blooshi",
    "Noura Al Kaabi",
  ]

  // Location list
  const locationList = ["Main Store", "VIP Lounge", "Conference Room", "Warehouse", "Design Studio", "Training Room"]

  const handleAddEvent = () => {
    // In a real app, this would add the event to the database
    console.log("Adding event:", newEvent)

    // Navigate back to calendar
    router.push("/calendar")
  }

  return (
    <div className="container max-w-2xl py-6">
      <div className="mb-6 flex items-center">
        <Link href="/calendar" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Add New Event</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>Create a new event or appointment in the calendar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              placeholder="Event title"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              placeholder="Event description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Event Type</Label>
              <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appointment">Appointment</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="staff">Assigned Staff</Label>
              <Select value={newEvent.staff} onValueChange={(value) => setNewEvent({ ...newEvent, staff: value })}>
                <SelectTrigger id="staff">
                  <SelectValue placeholder="Select staff" />
                </SelectTrigger>
                <SelectContent>
                  {staffList.map((staff) => (
                    <SelectItem key={staff} value={staff}>
                      {staff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Select
                value={newEvent.location}
                onValueChange={(value) => setNewEvent({ ...newEvent, location: value })}
              >
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locationList.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customer">Customer (if applicable)</Label>
              <Select
                value={newEvent.customer}
                onValueChange={(value) => setNewEvent({ ...newEvent, customer: value })}
              >
                <SelectTrigger id="customer">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {customerList.map((customer) => (
                    <SelectItem key={customer} value={customer}>
                      {customer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/calendar">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button onClick={handleAddEvent}>Save Event</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

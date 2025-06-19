"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Clock, MapPin, Plus, User } from "lucide-react"
import { format, addMonths, subMonths, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isAfter, parseISO } from "date-fns"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { fetchEvents } from "./api"

export type EventType = "appointment" | "meeting" | "task" | string

export interface CalendarEvent {
  id: number
  title: string
  description?: string
  startAt: string      // ISO
  endAt?: string       // ISO
  type: EventType
  staff?: string
  customer?: string
  location?: string
  reminderMins?: number
  createdAt: string
  updatedAt: string
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")

  const { data: eventsRaw = [] } = useQuery<CalendarEvent[]>({
    queryKey: ['events'],
    queryFn: fetchEvents
  })

  // Parse ISO dates to Date objects for easier manipulation
  const events = eventsRaw.map(event => ({
    ...event,
    start: parseISO(event.startAt),
    end: event.endAt ? parseISO(event.endAt) : undefined,
  }))

  // Filter events for the selected date
  const selectedDateEvents = events.filter((event) => isSameDay(event.start, date))

  // Get event badge color based on type
  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case "appointment":
        return "bg-blue-500 hover:bg-blue-600"
      case "meeting":
        return "bg-green-500 hover:bg-green-600"
      case "task":
        return "bg-amber-500 hover:bg-amber-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  // Generate week view days
  const weekDays = eachDayOfInterval({
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  })

  // Generate day view hours
  const dayHours = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM

  // Get upcoming events
  const now = new Date()
  const upcomingEvents = events
    .filter((event) => isAfter(event.start, now))
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, 5)

  // Custom month view rendering
  const renderMonthView = () => {
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 })
    const totalDays = 42 // 6 weeks * 7 days
    const daysToDisplay = Array.from({ length: totalDays }, (_, i) => addDays(startDate, i))

    return (
      <div className="w-full p-4 md:p-6">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center py-2 text-sm font-medium">
              {day}
            </div>
          ))}
        </div>
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {daysToDisplay.map((day, i) => {
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth()
            const isToday = isSameDay(day, new Date())
            const isSelected = isSameDay(day, date)
            const dayEvents = events.filter((event) => isSameDay(event.start, day))

            return (
              <div
                key={i}
                className={`
                  border rounded-md p-1 min-h-[90px] relative
                  ${isCurrentMonth ? "bg-card" : "bg-muted/30 text-muted-foreground"}
                  ${isToday ? "border-primary" : "border-border"}
                  ${isSelected ? "ring-2 ring-primary ring-offset-1" : ""}
                `}
                onClick={() => setDate(day)}
              >
                <div className="text-right text-sm p-1">{format(day, "d")}</div>
                <div className="space-y-1 mt-1 overflow-hidden max-h-[60px]">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={`
                        text-xs px-1 py-0.5 rounded truncate
                        ${
                          event.type === "appointment"
                            ? "bg-blue-100 text-blue-800"
                            : event.type === "meeting"
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                        }
                      `}
                    >
                      {format(event.start, "HH:mm")}{" "}
                      {event.title.length > 15 ? event.title.substring(0, 15) + "..." : event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-center text-muted-foreground">+{dayEvents.length - 3} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Custom week view rendering
  const renderWeekView = () => {
    return (
      <div className="w-full">
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className={`
                border rounded-md p-2 min-h-[500px]
                ${isSameDay(day, new Date()) ? "border-primary" : "border-border"}
                ${isSameDay(day, date) ? "ring-2 ring-primary ring-offset-1" : ""}
              `}
            >
              <div
                className={`
                  text-center p-2 rounded-md mb-2 font-medium
                  ${isSameDay(day, new Date()) ? "bg-primary text-primary-foreground" : ""}
                `}
              >
                {format(day, "EEE")}
                <div>{format(day, "d")}</div>
              </div>
              <div className="space-y-2">
                {events
                  .filter((event) => isSameDay(event.start, day))
                  .sort((a, b) => a.start.getTime() - b.start.getTime())
                  .map((event) => (
                    <div
                      key={event.id}
                      className={`
                        rounded-md p-2 text-left text-xs
                        ${
                          event.type === "appointment"
                            ? "bg-blue-100 text-blue-800"
                            : event.type === "meeting"
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                        }
                      `}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div>{format(event.start, "h:mm a")}</div>
                      <div className="mt-1 text-xs opacity-80">{event.location}</div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Custom day view rendering
  const renderDayView = () => {
    return (
      <div className="w-full">
        <div className="text-center p-2 mb-4 font-medium text-lg">{format(date, "EEEE, MMMM d, yyyy")}</div>
        <div className="space-y-2">
          {dayHours.map((hour) => {
            const hourEvents = events.filter(
              (event) =>
                isSameDay(event.start, date) &&
                (event.start.getHours() === hour ||
                  (event.start.getHours() === hour - 1 && event.start.getMinutes() >= 30)),
            )
            return (
              <div key={hour} className="grid grid-cols-[80px_1fr] gap-4">
                <div className="py-4 text-right text-sm text-muted-foreground">
                  {hour % 12 === 0 ? 12 : hour % 12}:00 {hour >= 12 ? "PM" : "AM"}
                </div>
                <div className="relative min-h-[60px] rounded-md border">
                  {hourEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`
                        absolute left-0 right-0 m-1 rounded-md p-2
                        ${
                          event.type === "appointment"
                            ? "bg-blue-100 text-blue-800"
                            : event.type === "meeting"
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                        }
                      `}
                      style={{
                        top: `${((event.start.getMinutes() % 30) / 30) * 100}%`,
                      }}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-xs">
                        {format(event.start, "h:mm a")} - {event.location}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col space-y-4 overflow-hidden">
      <div className="flex items-center justify-between px-1">
        <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
        <div className="flex items-center gap-2">
          <Link href="/calendar/new-event">
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" />
              New Event
            </Button>
          </Link>
          <Tabs value={view} onValueChange={(v) => setView(v as "month" | "week" | "day")}>
            <TabsList className="h-8">
              <TabsTrigger value="month" className="text-xs">
                Month
              </TabsTrigger>
              <TabsTrigger value="week" className="text-xs">
                Week
              </TabsTrigger>
              <TabsTrigger value="day" className="text-xs">
                Day
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden md:grid-cols-[2fr_1fr]">
        {/* Calendar Section - Scrollable */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
              <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-blue-500 text-white text-xs">
                Appointment
              </Badge>
              <Badge variant="outline" className="bg-green-500 text-white text-xs">
                Meeting
              </Badge>
              <Badge variant="outline" className="bg-amber-500 text-white text-xs">
                Task
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto pb-6 px-2">
            <Tabs value={view} className="h-full">
              <TabsContent value="month" className="h-full mt-0">
                {renderMonthView()}
              </TabsContent>

              <TabsContent value="week" className="h-full mt-0 overflow-auto">
                {renderWeekView()}
              </TabsContent>

              <TabsContent value="day" className="h-full mt-0 overflow-auto">
                {renderDayView()}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Events Section - Scrollable */}
        <div className="flex flex-col space-y-4 overflow-hidden">
          <Card className="flex-1 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Events for {format(date, "MMM d, yyyy")}</CardTitle>
              <CardDescription>
                {selectedDateEvents.length === 0
                  ? "No events scheduled"
                  : `${selectedDateEvents.length} event${selectedDateEvents.length > 1 ? "s" : ""}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto h-[calc(100%-5rem)]">
              <div className="space-y-3">
                {selectedDateEvents.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-4 text-center">
                    <p className="text-sm text-muted-foreground">No events for this day</p>
                    <Link href="/calendar/new-event">
                      <Button variant="outline" className="mt-3" size="sm">
                        <Plus className="mr-1 h-3 w-3" />
                        Add Event
                      </Button>
                    </Link>
                  </div>
                ) : (
                  selectedDateEvents.map((event) => (
                    <div key={event.id} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm">{event.title}</h3>
                        <Badge className={`${getEventBadgeColor(event.type)} text-xs`}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>
                      </div>
                      <div className="mt-2 space-y-1 text-xs">
                        <p className="text-muted-foreground">{event.description}</p>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{format(event.start, "h:mm a")}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.staff && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{event.staff}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="overflow-auto max-h-[200px]">
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <span className="text-xs font-medium">{format(event.start, "d MMM")}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{format(event.start, "EEE, h:mm a")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

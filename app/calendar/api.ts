// src/lib/api.ts
export type EventType = 'appointment' | 'meeting' | 'task';

export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  startAt: string;      // ISO
  endAt?: string;       // ISO
  type: EventType;
  staff?: string;
  customer?: string;
  location?: string;
  reminderMins?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventDto {
  title: string;
  description?: string;
  startAt: string;      // ISO
  endAt?: string;       // ISO
  type: EventType;
  staff?: string;
  customer?: string;
  location?: string;
  reminderMins?: number;
}

export async function fetchEvents(): Promise<CalendarEvent[]> {
  const res = await fetch('https://api.alnubras.co/api/v1/calendar', { credentials: 'include' });
  if (!res.ok) throw new Error('Could not load events');
  return res.json();
}

export async function createEvent(dto: CreateEventDto): Promise<CalendarEvent> {
  const res = await fetch('https://api.alnubras.co/api/v1/calendar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to create event');
  return res.json();
}

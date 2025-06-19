'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

import { createEvent, CreateEventDto, EventType } from '../api';

import {
  Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

export default function NewEventPage() {
  const router = useRouter();
  const today = format(new Date(), 'yyyy-MM-dd');
  const nowTime = format(new Date(), 'HH:mm');

  const [data, setData] = useState({
    title: '',
    description: '',
    date: today,
    time: nowTime,
    endDate: today,
    endTime: nowTime,
    type: 'appointment' as EventType,
    staff: '',
    customer: '',
    location: '',
    reminder: 15,
  });

  const handleSave = async () => {
    const dto: CreateEventDto = {
      title: data.title,
      description: data.description || undefined,
      startAt: new Date(`${data.date}T${data.time}`).toISOString(),
      endAt: data.endDate && data.endTime
        ? new Date(`${data.endDate}T${data.endTime}`).toISOString()
        : undefined,
      type: data.type,
      staff: data.staff || undefined,
      customer: data.customer || undefined,
      location: data.location || undefined,
      reminderMins: data.reminder,
    };
    try {
      await createEvent(dto);
      router.push('/calendar');
    } catch (err) {
      console.error(err);
      alert('Failed to create event');
    }
  };

  // example lists
  const staffList = ['Ahmed','Fatima','Mohammed','Sara','All Staff','Mgmt','Marketing'];
  const customerList = ['Ahmed','Fatima','Sheikh Abdullah','Mariam'];

  return (
    <div className="container max-w-2xl py-6 mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/calendar">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4"/></Button>
        </Link>
        <h1 className="text-2xl font-bold ml-4">Add New Event</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>Schedule your event & reminder</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div className="grid gap-1">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={data.title} onChange={e => setData({...data,title:e.target.value})}/>
          </div>

          {/* Description */}
          <div className="grid gap-1">
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" rows={3}
              value={data.description}
              onChange={e => setData({...data,description:e.target.value})}
            />
          </div>

          {/* Start */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label htmlFor="date">Start Date</Label>
              <Input id="date" type="date" value={data.date}
                onChange={e=>setData({...data,date:e.target.value})}/>
            </div>
            <div className="grid gap-1">
              <Label htmlFor="time">Start Time</Label>
              <Input id="time" type="time" value={data.time}
                onChange={e=>setData({...data,time:e.target.value})}/>
            </div>
          </div>

          {/* End */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" value={data.endDate}
                onChange={e=>setData({...data,endDate:e.target.value})}/>
            </div>
            <div className="grid gap-1">
              <Label htmlFor="endTime">End Time</Label>
              <Input id="endTime" type="time" value={data.endTime}
                onChange={e=>setData({...data,endTime:e.target.value})}/>
            </div>
          </div>

          {/* Type & Reminder */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label htmlFor="type">Type</Label>
              <Select value={data.type} onValueChange={v=>setData({...data,type:v as EventType})}>
                <SelectTrigger id="type"><SelectValue/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="appointment">Appointment</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1">
              <Label htmlFor="reminder">Reminder (mins)</Label>
              <Input id="reminder" type="number" min={0} value={data.reminder}
                onChange={e=>setData({...data,reminder:+e.target.value})}/>
            </div>
          </div>

          {/* Staff & Customer */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label htmlFor="staff">Staff</Label>
              <Select value={data.staff} onValueChange={v=>setData({...data,staff:v})}>
                <SelectTrigger id="staff"><SelectValue placeholder="—"/></SelectTrigger>
                <SelectContent>
                  {staffList.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1">
              <Label htmlFor="customer">Customer</Label>
              <Select value={data.customer} onValueChange={v=>setData({...data,customer:v})}>
                <SelectTrigger id="customer"><SelectValue placeholder="—"/></SelectTrigger>
                <SelectContent>
                  {customerList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div className="grid gap-1">
            <Label htmlFor="loc">Location</Label>
            <Input id="loc" value={data.location}
              onChange={e=>setData({...data,location:e.target.value})}/>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-2">
          <Link href="/calendar"><Button variant="outline">Cancel</Button></Link>
          <Button onClick={handleSave}>Save Event</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

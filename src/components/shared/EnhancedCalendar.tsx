
import * as React from "react";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Event } from "@/data/types";

interface EnhancedCalendarProps {
  events: Event[];
  title?: string;
  entityType?: 'artist' | 'promoter' | 'venue';
  currentMonth?: Date;
  onEventClick?: (eventId: string) => void;
  onMonthChange?: (month: Date) => void;
}

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

export function EnhancedCalendar({ events, title, entityType, currentMonth, onEventClick, onMonthChange }: EnhancedCalendarProps) {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = React.useState(today);
  
  // Use prop or default to today's month
  const displayMonth = currentMonth || today;
  const firstDayCurrentMonth = startOfMonth(displayMonth);

  // Convert your Event type to calendar format
  const calendarData = events.map(event => ({
    day: new Date(event.date),
    events: [{
      id: event.id, // Keep ID as string (UUID)
      name: event.name,
      time: new Date(event.date).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      datetime: event.date,
      venue: event.venue,
      status: event.status
    }]
  }));

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });

  function previousMonth() {
    const firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 });
    onMonthChange?.(firstDayPrevMonth);
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    onMonthChange?.(firstDayNextMonth);
  }

  function goToToday() {
    setSelectedDay(today);
    onMonthChange?.(today);
  }

  return (
    <div className="flex flex-1 flex-col border rounded-xl shadow-md overflow-hidden">
      {/* Calendar Header */}
      <div className="flex flex-col space-y-4 p-4 md:flex-row md:items-center md:justify-between md:space-y-0 bg-muted/30">
        <div className="flex items-center gap-4">
          <div className="hidden w-20 flex-col items-center justify-center rounded-lg border bg-muted p-0.5 md:flex">
            <h1 className="p-1 text-xs uppercase text-muted-foreground">
              {format(today, "MMM")}
            </h1>
            <div className="flex w-full items-center justify-center rounded-lg border bg-background p-0.5 text-lg font-bold">
              <span>{format(today, "d")}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-foreground">
              {title || format(firstDayCurrentMonth, "MMMM, yyyy")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {format(firstDayCurrentMonth, "MMM d, yyyy")} -{" "}
              {format(endOfMonth(firstDayCurrentMonth), "MMM d, yyyy")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex -space-x-px rounded-lg shadow-sm">
            <Button
              onClick={previousMonth}
              className="rounded-none shadow-none first:rounded-s-lg"
              variant="outline"
              size="icon"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={goToToday}
              className="rounded-none shadow-none px-4"
              variant="outline"
            >
              Today
            </Button>
            <Button
              onClick={nextMonth}
              className="rounded-none shadow-none last:rounded-e-lg"
              variant="outline"
              size="icon"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 border-t text-center text-xs font-semibold leading-6">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
          <div key={day} className={cn("border-r py-2.5", idx === 6 && "border-r-0")}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="flex-1 grid grid-cols-7 border-t">
        {days.map((day, dayIdx) => {
          const dayEvents = calendarData.filter(date => isSameDay(date.day, day));
          const isCurrentMonth = isSameMonth(day, firstDayCurrentMonth);
          const isSelected = isEqual(day, selectedDay);
          const isTodayDate = isToday(day);

          return (
            <div
              key={dayIdx}
              onClick={() => setSelectedDay(day)}
              className={cn(
                "relative min-h-[100px] p-2 border-b border-r hover:bg-muted/50 cursor-pointer transition-colors",
                !isCurrentMonth && "bg-muted/20 text-muted-foreground",
                isSelected && "bg-accent",
                dayIdx % 7 === 6 && "border-r-0",
                dayIdx >= days.length - 7 && "border-b-0"
              )}
            >
              <button
                type="button"
                className={cn(
                  "mb-1 flex h-7 w-7 items-center justify-center rounded-full text-sm",
                  isTodayDate && "bg-primary text-primary-foreground",
                  isSelected && !isTodayDate && "bg-foreground text-background",
                  "hover:border"
                )}
              >
                {format(day, "d")}
              </button>
              
              {/* Events for this day */}
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((dateData, idx) => (
                  <div key={idx} className="text-xs">
                    {dateData.events.map(event => (
                      <div
                        key={event.id}
                        className={cn(
                          "px-1 py-0.5 rounded text-xs truncate cursor-pointer transition-colors",
                          "bg-primary/10 text-primary hover:bg-primary/20",
                          event.status === 'Sold Out' && "bg-green-100 text-green-800 hover:bg-green-200",
                          event.status === 'Cancelled' && "bg-red-100 text-red-800 hover:bg-red-200",
                          entityType === 'artist' && "bg-blue-100 text-blue-800 hover:bg-blue-200"
                        )}
                        title={`${event.name} - ${event.venue}${(event as any).has_tickets ? ' (Tickets Available)' : ' (No Tickets)'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick?.(event.id);
                        }}
                      >
                        {event.name}
                        {entityType === 'artist' && (event as any).has_tickets && (
                          <span className="ml-1 text-xs opacity-75">
                            🎟️
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-muted-foreground px-1">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

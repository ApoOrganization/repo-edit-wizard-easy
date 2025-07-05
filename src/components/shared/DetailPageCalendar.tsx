
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { Event } from "@/data/types";

interface DetailPageCalendarProps {
  events: Event[];
  title?: string;
  entityType?: 'artist' | 'promoter' | 'venue';
}

const DetailPageCalendar = ({ 
  events, 
  title = "Event Calendar",
  entityType = 'artist'
}: DetailPageCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Convert events to dates for highlighting
  const eventDates = events.map(event => new Date(event.date));
  
  // Check if a date has events
  const hasEvents = (date: Date) => {
    return eventDates.some(eventDate => 
      eventDate.toDateString() === date.toDateString()
    );
  };

  // Get events for selected date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      new Date(event.date).toDateString() === date.toDateString()
    );
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <Card className="lg:col-span-10 w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Calendar */}
          <div className="flex-1">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border-0"
              modifiers={{
                hasEvent: eventDates
              }}
              modifiersStyles={{
                hasEvent: {
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  fontWeight: 'bold'
                }
              }}
            />
          </div>
          
          {/* Selected Date Events */}
          {selectedDate && (
            <div className="flex-1 lg:max-w-sm">
              <div className="space-y-2">
                <h4 className="text-xs font-medium">
                  Events on {selectedDate.toLocaleDateString()}
                </h4>
                {selectedDateEvents.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No events on this date</p>
                ) : (
                  <div className="space-y-2">
                    {selectedDateEvents.map((event) => (
                      <div key={event.id} className="p-2 bg-muted/30 rounded-md">
                        <h5 className="text-xs font-medium">{event.name}</h5>
                        <p className="text-xs text-muted-foreground">{event.venue}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailPageCalendar;

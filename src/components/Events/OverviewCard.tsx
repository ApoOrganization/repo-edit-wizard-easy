import { Event } from "@/data/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OverviewCardProps {
  event: Event;
}

const OverviewCard = ({ event }: OverviewCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const selloutPercentage = (event.ticketsSold / event.capacity) * 100;

  return (
    <Card className="media-card h-full">
      <CardHeader>
        <CardTitle className="text-lg">Event Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-base">Ticket sales started 4 months ago</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-base">Event announced on {new Date(event.date).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${selloutPercentage >= 100 ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
            <span className="text-base">
              {selloutPercentage >= 100 ? 'Sold out' : `${selloutPercentage.toFixed(1)}% sold`} 
              ({event.ticketsSold.toLocaleString()} / {event.capacity.toLocaleString()} tickets)
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-base">Estimated revenue: {formatCurrency(event.revenue)}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Listed on Platforms</h4>
          <div className="flex flex-wrap gap-2">
            {event.providers.map((provider, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {provider}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewCard;
import { Event } from "@/data/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PromoterInfoCardProps {
  event: Event;
  eventData?: any; // Raw event data from edge function response
}

const PromoterInfoCard = ({ event, eventData }: PromoterInfoCardProps) => {
  const navigate = useNavigate();
  
  // Get promoter data from eventData
  const promoterData = eventData?.promoters?.[0];
  
  const handlePromoterNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!promoterData?.id) {
      console.error('No promoter ID available for navigation');
      return;
    }
    
    console.log('Promoter navigation clicked:', promoterData.name);
    console.log('Navigating to promoter ID:', promoterData.id);
    navigate(`/promoters/${promoterData.id}`);
  };

  return (
    <Card className="media-card h-full">
      <CardHeader>
        <CardTitle className="text-lg">Promoter Info</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full justify-between">
        {promoterData ? (
          <>
            {/* Promoter Details */}
            <div className="space-y-4">
              <div>
                <h3 
                  className="text-xl font-bold cursor-pointer hover:text-primary transition-colors"
                  onClick={handlePromoterNavigation}
                >
                  {promoterData.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Click to view promoter profile
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Event promoter and organizer
                </span>
              </div>
            </div>
            
            {/* Navigation Button */}
            <div className="flex justify-end pt-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 cursor-pointer hover:bg-accent transition-colors" 
                onClick={handlePromoterNavigation}
                title={`View ${promoterData.name} details`}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          // No promoter data available
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">
                Promoter will be added later
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PromoterInfoCard;
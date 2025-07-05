import { Event } from "@/data/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

interface CampaignInfoCardProps {
  event: Event;
}

const CampaignInfoCard = ({ event }: CampaignInfoCardProps) => {
  const [activeTab, setActiveTab] = useState(0);
  
  const tabs = [
    { label: "Sales Campaign", content: "Campaign data coming soon..." },
    { label: "Ad Reach", content: "Ad reach data coming soon..." }
  ];

  return (
    <Card className="media-card h-full">
      <CardHeader>
        <CardTitle className="text-lg">Campaign & Info</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full">
        {/* Dot Navigation */}
        <div className="flex justify-center gap-2 mb-6">
          {tabs.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                activeTab === index 
                  ? 'bg-foreground' 
                  : 'bg-muted-foreground/30'
              }`}
              aria-label={`Go to ${tabs[index].label}`}
            />
          ))}
        </div>
        
        {/* Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              {tabs[activeTab].content}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignInfoCard;
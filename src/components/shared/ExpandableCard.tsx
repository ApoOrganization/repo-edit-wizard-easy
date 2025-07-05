
import { useState, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandableCardProps {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  icon?: ReactNode;
  maxCollapsedHeight?: string;
  className?: string;
}

const ExpandableCard = ({
  title,
  children,
  defaultExpanded = false,
  icon,
  maxCollapsedHeight = "80px",
  className = ""
}: ExpandableCardProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div
          className={`transition-all duration-300 overflow-hidden ${
            isExpanded ? "max-h-none" : `max-h-[${maxCollapsedHeight}]`
          }`}
        >
          {children}
        </div>
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none" />
        )}
      </CardContent>
    </Card>
  );
};

export default ExpandableCard;

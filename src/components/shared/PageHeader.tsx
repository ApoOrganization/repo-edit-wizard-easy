
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const PageHeader = ({ title, subtitle, showBackButton, onBackClick }: PageHeaderProps) => {
  return (
    <div className="bg-gradient-to-br from-accent/5 to-brand-success/10 border-b border-brand-border/30">
      <div className="px-8 py-8">
        {showBackButton && (
          <Button variant="ghost" size="sm" onClick={onBackClick} className="mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        )}
        <div className="hero">
          <h1 className="text-4xl font-bold text-foreground mb-2 font-manrope">{title}</h1>
          <p className="text-xl text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;

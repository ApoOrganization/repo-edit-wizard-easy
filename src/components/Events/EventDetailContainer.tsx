import { useState, useMemo } from "react";
import { Event } from "@/data/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import EventGridView from "./EventGridView";
import DetailedAnalysisView from "./DetailedAnalysisView";
import { EventAnalytics } from "@/hooks/useEventAnalytics";
import { EventAnalyticsEnhancedResponse } from "@/hooks/useEventAnalyticsEnhanced";

interface EventDetailContainerProps {
  event: Event;
  analytics?: EventAnalytics['analytics'];
  eventData?: any; // Raw event data from edge function response
  enhancedData?: EventAnalyticsEnhancedResponse;
}

const EventDetailContainer = ({ event, analytics, eventData, enhancedData }: EventDetailContainerProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeView, setActiveView] = useState<'overview' | 'detailed'>('overview');
  
  // Calculate how many detailed analysis slides we need based on categories
  const detailedAnalysisSlides = useMemo(() => {
    if (!enhancedData?.providers) {
      return [{ component: <DetailedAnalysisView event={event} enhancedData={enhancedData} />, label: "Detailed Analysis" }];
    }

    const CATEGORIES_PER_SLIDE = 4;
    const maxCategoriesAcrossProviders = Math.max(
      ...Object.values(enhancedData.providers).map(categories => categories.length),
      0
    );

    const numberOfSlides = Math.max(1, Math.ceil(maxCategoriesAcrossProviders / CATEGORIES_PER_SLIDE));
    
    return Array.from({ length: numberOfSlides }, (_, index) => {
      const start = index * CATEGORIES_PER_SLIDE;
      const end = start + CATEGORIES_PER_SLIDE;
      const categorySlice = { start, end };
      
      return {
        component: (
          <DetailedAnalysisView 
            event={event} 
            enhancedData={enhancedData} 
            categorySlice={categorySlice}
          />
        ),
        label: numberOfSlides === 1 ? "Detailed Analysis" : `Detailed Analysis ${index + 1}`
      };
    });
  }, [event, enhancedData]);
  
  const pages = [
    { component: <EventGridView event={event} analytics={analytics} eventData={eventData} />, label: "Overview" },
    ...detailedAnalysisSlides
  ];

  const nextPage = () => {
    const newPage = (currentPage + 1) % pages.length;
    setCurrentPage(newPage);
    setActiveView(newPage === 0 ? 'overview' : 'detailed');
  };

  const prevPage = () => {
    const newPage = (currentPage - 1 + pages.length) % pages.length;
    setCurrentPage(newPage);
    setActiveView(newPage === 0 ? 'overview' : 'detailed');
  };

  const goToPage = (index: number) => {
    setCurrentPage(index);
    setActiveView(index === 0 ? 'overview' : 'detailed');
  };

  // Navigate to overview
  const goToOverview = () => {
    setCurrentPage(0);
    setActiveView('overview');
  };

  // Navigate to first detailed analysis slide
  const goToDetailed = () => {
    setCurrentPage(1);
    setActiveView('detailed');
  };

  return (
    <div className="relative max-w-[calc(100%-80px)] mx-auto">
      {/* Navigation Arrows - Positioned relative to carousel container */}
      <Button
        variant="outline"
        size="icon"
        onClick={prevPage}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-50 h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent hover:border-border shadow-lg"
        aria-label="Previous page"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={nextPage}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-50 h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent hover:border-border shadow-lg"
        aria-label="Next page"
      >
        <ArrowRight className="h-5 w-5" />
      </Button>

      {/* Pagination Dots - Modern styling */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-50">
        <div className="flex gap-2">
          {pages.map((page, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              className={`h-2 rounded-full border-none cursor-pointer transition-all duration-300 ${
                currentPage === index 
                  ? 'w-6 bg-primary' 
                  : 'w-2 bg-muted-foreground/20 hover:bg-muted-foreground/40'
              }`}
              aria-label={`Go to ${page.label}`}
            />
          ))}
        </div>
      </div>

      <div className="relative">
        {/* View Mode Toggle - Clean minimal styling */}
        <div className="flex justify-center mb-5">
          <div className="flex gap-6">
            <button
              onClick={goToOverview}
              className={`py-1 text-sm font-medium transition-all duration-200 relative ${
                activeView === 'overview'
                  ? 'text-foreground font-semibold text-base'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Overview
              {activeView === 'overview' && (
                <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-current" />
              )}
            </button>
            <button
              onClick={goToDetailed}
              className={`py-1 text-sm font-medium transition-all duration-200 relative ${
                activeView === 'detailed'
                  ? 'text-foreground font-semibold text-base'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Detailed Analysis
              {activeView === 'detailed' && (
                <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-current" />
              )}
            </button>
          </div>
        </div>

        {/* Carousel Container - Adjusted width to show less of next slide */}
        <div className="relative overflow-visible">
          <div 
            className="flex transition-transform duration-300 ease-in-out gap-[2%]"
            style={{ transform: `translateX(-${currentPage * 87}%)` }}
          >
            {pages.map((page, index) => (
              <div key={index} className="w-[85%] flex-shrink-0">
                {page.component}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailContainer;
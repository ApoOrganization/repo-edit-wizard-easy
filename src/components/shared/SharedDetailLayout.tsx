
import { ReactNode } from "react";

interface SharedDetailLayoutProps {
  children: ReactNode;
  className?: string;
}

const SharedDetailLayout = ({ children, className = "" }: SharedDetailLayoutProps) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 py-3 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
        {/* Left Column - 70% width on desktop */}
        <div className="lg:col-span-7 space-y-4">
          <div className="left-column-content">
            {children}
          </div>
        </div>
        
        {/* Right Column - 30% width on desktop */}
        <div className="lg:col-span-3 space-y-4">
          <div className="right-column-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedDetailLayout;

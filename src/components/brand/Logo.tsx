import React from 'react';
import { cn } from '@/lib/utils';
import { brandConfig, getBrandLogo } from '@/config/brand';

export interface LogoProps {
  /**
   * Logo variant to display
   */
  variant?: 'main' | 'icon' | 'dark' | 'light' | 'brandName';
  
  /**
   * Size of the logo
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Custom width (overrides size)
   */
  width?: number;
  
  /**
   * Custom height (overrides size)
   */
  height?: number;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Alt text for accessibility
   */
  alt?: string;
  
  /**
   * Whether to show the brand name alongside icon-only logos
   */
  showName?: boolean;
}

const sizeMap = {
  sm: { width: 24, height: 24 },
  md: { width: 32, height: 32 },
  lg: { width: 48, height: 48 },
  xl: { width: 64, height: 64 }
};

export const Logo: React.FC<LogoProps> = ({
  variant = 'main',
  size = 'md',
  width,
  height,
  className,
  alt,
  showName = false
}) => {
  const logoSrc = getBrandLogo(variant);
  const { width: defaultWidth, height: defaultHeight } = sizeMap[size];
  
  const logoWidth = width || defaultWidth;
  const logoHeight = height || defaultHeight;
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src={logoSrc}
        alt={alt || `${brandConfig.name} logo`}
        width={logoWidth}
        height={logoHeight}
        className="object-contain"
      />
      {showName && variant !== 'icon' && variant !== 'brandName' && (
        <span className="font-semibold text-current">
          {brandConfig.name}
        </span>
      )}
    </div>
  );
};

export default Logo;
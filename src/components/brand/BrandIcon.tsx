import React from 'react';
import { cn } from '@/lib/utils';
import { brandConfig, getBrandLogo } from '@/config/brand';

export interface BrandIconProps {
  /**
   * Size of the icon
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
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
   * Theme variant
   */
  theme?: 'auto' | 'light' | 'dark';
}

const sizeMap = {
  xs: { width: 16, height: 16 },
  sm: { width: 20, height: 20 },
  md: { width: 24, height: 24 },
  lg: { width: 32, height: 32 },
  xl: { width: 48, height: 48 }
};

export const BrandIcon: React.FC<BrandIconProps> = ({
  size = 'md',
  width,
  height,
  className,
  alt,
  theme = 'auto'
}) => {
  // Determine which logo variant to use based on theme
  let logoSrc = getBrandLogo('icon');
  
  if (theme === 'dark' && brandConfig.logo.dark) {
    logoSrc = brandConfig.logo.dark;
  } else if (theme === 'light' && brandConfig.logo.light) {
    logoSrc = brandConfig.logo.light;
  }
  
  const { width: defaultWidth, height: defaultHeight } = sizeMap[size];
  
  const iconWidth = width || defaultWidth;
  const iconHeight = height || defaultHeight;
  
  return (
    <img
      src={logoSrc}
      alt={alt || `${brandConfig.name} icon`}
      width={iconWidth}
      height={iconHeight}
      className={cn("object-contain", className)}
    />
  );
};

export default BrandIcon;